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
  getOsOptionsRepository,
  getOfficeSuitesRepository,
  getAntivirusSolutionsRepository,
} from "../repositories/catalog.repository";

export const getAllCatalogsService = async () => {
  const [
    os_options,
    office_suites,
    antivirus_solutions,
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
    getOsOptionsRepository(),
    getOfficeSuitesRepository(),
    getAntivirusSolutionsRepository(),
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
  return { os_options, office_suites, antivirus_solutions, request_types, computer_brands, computer_statuses, computer_types, roles, departments, positions, genders, technicians };
};
