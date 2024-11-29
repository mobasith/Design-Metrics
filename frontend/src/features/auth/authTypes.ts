// authTypes.ts

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface SignInResponse {
  roleId: number | null;
  token: string;
  user: User;
}
