export {}
const Joi = require('joi');

const createStickyNoteSchema = Joi.object({
    content: Joi.string().required()
})

const updateStickyNoteSchema = Joi.object({
    content: Joi.string().required()
})

module.exports = {
    createStickyNoteSchema,
    updateStickyNoteSchema
}