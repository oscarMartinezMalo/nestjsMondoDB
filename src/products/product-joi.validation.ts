import * as Joi from '@hapi/joi';

export const ProductValidationSchema = Joi.object({
    title: Joi.string()
        .min(3)
        .required(),
    description: Joi.string()
        .min(6)
        .required(),
    price: Joi.number()
        .min(1)
        .required()
});