const Joi = require('joi');

const signUpSchema = Joi.object({
  fullName: Joi.string()
    .regex(/^[A-Za-z\s]{5,}$/)
    .message(
      'fullName can only contain letters and should have atleast 5 characters'
    )
    .required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .regex(/^[A-Za-z0-9]{8,}$/)
    .message(
      'Password must be at least 8 characters long and contain only letters and numbers'
    )
    .required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .regex(/^[A-Za-z0-9]{8,}$/)
    .message(
      'Password must be at least 8 characters long and contain only letters and numbers'
    )
    .required(),
});

module.exports = {
  signUpSchema,
  loginSchema,
};
