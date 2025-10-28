import { CreateComputerEquipmentInput, ServiceResponse } from "../../utils/types";
import {
  getAllComputerEquipmentRepository,
  getComputerEquipmentByIdRepository,
  getComputerEquipmentByAssetNumberRepository,
  getComputerEquipmentBySerialNumberRepository,
  registerComputerEquipmentRepository,
  updateComputerEquipmentRepository,
  getCumputerEquipmentByUserIdRepository,
} from "../repositories/computerEquipment.repository";

export const getAllComputerEquipmentService = async () => {
  return await getAllComputerEquipmentRepository();
};

export const getComputerEquipmentByIdService = async (id: number) => {
  const equipment = await getComputerEquipmentByIdRepository(id);
  if (!equipment) {
    throw new Error("Equipo de cómputo con el ID proporcionado no fue encontrado.");
  }
  return equipment;
};

export const getComputerEquipmentByAssetNumberService = async (asset_number: string) => {
  const equipment = await getComputerEquipmentByAssetNumberRepository(asset_number);
  if (!equipment) {
    throw new Error("Equipo de cómputo con el número de activo proporcionado no fue encontrado.");
  }
  return equipment;
};

export const getComputerEquipmentBySerialNumberService = async (serial_number: string) => {
  const equipment = await getComputerEquipmentBySerialNumberRepository(serial_number);
  if (!equipment) {
    throw new Error("Equipo de cómputo con el número de serie proporcionado no fue encontrado.");
  }
  return equipment;
};

export const registerComputerEquipmentService = async (
  equipmentData: CreateComputerEquipmentInput
): Promise<ServiceResponse> => {
  try {
    // Validar que el número de activo no exista
    const existingAsset = await getComputerEquipmentByAssetNumberRepository(equipmentData.asset_number);
    if (existingAsset) {
      throw new Error("Este número de bien ya está registrado");
    }

    // Validar que el número de serie no exista
    const existingSerial = await getComputerEquipmentBySerialNumberRepository(equipmentData.serial_number);
    if (existingSerial) {
      throw new Error("Este número de serie ya está registrado");
    }

    // Validar que el usuario no tenga otro equipo asignado
    if (equipmentData.assigned_user_id) {
      const existingUserEquipment = await getCumputerEquipmentByUserIdRepository(equipmentData.assigned_user_id);
      if (existingUserEquipment) {
        throw new Error("Este usuario ya tiene un equipo asignado");
      }
    }

    const result = await registerComputerEquipmentRepository(equipmentData);
    return {
      success: "Registro exitoso",
      data: `ID del equipo registrado: ${result.id}`,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "No se pudo registrar el equipo de cómputo",
    };
  }
};

export const updateComputerEquipmentService = async (
  id: number,
  dataToUpdate: Partial<CreateComputerEquipmentInput>
): Promise<ServiceResponse> => {
  try {
    // Verificar que el equipo existe
    await getComputerEquipmentByIdService(id);

    // Si se está actualizando el número de activo, validar que no exista
    if (dataToUpdate.asset_number) {
      const existingAsset = await getComputerEquipmentByAssetNumberRepository(dataToUpdate.asset_number);
      if (existingAsset && existingAsset.id !== id) {
        throw new Error("Este número de activo ya está registrado en otro equipo");
      }
    }

    // Si se está actualizando el número de serie, validar que no exista
    if (dataToUpdate.serial_number) {
      const existingSerial = await getComputerEquipmentBySerialNumberRepository(dataToUpdate.serial_number);
      if (existingSerial && existingSerial.id !== id) {
        throw new Error("Este número de serie ya está registrado en otro equipo");
      }
    }

    // Si se está actualizando el usuario asignado, validar que no tenga otro equipo
    if (dataToUpdate.assigned_user_id) {
      const existingUserEquipment = await getCumputerEquipmentByUserIdRepository(dataToUpdate.assigned_user_id);
      if (existingUserEquipment && existingUserEquipment.id !== id) {
        throw new Error("Este usuario ya tiene un equipo asignado");
      }
    }

    const result = await updateComputerEquipmentRepository(id, dataToUpdate);
    return {
      success: "Actualización exitosa",
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "No se pudo actualizar el equipo de cómputo",
    };
  }
};