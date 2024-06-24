import { Request, Response, NextFunction } from 'express';
import { IUser } from '../custom';

const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
  
  const user = req.user as IUser;
  if (user.role !== 'admin') {
    return res.status(403).json({ status: 'error', message: 'Forbidden' });
  }
  next();
};

module.exports = authorizeAdmin;
