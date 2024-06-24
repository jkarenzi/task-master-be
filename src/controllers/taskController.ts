import { Request, Response } from 'express'
const {errorHandler} = require('../middleware/errorHandler')
const Task = require('../models/Task')
const {
    createTaskSchema,
    updateTaskSchema
} = require('../middleware/validators/taskSchema')



const createTask = errorHandler(async (req:Request, res:Response) => {
    const userId = req.user!._id
    const formData = req.body

    const validationResult = createTaskSchema.validate(formData);

    if (validationResult.error) {
        return res
        .status(400)
        .json({
            status: 'error',
            message: validationResult.error.details[0].message,
        });
    }

    const newTask = new Task({
        ...formData,
        userId
    })

    const savedTask = await newTask.save()
    return res.status(201).json({status:'success',message:'Task created successfully', data:savedTask})
})

const getTasks = errorHandler(async (req:Request, res:Response) => {
     const userId = req.user!._id
    const boardId = req.params.boardId
    const tasks = await Task.find({boardId, userId}).populate({
        path:'labels',
        select: '_id name color'
    }).exec()
    return res.status(200).json({status:'success', data:tasks})
})

const getTask = errorHandler(async (req:Request, res:Response) => {
    const userId = req.user!._id
   const taskId = req.params.taskId
   const task = await Task.findOne({_id:taskId, userId}).populate({
        path:'labels',
        select: '_id name color'
   }).exec()
   return res.status(200).json({status:'success', data:task})
})

const updateTask = errorHandler(async (req:Request, res:Response) => {
    const userId = req.user!._id
    const taskId = req.params.taskId
    const formData = req.body

    const validationResult = updateTaskSchema.validate(formData);

    if (validationResult.error) {
        return res
        .status(400)
        .json({
            status: 'error',
            message: validationResult.error.details[0].message,
        });
    }

    const task = await Task.findOne({_id:taskId, userId})
    if(!task){
        return res.status(409).json({status:'error',message:'Task not found or does not belong to currently logged in user'})
    }

    const updatedTask = await Task.findByIdAndUpdate(taskId, formData, {new:true}).populate({
        path:'labels',
        select: '_id name color'
    }).exec()

    return res.status(200).json({status:'success',data: updatedTask})
})

const deleteTask = errorHandler(async (req:Request, res:Response) => {
    const taskId = req.params.taskId
    const userId = req.user!._id

    const task = await Task.findOne({_id:taskId, userId})
    if(!task){
        return res.status(409).json({status:'error',message:'Task not found or does not belong to currently logged in user'})
    }

    await Task.findByIdAndDelete(taskId)
    return res.status(204).json({})
})

module.exports = {
    createTask,
    getTasks,
    getTask,
    updateTask,
    deleteTask
}