const { tester } = require('../controllers/testController');
import { Router } from 'express';

const testRouter = Router();

testRouter.get('/', tester);

module.exports = testRouter;
