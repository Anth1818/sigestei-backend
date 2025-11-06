import { equipment } from './../../generated/prisma/index.d';
import {getUserByEmailRepository, getEquipmentByUserIdRepository, updateLoginTimestampsRepository, updateLogoutTimestampRepository}from '../repositories/user.repository'; // Asumiendo que exportas una instancia
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { users as User } from '../../generated/prisma'; // Asumiendo que tienes una interfaz/tipo para el usuario
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

  // Actualizar last_login y last_login_backup según la lógica
  await updateLoginTimestampsRepository(user.id);


  // Obtener el equipo de cómputo asignado al usuario
  const equipment_id = await getEquipmentByUserIdRepository(user.id);
  const id = equipment_id ? equipment_id.id : null;


  const tokenPayload: UserPayload = {
    id: user.id,
    identity_card: user.identity_card,
    email: user.email,
    full_name: user.full_name,
    role_id: user.role_id,
    department_id: user.department_id,
    last_login: user.last_login || null,
    last_login_backup: user.last_login_backup || null,
    equipment_id: id
    
  };

  const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '5h' });

  return {
    token,
    user: tokenPayload,
  };
};

export const logoutUser = async (userId: number) => {
  await updateLogoutTimestampRepository(userId);
};

