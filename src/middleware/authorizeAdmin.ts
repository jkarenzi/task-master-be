import { Request, Response, NextFunction } from 'express';

const authorizeAdmin = (req: any, res: Response, next: NextFunction) => {
  const user = req.user;
  if (user.role !== 'admin') {
    return res.status(403).json({ status: 'error', message: 'Forbidden' });
  }
  next();
};

module.exports = authorizeAdmin;
