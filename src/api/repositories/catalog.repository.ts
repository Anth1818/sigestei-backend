import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getRolesRepository = async () => prisma.roles.findMany();
export const getDepartmentsRepository = async () => prisma.departments.findMany();
export const getPositionsRepository = async () => prisma.positions.findMany();
export const getGendersRepository = async () => prisma.genders.findMany();
// Agrega más según tus catálogos