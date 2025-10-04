import { computer_equipment } from './../../generated/prisma/index.d';
import { PrismaClient } from "../../generated/prisma";
import type { CreateRequestInput } from "../../utils/types";
const prisma = new PrismaClient();

const fieldsToInclude = {
  select: {
    id: true,
    full_name: true,
    identity_card: true,
    email: true,
    is_active: true,
    role_id: true,
    position_id: true,
    department_id: true,
    gender_id: true,
    created_at: true,
    positions: { select: { name: true } },
    departments: { select: { name: true } },
    genders: { select: { name: true } },
    roles: { select: { name: true } },
    
  },
};

const fieldsToIncludeComputer = {
  select: {
    ...fieldsToInclude.select,
    computer_equipment: true,
  },
}

export const getAllRequestsRepository = async () => {
  const requests = await prisma.requests.findMany({
    orderBy: { id: "asc" },
    include: {
      users_requests_beneficiary_idTousers: fieldsToIncludeComputer,
      users_requests_requester_idTousers: fieldsToInclude,
      users_requests_technician_idTousers: fieldsToInclude,
      computer_equipment: true,
      request_priorities: true,
      request_statuses: true,
      request_types: true,
    },
  });

  // Mapear los campos relacionados para devolver solo el texto del nombre
  const mapUserFields = (user: any) => user && {
    ...user,
    position: user.positions?.name ?? null,
    department: user.departments?.name ?? null,
    gender: user.genders?.name ?? null,
    role: user.roles?.name ?? null,
    // Elimina los objetos anidados originales
    positions: undefined,
    departments: undefined,
    genders: undefined,
    roles: undefined,
  };

  return requests.map(req => ({
    ...req,
    users_requests_beneficiary_idTousers: mapUserFields(req.users_requests_beneficiary_idTousers),
    users_requests_requester_idTousers: mapUserFields(req.users_requests_requester_idTousers),
    users_requests_technician_idTousers: mapUserFields(req.users_requests_technician_idTousers),
  }));
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
      computer_equipment_id: requestData.computer_equipment_id ?? null,
      type_id: requestData.type_id,
      status_id: 1, // Nuevo request siempre inicia en 'pending'
      priority_id: 3, // Nuevo request siempre inicia en 'low'
    },
  });
};
