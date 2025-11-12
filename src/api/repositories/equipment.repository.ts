import { Prisma } from "@prisma/client";
import prisma from "../../config/db";

// Fields to include in equipment queries
const fieldsToInclude = {
  equipment_types: {
    select: {
      name: true,
    },
  },
  equipment_brands: {
    select: {
      name: true,
    },
  },
  equipment_statuses: {
    select: {
      name: true,
    },
  },
  departments: {
    select: {
      name: true,
    },
  },
  users: {
    select: {
      id: true,
      full_name: true,
      email: true,
      identity_card: true,
    },
  },
  requests: {
    select: {
      id: true,
    },
  },
};

// const getAllRequestByIdOfEquipment = async (equipmentId: number) => {
//   return await prisma.requests.findMany({
//     where: { equipment_id: equipmentId },
//   });
// }

// Helper function to map nested objects to flat names
const mapEquipmentFields = (equipment: any) => {
  return {
    ...equipment,
    type_name: equipment.equipment_types?.name || null,
    brand_name: equipment.equipment_brands?.name || null,
    status_name: equipment.equipment_statuses?.name || null,
    department_name: equipment.departments?.name || null,
    assigned_user_name: equipment.users?.full_name || null,
    assigned_user_email: equipment.users?.email || null,
    assigned_user_identity_card: equipment.users?.identity_card || null,
    requests_linked: equipment.requests?.map((req: any) => req.id) || [],
    // Remove nested objects after mapping
    equipment_types: undefined,
    equipment_brands: undefined,
    equipment_statuses: undefined,
    departments: undefined,
    users: undefined,
    requests: undefined,
  };
};

/**
 * Get all equipment with optional filters
 */
export const getAllEquipmentRepository = async (filters?: {
  type_id?: number;
  department_id?: number;
  assigned_user_id?: number;
  status_id?: number;
}) => {
  try {
    const where: Prisma.equipmentWhereInput = {};

    if (filters?.type_id) {
      where.type_id = filters.type_id;
    }
    if (filters?.department_id) {
      where.department_id = filters.department_id;
    }
    if (filters?.assigned_user_id !== undefined) {
      where.assigned_user_id = filters.assigned_user_id;
    }
    if (filters?.status_id) {
      where.status_id = filters.status_id;
    }

    const equipment = await prisma.equipment.findMany({
      where,
      include: fieldsToInclude,
      orderBy: {
        id: "desc",
      },
    });

    // Map nested objects to flat names
    return equipment.map(mapEquipmentFields);
  } catch (error) {
    console.error("Error in getAllEquipmentRepository:", error);
    throw new Error("Error fetching equipment from database");
  }
};

/**
 * Get equipment by ID
 */
export const getEquipmentByIdRepository = async (id: number) => {
  try {
    const equipment = await prisma.equipment.findUnique({
      where: { id },
      include: fieldsToInclude,
    });

    if (!equipment) {
      return null;
    }

    return mapEquipmentFields(equipment);
  } catch (error) {
    console.error("Error in getEquipmentByIdRepository:", error);
    throw new Error("Error fetching equipment by ID from database");
  }
};

/**
 * Get equipment by asset number
 */
export const getEquipmentByAssetNumberRepository = async (
  assetNumber: string
) => {
  try {
    const equipment = await prisma.equipment.findUnique({
      where: { asset_number: assetNumber },
      include: fieldsToInclude,
    });

    if (!equipment) {
      return null;
    }

    return mapEquipmentFields(equipment);
  } catch (error) {
    console.error("Error in getEquipmentByAssetNumberRepository:", error);
    throw new Error("Error fetching equipment by asset number from database");
  }
};

/**
 * Get equipment by serial number
 */
export const getEquipmentBySerialNumberRepository = async (
  serialNumber: string
) => {
  try {
    const equipment = await prisma.equipment.findUnique({
      where: { serial_number: serialNumber },
      include: fieldsToInclude,
    });

    if (!equipment) {
      return null;
    }

    return mapEquipmentFields(equipment);
  } catch (error) {
    console.error("Error in getEquipmentBySerialNumberRepository:", error);
    throw new Error("Error fetching equipment by serial number from database");
  }
};

/**
 * Get department ID by matching location name with department name
 * Busca coincidencia parcial (case-insensitive) entre location y nombres de departamentos
 */
const getDepartmentIdByLocation = async (location: string | null | undefined) => {
  if (!location) return null;
  
  try {
    // Buscar todos los departamentos
    const departments = await prisma.departments.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    // Normalizar location para comparación (sin acentos, minúsculas, sin espacios extra)
    const normalizedLocation = location
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

    // Buscar coincidencia exacta primero
    const exactMatch = departments.find(dept => {
      const normalizedDeptName = dept.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      return normalizedLocation === normalizedDeptName;
    });

    if (exactMatch) {
      return exactMatch.id;
    }

    // Si no hay coincidencia exacta, buscar si el location contiene el nombre del departamento
    const partialMatch = departments.find(dept => {
      const normalizedDeptName = dept.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      return normalizedLocation.includes(normalizedDeptName);
    });

    return partialMatch?.id || null;
  } catch (error) {
    console.error("Error in getDepartmentIdByLocation:", error);
    return null;
  }
};

/**
 * Create new equipment
 */
export const createEquipmentRepository = async (
  data: Prisma.equipmentCreateInput
) => {
  try {
    // Buscar department_id basado en location si no se proporcionó department_id
    let departmentId = null;
    if (data.location && typeof data.location === 'string') {
      departmentId = await getDepartmentIdByLocation(data.location);
    }

    // Preparar los datos con el department_id encontrado
    const equipmentData: Prisma.equipmentCreateInput = {
      ...data,
      ...(departmentId && {
        departments: {
          connect: { id: departmentId }
        }
      }),
    };

    const equipment = await prisma.equipment.create({
      data: equipmentData,
      include: fieldsToInclude,
    });

    return mapEquipmentFields(equipment);
  } catch (error) {
    console.error("Error in createEquipmentRepository:", error);
    throw new Error("Error creating equipment in database");
  }
};

/**
 * Update equipment by ID
 */
export const updateEquipmentRepository = async (
  id: number,
  data: Prisma.equipmentUpdateInput
) => {
  try {
    const equipment = await prisma.equipment.update({
      where: { id },
      data,
      include: fieldsToInclude,
    });

    return mapEquipmentFields(equipment);
  } catch (error) {
    console.error("Error in updateEquipmentRepository:", error);
    throw new Error("Error updating equipment in database");
  }
};

/**
 * Delete equipment by ID
 */
export const deleteEquipmentRepository = async (id: number) => {
  try {
    const equipment = await prisma.equipment.delete({
      where: { id },
    });

    return equipment;
  } catch (error) {
    console.error("Error in deleteEquipmentRepository:", error);
    throw new Error("Error deleting equipment from database");
  }
};

/**
 * Get all departmental equipment (assigned_user_id is NULL)
 */
export const getDepartmentalEquipmentRepository = async (
  departmentId?: number
) => {
  try {
    const where: Prisma.equipmentWhereInput = {
      assigned_user_id: null,
    };

    if (departmentId) {
      where.department_id = departmentId;
    }

    const equipment = await prisma.equipment.findMany({
      where,
      include: fieldsToInclude,
      orderBy: {
        id: "asc",
      },
    });

    return equipment.map(mapEquipmentFields);
  } catch (error) {
    console.error("Error in getDepartmentalEquipmentRepository:", error);
    throw new Error("Error fetching departmental equipment from database");
  }
};

/**
 * Get all personal equipment (assigned_user_id is NOT NULL)
 */
export const getPersonalEquipmentRepository = async (userId?: number) => {
  try {
    const where: Prisma.equipmentWhereInput = {
      assigned_user_id: {
        not: null,
      },
    };

    if (userId) {
      where.assigned_user_id = userId;
    }

    const equipment = await prisma.equipment.findMany({
      where,
      include: fieldsToInclude,
      orderBy: {
        id: "asc",
      },
    });

    return equipment.map(mapEquipmentFields);
  } catch (error) {
    console.error("Error in getPersonalEquipmentRepository:", error);
    throw new Error("Error fetching personal equipment from database");
  }
};
