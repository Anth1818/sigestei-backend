import { Request, Response } from "express";
import {
  getAllRequestsByUserIdService,
  getAllRequestsForTechnicianService,
  getAllRequestsService,
  registerRequestService,
  updateRequestService,
  getRequestsPaginatedService,
  getRequestsByFiltersService,
} from "../services/request.service";

import { createGetByIdController } from "../../utils/controllerFactory";
import { RequestFilters } from "../../utils/types";

export const getAllRequestsByUserIdController = createGetByIdController(
  getAllRequestsByUserIdService,
  "Error al obtener las solicitudes por ID de usuario"
);

export const getAllRequestsForTechnicianController = createGetByIdController(
  getAllRequestsForTechnicianService,
  "Error al obtener las solicitudes para el técnico"
);


export const getAllRequestsController = async (
  _req: Request,
  res: Response
) => {
  try {
    const requests = await getAllRequestsService();
    res.json(requests);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al obtener las solicitudes",
        error: error instanceof Error ? error.message : error,
      });
  }
};



export const registerRequestController = async (
  req: Request,
  res: Response
) => {
  try {
    const requestData = req.body;
    // Obtener el ID del usuario autenticado desde el token (si existe en req.user)
    const userId = (req as any).user?.id;
    
    if (!requestData || Object.keys(requestData).length === 0) {
      return res
        .status(400)
        .json({ message: "Datos de la solicitud no proporcionados" });
    }
    if (
      !requestData.description ||
      !requestData.requester_id ||
      !requestData.type_id ||
      !requestData.equipment_id 
    ) {
      return res
        .status(400)
        .json({
          message: "Faltan campos obligatorios en los datos de la solicitud",
        });
    }
    const result = await registerRequestService(requestData, userId);
    res.status(201).json(result);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al registrar la solicitud",
        error: error instanceof Error ? error.message : error,
      });
  }
};

export const updateRequestController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const {...dataToUpdate } = req.body;
  // ...existing code...
console.log("Datos a actualizar:", JSON.stringify(dataToUpdate, null, 2));
// ...existing code...
    // Obtener el ID del usuario autenticado desde el token (si existe en req.user)
    const userId = (req as any).user?.id;
    
    if (!id || isNaN(Number(id))) {
      return res
        .status(400)
        .json({ message: "ID de la solicitud inválido o no proporcionado" });
    }

    if (!id) {
      return res
        .status(400)
        .json({ message: "El ID de la solicitud es obligatorio" });
    }

    if (!dataToUpdate || Object.keys(dataToUpdate).length === 0) {
      return res
        .status(400)
        .json({ message: "No se proporcionaron datos para actualizar" });
    }

    const result = await updateRequestService(Number(id), dataToUpdate, userId);
    res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al actualizar la solicitud",
        error: error instanceof Error ? error.message : error,
      });
  }
};

/**
 * Controlador para obtener requests con paginación
 * Query params: page (default: 1), limit (default: 100)
 */
export const getRequestsPaginatedController = async (
  req: Request,
  res: Response
) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(500, Math.max(1, parseInt(req.query.limit as string) || 10));

    const result = await getRequestsPaginatedService({ page, limit });
    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener las solicitudes paginadas",
      error: error instanceof Error ? error.message : error,
    });
  }
};

/**
 * Controlador para obtener requests filtrados
 * Query params:
 *   - request_id: ID de la solicitud específica (ej: "123")
 *   - technician_ids: string de IDs separados por coma (ej: "1,2,3")
 *   - status_ids: string de IDs separados por coma (ej: "1,2")
 *   - priority_ids: string de IDs separados por coma (ej: "1,2,3")
 *   - type_ids: string de IDs separados por coma (ej: "1,2")
 *   - date_from: fecha ISO (ej: "2024-01-01")
 *   - date_to: fecha ISO (ej: "2024-12-31")
 *   - page: número de página (opcional, default: 1)
 *   - limit: límite por página (opcional, default: 100)
 */
export const getRequestsByFiltersController = async (
  req: Request,
  res: Response
) => {
  try {
    const filters: RequestFilters = {};

    // Parsear ID de request
    if (req.query.request_id) {
      const id = parseInt(req.query.request_id as string);
      if (!isNaN(id)) filters.request_id = id;
    }

    // Parsear IDs de técnicos
    if (req.query.technician_ids) {
      const ids = (req.query.technician_ids as string).split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
      if (ids.length > 0) filters.technician_ids = ids;
    }

    // Parsear IDs de estados
    if (req.query.status_ids) {
      const ids = (req.query.status_ids as string).split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
      if (ids.length > 0) filters.status_ids = ids;
    }

    // Parsear IDs de prioridades
    if (req.query.priority_ids) {
      const ids = (req.query.priority_ids as string).split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
      if (ids.length > 0) filters.priority_ids = ids;
    }

    // Parsear IDs de tipos
    if (req.query.type_ids) {
      const ids = (req.query.type_ids as string).split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
      if (ids.length > 0) filters.type_ids = ids;
    }

    // Parsear rango de fechas
    if (req.query.date_from) {
      const dateFrom = new Date(req.query.date_from as string);
      if (!isNaN(dateFrom.getTime())) filters.date_from = dateFrom;
    }

    if (req.query.date_to) {
      const dateTo = new Date(req.query.date_to as string);
      if (!isNaN(dateTo.getTime())) {
        // Ajustar al final del día
        dateTo.setHours(23, 59, 59, 999);
        filters.date_to = dateTo;
      }
    }

    // Paginación opcional
    let pagination;
    if (req.query.page || req.query.limit) {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(500, Math.max(1, parseInt(req.query.limit as string) || 100));
      pagination = { page, limit };
    }

    const result = await getRequestsByFiltersService(filters, pagination);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener las solicitudes filtradas",
      error: error instanceof Error ? error.message : error,
    });
  }
};
