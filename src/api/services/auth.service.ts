import {getUserByEmailRepository}from '../repositories/user.repository'; // Asumiendo que exportas una instancia
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { users as User } from '@prisma/client'; // Asumiendo que tienes una interfaz/tipo para el usuario
import { UserPayload, LoginResponse } from '../../utils/types';


//  Clase de error personalizada
export class AuthError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Lógica del servicio tipada
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  const user: User | null = await getUserByEmailRepository(email);
  if (!user) {
    throw new AuthError('Credenciales inválidas', 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw new AuthError('Credenciales inválidas', 401);
  }

  if (!user.is_active) {
    throw new AuthError('El usuario se encuentra inactivo', 403);
  }

  const tokenPayload: UserPayload = {
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    role_id: user.role_id,
  };

  const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '3h' });

  return {
    token,
    user: tokenPayload,
  };
};

