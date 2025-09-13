const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllUsers = async () => {
  return await prisma.users.findMany();
};

exports.getUserByEmail = async (email) => {
  return await prisma.users.findUnique({
    where: { email },
  });
};
