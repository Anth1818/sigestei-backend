import {prisma} from "../../config/prisma";
import type { CreateRequestInput } from "../../utils/types";
import { 
  mapUserFields, 
  mapEquipmentFields, 
  getRequestIncludeConfig 
} from "../../utils/queryHelpers";


/**
 * Función base reutilizable para consultas de requests con filtros dinámicos
 */
const getRequestsWithFilter = async (whereClause: any = {}) => {
  const requests = await prisma.requests.findMany({
    where: whereClause,
    orderBy: { id: "desc" },
    include: getRequestIncludeConfig(),
  });

  return requests.map(req => ({
    ...req,
    users_requests_beneficiary_idTousers: mapUserFields(req.users_requests_beneficiary_idTousers),
    users_requests_requester_idTousers: mapUserFields(req.users_requests_requester_idTousers),
    users_requests_technician_idTousers: mapUserFields(req.users_requests_technician_idTousers),
    equipment: mapEquipmentFields(req.equipment),
  }));
};

export const getAllRequestsRepository = async () => {
  return getRequestsWithFilter();
};

export const getAllRequestsByUserIdRepository = async (userId: number) => {
  return getRequestsWithFilter({ requester_id: userId });
};

export const getAllRequestsForTechnicianRepository = async (userId: number) => {
  return getRequestsWithFilter({
    OR: [
      { requester_id: userId },
      { technician_id: userId }
    ]
  });
};

export const updateRequestRepository = async (
  id: number,
  data: Partial<CreateRequestInput>
) => {
  return await prisma.requests.update({
    where: { id },
    data,
  });
};

export const registerRequestRepository = async (
  requestData: CreateRequestInput
) => {
  return await prisma.requests.create({
    data: {
      description: requestData.description,
      requester_id: requestData.requester_id,
      beneficiary_id: requestData.beneficiary_id ?? null,
      equipment_id: requestData.equipment_id ?? null, // Usando equipment_id en lugar de computer_equipment_id
      type_id: requestData.type_id,
      type_equipment_id: requestData.type_equipment_id ?? null,
      status_id: 1, // Nuevo request siempre inicia en 'pending'
      priority_id: 3, // Nuevo request siempre inicia en 'low'
    },
  });
};
