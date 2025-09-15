import { getUserByEmail, getUserByIdentityCard, createUser } from "../repositories/user.repository";
import bcrypt from "bcrypt";
import { users as User } from "@prisma/client";
import { UserPayload } from "../../utils/types";
import type { CreateUserInput } from "../../utils/types";


export const registerUserService = async (
  userData: CreateUserInput
): Promise<UserPayload> => {
  try {
    // Validar que el email no exista
    const email = userData.email?.trim().toLowerCase();
    if (!email) {
      throw new Error("El correo es requerido");
    }
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      throw new Error("Este correo ya está registrado");
    }

    // Validar que el identity_card no este repetido
    if (!userData.identity_card) {
      throw new Error("La cédula es requerida");
    }
    const existingIdentityCard = await getUserByIdentityCard(userData.identity_card);
    if (existingIdentityCard) {
      throw new Error("Esta cédula ya está registrada");
    }
    userData.email = email;

    // Hashear la contraseña con bcrypt.hash()
    const hashedPassword = await bcrypt.hash(userData.password_hash!, 10);

    // Preparar los datos filtrando solo los campos necesarios (sin id, created_at, is_active)
    const userDataForCreation = {
      full_name: userData.full_name,
      identity_card: userData.identity_card,
      email: userData.email,
      role_id: userData.role_id,
      position_id: userData.position_id || null,
      gender_id: userData.gender_id || null,
    };

    // Crear el usuario usando el userRepository
    const newUser = await createUser(userDataForCreation, hashedPassword);

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