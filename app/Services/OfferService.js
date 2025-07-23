import OfferRepository from "../Repository/OfferRepository.js";
import Logger from "../Utils/Logger.js";

export default class OfferService {
  constructor() {
    this.offerRepository = new OfferRepository();
  }

  async ingestAll(rawJson) {
    try {
      const list = rawJson.flipkartOfferApiResponse?.offers?.offerList || [];
      let inserted = 0,
        updated = 0;

      // console.log("Ingesting offers:", rawJson);

      for (const item of list) {
        const norm = await this.parseOffer(item);

        const doc = await this.offerRepository.upsert(norm);
        // console.log("Upserted offer:", doc);

        // rough heuristic: if createdAt==updatedAt => new
        if (doc.createdAt.valueOf() === doc.updatedAt.valueOf()) inserted++;
        else updated++;
      }

      return {
        noOfOffersIdentified: list.length,
        noOfNewOffersCreated: inserted,
      };
    } catch (error) {
      Logger.debug("Error in ingestAll:", error);
      err.name = "InternalServerErrorException";
      throw error;
    }
  }

  computeDiscount(o, amount) {
    switch (o.discountType) {
      case "flat":
        return o.value;
      case "percentage":
        return Math.min((o.percentage / 100) * amount, o.cap);
      case "cashback":
        if (o.percentage > 0) {
          return Math.min((o.percentage / 100) * amount, o.cap);
        } else {
          return o.value;
        }
      case "noCostEmi":
        return 0;
      default:
        return 0;
    }
  }

  async getBest(bankName, amount) {
    try {
      const offers = await this.offerRepository.findEligible(bankName, amount);
      let bestOffer = null;
      let bestDiscount = 0;
      for (const o of offers) {
        const disc = this.computeDiscount(o, amount);
        if (disc > bestDiscount) {
          bestDiscount = disc;
          bestOffer = o;
        }
        // console.log("Offer:", o.offerId, "Discount:", disc);
      }

      // Logger.debug("Best offer found:", bestOffer, bestDiscount);
      return {
        highestDiscountAmount: bestDiscount,
      };
    } catch (error) {
      Logger.debug("Error in getBest:", error);
      error.name = "InternalServerErrorException";
      throw error;
    }
  }

  async parseOffer(item) {
    try {
      // 1. ID, provider & logo
      const offerId = item.offerDescription.id;

      const providers = Array.isArray(item.provider)
        ? item.provider[0]
        : item.provider || "";

      // 2. Raw text to scan
      const rawDesc = item.offerDescription.text || "";

      // 3. Regex matches
      const rupeeMatch = rawDesc.match(/₹\s*([\d,]+(?:\.\d+)?)/);
      const pctMatch = rawDesc.match(/\b([1-9]?\d|100)\s*%/);
      const capMatch = rawDesc.match(
        /(?:up[\s-–-]*to|upto)\s*₹\s*([\d,]+(?:\.\d+)?)/i
      );
      const cashbackMatch = rawDesc.match(
        /(?:₹\s*[\d,]+(?:\.\d+)?\s*)?cashback|cashback(?:\s*₹\s*[\d,]+(?:\.\d+)?)/i
      );
      const minTxnMatch = rawDesc.match(
        /(?:Min(?:\.|imum)?)[\s-]*(?:Order|Txn|Product)[\s-]*Value[:\s]*₹\s*([\d,]+(?:\.\d+)?)/i
      );

      // 4. Decide type & values
      let discountType = "nocostemi";
      let value = 0;
      let percentage = 0;
      let cap = 0;
      let minTxnValue = 0;

      // a) both % and ₹ → percentage
      if (pctMatch && rupeeMatch) {
        discountType = "percentage";
        percentage = Number(pctMatch[1]);
        cap = capMatch ? Number(capMatch[1].replace(/,/g, "")) : 0;
      }
      // b) cashback mention → cashback (flat ₹ if we find one)
      else if (cashbackMatch) {
        discountType = "cashback";
        if (pctMatch) {
          percentage = Number(pctMatch[1]);
          cap = capMatch ? Number(capMatch[1].replace(/,/g, "")) : 0;
        } else if (rupeeMatch) {
          // sometimes cashback is a flat ₹
          value = Number(rupeeMatch[1].replace(/,/g, ""));
          cap = value;
        }
      }

      /// c) only % ⇒ percentage
      else if (pctMatch) {
        discountType = "percentage";
        percentage = Number(pctMatch[1]);
        cap = capMatch ? Number(capMatch[1].replace(/,/g, "")) : 0;
      }
      // d) only ₹ ⇒ flat
      else if (rupeeMatch) {
        discountType = "flat";
        value = Number(rupeeMatch[1].replace(/,/g, ""));
        cap = value;
      }

      // 6) Min transaction threshold
      if (minTxnMatch) {
        minTxnValue = Number(minTxnMatch[1].replace(/,/g, ""));
      }

      return {
        offerId,
        providers,
        discountType, // 'flat' | 'percentage' | 'cashback' | 'nocostemi'
        value, // ₹ amount for flat or cashback
        percentage, // % for percentage
        cap, // max discount for percentage or cashback
        minTxnValue, // ₹ threshold
        rawPayload: item,
      };
    } catch (error) {
      Logger.debug("Error in parseOffer:", error);
      error.name = "InternalServerErrorException";
      throw error;
    }
  }
}
