import { getAllUsersRepository } from "../repositories/user.repository"
import { getUserByEmailRepository,
getUserByIdentityCardRepository, getAllUsersByAllDepartmentsRepository, getAllUsersByDepartmentRepository, createUserRepository, updateUserRepository, toggleActiveUserRepository, resetUserPasswordRepository } from "../repositories/user.repository";
import bcrypt from "bcrypt";
import { UserPayload } from "../../utils/types";
import type { CreateUserInput } from "../../utils/types";


//  Clase de error personalizada
// export class UserError extends Error {
//   public statusCode: number;

//   constructor(message: string, statusCode: number) {
//     super(message);
//     this.statusCode = statusCode;
//   }
// }

export const getUserByIdentityCardService = async (identity_card: number) => {
  const user = await getUserByIdentityCardRepository(identity_card);
  if (!user) {
    throw new Error("Usuario con la cédula proporcionada no fue encontrado.");
  }
  return user;
};

export const getAllUsersService = async () => {
  return await getAllUsersRepository();
}

export const getAllUsersByAllDepartmentsService = async () => {
  return await getAllUsersByAllDepartmentsRepository();
}

export const getAllUsersByDepartmentsService = async (department_id: number) => {
  const UsersBydepartment = await getAllUsersByDepartmentRepository(department_id);
  if (UsersBydepartment.length === 0) {
    throw new Error("No se encontraron usuarios en el departamento proporcionado.");
  }
  return UsersBydepartment
}

export const toggleActiveUserService = async (identity_card: number) => {
  // Primero, verifica si el usuario existe
  await getUserByIdentityCardService(identity_card);
  
  const toggleActiveUser = await toggleActiveUserRepository(identity_card);
  return {
    id: toggleActiveUser.id,
    email: toggleActiveUser.email,
    full_name: toggleActiveUser.full_name,
    is_active: toggleActiveUser.is_active,
  };
};

export const resetUserPasswordService = async (identity_card: number) => {
  // Primero, verifica si el usuario existe
  await getUserByIdentityCardService(identity_card);

  const newPasswordHashed = await bcrypt.hash(String(identity_card), 10);
  const resetPasswordUser = await resetUserPasswordRepository(identity_card, newPasswordHashed);
  return {
    id: resetPasswordUser.id,
    email: resetPasswordUser.email,
    full_name: resetPasswordUser.full_name,
    is_active: resetPasswordUser.is_active,
  };
};

export const updateUserService = async (identity_card: number, userData: Partial<CreateUserInput>) => {
  // Primero, verifica si el usuario existe
  await getUserByIdentityCardService(identity_card);

  const updatedUser = await updateUserRepository(identity_card, userData);
  return updatedUser;
};

export const registerUserService = async (
  userData: CreateUserInput
): Promise<UserPayload> => {
  try {
    // Validar si el correo ya está registrado (ignorando mayúsculas y espacios)
    const email = userData.email?.trim().toLowerCase();

    const existingUser = await getUserByEmailRepository(email);
    if (existingUser) {
      throw new Error("Este correo ya está registrado");
    }

    // Validar si la cédula ya está registrada
    const existingIdentityCard = await getUserByIdentityCardRepository(userData.identity_card);
    if (existingIdentityCard) {
      throw new Error("Esta cédula ya está registrada");
    }
    userData.email = email;

    // Hashear la contraseña con bcrypt.hash()
    const hashedPassword = await bcrypt.hash(userData.password!, 10);

    // Crear el usuario usando el userRepository
    const newUser = await createUserRepository(userData, hashedPassword);

    // Devolver el usuario creado (sin la contraseña)
    return {
      id: newUser.id,
      email: newUser.email,
      full_name: newUser.full_name,
      role_id: newUser.role_id,
    };
  } catch (error) {
    // Puedes personalizar el manejo de errores aquí si lo deseas
    throw error;
  }
};