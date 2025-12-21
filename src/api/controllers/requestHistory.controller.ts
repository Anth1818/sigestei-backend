import { Request, Response } from "express";
import {
  getRequestHistoryRepository,
  getRequestHistoryByTypeRepository,
  getHistoryByUserRepository,
} from "../repositories/requestHistory.repository";

/**
 * Get all history for a specific request
 */
export const getRequestHistoryController = async (
  req: Request,
  res: Response
) => {
  try {
    const { requestId } = req.params;

    if (!requestId || isNaN(Number(requestId))) {
      return res.status(400).json({
        message: "ID de solicitud inválido o no proporcionado",
      });
    }

    const history = await getRequestHistoryRepository(Number(requestId));
    
    return res.json(history);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener el historial de la solicitud",
      error: error instanceof Error ? error.message : error,
    });
  }
};

/**
 * Get history by change type for a specific request
 */
export const getRequestHistoryByTypeController = async (
  req: Request,
  res: Response
) => {
  try {
    const { requestId, changeType } = req.params;

    if (!requestId || isNaN(Number(requestId))) {
      return res.status(400).json({
        message: "ID de solicitud inválido o no proporcionado",
      });
    }

    const validChangeTypes = ['priority', 'status', 'technician_assigned', 'technician_reassigned'];
    if (!validChangeTypes.includes(changeType)) {
      return res.status(400).json({
        message: `Tipo de cambio inválido. Valores permitidos: ${validChangeTypes.join(', ')}`,
      });
    }

    const history = await getRequestHistoryByTypeRepository(
      Number(requestId),
      changeType as 'priority' | 'status' | 'technician_assigned' | 'technician_reassigned'
    );
    
    return res.json(history);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener el historial por tipo",
      error: error instanceof Error ? error.message : error,
    });
  }
};

/**
 * Get all changes made by a specific user
 */
export const getHistoryByUserController = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId } = req.params;

    if (!userId || isNaN(Number(userId))) {
      return res.status(400).json({
        message: "ID de usuario inválido o no proporcionado",
      });
    }

    const history = await getHistoryByUserRepository(Number(userId));
    
    return res.json(history);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener el historial del usuario",
      error: error instanceof Error ? error.message : error,
    });
  }
};
