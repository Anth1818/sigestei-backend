import {getUserByEmail, createUser }from '../repositories/user.repository'; // Asumiendo que exportas una instancia
import bcrypt from 'bcrypt';
import { users as User } from '@prisma/client'; // Asumiendo que tienes una interfaz/tipo para el usuario
import { UserPayload } from '../../utils/types';


export const registerUserService = async (userData: User): Promise<UserPayload> => {
    // Lógica para crear el usuario...
    // 1. Validar que el email no exista
    // 2. Hashear la contraseña con bcrypt.hash()
    const hashedPassword = await bcrypt.hash(userData.password_hash!, 10);
    
    // 3. Crear el usuario usando el userRepository
    const newUser = await createUser(userData, hashedPassword, );

    // 4. Devolver el usuario creado (sin la contraseña)
    return {
        id: newUser.id,
        email: newUser.email,
        full_name: newUser.full_name,
        role_id: newUser.role_id
    };
};