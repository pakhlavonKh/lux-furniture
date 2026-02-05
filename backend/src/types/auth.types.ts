export interface User {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export interface AuthPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  passwordConfirm: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: Partial<User>;
  refreshToken?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
