import { prisma } from '../config/prisma';

/**
 * Registra un login de usuario (exitoso o fallido)
 */
export const logUserLogin = async (
  userId: number,
  ipAddress: string | null,
  userAgent: string | null,
  success: boolean = true,
  failureReason: string | null = null
) => {
  try {
    await prisma.user_logins.create({
      data: {
        user_id: userId,
        ip_address: ipAddress,
        user_agent: userAgent,
        success,
        failure_reason: failureReason
      }
    });
  } catch (error) {
    console.error('Error logging user login:', error);
    // No lanzar error para no interrumpir la operación principal
  }
};

/**
 * Registra la asignación o reasignación de un técnico a una solicitud
 */
export const logTechnicianAssignment = async (
  requestId: number,
  technicianId: number | null,
  previousTechnicianId: number | null,
  assignedById: number,
  reason: string | null = null
) => {
  try {
    await prisma.request_technician_assignments.create({
      data: {
        request_id: requestId,
        technician_id: technicianId,
        previous_technician_id: previousTechnicianId,
        assigned_by_id: assignedById,
        reason
      }
    });
  } catch (error) {
    console.error('Error logging technician assignment:', error);
  }
};

/**
 * Registra la asignación de un equipo a un usuario o cambio de ubicación
 */
export const logEquipmentAssignment = async (
  equipmentId: number,
  userId: number | null,
  previousUserId: number | null,
  location: string | null,
  previousLocation: string | null,
  assignedById: number,
  reason: string | null = null
) => {
  try {
    await prisma.equipment_assignments.create({
      data: {
        equipment_id: equipmentId,
        user_id: userId,
        previous_user_id: previousUserId,
        location,
        previous_location: previousLocation,
        assigned_by_id: assignedById,
        reason
      }
    });
  } catch (error) {
    console.error('Error logging equipment assignment:', error);
  }
};

/**
 * Registra un cambio genérico en una entidad (request, equipment, user)
 * Útil para cambios de estado, prioridad, actualizaciones de perfil, etc.
 */
export const createAuditLog = async (
  entityType: 'request' | 'equipment' | 'user',
  entityId: number,
  changeType: string,
  fieldName: string | null,
  oldValue: string | number | null,
  newValue: string | number | null,
  userId: number | null,
  comments: string | null = null
) => {
  try {
    await prisma.audit_log.create({
      data: {
        entity_type: entityType,
        entity_id: entityId,
        change_type: changeType,
        field_name: fieldName,
        old_value: oldValue ? String(oldValue) : null,
        new_value: newValue ? String(newValue) : null,
        changed_by_id: userId,
        comments
      }
    });
  } catch (error) {
    console.error('Error creating audit log:', error);
  }
};

/**
 * Registra cambio de estado de una solicitud
 */
export const logRequestStatusChange = async (
  requestId: number,
  oldStatusId: number,
  newStatusId: number,
  userId: number,
  comments: string | null = null
) => {
  await createAuditLog(
    'request',
    requestId,
    'status_changed',
    'status_id',
    oldStatusId,
    newStatusId,
    userId,
    comments
  );
};

/**
 * Registra cambio de prioridad de una solicitud
 */
export const logRequestPriorityChange = async (
  requestId: number,
  oldPriorityId: number,
  newPriorityId: number,
  userId: number,
  comments: string | null = null
) => {
  await createAuditLog(
    'request',
    requestId,
    'priority_changed',
    'priority_id',
    oldPriorityId,
    newPriorityId,
    userId,
    comments
  );
};

/**
 * Registra cambio de estado de un equipo
 */
export const logEquipmentStatusChange = async (
  equipmentId: number,
  oldStatusId: number,
  newStatusId: number,
  userId: number,
  comments: string | null = null
) => {
  await createAuditLog(
    'equipment',
    equipmentId,
    'status_changed',
    'status_id',
    oldStatusId,
    newStatusId,
    userId,
    comments
  );
};

/**
 * Registra desactivación/activación de un usuario
 */
export const logUserActivationChange = async (
  userId: number,
  wasActive: boolean,
  isActive: boolean,
  changedById: number,
  comments: string | null = null
) => {
  await createAuditLog(
    'user',
    userId,
    isActive ? 'user_activated' : 'user_deactivated',
    'is_active',
    String(wasActive),
    String(isActive),
    changedById,
    comments
  );
};

/**
 * Registra cambio de rol de un usuario
 */
export const logUserRoleChange = async (
  userId: number,
  oldRoleId: number,
  newRoleId: number,
  changedById: number,
  comments: string | null = null
) => {
  await createAuditLog(
    'user',
    userId,
    'role_changed',
    'role_id',
    oldRoleId,
    newRoleId,
    changedById,
    comments
  );
};
