const { 
    signUp, 
    login,
    verifyEmail,
    requestVerifyLink,
    verifyTwoFactorCode,
    requestTwoFactorCode,
    toggleTwoFactorAuth
} = require('../controllers/authController');
const authenticateToken = require('../middleware/authenticateToken')
import { Router } from 'express';

const authRouter = Router();

authRouter.post('/signup', signUp);
authRouter.post('/login', login);
authRouter.get('/verify_email/:token', verifyEmail)
authRouter.post('/verify_code/:userId', verifyTwoFactorCode)
authRouter.post('/request_new_link', authenticateToken, requestVerifyLink)
authRouter.post('/request_new_code/:userId', requestTwoFactorCode)
authRouter.patch('/toggle_2fa', authenticateToken, toggleTwoFactorAuth)

module.exports = authRouter;
