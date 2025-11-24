/**
 * Mapea los campos de usuario para devolver solo el nombre de las relaciones
 */
export const mapUserFields = (user: any) => user && {
  ...user,
  position: user.positions?.name ?? null,
  department: user.departments?.name ?? null,
  gender: user.genders?.name ?? null,
  role: user.roles?.name ?? null,
  positions: undefined,
  departments: undefined,
  genders: undefined,
  roles: undefined,
};

/**
 * Mapea los campos de equipo para incluir nombres de relaciones
 */
export const mapEquipmentFields = (equipment: any) => equipment && {
  ...equipment,
  type_name: equipment.equipment_types?.name ?? null,
  brand_name: equipment.equipment_brands?.name ?? null,
  status_name: equipment.equipment_statuses?.name ?? null,
  equipment_types: undefined,
  equipment_brands: undefined,
  equipment_statuses: undefined,
};

/**
 * Configuración común de includes para queries de requests
 */
export const getRequestIncludeConfig = () => ({
  users_requests_beneficiary_idTousers: {
    select: {
      id: true,
      full_name: true,
      identity_card: true,
      email: true,
      is_active: true,
      role_id: true,
      position_id: true,
      department_id: true,
      gender_id: true,
      created_at: true,
      positions: { select: { name: true } },
      departments: { select: { name: true } },
      genders: { select: { name: true } },
      roles: { select: { name: true } },
      equipment: true,
    },
  },
  users_requests_requester_idTousers: {
    select: {
      id: true,
      full_name: true,
      identity_card: true,
      email: true,
      is_active: true,
      role_id: true,
      position_id: true,
      department_id: true,
      gender_id: true,
      created_at: true,
      positions: { select: { name: true } },
      departments: { select: { name: true } },
      genders: { select: { name: true } },
      roles: { select: { name: true } },
    },
  },
  users_requests_technician_idTousers: {
    select: {
      id: true,
      full_name: true,
      identity_card: true,
      email: true,
      is_active: true,
      role_id: true,
      position_id: true,
      department_id: true,
      gender_id: true,
      created_at: true,
      positions: { select: { name: true } },
      departments: { select: { name: true } },
      genders: { select: { name: true } },
      roles: { select: { name: true } },
    },
  },
  equipment: {
    include: {
      equipment_types: { select: { name: true } },
      equipment_brands: { select: { name: true } },
      equipment_statuses: { select: { name: true } },
    },
  },
  request_priorities: true,
  request_statuses: true,
  request_types: true,
});