const { signUp, login } = require('../controllers/authController');
import { Router } from 'express';

const authRouter = Router();

authRouter.post('/signup', signUp);
authRouter.post('/login', login);

module.exports = authRouter;
