import { getRolesRepository, getDepartmentsRepository, getPositionsRepository, getGendersRepository } from '../repositories/catalog.repository';

export const getAllCatalogsService = async () => {
  const [roles, departments, positions, genders] = await Promise.all([
    getRolesRepository(),
    getDepartmentsRepository(),
    getPositionsRepository(),
    getGendersRepository(),
  ]);
  return { roles, departments, positions, genders };
};