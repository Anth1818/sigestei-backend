import {prisma} from "../../config/prisma";
import type { CreateRequestInput, PaginationParams, PaginatedResponse, RequestFilters } from "../../utils/types";
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

/**
 * Obtener requests con paginación
 */
export const getRequestsPaginatedRepository = async (
  params: PaginationParams
): Promise<PaginatedResponse<any>> => {
  const { page, limit } = params;
  const skip = (page - 1) * limit;

  const [requests, total] = await Promise.all([
    prisma.requests.findMany({
      skip,
      take: limit,
      orderBy: { id: "desc" },
      include: getRequestIncludeConfig(),
    }),
    prisma.requests.count(),
  ]);

  const mappedRequests = requests.map(req => ({
    ...req,
    users_requests_beneficiary_idTousers: mapUserFields(req.users_requests_beneficiary_idTousers),
    users_requests_requester_idTousers: mapUserFields(req.users_requests_requester_idTousers),
    users_requests_technician_idTousers: mapUserFields(req.users_requests_technician_idTousers),
    equipment: mapEquipmentFields(req.equipment),
  }));

  const totalPages = Math.ceil(total / limit);

  return {
    data: mappedRequests,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

/**
 * Construir where clause para filtros
 */
const buildFiltersWhereClause = (filters: RequestFilters) => {
  const whereClause: any = {};

  // Filtro por ID de request
  if (filters.request_id) {
    whereClause.id = filters.request_id;
  }

  if (filters.technician_ids && filters.technician_ids.length > 0) {
    whereClause.technician_id = { in: filters.technician_ids };
  }

  if (filters.status_ids && filters.status_ids.length > 0) {
    whereClause.status_id = { in: filters.status_ids };
  }

  if (filters.priority_ids && filters.priority_ids.length > 0) {
    whereClause.priority_id = { in: filters.priority_ids };
  }

  if (filters.type_ids && filters.type_ids.length > 0) {
    whereClause.type_id = { in: filters.type_ids };
  }

  // Filtro de rango de fechas
  if (filters.date_from || filters.date_to) {
    whereClause.request_date = {};
    if (filters.date_from) {
      whereClause.request_date.gte = filters.date_from;
    }
    if (filters.date_to) {
      whereClause.request_date.lte = filters.date_to;
    }
  }

  return whereClause;
};

/**
 * Obtener requests con filtros y paginación opcional
 */
export const getRequestsByFiltersRepository = async (
  filters: RequestFilters,
  pagination?: PaginationParams
): Promise<PaginatedResponse<any>> => {
  const whereClause = buildFiltersWhereClause(filters);

  if (pagination) {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const [requests, total] = await Promise.all([
      prisma.requests.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { id: "desc" },
        include: getRequestIncludeConfig(),
      }),
      prisma.requests.count({ where: whereClause }),
    ]);

    const mappedRequests = requests.map(req => ({
      ...req,
      users_requests_beneficiary_idTousers: mapUserFields(req.users_requests_beneficiary_idTousers),
      users_requests_requester_idTousers: mapUserFields(req.users_requests_requester_idTousers),
      users_requests_technician_idTousers: mapUserFields(req.users_requests_technician_idTousers),
      equipment: mapEquipmentFields(req.equipment),
    }));

    const totalPages = Math.ceil(total / limit);

    return {
      data: mappedRequests,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  // Sin paginación, devolver todos los resultados filtrados
  const requests = await prisma.requests.findMany({
    where: whereClause,
    orderBy: { id: "desc" },
    include: getRequestIncludeConfig(),
  });

  const mappedRequests = requests.map(req => ({
    ...req,
    users_requests_beneficiary_idTousers: mapUserFields(req.users_requests_beneficiary_idTousers),
    users_requests_requester_idTousers: mapUserFields(req.users_requests_requester_idTousers),
    users_requests_technician_idTousers: mapUserFields(req.users_requests_technician_idTousers),
    equipment: mapEquipmentFields(req.equipment),
  }));

  return {
    data: mappedRequests,
    pagination: {
      page: 1,
      limit: mappedRequests.length,
      total: mappedRequests.length,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  };
};
