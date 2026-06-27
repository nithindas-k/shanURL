export interface RegisterPayload {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  email: string;
  createdAt: string;
}

export interface AuthDataResponse {
  user: UserResponse;
  accessToken: string;
}
