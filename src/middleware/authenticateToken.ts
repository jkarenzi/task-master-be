import { Request, Response, NextFunction } from 'express';
const jwt = require('jsonwebtoken');

const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.header('Authorization');

  if (!header) {
    return res.status(401).json({ status: 'error', message: 'Access denied' });
  }

  const token = header.split(' ')[1];

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    //@ts-expect-errors still figuring out how to extend request
    req.user = decoded.user;

    next();
  } catch (err) {
    return res.status(403).json({ status: 'error', message: 'Invalid token' });
  }
};

module.exports = authenticateToken;
