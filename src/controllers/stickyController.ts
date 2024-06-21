const StickyNote = require('../models/StickyNote')
import { Request, Response } from 'express'
const {errorHandler} = require('../middleware/errorHandler')
const {
    updateStickyNoteSchema,
    createStickyNoteSchema
} = require('../middleware/validators/stickySchema')

const createStickyNote = errorHandler(async (req:Request, res:Response) => {
        //@ts-expect-error yet to come up with the right type
    const userId = req.user._id
    const formData = req.body

    const validationResult = createStickyNoteSchema.validate(formData);

    if (validationResult.error) {
        return res
        .status(400)
        .json({
            status: 'error',
            message: validationResult.error.details[0].message,
        });
    }

    const newStickyNote = new StickyNote({
        userId,
        ...formData
    })

    const savedStickyNote = await newStickyNote.save()
    return res.status(201).json({status:'success',message:'Sticky note created successfully',data:savedStickyNote})
})

const getStickyNotes = errorHandler(async (req:Request, res:Response) => {
    const stickyNotes = await StickyNote.find()
    return res.status(200).json({status:'success', data:stickyNotes})
})

const updateStickyNote = errorHandler(async (req:Request, res:Response) => {
        //@ts-expect-error yet to come up with the right type
    const userId = req.user._id
    const stickyId = req.params.id
    const formData = req.body

    const validationResult = updateStickyNoteSchema.validate(formData);

    if (validationResult.error) {
        return res
        .status(400)
        .json({
            status: 'error',
            message: validationResult.error.details[0].message,
        });
    }

    const stickyNote = await StickyNote.findOne({_id:stickyId, userId})
    if(!stickyNote){
        return res.status(409).json({status:'error',message:'Sticky not found or does not belong to currently logged in user'})
    }

    const updatedStickyNote = await StickyNote.findByIdAndUpdate(stickyId,formData,{new:true})
    return res.status(200).json({status:'success',data: updatedStickyNote})
})

const deleteStickyNote = errorHandler(async (req:Request, res:Response) => {
    const stickyId = req.params.id
    //@ts-expect-error yet to come up with the right type
    const userId = req.user._id

    const stickyNote = await StickyNote.findOne({_id:stickyId, userId})
    if(!stickyNote){
        return res.status(409).json({status:'error',message:'Sticky not found or does not belong to currently logged in user'})
    }

    await StickyNote.findByIdAndDelete(stickyId)
    return res.status(204).json({})
})

module.exports = {
    createStickyNote,
    getStickyNotes,
    updateStickyNote,
    deleteStickyNote
}