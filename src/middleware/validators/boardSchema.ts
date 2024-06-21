export {}
const Joi = require('joi')

const createBoardSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().optional()
})

const updateBoardSchema = Joi.object({
    name: Joi.string().optional(),
    description: Joi.string().optional()
}).min(1)

module.exports = {
    createBoardSchema,
    updateBoardSchema
}