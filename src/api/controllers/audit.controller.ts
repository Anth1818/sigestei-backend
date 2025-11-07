import { Request, Response } from 'express';
import * as auditService from '../services/audit.service';

/**
 * Obtener historial de auditoría de una solicitud
 */
export const getRequestAuditHistory = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;
    
    if (!requestId || isNaN(Number(requestId))) {
      return res.status(400).json({ message: 'ID de solicitud inválido' });
    }

    const history = await auditService.getRequestAuditHistoryService(Number(requestId));
    return res.json(history);
  } catch (error) {
    console.error('Error al obtener historial de solicitud:', error);
    return res.status(500).json({ 
      message: 'Error al obtener historial de auditoría',
      error: error instanceof Error ? error.message : error
    });
  }
};

/**
 * Obtener historial de auditoría de un equipo
 */
export const getEquipmentAuditHistory = async (req: Request, res: Response) => {
  try {
    const { equipmentId } = req.params;
    
    if (!equipmentId || isNaN(Number(equipmentId))) {
      return res.status(400).json({ message: 'ID de equipo inválido' });
    }

    const history = await auditService.getEquipmentAuditHistoryService(Number(equipmentId));
    return res.json(history);
  } catch (error) {
    console.error('Error al obtener historial de equipo:', error);
    return res.status(500).json({ 
      message: 'Error al obtener historial de auditoría',
      error: error instanceof Error ? error.message : error
    });
  }
};

/**
 * Obtener historial de logins de un usuario
 */
export const getUserLoginHistory = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { limit } = req.query;
    
    if (!userId || isNaN(Number(userId))) {
      return res.status(400).json({ message: 'ID de usuario inválido' });
    }

    const loginLimit = limit ? Number(limit) : 20;
    const history = await auditService.getUserLoginHistoryService(Number(userId), loginLimit);
    return res.json(history);
  } catch (error) {
    console.error('Error al obtener historial de logins:', error);
    return res.status(500).json({ 
      message: 'Error al obtener historial de logins',
      error: error instanceof Error ? error.message : error
    });
  }
};

/**
 * Obtener historial de cambios de un usuario
 */
export const getUserAuditHistory = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    if (!userId || isNaN(Number(userId))) {
      return res.status(400).json({ message: 'ID de usuario inválido' });
    }

    const history = await auditService.getUserAuditHistoryService(Number(userId));
    return res.json(history);
  } catch (error) {
    console.error('Error al obtener historial de usuario:', error);
    return res.status(500).json({ 
      message: 'Error al obtener historial de auditoría',
      error: error instanceof Error ? error.message : error
    });
  }
};

/**
 * Obtener cambios recientes del sistema
 */
export const getRecentAuditLogs = async (req: Request, res: Response) => {
  try {
    const { limit } = req.query;
    const logLimit = limit ? Number(limit) : 50;
    
    const logs = await auditService.getRecentAuditLogsService(logLimit);
    return res.json(logs);
  } catch (error) {
    console.error('Error al obtener logs recientes:', error);
    return res.status(500).json({ 
      message: 'Error al obtener logs de auditoría',
      error: error instanceof Error ? error.message : error
    });
  }
};

/**
 * Obtener estadísticas de auditoría
 */
export const getAuditStatistics = async (req: Request, res: Response) => {
  try {
    const stats = await auditService.getAuditStatisticsService();
    return res.json(stats);
  } catch (error) {
    console.error('Error al obtener estadísticas de auditoría:', error);
    return res.status(500).json({ 
      message: 'Error al obtener estadísticas',
      error: error instanceof Error ? error.message : error
    });
  }
};

/**
 * Buscar en logs de auditoría con filtros
 */
export const searchAuditLogs = async (req: Request, res: Response) => {
  try {
    const { 
      entity_type, 
      entity_id, 
      change_type, 
      changed_by_id, 
      start_date, 
      end_date,
      limit 
    } = req.query;

    const filters: any = {};
    
    if (entity_type) filters.entity_type = entity_type as 'request' | 'equipment' | 'user';
    if (entity_id) filters.entity_id = Number(entity_id);
    if (change_type) filters.change_type = change_type as string;
    if (changed_by_id) filters.changed_by_id = Number(changed_by_id);
    if (start_date) filters.start_date = new Date(start_date as string);
    if (end_date) filters.end_date = new Date(end_date as string);
    if (limit) filters.limit = Number(limit);

    const logs = await auditService.searchAuditLogsService(filters);
    return res.json(logs);
  } catch (error) {
    console.error('Error al buscar en logs de auditoría:', error);
    return res.status(500).json({ 
      message: 'Error al buscar logs de auditoría',
      error: error instanceof Error ? error.message : error
    });
  }
};
