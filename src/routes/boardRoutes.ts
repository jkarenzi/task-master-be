import { Router } from 'express';
const authenticateToken = require('../middleware/authenticateToken')
const {
    createBoard,
    getBoards,
    updateBoard,
    deleteBoard
} = require('../controllers/boardController')

const boardRouter = Router()
boardRouter.use(authenticateToken)

boardRouter.route('/').post(createBoard).get(getBoards)
boardRouter.route('/:boardId').patch(updateBoard).delete(deleteBoard)

module.exports = boardRouter