// Models/Offer.js
import mongoose from 'mongoose';

const OfferSchema = new mongoose.Schema({
  offerId:       { type: String,  unique: true,  required: true },  // e.g. FPO...
  providers:     { type: String, index: true },                   // bank codes

  // core discount fields
  discountType:  { type: String, enum: ['flat','percentage','cashback'], required: true },
  value:         Number,    // flat or cashback amount OR percentage base
  cap:           Number,    // max discount (for % or cashback)
  percentage:    Number,    // stored if discountType=='percentage' or 'cashback'

  // eligibility
  minTxnValue:   { type: Number},                     // ₹ threshold
  
  // raw data for reference
  rawPayload:    mongoose.Schema.Types.Mixed,
}, {
  timestamps: true
});

// Compound index to serve GET /highest‑discount quickly:
OfferSchema.index({ providers:1 });

export default mongoose.model('Offer', OfferSchema);
