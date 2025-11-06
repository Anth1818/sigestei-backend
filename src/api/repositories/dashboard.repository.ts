import { PrismaClient } from "../../generated/prisma";
const prisma = new PrismaClient();

// Obtener solicitudes creadas y resueltas por mes
export const getRequestsCreatedAndResolvedByMonthRepository = async () => {
  const currentYear = new Date().getFullYear();

  // Agrupar solicitudes creadas por mes
  const created = await prisma.requests.groupBy({
    by: ["request_date"],
    where: {
      request_date: {
        gte: new Date(`${currentYear}-01-01`),
        lt: new Date(`${currentYear + 1}-01-01`),
      },
    },
    _count: { id: true },
  });

  // Agrupar solicitudes resueltas por mes basado en el status_id = 3
  const resolved = await prisma.requests.groupBy({
    by: ["resolution_date"],
    where: {
      status_id: 3,
      resolution_date: {
        not: null,
        gte: new Date(`${currentYear}-01-01`),
        lt: new Date(`${currentYear + 1}-01-01`),
      },
    },
    _count: { id: true },
  });

  // Meses en inglés
  const monthNames = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];

  // Inicializar objetos con todos los meses en 0
  const createdByMonth: Record<string, number> = {};
  const resolvedByMonth: Record<string, number> = {};
  monthNames.forEach((name) => {
    createdByMonth[name] = 0;
    resolvedByMonth[name] = 0;
  });

  created.forEach((item) => {
    const monthIdx = (item.request_date as Date).getMonth();
    const monthName = monthNames[monthIdx];
    createdByMonth[monthName] += item._count.id;
  });

  resolved.forEach((item) => {
    const monthIdx = (item.resolution_date as Date).getMonth();
    const monthName = monthNames[monthIdx];
    resolvedByMonth[monthName] += item._count.id;
  });

  return {
    created: createdByMonth,
    resolved: resolvedByMonth,
  };
};


export const getRequestsCreatedAndResolvedSameMonthRepository = async () => {
  const currentYear = new Date().getFullYear();
  const requests = await prisma.requests.findMany({
    where: {
      request_date: {
        gte: new Date(`${currentYear}-01-01`),
        lt: new Date(`${currentYear + 1}-01-01`),
      },
      resolution_date: {
        not: null,
        gte: new Date(`${currentYear}-01-01`),
        lt: new Date(`${currentYear + 1}-01-01`),
      },
      status_id: 3,
    },
    select: {
      request_date: true,
      resolution_date: true,
    },
  });

  // Meses en inglés
  const monthNames = [
    "january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december"
  ];

  // Inicializar objeto con todos los meses en 0
  const sameMonth: Record<string, number> = {};
  monthNames.forEach((name) => {
    sameMonth[name] = 0;
  });

  requests.forEach((item) => {
    if (item.request_date && item.resolution_date) {
      const reqMonth = new Date(item.request_date).getMonth();
      const resMonth = new Date(item.resolution_date).getMonth();
      if (reqMonth === resMonth) {
        const monthName = monthNames[reqMonth];
        sameMonth[monthName]++;
      }
    }
  });

  return sameMonth;
};

// Obtener solicitudes agrupadas por status (1: pendiente, 2: en proceso, 3: completada, 4: cerrada) solo del mes actual
export const getRequestsByStatusCurrentMonthRepository = async () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);

  // 1, 2, 4: creados en el mes actual
  const createdStatuses = [1, 2, 4];
  const createdRequests = await prisma.requests.groupBy({
    by: ["status_id"],
    where: {
      status_id: { in: createdStatuses },
      request_date: {
        gte: startDate,
        lte: endDate,
      },
    },
    _count: { id: true },
  });

  // 3: resueltos en el mes actual (independiente de fecha de creación)
  const resolvedRequests = await prisma.requests.groupBy({
    by: ["status_id"],
    where: {
      status_id: 3,
      resolution_date: {
        not: null,
        gte: startDate,
        lte: endDate,
      },
    },
    _count: { id: true },
  });

  // Mapeo de ids a nombres de status
  const statusNames: Record<number, string> = {
    1: "pending",
    2: "in_process",
    3: "resolved",
    4: "closed",
  };

  // Inicializar resultado
  const byStatus: Record<string, number> = {
    pending: 0,
    in_process: 0,
    resolved: 0,
    closed: 0,
  };

  createdRequests.forEach((item) => {
    const statusName = statusNames[item.status_id];
    if (statusName) byStatus[statusName] = item._count.id;
  });

  resolvedRequests.forEach((item) => {
    byStatus["resolved"] = item._count.id;
  });

  return byStatus;
};

// Obtener el total de equipos y el total de equipos divididos por status (1,2,3,4)
export const getTotalEquipmentAndByStatusRepository = async () => {
  // Total de equipos
  const total = await prisma.equipment.count();

  // Totales por status (1,2,3,4)
  const statusCounts = await prisma.equipment.groupBy({
    by: ["status_id"],
    where: {
      status_id: { in: [1, 2, 3, 4] },
    },
    _count: {
      status_id: true,
    },
  });

  // Mapeo de ids a nombres de status
  const statusNames: Record<number, string> = {
    1: "operational",
    2: "under_review",
    3: "damaged",
    4: "withdrawn",
  };

  // Formatear resultado para devolver un objeto { nombreStatus: count }
  const byStatus: Record<string, number> = {};
  statusCounts.forEach((item) => {
    const statusName = statusNames[item.status_id] || String(item.status_id);
    byStatus[statusName] = item._count.status_id;
  });

  return {
    total,
    byStatus,
  };
};

// Obtener total de usuarios y el total de usuarios divididos por rol
export const getTotalUsersAndByRoleRepository = async () => {
  const totalUsers = await prisma.users.count();

  const rolesCounts = await prisma.users.groupBy({
    by: ["role_id"],
    where: {
      role_id: { in: [1, 2, 3, 4] },
    },
    _count: {
      role_id: true,
    },
  });

  // Mapeo de ids a nombres de roles
  const roleNames: Record<number, string> = {
    1: "admin",
    2: "manager",
    3: "technician",
    4: "user",
  };

  // Formatear resultado para devolver un objeto { nombreRol: count }
  const byRoles: Record<string, number> = {};
  rolesCounts.forEach((item) => {
    const roleName = roleNames[item.role_id] || String(item.role_id);
    byRoles[roleName] = item._count.role_id;
  });

  return {
    totalUsers,
    byRoles,
  };
};

// Obtener métricas completas del dashboard
export const getDashboardMetricsRepository = async () => {
  // Ejecutar todas las consultas en paralelo
  const [
    requestByStatusCurrentMonth,
    requestsCreatedAndResolvedByMonth,
    totalEquipment,
    totalUsers,
  ] = await Promise.all([
    getRequestsByStatusCurrentMonthRepository(),
    getRequestsCreatedAndResolvedByMonthRepository(),
    getTotalEquipmentAndByStatusRepository(),
    getTotalUsersAndByRoleRepository(),
  ]);

  return {
    requestByStatusCurrentMonth,
    requestsCreatedAndResolvedByMonth,
    totalEquipment,
    totalUsers,
  };
};
