import { Request, Response } from 'express'
const {errorHandler} = require('../middleware/errorHandler')
const Category = require('../models/Category')
const {
    createCategorySchema,
    updateCategorySchema
} = require('../middleware/validators/categorySchema')


const createCategory = errorHandler(async (req:Request, res:Response) => {
    const userId = req.user!._id
    const formData = req.body

    const validationResult = createCategorySchema.validate(formData);

    if (validationResult.error) {
        return res
        .status(400)
        .json({
            status: 'error',
            message: validationResult.error.details[0].message,
        });
    }

    const existingCategory = await Category.findOne({boardId:formData.boardId, name:{ $regex: `^${formData.name}$`, $options: 'i' }})
    if(existingCategory){
        return res.status(409).json({status:'error', message:'Category already exists'})
    }

    const newCategory = new Category({
        ...formData,
        userId
    })

    const savedCategory = await newCategory.save()
    return res.status(201).json({status:'success',message:'Category created successfully', data:savedCategory})
})

const getCategories = errorHandler(async (req:Request, res:Response) => {
     const userId = req.user!._id
    const boardId = req.params.boardId
    const categories = await Category.find({boardId, userId})
    return res.status(200).json({status:'success', data:categories})
})

const updateCategory = errorHandler(async (req:Request, res:Response) => {
    const userId = req.user!._id
    const categoryId = req.params.categoryId
    const formData = req.body

    const validationResult = updateCategorySchema.validate(formData);

    if (validationResult.error) {
        return res
        .status(400)
        .json({
            status: 'error',
            message: validationResult.error.details[0].message,
        });
    }

    const category = await Category.findOne({_id:categoryId, userId})
    if(!category){
        return res.status(409).json({status:'error',message:'Category not found or does not belong to currently logged in user'})
    }

    const existingCategory = await Category.findOne({boardId: category.boardId, name:{ $regex: `^${formData.name}$`, $options: 'i' }, _id: { $ne: categoryId }})
    if(existingCategory){
        return res.status(409).json({status:'error', message:'Category already exists'})
    }

    const updatedCategory = await Category.findByIdAndUpdate(categoryId, formData, {new:true})

    return res.status(200).json({status:'success',data: updatedCategory})
})

const deleteCategory = errorHandler(async (req:Request, res:Response) => {
    const categoryId = req.params.categoryId
    const userId = req.user!._id

    const category = await Category.findOne({_id:categoryId, userId})
    if(!category){
        return res.status(409).json({status:'error',message:'Category not found or does not belong to currently logged in user'})
    }

    await Category.findByIdAndDelete(categoryId)
    return res.status(204).json({})
})

module.exports = {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
}