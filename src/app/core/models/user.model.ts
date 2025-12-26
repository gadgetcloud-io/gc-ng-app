export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  role: UserRole;
  createdAt?: string;
}

/**
 * Get display name from user object
 * @param user User object
 * @returns Full name as "firstName lastName" or just firstName if no lastName
 */
export function getUserDisplayName(user: User | null): string {
  if (!user) return '';
  return user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName;
}

export enum UserRole {
  CUSTOMER = 'customer',
  PARTNER = 'partner',
  SUPPORT = 'support',
  ADMIN = 'admin'
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  mobile?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}
