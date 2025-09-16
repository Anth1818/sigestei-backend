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




export interface LoginResponse {
  token: string;
  user: UserPayload;
}

export interface UserPayload {
  id: number; // o string, dependiendo de tu BD
  email: string;
  full_name: string;
  role_id: number;
}
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}