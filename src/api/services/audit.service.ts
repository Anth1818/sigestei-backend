import {
  getAuditLogsByEntityRepository,
  getRequestTechnicianAssignmentsRepository,
  getEquipmentAssignmentsRepository,
  getUserLoginsRepository,
  getRecentAuditLogsRepository,
  countAuditLogsByEntityTypeRepository,
  countTotalLoginsRepository,
  searchAuditLogsRepository
} from "../repositories/audit.repository";

/**
 * Obtener historial completo de una solicitud
 */
export const getRequestAuditHistoryService = async (requestId: number) => {
  const [generalChanges, technicianAssignments] = await Promise.all([
    getAuditLogsByEntityRepository('request', requestId),
    getRequestTechnicianAssignmentsRepository(requestId)
  ]);

  return {
    general_changes: generalChanges,
    technician_assignments: technicianAssignments
  };
};

/**
 * Obtener historial completo de un equipo
 */
export const getEquipmentAuditHistoryService = async (equipmentId: number) => {
  const [generalChanges, assignments] = await Promise.all([
    getAuditLogsByEntityRepository('equipment', equipmentId),
    getEquipmentAssignmentsRepository(equipmentId)
  ]);

  return {
    general_changes: generalChanges,
    assignments: assignments
  };
};

/**
 * Obtener historial de logins de un usuario
 */
export const getUserLoginHistoryService = async (userId: number, limit: number = 20) => {
  return await getUserLoginsRepository(userId, limit);
};

/**
 * Obtener historial de cambios de un usuario (roles, activaciones, etc.)
 */
export const getUserAuditHistoryService = async (userId: number) => {
  return await getAuditLogsByEntityRepository('user', userId);
};

/**
 * Obtener cambios recientes del sistema (para dashboard de auditoría)
 */
export const getRecentAuditLogsService = async (limit: number = 50) => {
  return await getRecentAuditLogsRepository(limit);
};

/**
 * Obtener estadísticas de auditoría por tipo de entidad
 */
export const getAuditStatisticsService = async () => {
  const [requestChanges, equipmentChanges, userChanges, totalLogins] = await Promise.all([
    countAuditLogsByEntityTypeRepository('request'),
    countAuditLogsByEntityTypeRepository('equipment'),
    countAuditLogsByEntityTypeRepository('user'),
    countTotalLoginsRepository()
  ]);

  return {
    request_changes: requestChanges,
    equipment_changes: equipmentChanges,
    user_changes: userChanges,
    total_logins: totalLogins
  };
};

/**
 * Buscar en logs de auditoría por filtros
 */
export const searchAuditLogsService = async (filters: {
  entity_type?: 'request' | 'equipment' | 'user';
  entity_id?: number;
  change_type?: string;
  changed_by_id?: number;
  start_date?: Date;
  end_date?: Date;
  limit?: number;
}) => {
  return await searchAuditLogsRepository(filters);
};
