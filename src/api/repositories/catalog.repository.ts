import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getRolesRepository = async () => prisma.roles.findMany();
export const getDepartmentsRepository = async () => prisma.departments.findMany();
export const getPositionsRepository = async () => prisma.positions.findMany();
export const getGendersRepository = async () => prisma.genders.findMany();
export const getTecniciansRepository = async () => prisma.users.findMany({
  where: { role_id: 3, is_active: true }, // Solo técnicos activos
  orderBy: { full_name: 'asc' },
    select: { id: true, full_name: true },
});
export const getTypesOfRequestsRepository = async () => prisma.request_types.findMany();
// Agrega más según tus catálogos