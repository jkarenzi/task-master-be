export {}
const Joi = require('joi')

const createLabelSchema = Joi.object({
    boardId: Joi.string().length(24).required(),
    name: Joi.string().required(),
    color: Joi.string().length(7).required()
})

const updateLabelSchema = Joi.object({
    name: Joi.string().optional(),
    color: Joi.string().length(7).optional()
}).min(1)

module.exports = {
    createLabelSchema,
    updateLabelSchema
}