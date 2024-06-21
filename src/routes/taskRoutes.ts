import { Router } from 'express';
const authenticateToken = require('../middleware/authenticateToken')
const {
    createTask,
    getTasks,
    getTask,
    updateTask,
    deleteTask
} = require('../controllers/taskController')

const taskRouter = Router()
taskRouter.use(authenticateToken)

taskRouter.route('/').post(createTask)
taskRouter.route('/:taskId').get(getTask).patch(updateTask).delete(deleteTask)
taskRouter.route('/all/:boardId').get(getTasks)


module.exports = taskRouter