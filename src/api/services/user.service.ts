import { ChangeUserPasswordRepository, getAllUsersEnabledToGetSupportByDepartmentRepository, getAllUsersRepository } from "../repositories/user.repository"
import { getUserByEmailRepository,
getUserByIdentityCardRepository, getAllUsersByAllDepartmentsRepository, getAllUsersByDepartmentRepository, createUserRepository, updateUserRepository, toggleActiveUserRepository, resetUserPasswordRepository } from "../repositories/user.repository";
import bcrypt from "bcrypt";
import { UserPayload } from "../../utils/types";
import type { CreateUserInput } from "../../utils/types";
import { 
  logUserActivationChange, 
  logUserRoleChange,
  createAuditLog 
} from "../../middlewares/auditMiddleware";


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

export const getAllUsersEnabledToGetSupportByDepartmentService = async (department_id: number) => {
  return await getAllUsersEnabledToGetSupportByDepartmentRepository(department_id);
}

export const getAllUsersByDepartmentsService = async (department_id: number) => {
  const UsersBydepartment = await getAllUsersByDepartmentRepository(department_id);
  if (UsersBydepartment.length === 0) {
    throw new Error("No se encontraron usuarios en el departamento proporcionado.");
  }
  return UsersBydepartment
}

export const toggleActiveUserService = async (identity_card: number, changedById?: number) => {
  // Primero, verifica si el usuario existe y obtén el estado actual
  const currentUser = await getUserByIdentityCardService(identity_card);
  
  const toggleActiveUser = await toggleActiveUserRepository(identity_card);

  // Registrar el cambio en auditoría
  if (changedById) {
    await logUserActivationChange(
      toggleActiveUser.id,
      currentUser.is_active || false,
      toggleActiveUser.is_active || false,
      changedById,
      toggleActiveUser.is_active ? 'Usuario activado' : 'Usuario desactivado'
    );
  }

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

export const changeUserPasswordService = async (identity_card: number, newPassword: string) => {
    await getUserByIdentityCardService(identity_card);

  const newPasswordHashed = await bcrypt.hash(String(newPassword), 10);
  const changeUserPassword = await ChangeUserPasswordRepository(identity_card, newPasswordHashed);
  return {
    id: changeUserPassword.id,
    identity_card: changeUserPassword.identity_card,
    email: changeUserPassword.email,
    full_name: changeUserPassword.full_name,
    is_active: changeUserPassword.is_active,
  };
}

export const updateUserService = async (
  identity_card: number, 
  userData: Partial<CreateUserInput>,
  updatedById?: number
) => {
  // Primero, verifica si el usuario existe y obtén los datos actuales
  const currentUser = await getUserByIdentityCardService(identity_card);

  const updatedUser = await updateUserRepository(identity_card, userData);

  // Registrar cambios en auditoría
  if (updatedById) {
    const auditPromises = [];

    // Cambio de rol
    if (userData.role_id && userData.role_id !== currentUser.role_id) {
      auditPromises.push(
        logUserRoleChange(
          updatedUser.id,
          currentUser.role_id,
          userData.role_id,
          updatedById,
          'Cambio de rol de usuario'
        )
      );
    }

    // Cambio de departamento
    if (userData.department_id && userData.department_id !== currentUser.department_id) {
      auditPromises.push(
        createAuditLog(
          'user',
          updatedUser.id,
          'department_changed',
          'department_id',
          currentUser.department_id,
          userData.department_id,
          updatedById,
          'Cambio de departamento'
        )
      );
    }

    // Cambio de posición
    if (userData.position_id && userData.position_id !== currentUser.position_id) {
      auditPromises.push(
        createAuditLog(
          'user',
          updatedUser.id,
          'position_changed',
          'position_id',
          currentUser.position_id,
          userData.position_id,
          updatedById,
          'Cambio de cargo'
        )
      );
    }
    //Cambio de genero 
    if (userData.gender_id && userData.gender_id !== currentUser.gender_id) {
      auditPromises.push(
        createAuditLog(
          'user',
          updatedUser.id,
          'gender_changed',
          'gender_id',
          currentUser.gender_id,
          userData.gender_id,
          updatedById,
          'Cambio de género'
        )
      );
    }

    // Cambio de email
    if (userData.email && userData.email !== currentUser.email) {
      auditPromises.push(
        createAuditLog(
          'user',
          updatedUser.id,
          'email_changed',
          'email',
          currentUser.email,
          userData.email,
          updatedById,
          'Cambio de correo electrónico'
        )
      );
    }

    //Cambio de nombre completo
    if (userData.full_name && userData.full_name !== currentUser.full_name) {
      auditPromises.push(
        createAuditLog(
          'user',
          updatedUser.id,
          'full_name_changed',
          'full_name',
          currentUser.full_name,
          userData.full_name,
          updatedById,
          'Cambio de nombre completo'
        )
      );
    }

    //Cambio de cedula identidad
    if (userData.identity_card && userData.identity_card !== currentUser.identity_card) {
      auditPromises.push(
        createAuditLog(
          'user',
          updatedUser.id,
          'identity_card_changed',
          'identity_card',
          currentUser.identity_card,
          userData.identity_card,
          updatedById,
          'Cambio de cédula de identidad'
        )
      );
    }

   //Cambio de contraseña (reseteo o cambio por el user)
    if (userData.password) {
      auditPromises.push(
        createAuditLog(
          'user',
          updatedUser.id,
          'password_changed',
          'password_hash',
          '********',
          '********',
          updatedById,
          'Cambio de contraseña'
        )
      );
    }


    await Promise.all(auditPromises);
  }

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
      identity_card: newUser.identity_card,
      email: newUser.email,
      full_name: newUser.full_name,
      role_id: newUser.role_id,
    };
  } catch (error) {
    // Puedes personalizar el manejo de errores aquí si lo deseas
    throw error;
  }
};