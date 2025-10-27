import { registerUserService, getAllUsersService, getAllUsersByAllDepartmentsService, getAllUsersByDepartmentsService, getUserByIdentityCardService, updateUserService, toggleActiveUserService, resetUserPasswordService, changeUserPasswordService} from '../services/user.service';
import { Request, Response } from 'express';


export const getUserByIdentityCardController = async (req: Request, res: Response) => {
  try {
    const { identity_card } = req.params;

    // Validación de formato
    if (!/^\d{1,10}$/.test(identity_card)) {
      return res.status(400).json({ message: "Formato de cédula inválido. Debe contener solo números y tener un máximo de 10 dígitos." });
    }

    const user = await getUserByIdentityCardService(Number(identity_card));
    return res.json(user);
  } catch (error) {
    if (error instanceof Error) {
      // Si el error es "Usuario no encontrado", devolvemos 404
      if (error.message.includes("no fue encontrado")) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};


export const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsersService();
    return res.json(users);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    } else {
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
};

export const getAllUsersByAllDepartmentsController = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsersByAllDepartmentsService();   
    return res.json(users);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
  }
};

export const getAllUsersByDepartmentController = async (req: Request, res: Response) => {
  try {
    const { department_id } = req.params; 
    // Validación de formato
    if (!/^\d+$/.test(department_id)) {
      return res.status(400).json({ message: "ID de departamento inválido. Debe ser un número entero." });
    } 
    const users = await getAllUsersByDepartmentsService(Number(department_id));   
    return res.json(users);
  } catch (error) {
    if (error instanceof Error) {
      // Si el error es "No se encontraron usuarios en el departamento proporcionado", devolvemos 404
      if (error.message.includes("No se encontraron usuarios en el departamento proporcionado")) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ error: error.message });
    }
  }
}

export const toggleActiveUserController = async (req: Request, res: Response) => {
  try {
    const { identity_card } = req.params;

    // Validación de formato
    if (!/^\d{1,10}$/.test(identity_card)) {
      return res.status(400).json({ message: "Formato de cédula inválido. Debe contener solo números y tener un máximo de 10 dígitos." });
    }

    const userUpdate = await toggleActiveUserService(Number(identity_card));
    return res.json({ message: "Usuario actualizado correctamente", user: userUpdate });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("no fue encontrado")) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const resetUserPasswordController = async (req: Request, res: Response) => {
  try {
    const { identity_card } = req.params;

    // Validación de formato
    if (!/^\d{1,10}$/.test(identity_card)) {
      return res.status(400).json({ message: "Formato de cédula inválido. Debe contener solo números y tener un máximo de 10 dígitos." });
    }

    const userUpdate = await resetUserPasswordService(Number(identity_card));
    return res.json({ message: "Contraseña reseteada correctamente", user: userUpdate });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("no fue encontrado")) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}

export const changeUserPasswordController = async (req: Request, res: Response) => {
  const { identity_card } = req.params;
  const { new_password } = req.body;

  if(new_password === undefined || new_password.trim().length === 0) {
    return res.status(400).json({ message: "Nueva contraseña requerida" });
  }

  // Validación de formato
  if (!/^\d{1,10}$/.test(identity_card)) {
    return res.status(400).json({ message: "Formato de cédula inválido. Debe contener solo números y tener un máximo de 10 dígitos." });
  }

  try {
    const changeUserPassword = await changeUserPasswordService(Number(identity_card), new_password);
    return res.json({ message: "Contraseña cambiada correctamente", user: changeUserPassword });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("no fue encontrado")) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}

export const updateUserController = async (req: Request, res: Response) => {
  try {
    const { identity_card } = req.params;

    // Validación de formato
    if (!/^\d{1,10}$/.test(identity_card)) {
      return res.status(400).json({ message: "Formato de cédula inválido. Debe contener solo números y tener un máximo de 10 dígitos." });
    }

    const userUpdate = await updateUserService(Number(identity_card), req.body);
    return res.json({ message: "Usuario actualizado correctamente", user: userUpdate });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("no fue encontrado")) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const registerUserController = async (req: Request, res: Response): Promise<Response> => {
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




