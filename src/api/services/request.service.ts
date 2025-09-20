import { CreateRequestInput, ServiceResponse } from '../../utils/types';
import { getAllRequestsRepository, registerRequestRepository } from '../repositories/request.repository';

export const getAllRequestsService = async () => {
  return await getAllRequestsRepository();
};

export const registerRequestService = async (requestData: CreateRequestInput) : Promise<ServiceResponse> => {
  try {
    const result = await registerRequestRepository(requestData);
    return { success: "Registro exitoso", data: `Id del registro: ${result.id}` };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'No se puedo registar la solicitud' };
  }
};

