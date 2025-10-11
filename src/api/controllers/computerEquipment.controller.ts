import { Request, Response } from 'express';
import { 
  getAllComputerEquipmentService, 
  getComputerEquipmentByIdService,
  getComputerEquipmentByAssetNumberService,
  getComputerEquipmentBySerialNumberService,
  registerComputerEquipmentService, 
  updateComputerEquipmentService 
} from '../services/computerEquipment.service';

export const getAllComputerEquipmentController = async (_req: Request, res: Response) => {
  try {
    const equipment = await getAllComputerEquipmentService();
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los equipos de cómputo', error: error instanceof Error ? error.message : error });
  }
};

export const getComputerEquipmentByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validación de formato
    if (!/^\d+$/.test(id)) {
      return res.status(400).json({ message: "ID inválido. Debe ser un número entero." });
    }

    const equipment = await getComputerEquipmentByIdService(Number(id));
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

export const getComputerEquipmentByAssetNumberController = async (req: Request, res: Response) => {
  try {
    const { asset_number } = req.params;

    if (!asset_number || asset_number.trim().length === 0) {
      return res.status(400).json({ message: "Número de activo requerido" });
    }

    const equipment = await getComputerEquipmentByAssetNumberService(asset_number.trim());
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

export const getComputerEquipmentBySerialNumberController = async (req: Request, res: Response) => {
  try {
    const { serial_number } = req.params;

    if (!serial_number || serial_number.trim().length === 0) {
      return res.status(400).json({ message: "Número de serie requerido" });
    }

    const equipment = await getComputerEquipmentBySerialNumberService(serial_number.trim());
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

export const registerComputerEquipmentController = async (req: Request, res: Response) => {
  try {
    const equipmentData = req.body;
    
    if (!equipmentData || Object.keys(equipmentData).length === 0) {
      return res.status(400).json({ message: 'Datos del equipo no proporcionados' });
    }

    // Validar campos obligatorios
    if (!equipmentData.asset_number || !equipmentData.serial_number || !equipmentData.type_id || !equipmentData.brand_id || !equipmentData.status_id) {
      return res.status(400).json({ message: 'Faltan campos obligatorios: número de bien, número de serie, id del tipo de computador, id de la marca, id del estatus' });
    }

    const result = await registerComputerEquipmentService(equipmentData);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar el equipo de cómputo', error: error instanceof Error ? error.message : error });
  }
};

export const updateComputerEquipmentController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { ...dataToUpdate } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'El ID del equipo es obligatorio' });
    }

    if (!dataToUpdate || Object.keys(dataToUpdate).length === 0) {
      return res.status(400).json({ message: 'No se proporcionaron datos para actualizar' });
    }

    const result = await updateComputerEquipmentService(Number(id), dataToUpdate);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el equipo de cómputo', error: error instanceof Error ? error.message : error });
  } 
};