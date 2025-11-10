import { equipment } from './../../generated/prisma/index.d';
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

const fieldsToIncludeEquipment = {
  select: {
    ...fieldsToInclude.select,
    equipment: true,
  },
}

export const getAllRequestsRepository = async () => {
  const requests = await prisma.requests.findMany({
    orderBy: { id: "desc" },
    include: {
      users_requests_beneficiary_idTousers: {
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
          equipment: true, // Incluir equipos del usuario beneficiario
        },
      },
      users_requests_requester_idTousers: fieldsToInclude,
      users_requests_technician_idTousers: fieldsToInclude,
      equipment: {
        include: {
          equipment_types: {
            select: {
              name: true,
            },
          },
          equipment_brands: {
            select: {
              name: true,
            },
          },
          equipment_statuses: {
            select: {
              name: true,
            },
          },
        },
      },
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

  // Mapear equipment para incluir nombres de relaciones
  const mapEquipmentFields = (equipment: any) => equipment && {
    ...equipment,
    type_name: equipment.equipment_types?.name ?? null,
    brand_name: equipment.equipment_brands?.name ?? null,
    status_name: equipment.equipment_statuses?.name ?? null,
    // Eliminar objetos anidados
    equipment_types: undefined,
    equipment_brands: undefined,
    equipment_statuses: undefined,
  };

  return requests.map(req => ({
    ...req,
    users_requests_beneficiary_idTousers: mapUserFields(req.users_requests_beneficiary_idTousers),
    users_requests_requester_idTousers: mapUserFields(req.users_requests_requester_idTousers),
    users_requests_technician_idTousers: mapUserFields(req.users_requests_technician_idTousers),
    equipment: mapEquipmentFields(req.equipment),
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
      equipment_id: requestData.equipment_id ?? null, // Usando equipment_id en lugar de computer_equipment_id
      type_id: requestData.type_id,
      type_equipment_id: requestData.type_equipment_id ?? null,
      status_id: 1, // Nuevo request siempre inicia en 'pending'
      priority_id: 3, // Nuevo request siempre inicia en 'low'
    },
  });
};
