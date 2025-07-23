import express from "express";
import OfferController from "../app/Controllers/OfferController.js";

const OfferApiRouter = express.Router();

OfferApiRouter.post("/v1/offer", (request, response) => {
  const offerController = new OfferController(response);
  offerController.ingestOffers(request);
});

OfferApiRouter.get("/v1/highest-discount", (request, response) => {
  const offerController = new OfferController(response);
  offerController.getOffers(request);
});

export default OfferApiRouter;
