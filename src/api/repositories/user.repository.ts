import { PrismaClient } from "../../generated/prisma";
import type { CreateUserInput } from "../../utils/types";

const prisma = new PrismaClient();


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


export const getAllUsersRepository = async () => {
  const users = await prisma.users.findMany({
    orderBy: { id: 'asc' },
    include: {
      departments: { select: { id: true, name: true } },
      roles: { select: { id: true, name: true } },
      genders: { select: { id: true, name: true } },
      positions: { select: { id: true, name: true } },
      computer_equipment: { select: {id: true, asset_number: true} }
    },
  });

  // Mapear para devolver los names como campos planos
  return users.map(u => ({
    id: u.id,
    full_name: u.full_name,
    identity_card: u.identity_card,
    email: u.email,
    is_active: u.is_active,
    role_id: u.role_id,
    position_id: u.position_id,
    department_id: u.department_id,
    gender_id: u.gender_id,
    created_at: u.created_at,
    last_login: u.last_login,
    last_login_backup: u.last_login_backup,
    department_name: u.departments?.name ?? null,
    role_name: u.roles?.name ?? null,
    gender_name: u.genders?.name ?? null,
    position_name: u.positions?.name ?? null,
    computer_equipment_asset_number: u.computer_equipment[0]?.asset_number ?? null,
  }));
};

export const getAllUsersByAllDepartmentsRepository = async () => {
  return await prisma.departments.findMany({
    include: { users: true},
    orderBy: { id: 'asc' }
  });
};

export const getAllUsersByDepartmentRepository = async (department_id: number) => {
  return await prisma.users.findMany({
    where: { department_id },
    orderBy: { full_name: 'asc' }
  });
}

export const getUserByEmailRepository = async (email: string) => {
  return await prisma.users.findUnique({
    where: { email },
  });
};

export const getUserByIdentityCardRepository = async (identity_card: number) => {
  return await prisma.users.findUnique({
    where: { identity_card },
  });
};

export const updateUserRepository = async (identity_card: number, userData: Partial<CreateUserInput>) => {
  return await prisma.users.update({
    where: { identity_card },
    data: userData,
  });
}

export const toggleActiveUserRepository = async (identity_card: number) => {
  const user = await prisma.users.findUnique({
    where: { identity_card },
    select: { is_active: true }
  });
  if (!user) throw new Error('Usuario no encontrado');
  return await prisma.users.update({
    where: { identity_card },
    data: { is_active: !user.is_active },
  });
}

export const resetUserPasswordRepository = async (identity_card: number, hashedPassword: string) => {
  return await prisma.users.update({
    where: { identity_card },
    data: { password_hash: hashedPassword },
  });
}

export const getCumputerEquipmentByUserIdRepository = async (userId: number) => {
  return await prisma.computer_equipment.findFirst({
    where: { assigned_user_id: userId },
  });
}

export const createUserRepository = async (userData: Omit<CreateUserInput, 'password'>, hashedPassword: string, ) => {
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

