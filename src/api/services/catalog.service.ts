import { getRolesRepository, getDepartmentsRepository, getPositionsRepository, getGendersRepository, getTecniciansRepository, getTypesOfRequestsRepository } from '../repositories/catalog.repository';

export const getAllCatalogsService = async () => {
  const [roles, departments, positions, genders, technicians, request_types] = await Promise.all([
    getRolesRepository(),
    getDepartmentsRepository(),
    getPositionsRepository(),
    getGendersRepository(),
    getTecniciansRepository(),
    getTypesOfRequestsRepository(),

  ]);
  return { roles, departments, positions, genders, technicians, request_types };
};