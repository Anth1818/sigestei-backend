import { CreateEquipmentInput, ServiceResponse } from "../../utils/types";
import {
  getAllEquipmentRepository,
  getEquipmentByIdRepository,
  getEquipmentByAssetNumberRepository,
  getEquipmentBySerialNumberRepository,
  createEquipmentRepository,
  updateEquipmentRepository,
  getPersonalEquipmentRepository,
} from "../repositories/equipment.repository";

export const getAllEquipmentService = async () => {
  return await getAllEquipmentRepository();
};

export const getEquipmentByIdService = async (id: number) => {
  const equipment = await getEquipmentByIdRepository(id);
  if (!equipment) {
    throw new Error("Equipo de cómputo con el ID proporcionado no fue encontrado.");
  }
  return equipment;
};

export const getEquipmentByAssetNumberService = async (asset_number: string) => {
  const equipment = await getEquipmentByAssetNumberRepository(asset_number);
  if (!equipment) {
    throw new Error("Equipo de cómputo con el número de activo proporcionado no fue encontrado.");
  }
  return equipment;
};

export const getEquipmentBySerialNumberService = async (serial_number: string) => {
  const equipment = await getEquipmentBySerialNumberRepository(serial_number);
  if (!equipment) {
    throw new Error("Equipo de cómputo con el número de serie proporcionado no fue encontrado.");
  }
  return equipment;
};

export const registerEquipmentService = async (
  equipmentData: CreateEquipmentInput
): Promise<ServiceResponse> => {
  try {
    // Validar que el número de activo no exista
    const existingAsset = await getEquipmentByAssetNumberRepository(equipmentData.asset_number);
    if (existingAsset) {
      throw new Error("Este número de bien ya está registrado");
    }

    // Validar que el número de serie no exista
    const existingSerial = await getEquipmentBySerialNumberRepository(equipmentData.serial_number);
    if (existingSerial) {
      throw new Error("Este número de serie ya está registrado");
    }

    // Validar que el usuario no tenga otro equipo asignado
    if (equipmentData.assigned_user_id) {
      const existingUserEquipment = await getPersonalEquipmentRepository(equipmentData.assigned_user_id);
      if (existingUserEquipment && existingUserEquipment.length > 0) {
        throw new Error("Este usuario ya tiene un equipo asignado");
      }
    }

    const result = await createEquipmentRepository({
      asset_number: equipmentData.asset_number,
      serial_number: equipmentData.serial_number,
      model: equipmentData.model,
      location: equipmentData.location,
      specifications: {
        hardware: equipmentData.hardware_specs,
        software: equipmentData.software_specs,
      },
      equipment_types: {
        connect: { id: equipmentData.type_id }
      },
      equipment_brands: {
        connect: { id: equipmentData.brand_id }
      },
      equipment_statuses: {
        connect: { id: equipmentData.status_id }
      },
      ...(equipmentData.assigned_user_id && {
        users: {
          connect: { id: equipmentData.assigned_user_id }
        }
      }),
    });
    
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

export const updateEquipmentService = async (
  id: number,
  dataToUpdate: Partial<CreateEquipmentInput>
): Promise<ServiceResponse> => {
  try {
    // Verificar que el equipo existe
    await getEquipmentByIdService(id);

    // Si se está actualizando el número de activo, validar que no exista
    if (dataToUpdate.asset_number) {
      const existingAsset = await getEquipmentByAssetNumberRepository(dataToUpdate.asset_number);
      if (existingAsset && existingAsset.id !== id) {
        throw new Error("Este número de activo ya está registrado en otro equipo");
      }
    }

    // Si se está actualizando el número de serie, validar que no exista
    if (dataToUpdate.serial_number) {
      const existingSerial = await getEquipmentBySerialNumberRepository(dataToUpdate.serial_number);
      if (existingSerial && existingSerial.id !== id) {
        throw new Error("Este número de serie ya está registrado en otro equipo");
      }
    }

    // Si se está actualizando el usuario asignado, validar que no tenga otro equipo
    if (dataToUpdate.assigned_user_id) {
      const existingUserEquipment = await getPersonalEquipmentRepository(dataToUpdate.assigned_user_id) as any[];
      if (existingUserEquipment && existingUserEquipment.length > 0 && existingUserEquipment[0].id !== id) {
        throw new Error("Este usuario ya tiene un equipo asignado");
      }
    }

    // Construir el objeto de actualización
    const updateData: any = {};
    
    if (dataToUpdate.asset_number) updateData.asset_number = dataToUpdate.asset_number;
    if (dataToUpdate.serial_number) updateData.serial_number = dataToUpdate.serial_number;
    if (dataToUpdate.model) updateData.model = dataToUpdate.model;
    if (dataToUpdate.location) updateData.location = dataToUpdate.location;
    
    if (dataToUpdate.hardware_specs || dataToUpdate.software_specs) {
      updateData.specifications = {
        ...(dataToUpdate.hardware_specs && { hardware: dataToUpdate.hardware_specs }),
        ...(dataToUpdate.software_specs && { software: dataToUpdate.software_specs }),
      };
    }
    
    if (dataToUpdate.type_id) {
      updateData.equipment_types = { connect: { id: dataToUpdate.type_id } };
    }
    if (dataToUpdate.brand_id) {
      updateData.equipment_brands = { connect: { id: dataToUpdate.brand_id } };
    }
    if (dataToUpdate.status_id) {
      updateData.equipment_statuses = { connect: { id: dataToUpdate.status_id } };
    }
    if (dataToUpdate.assigned_user_id !== undefined) {
      updateData.users = dataToUpdate.assigned_user_id 
        ? { connect: { id: dataToUpdate.assigned_user_id } }
        : { disconnect: true };
    }

    const result = await updateEquipmentRepository(id, updateData);
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