import {PrismaClient} from '@prisma/client';
import {users as User} from '@prisma/client'; // Asumiendo que tienes una interfaz/tipo para el usuario


const prisma = new PrismaClient();

const getAllUsers = async () => {
  return await prisma.users.findMany();
};

const getUserByEmail = async (email: string) => {
  return await prisma.users.findUnique({
    where: { email },
  });
};

const createUser = async (userData: Omit<User, 'password'>, hashedPassword: string, ) => {
  return await prisma.users.create({
    data: {
      ...userData,
      password_hash: hashedPassword,
    },
  });
}

export { getAllUsers, getUserByEmail, createUser };