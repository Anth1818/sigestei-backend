import { Request, Response } from "express";
import {
  getAllRequestsByUserIdService,
  getAllRequestsForTechnicianService,
  getAllRequestsService,
  registerRequestService,
  updateRequestService,
} from "../services/request.service";

import { createGetByIdController } from "../../utils/controllerFactory";

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
