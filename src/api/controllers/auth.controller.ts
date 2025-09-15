import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { AuthError } from '../services/auth.service';

export const login = async (req: Request, res: Response): Promise<Response> => {
  // El tipo del body también podría ser validado con librerías como Zod o class-validator
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña requeridos' });
  }

  try {
    const { token, user } = await authService.loginUser(email, password);

    res.cookie('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000, // 1 hora en ms
      sameSite: 'strict',
    });

    return res.status(200).json({
      message: 'Login exitoso',
      user,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    // Para cualquier otro error inesperado
    console.error(error); // Es buena idea loguear el error real
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// 
export const logout = (req: Request, res: Response): Response => {
  res.clearCookie('auth-token');
  return res.status(200).json({ message: 'Logout exitoso' });
};