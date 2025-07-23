import Logger from "../Utils/Logger.js";
import Contoller from "./Controller.js";
import OfferService from "../Services/OfferService.js";
import Validator from "../Validators/Validator.js";

export default class OfferController extends Contoller {
  constructor(response) {
    super(response);
    this.OfferService = new OfferService();
  }

  async ingestOffers(request) {
    try {
      const requestBody = await this.validateParams(
        request,
        Validator.offersRequest
      );
      //   Logger.debug("Ingesting offers with request body: ", requestBody);
      const stats = await this.OfferService.ingestAll(requestBody);
      this.sendResponse(stats);
    } catch (error) {
      Logger.debug("Error in ingestOffers:", error);
      this.handleException(error);
    }
  }

  async getOffers(request) {
    try {
      const requestBody = await this.validateParams(
        request,
        Validator.highestDiscountRequest,
        true
      );

      const offers = await this.OfferService.getBest(
        requestBody.bankName,
        requestBody.amountToPay
      );
      this.sendResponse(offers);
    } catch (error) {
      Logger.debug("Error in getOffers:", error);
      this.handleException(error);
    }
  }
}
