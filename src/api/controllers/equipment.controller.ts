import { Request, Response } from "express";
import {
  getAllEquipmentService,
  getEquipmentByIdService,
  getEquipmentByAssetNumberService,
  getEquipmentBySerialNumberService,
  registerEquipmentService,
  updateEquipmentService,
} from "../services/equipment.service";

export const getAllEquipmentController = async (
  _req: Request,
  res: Response
) => {
  try {
    const equipment = await getAllEquipmentService();
    res.json(equipment);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al obtener los equipos de cómputo",
        error: error instanceof Error ? error.message : error,
      });
  }
};

export const getEquipmentByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    // Validación de formato
    if (!/^\d+$/.test(id)) {
      return res
        .status(400)
        .json({ message: "ID inválido. Debe ser un número entero." });
    }

    const equipment = await getEquipmentByIdService(Number(id));
    return res.json(equipment);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("no fue encontrado")) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getEquipmentByAssetNumberController = async (
  req: Request,
  res: Response
) => {
  try {
    const { asset_number } = req.params;

    if (!asset_number || asset_number.trim().length === 0) {
      return res.status(400).json({ message: "Número de activo requerido" });
    }

    const equipment = await getEquipmentByAssetNumberService(
      asset_number.trim()
    );
    return res.json(equipment);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("no fue encontrado")) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getEquipmentBySerialNumberController = async (
  req: Request,
  res: Response
) => {
  try {
    const { serial_number } = req.params;

    if (!serial_number || serial_number.trim().length === 0) {
      return res.status(400).json({ message: "Número de serie requerido" });
    }

    const equipment = await getEquipmentBySerialNumberService(
      serial_number.trim()
    );
    return res.json(equipment);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("no fue encontrado")) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const registerEquipmentController = async (
  req: Request,
  res: Response
) => {
  try {
    const equipmentData = req.body;

    if (!equipmentData || Object.keys(equipmentData).length === 0) {
      return res
        .status(400)
        .json({ message: "Datos del equipo no proporcionados" });
    }

    // Validar campos obligatorios
    if (!equipmentData.asset_number) {
      return res
        .status(400)
        .json({ message: "Número de activo es obligatorio" });
    }

    if (!equipmentData.serial_number) {
      return res
        .status(400)
        .json({ message: "Número de serie es obligatorio" });
    }

    if (!equipmentData.type_id) {
      return res
        .status(400)
        .json({ message: "ID del tipo de equipo es obligatorio" });
    }

    if (!equipmentData.brand_id) {
      return res.status(400).json({ message: "ID de la marca es obligatorio" });
    }
    if (!equipmentData.status_id) {
      return res.status(400).json({ message: "ID del estatus es obligatorio" });
    }

    // Validaciones adicionales según reglas de negocio
    // if (!equipmentData.assigned_user_id && equipmentData.status_id !== 4 && equipmentData.type_id !== 3) {
    //   return res
    //     .status(400)
    //     .json({ message: "ID del usuario asignado es obligatorio" });
    // }

    const result = await registerEquipmentService(equipmentData);
    res.status(201).json(result);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al registrar el equipo de cómputo",
        error: error instanceof Error ? error.message : error,
      });
  }
};

export const updateEquipmentController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id;
    const { ...dataToUpdate } = req.body;
    const updatedById = req.user?.id; // Usuario autenticado

    if (!id) {
      return res
        .status(400)
        .json({ message: "El ID del equipo es obligatorio" });
    }

    if (!dataToUpdate || Object.keys(dataToUpdate).length === 0) {
      return res
        .status(400)
        .json({ message: "No se proporcionaron datos para actualizar" });
    }

    const result = await updateEquipmentService(
      Number(id),
      dataToUpdate,
      updatedById
    );
    res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al actualizar el equipo de cómputo",
        error: error instanceof Error ? error.message : error,
      });
  }
};
