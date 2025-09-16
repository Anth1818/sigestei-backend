import {PrismaClient} from '@prisma/client';
import type { CreateUserInput } from "../../utils/types";


const prisma = new PrismaClient();

const getAllUsers = async () => {
  return await prisma.users.findMany();
};

const getUserByEmail = async (email: string) => {
  return await prisma.users.findUnique({
    where: { email },
  });
};

const getUserByIdentityCard = async (identity_card: number) => {
  return await prisma.users.findUnique({
    where: { identity_card },
  });
};

const createUser = async (userData: Omit<CreateUserInput, 'password'>, hashedPassword: string, ) => {
  return await prisma.users.create({
    data: {
      ...userData,
      password_hash: hashedPassword,
    },
  });
}

export { getAllUsers, getUserByEmail, getUserByIdentityCard, createUser };