import { Router } from 'express';
import * as auditController from '../controllers/audit.controller';
import authMiddleware from '../../middlewares/authMiddleware';
import roleMiddleware from '../../middlewares/roleMiddleware';

const router = Router();

// Todas las rutas de auditoría requieren autenticación
router.use(authMiddleware);

// Función helper para obtener roleIds
const getRoleIds = async (roles: string[]): Promise<number[]> => {
  // Mapeo de nombres de roles a IDs (ajusta según tu BD)
  const roleMap: Record<string, number> = {
    'admin': 1,
    'manager': 2,
    'technician': 3,
    'user': 4
  };
  return roles.map(role => roleMap[role]).filter(id => id !== undefined);
};

/**
 * GET /audit/requests/:requestId
 * Obtener historial completo de una solicitud
 * Acceso: admin, manager, technician
 */
router.get(
  '/requests/:requestId',
  roleMiddleware(1, 2, 3), // admin, manager, technician
  auditController.getRequestAuditHistory
);

/**
 * GET /audit/equipment/:equipmentId
 * Obtener historial completo de un equipo
 * Acceso: admin, manager, technician
 */
router.get(
  '/equipment/:equipmentId',
  roleMiddleware(1, 2, 3), // admin, manager, technician
  auditController.getEquipmentAuditHistory
);

/**
 * GET /audit/users/:userId/logins
 * Obtener historial de logins de un usuario
 * Acceso: admin, manager
 */
router.get(
  '/users/:userId/logins',
  roleMiddleware(1, 2), // admin, manager
  auditController.getUserLoginHistory
);

/**
 * GET /audit/users/:userId/changes
 * Obtener historial de cambios de un usuario
 * Acceso: admin, manager
 */
router.get(
  '/users/:userId/changes',
  roleMiddleware(1, 2), // admin, manager
  auditController.getUserAuditHistory
);

/**
 * GET /audit/recent
 * Obtener cambios recientes del sistema
 * Acceso: admin, manager
 */
router.get(
  '/recent',
  roleMiddleware(1, 2), // admin, manager
  auditController.getRecentAuditLogs
);

/**
 * GET /audit/statistics
 * Obtener estadísticas de auditoría
 * Acceso: admin, manager
 */
router.get(
  '/statistics',
  roleMiddleware(1, 2), // admin, manager
  auditController.getAuditStatistics
);

/**
 * GET /audit/search
 * Buscar en logs de auditoría con filtros
 * Query params: entity_type, entity_id, change_type, changed_by_id, start_date, end_date, limit
 * Acceso: admin, manager
 */
router.get(
  '/search',
  roleMiddleware(1, 2), // admin, manager
  auditController.searchAuditLogs
);

export default router;
