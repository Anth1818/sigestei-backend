import { Request, Response } from 'express';
import { getAllRequestsService, registerRequestService } from '../services/request.service';

export const getAllRequestsController = async (_req: Request, res: Response) => {
  try {
    const requests = await getAllRequestsService();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las solicitudes', error: error instanceof Error ? error.message : error });
  }
};

export const registerRequestController = async (req: Request, res: Response) => {
  try {
    const requestData = req.body;
    if (!requestData || Object.keys(requestData).length === 0) {
      return res.status(400).json({ message: 'Datos de la solicitud no proporcionados' });
    }
    if(!requestData.description || !requestData.request_date || !requestData.requester_id || !requestData.type_id || !requestData.status_id || !requestData.priority_id) {
      return res.status(400).json({ message: 'Faltan campos obligatorios en los datos de la solicitud' });
    }
    const result = await registerRequestService(requestData);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar la solicitud', error: error instanceof Error ? error.message : error });
  }
};