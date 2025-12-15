import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getOsOptionsRepository = async () => prisma.os_options.findMany();
export const getOfficeSuitesRepository = async () => prisma.office_suites.findMany();
export const getAntivirusSolutionsRepository = async () => prisma.antivirus_solutions.findMany();
export const getTypesOfRequestsRepository = async () => prisma.request_types.findMany();
export const getEquipmentBrandsRepository = async () => prisma.equipment_brands.findMany();
export const getEquipmentStatusesRepository = async () => prisma.equipment_statuses.findMany();
export const getEquipmentTypesRepository = async () => prisma.equipment_types.findMany();
export const getRolesRepository = async () => prisma.roles.findMany();
export const getDepartmentsRepository = async () => prisma.departments.findMany();
export const getPositionsRepository = async () => prisma.positions.findMany();
export const getGendersRepository = async () => prisma.genders.findMany();
export const getRequestStatusesRepository = async () => prisma.request_statuses.findMany();
export const getTecniciansRepository = async () => prisma.users.findMany({
  where: { role_id: 3, is_active: true }, // Solo técnicos activos
  orderBy: { full_name: 'asc' },
    select: { id: true, full_name: true },
});

