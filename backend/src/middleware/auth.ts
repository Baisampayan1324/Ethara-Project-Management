import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../config/db';

interface JwtPayload {
  id: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as JwtPayload;

      req.user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, name: true, email: true, role: true }
      });

      if (!req.user) {
        return res.status(401).json({ success: false, error: 'User not found' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ success: false, error: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ success: false, error: 'Not authorized, no token' });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};
