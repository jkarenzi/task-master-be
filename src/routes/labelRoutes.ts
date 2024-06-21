import { Router } from 'express';
const authenticateToken = require('../middleware/authenticateToken')
const {
    createLabel,
    getLabels,
    updateLabel,
    deleteLabel
} = require('../controllers/labelController')

const labelRouter = Router()
labelRouter.use(authenticateToken)

labelRouter.route('/').post(createLabel)
labelRouter.route('/:labelId').patch(updateLabel).delete(deleteLabel)
labelRouter.route('/:boardId').get(getLabels)

module.exports = labelRouter