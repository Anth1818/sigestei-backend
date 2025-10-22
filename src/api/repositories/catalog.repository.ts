import { PrismaClient } from '../../generated/prisma';
const prisma = new PrismaClient();


export const getTypesOfRequestsRepository = async () => prisma.request_types.findMany();
export const getComputersBrandsRepository = async () => prisma.equipment_brands.findMany();
export const getComputersStatusesRepository = async () => prisma.equipment_statuses.findMany();
export const getComputersTypesRepository = async () => prisma.equipment_types.findMany();
export const getRolesRepository = async () => prisma.roles.findMany();
export const getDepartmentsRepository = async () => prisma.departments.findMany();
export const getPositionsRepository = async () => prisma.positions.findMany();
export const getGendersRepository = async () => prisma.genders.findMany();
export const getTecniciansRepository = async () => prisma.users.findMany({
  where: { role_id: 3, is_active: true }, // Solo técnicos activos
  orderBy: { full_name: 'asc' },
    select: { id: true, full_name: true },
});

