import Offer from '../Models/Offer.js';

export default class OfferRepository {
  async upsert(offerObj) {
    return Offer.findOneAndUpdate(
      { offerId: offerObj.offerId },
      { $set: offerObj },
      { upsert: true, new: true }
    );
  }

  async findEligible(bankName, amount) {
    return Offer.find({
      providers: bankName,
      minTxnValue: { $lte: amount }
    })
    .sort({ minTxnValue: -1 })
    .lean();
  }

  async findById(offerId) {
    return Offer.findOne({ offerId }).lean();
  }

  async findAll() {
    return Offer.find().lean();
  }

  async delete(offerId) {
    return Offer.findOneAndDelete({ offerId });
  }
}
