import {
  getRolesRepository,
  getDepartmentsRepository,
  getPositionsRepository,
  getGendersRepository,
  getTecniciansRepository,
  getTypesOfRequestsRepository,
  getComputersBrandsRepository,
  getComputersStatusesRepository,
  getComputersTypesRepository,
} from "../repositories/catalog.repository";

export const getAllCatalogsService = async () => {
  const [
    request_types,
    computer_brands,
    computer_statuses,
    computer_types,
    roles,
    departments,
    positions,
    genders,
    technicians,
  ] = await Promise.all([
    getTypesOfRequestsRepository(),
    getComputersBrandsRepository(),
    getComputersStatusesRepository(),
    getComputersTypesRepository(),
    getRolesRepository(),
    getDepartmentsRepository(),
    getPositionsRepository(),
    getGendersRepository(),
    getTecniciansRepository(),
   
  ]);
  return { request_types, computer_brands, computer_statuses, computer_types, roles, departments, positions, genders, technicians, };
};
