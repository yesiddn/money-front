export interface ResponseLogin {
  access: string;
  refresh: string;
}

export interface SignupRequest {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
}

export interface SignupErrorResponse {
  username?: string[];
  first_name?: string[];
  last_name?: string[];
  email?: string[];
  password?: string[];
  confirm_password?: string[];
}
