import {PrismaClient} from '@prisma/client';
import type { CreateUserInput } from "../../utils/types";

const prisma = new PrismaClient();

const getAllUsersRepository = async () => {
  return await prisma.users.findMany({
    orderBy: { id: 'asc' }
  });
};


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

export { getAllUsersRepository, getUserByEmailRepository, getUserByIdentityCardRepository, createUserRepository, updateUserRepository, toggleActiveUserRepository, resetUserPasswordRepository };