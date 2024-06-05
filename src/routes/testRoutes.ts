import { Router } from 'express';
import { test } from '../controllers/testController';

const testRouter = Router();

testRouter.get('/', test);

export default testRouter;
