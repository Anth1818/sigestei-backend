export type CreateUserInput = {
  identity_card: number;
  full_name: string;
  email: string;
  password: string;
  role_id: number;
  position_id?: number | null;
  gender_id?: number | null;
  department_id?: number | null;
};

export interface CreateRequestInput {
  description: string;
  request_date?: Date;
  resolution_date?: Date | null;
  comments_technician?: string | null;
  requester_id: number;
  beneficiary_id?: number | null;
  technician_id?: number | null;
  equipment_id?: number | null;
  type_equipment_id?: number | null;
  type_id: number;
  status_id: number;
  priority_id: number;
}

export interface CreateEquipmentInput {
  asset_number: string;
  serial_number: string;
  model?: string | null;
  location?: string | null;
  hardware_specs?: any | null; // JSON field
  software_specs?: any | null; // JSON field
  assigned_user_id?: number | null;
  type_id: number;
  brand_id: number;
  status_id: number;
  software_type_id: number | null;
  office_suite_id: number | null;
  antivirus_solution_id: number | null;
}

export interface ServiceResponse {
  success: boolean | string;
  data?: any;
  error?: string;
}


export interface LoginResponse {
  token: string;
  user: UserPayload;
}

export interface UserPayload {
  id?: number;
  identity_card: number; 
  email: string;
  full_name: string;
  role_id: number;
  department_id?: number | null;
  last_login?: Date | null;
  last_login_backup?: Date | null;
  equipment_id?: number | null;
}
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}