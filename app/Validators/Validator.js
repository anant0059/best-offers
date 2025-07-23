import Joi from '@hapi/joi';

export default{
    offersRequest: Joi.object({
        flipkartOfferApiResponse: Joi.object({
        offers: Joi.object({
            headerTitle: Joi.string().required(),
            offerList: Joi.array()
            .items(
                Joi.object({
                provider: Joi.array().items(Joi.string()).required(),
                logo: Joi.string().required(),
                offerText: Joi.object({
                    text: Joi.string().required(),
                }).required(),
                offerDescription: Joi.object({
                    type: Joi.string().required(),
                    tncText: Joi.string().required(),
                    id: Joi.string().required(),
                    text: Joi.string().required(),
                }).required(),
                })
            )
            .required(),
            filterList: Joi.array()
        })
        .required()
        })
        .required()
    })
    .required(),


    highestDiscountRequest: Joi.object({
        bankName:    Joi.string().required(),
        amountToPay: Joi.number().required(),
    }).required()
}