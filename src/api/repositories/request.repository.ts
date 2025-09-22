import { PrismaClient } from '../../generated/prisma';
import type { CreateRequestInput } from '../../utils/types';
const prisma = new PrismaClient();

export const getAllRequestsRepository = async () => {
  return await prisma.requests.findMany({
    orderBy: { id: 'asc' },
    include: {
      users_requests_beneficiary_idTousers: true,
      users_requests_requester_idTousers: true,
      users_requests_technician_idTousers: true,
      computer_equipment: true,
      request_priorities: true,
      request_statuses: true,
      request_types: true,
    },
  });
};

export const updateRequestRepository = async (id: number, data: Partial<CreateRequestInput>) => {
  return await prisma.requests.update({
    where: { id },
    data,
  });
}

export const registerRequestRepository = async (requestData: CreateRequestInput) => {
  return await prisma.requests.create({
    data: {
      description: requestData.description,
      request_date: requestData.request_date, // opcional, si no se pasa usa el default de la DB
      resolution_date: requestData.resolution_date ?? null,
      requester_id: requestData.requester_id,
      beneficiary_id: requestData.beneficiary_id ?? null,
      computer_equipment_id: requestData.computer_equipment_id ?? null,
      type_id: requestData.type_id,
      status_id: requestData.status_id,
      priority_id: requestData.priority_id,
    },
  });
};