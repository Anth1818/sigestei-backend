import { CreateRequestInput, ServiceResponse } from "../../utils/types";
import {
  getAllRequestsRepository,
  registerRequestRepository,
  updateRequestRepository,
} from "../repositories/request.repository";

export const getAllRequestsService = async () => {
  return await getAllRequestsRepository();
};

export const registerRequestService = async (
  requestData: CreateRequestInput
): Promise<ServiceResponse> => {
  try {
    const result = await registerRequestRepository(requestData);
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
  dataToUpdate: Partial<CreateRequestInput>
): Promise<ServiceResponse> => {
  try {
    const result = await updateRequestRepository(id, dataToUpdate);
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
