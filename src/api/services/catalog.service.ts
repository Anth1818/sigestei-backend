import {
  getPriorityRequestsRepository,
  getRolesRepository,
  getDepartmentsRepository,
  getPositionsRepository,
  getGendersRepository,
  getTecniciansRepository,
  getTypesOfRequestsRepository,
  getEquipmentBrandsRepository,
  getEquipmentStatusesRepository,
  getEquipmentTypesRepository,
  getOsOptionsRepository,
  getOfficeSuitesRepository,
  getAntivirusSolutionsRepository,
  getRequestStatusesRepository,
} from "../repositories/catalog.repository";

export const getAllCatalogsService = async () => {
  const [
    priority_requests,
    os_options,
    office_suites,
    antivirus_solutions,
    request_types,
    equipment_brands,
    equipment_statuses,
    equipment_types,
    roles,
    departments,
    positions,
    genders,
    request_statuses,
    technicians,
  ] = await Promise.all([
    getPriorityRequestsRepository(),
    getOsOptionsRepository(),
    getOfficeSuitesRepository(),
    getAntivirusSolutionsRepository(),
    getTypesOfRequestsRepository(),
    getEquipmentBrandsRepository(),
    getEquipmentStatusesRepository(),
    getEquipmentTypesRepository(),
    getRolesRepository(),
    getDepartmentsRepository(),
    getPositionsRepository(),
    getGendersRepository(),
    getRequestStatusesRepository(),
    getTecniciansRepository(),
   
  ]);
  return { priority_requests, os_options, office_suites, antivirus_solutions, request_types, equipment_brands, equipment_statuses, equipment_types, roles, departments, positions, genders, request_statuses, technicians };
};
