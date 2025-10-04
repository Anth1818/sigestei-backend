// Actualiza last_login y last_login_backup al hacer login
export const updateLoginTimestampsRepository = async (userId: number) => {
  const user = await prisma.users.findUnique({ where: { id: userId } });
  if (!user) throw new Error('Usuario no encontrado');
  if (!user.last_login) {
    // Primer login: ambos campos se inicializan
    const now = new Date();
    await prisma.users.update({
      where: { id: userId },
      data: {
        last_login: now,
        last_login_backup: now,
      },
    });
  } else {
    // Logins siguientes: solo last_login
    await prisma.users.update({
      where: { id: userId },
      data: {
        last_login: new Date(),
      },
    });
  }
};

// Actualiza last_login_backup al hacer logout
export const updateLogoutTimestampRepository = async (userId: number) => {
  const user = await prisma.users.findUnique({ where: { id: userId } });
  if (!user) throw new Error('Usuario no encontrado');
  if (user.last_login) {
    await prisma.users.update({
      where: { id: userId },
      data: {
        last_login_backup: user.last_login,
      },
    });
  }
};
import { PrismaClient } from "../../generated/prisma";
import type { CreateUserInput } from "../../utils/types";

const prisma = new PrismaClient();

const getAllUsersRepository = async () => {
  return await prisma.users.findMany({
    orderBy: { id: 'asc' }
  });
};

const getAllUsersByAllDepartmentsRepository = async () => {
  return await prisma.departments.findMany({
    include: { users: true},
    orderBy: { id: 'asc' }
  });
};

const getAllUsersByDepartmentRepository = async (department_id: number) => {
  return await prisma.users.findMany({
    where: { department_id },
    orderBy: { full_name: 'asc' }
  });
}

const getUserByEmailRepository = async (email: string) => {
  return await prisma.users.findUnique({
    where: { email },
  });
};

const getUserByIdentityCardRepository = async (identity_card: number) => {
  return await prisma.users.findUnique({
    where: { identity_card },
  });
};

const updateUserRepository = async (identity_card: number, userData: Partial<CreateUserInput>) => {
  return await prisma.users.update({
    where: { identity_card },
    data: userData,
  });
}

const toggleActiveUserRepository = async (identity_card: number, isActive: boolean) => {
  return await prisma.users.update({
    where: { identity_card },
    data: { is_active: isActive },
  });
}

const resetUserPasswordRepository = async (identity_card: number, hashedPassword: string) => {
  return await prisma.users.update({
    where: { identity_card },
    data: { password_hash: hashedPassword },
  });
}

const getCumputerEquipmentByUserIdRepository = async (userId: number) => {
  return await prisma.computer_equipment.findFirst({
    where: { assigned_user_id: userId },
  });
}

const createUserRepository = async (userData: Omit<CreateUserInput, 'password'>, hashedPassword: string, ) => {
  return await prisma.users.create({
    data: {
      full_name: userData.full_name,
      identity_card: userData.identity_card,
      email: userData.email,
      role_id: userData.role_id,
      position_id: userData.position_id,
      gender_id: userData.gender_id,
      department_id: userData.department_id,
      password_hash: hashedPassword,
    },
  });
}

export { getAllUsersRepository, getCumputerEquipmentByUserIdRepository, getAllUsersByAllDepartmentsRepository, getAllUsersByDepartmentRepository, getUserByEmailRepository, getUserByIdentityCardRepository, createUserRepository, updateUserRepository, toggleActiveUserRepository, resetUserPasswordRepository };