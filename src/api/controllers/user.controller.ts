import { Request, Response } from 'express';
import { getAllUsers as getAllUsersRepository } from '../repositories/user.repository';
import { registerUserService } from '../services/user.service';

//  Clase de error personalizada
export class UserError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsersRepository();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

export const registerUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const newUser = await registerUserService(req.body);
        return res.status(201).json({ message: 'Registro exitoso', user: newUser });
    } catch (error) {
        if (error instanceof UserError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        return res.status(500).json({ message: 'Error al registrar el usuario' });
    }
};




