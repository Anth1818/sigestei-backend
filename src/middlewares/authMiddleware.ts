import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies['auth-token'];
  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }
  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
};

export default authMiddleware;