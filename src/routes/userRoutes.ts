const {
    getAllUsers,
    getUser,
    changeEmail,
    changePassword,
    changeProfileImg,
    removeProfileImg,
    deleteUser
} = require('../controllers/userController')
import { Router } from 'express';
const authenticateToken = require('../middleware/authenticateToken') 
const authorizeAdmin = require('../middleware/authorizeAdmin')
const upload = require('../middleware/multer')

const userRouter = Router();

userRouter.use(authenticateToken)

userRouter.patch('/email', changeEmail)
userRouter.patch('/password', changePassword)
userRouter.route('/profileImg').patch(upload.fields([{name:'image'}]), changeProfileImg).delete(removeProfileImg)


userRouter.use(authorizeAdmin)

userRouter.get('/', getAllUsers)
userRouter.route('/:userId').get(getUser).delete(deleteUser)

module.exports = userRouter;
