export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  userType: 'contractor' | 'client' | 'both';
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
}