import { PrismaClient } from '../../generated/prisma';
import type { CreateComputerEquipmentInput } from '../../utils/types';
const prisma = new PrismaClient();

export const getAllComputerEquipmentRepository = async () => {
  const computers = await prisma.computer_equipment.findMany({
    orderBy: { id: 'asc' },
    include: {
      users: true, // Usuario asignado
      requests: { select: { id: true } }, // Solo IDs de las requests
      equipment_brands: true, // Marca
      equipment_statuses: true, // Estatus
      equipment_types: true, // Tipo 
    },
  });

  // Mapea para que requests sea un array de IDs
  return computers.map(computer => ({
    ...computer,
    requests: computer.requests.map((request: { id: number }) => request.id),
  }));
};

export const getComputerEquipmentByIdRepository = async (id: number) => {
  return await prisma.computer_equipment.findUnique({
    where: { id },
    include: {
      users: true,
      equipment_brands: true,
      equipment_statuses: true,
      equipment_types: true,
    },
  });
};

export const getComputerEquipmentByAssetNumberRepository = async (asset_number: string) => {
  return await prisma.computer_equipment.findUnique({
    where: { asset_number },
    include: {
      users: true,
      equipment_brands: true,
      equipment_statuses: true,
      equipment_types: true,
    },
  });
};

export const getComputerEquipmentBySerialNumberRepository = async (serial_number: string) => {
  return await prisma.computer_equipment.findUnique({
    where: { serial_number },
    include: {
      users: true,
      equipment_brands: true,
      equipment_statuses: true,
      equipment_types: true,
    },
  });
};

export const updateComputerEquipmentRepository = async (id: number, data: Partial<CreateComputerEquipmentInput>) => {
  return await prisma.computer_equipment.update({
    where: { id },
    data,
  });
};

export const registerComputerEquipmentRepository = async (equipmentData: CreateComputerEquipmentInput) => {
  return await prisma.computer_equipment.create({
    data: {
      asset_number: equipmentData.asset_number,
      serial_number: equipmentData.serial_number,
      model: equipmentData.model ?? null,
      location: equipmentData.location ?? null,
      hardware_specs: equipmentData.hardware_specs ?? null,
      software_specs: equipmentData.software_specs ?? null,
      assigned_user_id: equipmentData.assigned_user_id ?? null,
      type_id: equipmentData.type_id,
      brand_id: equipmentData.brand_id,
      status_id: equipmentData.status_id,
    },
  });
};