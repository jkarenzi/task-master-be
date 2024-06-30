import { Request, Response, NextFunction } from 'express';
import { IUser } from '../custom';
const jwt = require('jsonwebtoken');

const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.header('Authorization');

  if (!header) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }

  const token = header.split(' ')[1];

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded.user as IUser;

    next();
  } catch (err) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }
};

module.exports = authenticateToken;
