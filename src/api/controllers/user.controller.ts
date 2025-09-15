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
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
};

export const registerUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const newUser = await registerUserService(req.body);
        return res.status(201).json({ message: 'Registro exitoso', user: newUser });
    } catch (error) {
        if (error instanceof Error) {
            // Usar el mensaje específico del service
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};




