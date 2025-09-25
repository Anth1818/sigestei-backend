import { requests } from "./../../generated/prisma/index.d";
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

  // Formatear resultados a { [mes]: { id: mes, name: nombreMes, count: cantidad } }
  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const createdByMonth: Record<
    number,
    { id: number; name: string; count: number }
  > = {};
  created.forEach((item) => {
    const month = (item.request_date as Date).getMonth() + 1;
    if (!createdByMonth[month]) {
      createdByMonth[month] = {
        id: month,
        name: monthNames[month - 1],
        count: 0,
      };
    }
    createdByMonth[month].count += item._count.id;
  });

  const resolvedByMonth: Record<
    number,
    { id: number; name: string; count: number }
  > = {};
  resolved.forEach((item) => {
    const month = (item.resolution_date as Date).getMonth() + 1;
    if (!resolvedByMonth[month]) {
      resolvedByMonth[month] = {
        id: month,
        name: monthNames[month - 1],
        count: 0,
      };
    }
    resolvedByMonth[month].count += item._count.id;
  });

  return {
    createdByMonth,
    resolvedByMonth,
  };
};

// Obtener solicitudes agrupadas por status (1: pendiente, 2: en proceso, 3: completada, 4: cerrada) solo del mes actual
export const getRequestsByStatusCurrentMonthRepository = async () => {
  const statusIds = [1, 2, 3, 4];
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);

  const grouped = await prisma.requests.groupBy({
    by: ["status_id"],
    where: {
      status_id: { in: statusIds },
      request_date: {
        gte: startDate,
        lte: endDate,
      },
    },
    _count: {
      id: true,
    },
  });

  // Formatear resultado para devolver un objeto { statusId: count }
  const byStatus: Record<number, number> = {};
  grouped.forEach((item) => {
    byStatus[item.status_id] = item._count.id;
  });

  return byStatus;
};

// Obtener el total de equipos y el total de equipos divididos por status (1,2,3,4)
export const getTotalEquipmentAndByStatusRepository = async () => {
  // Total de equipos
  const total = await prisma.computer_equipment.count();

  // Totales por status (1,2,3,4)
  const statusCounts = await prisma.computer_equipment.groupBy({
    by: ["status_id"],
    where: {
      status_id: { in: [1, 2, 3, 4] },
    },
    _count: {
      status_id: true,
    },
  });

  // Formatear resultado para devolver un objeto { statusId: count }
  const byStatus: Record<number, number> = {};
  statusCounts.forEach((item) => {
    byStatus[item.status_id] = item._count.status_id;
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

  // Formatear resultado para devolver un objeto { RoleId: count }
  const byRoles: Record<number, number> = {};
  rolesCounts.forEach((item) => {
    byRoles[item.role_id] = item._count.role_id;
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
