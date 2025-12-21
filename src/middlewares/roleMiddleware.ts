import { Request, Response, NextFunction } from 'express';

// Recibe uno o varios roles permitidos
const roleMiddleware = (...allowedRoles: number[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // req.user debe estar definido por el authMiddleware
    const user = req.user as { role_id?: number };
    if (!user || typeof user.role_id !== 'number') {
      return res.status(403).json({ error: 'Acceso denegado: rol no definido' });
    }
    if (!allowedRoles.includes(user.role_id)) {
      return res.status(403).json({ error: 'Acceso denegado: rol insuficiente' });
    }
    next();
  };
};

export default roleMiddleware;