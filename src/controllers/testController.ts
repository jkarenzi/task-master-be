import { Request, Response } from 'express';
const { errorHandler } = require('../middleware/errorHandler');

exports.tester = errorHandler(async (req: Request, res: Response) => {
  return res.status(200).json({ status: 'success', message: 'It works' });
});
