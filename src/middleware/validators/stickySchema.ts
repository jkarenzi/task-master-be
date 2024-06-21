export {}
const Joi = require('joi');

const createStickyNoteSchema = Joi.object({
    content: Joi.string().required(),
    color: Joi.string().length(7).required()
})

const updateStickyNoteSchema = Joi.object({
    content: Joi.string().optional(),
    color: Joi.string().length(7).optional()
}).min(1)

module.exports = {
    createStickyNoteSchema,
    updateStickyNoteSchema
}