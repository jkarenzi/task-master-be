export {}
const Joi = require('joi')

const createCategorySchema = Joi.object({
    boardId: Joi.string().length(24).required(),
    name: Joi.string().required()
})

const updateCategorySchema = Joi.object({
    name: Joi.string().required()
})

module.exports = {
    createCategorySchema,
    updateCategorySchema
}