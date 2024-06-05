import { Request, Response } from 'express';
import { errorHandler } from '../middleware/errorHandler';

export const test = errorHandler(async (req: Request, res: Response) => {
    return res.status(200).json({ status: 'success', message: 'It works' });
});
