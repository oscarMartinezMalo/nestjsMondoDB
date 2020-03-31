import * as Joi from '@hapi/joi';

// Register Validation
export const registerValidationSchema = Joi.object({ 
        email: Joi.string()
            .min(6)
            .required()
            .email(),
        password: Joi.string()
            .min(6)
            .required()
});

// Login Validation
export const loginValidationSchema = Joi.object({ 
        email: Joi.string()
            .min(6)
            .required()
            .email(),
        password: Joi.string()
            .min(6)
            .required()
});