import { Request, Response } from 'express'
const {errorHandler} = require('../middleware/errorHandler')
const Board = require('../models/Board')
const {
    createBoardSchema,
    updateBoardSchema
} = require('../middleware/validators/boardSchema')


const createBoard = errorHandler(async (req:Request, res:Response) => {
    //@ts-expect-error yet to come up with the right type
    const userId = req.user._id
    const formData = req.body

    const validationResult = createBoardSchema.validate(formData);

    if (validationResult.error) {
        return res
        .status(400)
        .json({
            status: 'error',
            message: validationResult.error.details[0].message,
        });
    }

    const existingBoard = await Board.findOne({userId, name:{ $regex: `^${formData.name}$`, $options: 'i' }})
    if(existingBoard){
        return res.status(409).json({status:'error', message:'Board already exists'})
    }

    const newBoard = new Board({
        ...formData,
        userId
    })

    const savedBoard = await newBoard.save()
    return res.status(201).json({status:'success',message:'Board created successfully',data:savedBoard})
})

const getBoards = errorHandler(async (req:Request, res:Response) => {
    //@ts-expect-error yet to come up with the right type
    const userId = req.user._id
    const boards = await Board.find({userId})
    return res.status(200).json({status:'success', data:boards})
})

const updateBoard = errorHandler(async (req:Request, res:Response) => {
        //@ts-expect-error yet to come up with the right type
    const userId = req.user._id
    const boardId = req.params.boardId
    const formData = req.body

    const validationResult = updateBoardSchema.validate(formData);

    if (validationResult.error) {
        return res
        .status(400)
        .json({
            status: 'error',
            message: validationResult.error.details[0].message,
        });
    }

    const board = await Board.findOne({_id:boardId, userId})
    if(!board){
        return res.status(409).json({status:'error',message:'Board not found or does not belong to currently logged in user'})
    }

    const existingBoard = await Board.findOne({userId, name:{ $regex: `^${formData.name}$`, $options: 'i' }, _id: { $ne: boardId }})
    if(existingBoard){
        return res.status(409).json({status:'error', message:'Board already exists'})
    }

    const updatedBoard = await Board.findByIdAndUpdate(boardId, formData,{new:true})

    return res.status(200).json({status:'success',data: updatedBoard})
})

const deleteBoard = errorHandler(async (req:Request, res:Response) => {
    const boardId = req.params.boardId
    //@ts-expect-error yet to come up with the right type
    const userId = req.user._id

    const board = await Board.findOne({_id:boardId, userId})
    if(!board){
        return res.status(409).json({status:'error',message:'Board not found or does not belong to currently logged in user'})
    }

    await Board.findByIdAndDelete(boardId)
    return res.status(204).json({})
})

module.exports = {
    createBoard,
    getBoards,
    updateBoard,
    deleteBoard
}