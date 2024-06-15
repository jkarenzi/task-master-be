import { Router } from 'express';
const {
    createStickyNote,
    getStickyNotes,
    updateStickyNote,
    deleteStickyNote
} = require('../controllers/stickyController')
const authenticateToken = require('../middleware/authenticateToken')

const stickyRouter = Router();
stickyRouter.use(authenticateToken)

stickyRouter.route('/').get(getStickyNotes).post(createStickyNote)
stickyRouter.route('/:id').patch(updateStickyNote).delete(deleteStickyNote)


module.exports = stickyRouter;