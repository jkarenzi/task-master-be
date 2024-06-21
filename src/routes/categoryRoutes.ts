import { Router } from 'express';
const authenticateToken = require('../middleware/authenticateToken')
const {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController')

const categoryRouter = Router()
categoryRouter.use(authenticateToken)

categoryRouter.route('/').post(createCategory)
categoryRouter.route('/:categoryId').patch(updateCategory).delete(deleteCategory)
categoryRouter.route('/:boardId').get(getCategories)

module.exports = categoryRouter