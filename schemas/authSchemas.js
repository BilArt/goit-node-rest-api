import Joi from "joi";

export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "Missing required email field",
    "string.email": "Email must be a valid email address",
  }),
  password: Joi.string().min(6).required().messages({
    "any.required": "Missing required password field",
    "string.min": "Password must be at least 6 characters",
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "Missing required email field",
    "string.email": "Email must be a valid email address",
  }),
  password: Joi.string().required().messages({
    "any.required": "Missing required password field",
  }),
});
