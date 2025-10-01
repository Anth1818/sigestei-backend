import { getRolesRepository, getDepartmentsRepository, getPositionsRepository, getGendersRepository, getTecniciansRepository } from '../repositories/catalog.repository';

export const getAllCatalogsService = async () => {
  const [roles, departments, positions, genders, technicians] = await Promise.all([
    getRolesRepository(),
    getDepartmentsRepository(),
    getPositionsRepository(),
    getGendersRepository(),
    getTecniciansRepository(),
  ]);
  return { roles, departments, positions, genders, technicians };
};