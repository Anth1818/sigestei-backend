import prisma from "../../config/db";

/**
 * Obtener historial completo de una solicitud
 */
export const getRequestAuditHistoryService = async (requestId: number) => {
  const [generalChanges, technicianAssignments] = await Promise.all([
    // Cambios genéricos de la tabla audit_log
    prisma.audit_log.findMany({
      where: {
        entity_type: 'request',
        entity_id: requestId
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
    }),
    
    // Asignaciones de técnicos
    prisma.request_technician_assignments.findMany({
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
    })
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
    // Cambios genéricos de la tabla audit_log
    prisma.audit_log.findMany({
      where: {
        entity_type: 'equipment',
        entity_id: equipmentId
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
    }),
    
    // Asignaciones de equipos (usuarios y ubicaciones)
    prisma.equipment_assignments.findMany({
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
    })
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
  return await prisma.user_logins.findMany({
    where: { user_id: userId },
    orderBy: { login_at: 'desc' },
    take: limit
  });
};

/**
 * Obtener historial de cambios de un usuario (roles, activaciones, etc.)
 */
export const getUserAuditHistoryService = async (userId: number) => {
  return await prisma.audit_log.findMany({
    where: {
      entity_type: 'user',
      entity_id: userId
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
 * Obtener cambios recientes del sistema (para dashboard de auditoría)
 */
export const getRecentAuditLogsService = async (limit: number = 50) => {
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
 * Obtener estadísticas de auditoría por tipo de entidad
 */
export const getAuditStatisticsService = async () => {
  const [requestChanges, equipmentChanges, userChanges, totalLogins] = await Promise.all([
    prisma.audit_log.count({ where: { entity_type: 'request' } }),
    prisma.audit_log.count({ where: { entity_type: 'equipment' } }),
    prisma.audit_log.count({ where: { entity_type: 'user' } }),
    prisma.user_logins.count()
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
