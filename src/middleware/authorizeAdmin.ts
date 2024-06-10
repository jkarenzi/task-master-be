import { Request, Response, NextFunction } from 'express';

const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
  //@ts-expect-errors still figuring out how to extend request
  const user = req.user;
  if (user.role !== 'admin') {
    return res.status(403).json({ status: 'error', message: 'Forbidden' });
  }
  next();
};

module.exports = authorizeAdmin;
