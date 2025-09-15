export type CreateUserInput = {
  full_name: string;
  identity_card: number;
  email: string;
  password_hash: string;
  role_id: number;
  position_id?: number | null;
  gender_id?: number | null;
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