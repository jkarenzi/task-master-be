export {}
const Joi = require('joi')

const updatePasswordSchema = Joi.object({
    oldPassword: Joi.string()
      .regex(/^[A-Za-z0-9]{8,}$/)
      .message(
        'Password must be at least 8 characters long and contain only letters and numbers'
      )
      .required(),
    newPassword: Joi.string()
    .regex(/^[A-Za-z0-9]{8,}$/)
    .message(
    'Password must be at least 8 characters long and contain only letters and numbers'
    )
    .required(),
})

const updateEmailSchema = Joi.object({
    password: Joi.string()
      .regex(/^[A-Za-z0-9]{8,}$/)
      .message(
        'Password must be at least 8 characters long and contain only letters and numbers'
      )
      .required(),
    newEmail: Joi.string().email().required(),
})

const updateFullNameSchema = Joi.object({
  fullName: Joi.string()
    .regex(/^[A-Za-z\s]{5,}$/)
    .message(
      'fullName can only contain letters and should have atleast 5 characters'
    )
    .required()
})


module.exports = {
    updateEmailSchema,
    updatePasswordSchema,
    updateFullNameSchema
}