import prisma from "../../config/db";

/**
 * Obtener cambios generales de audit_log por entidad
 */
export const getAuditLogsByEntityRepository = async (
  entityType: 'request' | 'equipment' | 'user',
  entityId: number
) => {
  return await prisma.audit_log.findMany({
    where: {
      entity_type: entityType,
      entity_id: entityId
    },
    include: {
      changed_by: {
        select: {
          id: true,
          full_name: true,
          email: true
        }
      }
    },
    orderBy: { changed_at: 'desc' }
  });
};

/**
 * Obtener asignaciones de técnicos para una solicitud
 */
export const getRequestTechnicianAssignmentsRepository = async (requestId: number) => {
  return await prisma.request_technician_assignments.findMany({
    where: { request_id: requestId },
    include: {
      technician: {
        select: {
          id: true,
          full_name: true,
          email: true
        }
      },
      previous_technician: {
        select: {
          id: true,
          full_name: true,
          email: true
        }
      },
      assigned_by: {
        select: {
          id: true,
          full_name: true,
          email: true
        }
      }
    },
    orderBy: { assigned_at: 'desc' }
  });
};

/**
 * Obtener asignaciones de equipos (usuarios y ubicaciones)
 */
export const getEquipmentAssignmentsRepository = async (equipmentId: number) => {
  return await prisma.equipment_assignments.findMany({
    where: { equipment_id: equipmentId },
    include: {
      user: {
        select: {
          id: true,
          full_name: true,
          email: true
        }
      },
      previous_user: {
        select: {
          id: true,
          full_name: true,
          email: true
        }
      },
      assigned_by: {
        select: {
          id: true,
          full_name: true,
          email: true
        }
      }
    },
    orderBy: { assigned_at: 'desc' }
  });
};

/**
 * Obtener historial de logins de un usuario
 */
export const getUserLoginsRepository = async (userId: number, limit: number = 20) => {
  return await prisma.user_logins.findMany({
    where: { user_id: userId },
    orderBy: { login_at: 'desc' },
    take: limit
  });
};

/**
 * Obtener logs recientes del sistema
 */
export const getRecentAuditLogsRepository = async (limit: number = 50) => {
  return await prisma.audit_log.findMany({
    include: {
      changed_by: {
        select: {
          id: true,
          full_name: true,
          email: true
        }
      }
    },
    orderBy: { changed_at: 'desc' },
    take: limit
  });
};

/**
 * Contar cambios por tipo de entidad
 */
export const countAuditLogsByEntityTypeRepository = async (
  entityType: 'request' | 'equipment' | 'user'
) => {
  return await prisma.audit_log.count({
    where: { entity_type: entityType }
  });
};

/**
 * Contar total de logins
 */
export const countTotalLoginsRepository = async () => {
  return await prisma.user_logins.count();
};

/**
 * Buscar en logs de auditoría con filtros
 */
export const searchAuditLogsRepository = async (filters: {
  entity_type?: 'request' | 'equipment' | 'user';
  entity_id?: number;
  change_type?: string;
  changed_by_id?: number;
  start_date?: Date;
  end_date?: Date;
  limit?: number;
}) => {
  const where: any = {};

  if (filters.entity_type) where.entity_type = filters.entity_type;
  if (filters.entity_id) where.entity_id = filters.entity_id;
  if (filters.change_type) where.change_type = filters.change_type;
  if (filters.changed_by_id) where.changed_by_id = filters.changed_by_id;
  
  if (filters.start_date || filters.end_date) {
    where.changed_at = {};
    if (filters.start_date) where.changed_at.gte = filters.start_date;
    if (filters.end_date) where.changed_at.lte = filters.end_date;
  }

  return await prisma.audit_log.findMany({
    where,
    include: {
      changed_by: {
        select: {
          id: true,
          full_name: true,
          email: true
        }
      }
    },
    orderBy: { changed_at: 'desc' },
    take: filters.limit || 100
  });
};
