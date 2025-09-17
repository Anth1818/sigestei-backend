import { getUserByEmail, getUserByIdentityCard, createUser } from "../repositories/user.repository";
import bcrypt from "bcrypt";
import { UserPayload } from "../../utils/types";
import type { CreateUserInput } from "../../utils/types";


export const registerUserService = async (
  userData: CreateUserInput
): Promise<UserPayload> => {
  try {
    // Validar si el correo ya está registrado (ignorando mayúsculas y espacios)
    const email = userData.email?.trim().toLowerCase();

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      throw new Error("Este correo ya está registrado");
    }

    // Validar si la cédula ya está registrada
    const existingIdentityCard = await getUserByIdentityCard(userData.identity_card);
    if (existingIdentityCard) {
      throw new Error("Esta cédula ya está registrada");
    }
    userData.email = email;

    // Hashear la contraseña con bcrypt.hash()
    const hashedPassword = await bcrypt.hash(userData.password!, 10);

    // Crear el usuario usando el userRepository
    const newUser = await createUser(userData, hashedPassword);

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