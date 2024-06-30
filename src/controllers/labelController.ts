import { Request, Response } from 'express'
const {errorHandler} = require('../middleware/errorHandler')
const Label = require('../models/Label')
const {
    createLabelSchema,
    updateLabelSchema
} = require('../middleware/validators/labelSchema')


const createLabel = errorHandler(async (req:Request, res:Response) => {
    const userId = req.user!._id
    const formData = req.body

    const validationResult = createLabelSchema.validate(formData);

    if (validationResult.error) {
        return res
        .status(400)
        .json({
            status: 'error',
            message: validationResult.error.details[0].message,
        });
    }

    const existingLabel = await Label.findOne({$or:[{boardId: formData.boardId, name:{ $regex: `^${formData.name}$`, $options: 'i' }},{boardId: formData.boardId, color: formData.color}]})
    if(existingLabel){
        return res.status(409).json({status:'error', message:'Label already exists'})
    }

    const newLabel = new Label({
        ...formData,
        userId
    })

    const savedLabel = await newLabel.save()
    return res.status(201).json({status:'success',message:'Label created successfully',data:savedLabel})
})

const getLabels = errorHandler(async (req:Request, res:Response) => {
    const userId = req.user!._id
    const boardId = req.params.boardId
    const labels = await Label.find({boardId, userId})
    return res.status(200).json({status:'success', data:labels})
})

const updateLabel = errorHandler(async (req:Request, res:Response) => {
    const userId = req.user!._id
    const labelId = req.params.labelId
    const formData = req.body

    const validationResult = updateLabelSchema.validate(formData);

    if (validationResult.error) {
        return res
        .status(400)
        .json({
            status: 'error',
            message: validationResult.error.details[0].message,
        });
    }

    const label = await Label.findOne({_id:labelId, userId})
    if(!label){
        return res.status(409).json({status:'error',message:'Label not found or does not belong to currently logged in user'})
    }

    const existingLabel = await Label.findOne({$or:[{boardId: label.boardId, name:{ $regex: `^${formData.name}$`, $options: 'i' }, _id: { $ne: labelId }},{boardId: label.boardId, color: formData.color, _id: { $ne: labelId }}]})
    if(existingLabel){
        return res.status(409).json({status:'error', message:'Label already exists'})
    }

    const updatedLabel = await Label.findByIdAndUpdate(labelId, formData, {new:true})

    return res.status(200).json({status:'success',data: updatedLabel})
})

const deleteLabel = errorHandler(async (req:Request, res:Response) => {
    const labelId = req.params.labelId
    const userId = req.user!._id

    const label = await Label.findOne({_id:labelId, userId})
    if(!label){
        return res.status(409).json({status:'error',message:'Label not found or does not belong to currently logged in user'})
    }

    await Label.findByIdAndDelete(labelId)
    return res.status(204).json({})
})

module.exports = {
    createLabel,
    getLabels,
    updateLabel,
    deleteLabel
}