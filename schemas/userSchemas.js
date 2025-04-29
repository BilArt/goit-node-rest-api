import Joi from "joi";

export const emailSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "missing required field email",
    "string.email": "email must be a valid email",
  }),
});
