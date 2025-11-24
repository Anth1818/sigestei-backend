import { CreateRequestInput, ServiceResponse } from "../../utils/types";
import {
  getAllRequestsForTechnicianRepository,
  getAllRequestsByUserIdRepository,
  getAllRequestsRepository,
  registerRequestRepository,
  updateRequestRepository,
} from "../repositories/request.repository";
import { createRequestHistoryRepository } from "../repositories/requestHistory.repository";
import prisma from "../../config/db";
import { 
  logTechnicianAssignment, 
  logRequestStatusChange, 
  logRequestPriorityChange 
} from "../../middlewares/auditMiddleware";

export const getAllRequestsService = async () => {
  return await getAllRequestsRepository();
};

export const getAllRequestsByUserIdService = async (UserId: number) => {
  return await getAllRequestsByUserIdRepository(UserId);
}
export const getAllRequestsForTechnicianService = async (UserId: number) => {
  return await getAllRequestsForTechnicianRepository(UserId);
}

export const registerRequestService = async (
  requestData: CreateRequestInput,
  createdById?: number
): Promise<ServiceResponse> => {
  try {
    const result = await registerRequestRepository(requestData);
    
    // Registrar en historial si se asignó un técnico desde el inicio
    if (requestData.technician_id && createdById) {
      const technician = await prisma.users.findUnique({
        where: { id: requestData.technician_id },
        select: { full_name: true },
      });
      
      await createRequestHistoryRepository({
        request_id: result.id,
        change_type: 'technician_assigned',
        old_value: null,
        new_value: `${technician?.full_name} (ID: ${requestData.technician_id})`,
        changed_by_id: createdById,
        comments: 'Asignado al crear la solicitud',
      });

      // Registrar asignación en la tabla específica de auditoría
      await logTechnicianAssignment(
        result.id,
        requestData.technician_id,
        null,
        createdById,
        'Asignado al crear la solicitud'
      );
    }
    
    return {
      success: "Registro exitoso",
      data: `Id de la solicitud: ${result.id}`,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "No se puedo registar la solicitud",
    };
  }
};

export const updateRequestService = async (
  id: number,
  dataToUpdate: Partial<CreateRequestInput>,
  updatedById?: number
): Promise<ServiceResponse> => {
  try {
    // Obtener el request actual antes de actualizar para comparar cambios
    const currentRequest = await prisma.requests.findUnique({
      where: { id },
      include: {
        request_priorities: { select: { name: true } },
        request_statuses: { select: { name: true } },
        users_requests_technician_idTousers: { select: { full_name: true } },
      },
    });

    if (!currentRequest) {
      throw new Error("Solicitud no encontrada");
    }

    // Actualizar el request
    const result = await updateRequestRepository(id, dataToUpdate);

    // Registrar cambios en el historial
    const historyPromises = [];

    // Cambio de prioridad
    if (dataToUpdate.priority_id && dataToUpdate.priority_id !== currentRequest.priority_id) {
      const oldPriority = currentRequest.request_priorities.name;
      const newPriority = await prisma.request_priorities.findUnique({
        where: { id: dataToUpdate.priority_id },
        select: { name: true },
      });

      historyPromises.push(
        createRequestHistoryRepository({
          request_id: id,
          change_type: 'priority',
          old_value: oldPriority,
          new_value: newPriority?.name || null,
          changed_by_id: updatedById,
        })
      );

      // Registrar en audit_log genérico
      if (updatedById) {
        historyPromises.push(
          logRequestPriorityChange(
            id,
            currentRequest.priority_id,
            dataToUpdate.priority_id,
            updatedById
          )
        );
      }
    }

    // Cambio de estado
    if (dataToUpdate.status_id && dataToUpdate.status_id !== currentRequest.status_id) {
      const oldStatus = currentRequest.request_statuses.name;
      const newStatus = await prisma.request_statuses.findUnique({
        where: { id: dataToUpdate.status_id },
        select: { name: true },
      });

      historyPromises.push(
        createRequestHistoryRepository({
          request_id: id,
          change_type: 'status',
          old_value: oldStatus,
          new_value: newStatus?.name || null,
          changed_by_id: updatedById,
        })
      );

      // Registrar en audit_log genérico
      if (updatedById) {
        historyPromises.push(
          logRequestStatusChange(
            id,
            currentRequest.status_id,
            dataToUpdate.status_id,
            updatedById
          )
        );
      }
    }

    // Asignación o reasignación de técnico
    if (dataToUpdate.technician_id !== undefined && dataToUpdate.technician_id !== currentRequest.technician_id) {
      const oldTechnician = currentRequest.users_requests_technician_idTousers;
      let newTechnicianName = null;

      if (dataToUpdate.technician_id) {
        const newTechnician = await prisma.users.findUnique({
          where: { id: dataToUpdate.technician_id },
          select: { full_name: true },
        });
        newTechnicianName = newTechnician ? `${newTechnician.full_name} (ID: ${dataToUpdate.technician_id})` : null;
      }

      const changeType = currentRequest.technician_id ? 'technician_reassigned' : 'technician_assigned';
      const oldValue = oldTechnician ? `${oldTechnician.full_name} (ID: ${currentRequest.technician_id})` : null;

      historyPromises.push(
        createRequestHistoryRepository({
          request_id: id,
          change_type: changeType,
          old_value: oldValue,
          new_value: newTechnicianName,
          changed_by_id: updatedById,
        })
      );

      // Registrar en tabla específica de asignaciones de técnicos
      if (updatedById) {
        historyPromises.push(
          logTechnicianAssignment(
            id,
            dataToUpdate.technician_id,
            currentRequest.technician_id,
            updatedById,
            changeType === 'technician_reassigned' ? 'Reasignación de técnico' : 'Asignación de técnico'
          )
        );
      }
    }

    // Ejecutar todos los registros de historial
    await Promise.all(historyPromises);

    return {
      success: "Actualización exitosa",
      data: `Id de la solicitud actualizada: ${result.id}`,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "No se pudo actualizar la solicitud",
    };
  }
};
