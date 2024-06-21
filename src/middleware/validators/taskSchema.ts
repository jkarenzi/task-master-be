export {}
const Joi = require('joi')

const createTaskSchema = Joi.object({
    boardId: Joi.string().length(24).required(),
    categoryId: Joi.string().length(24).required(),
    labels: Joi.array().items().required(),
    title: Joi.string().required(),
    description: Joi.string().optional(),
    dueDate: Joi.date().optional()
})

const updateTaskSchema = Joi.object({
    categoryId: Joi.string().length(24).optional(),
    title: Joi.string().optional(),
    labels: Joi.array().items().optional(),
    description: Joi.string().optional(),
    dueDate: Joi.date().optional(),
}).min(1)

module.exports = {
    createTaskSchema,
    updateTaskSchema
}