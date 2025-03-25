/**
 * Enum representing different user types in the application
 */
export enum UserType {
  /** Unauthenticated visitor */
  VISITOR = 0,
  
  /** Basic authenticated user */
  BASIC_USER = 1,
  
  /** Premium tier user with access to premium features */
  PREMIUM_USER = 2,
  
  /** Early adopter user with special privileges */
  EARLY_ADOPTER = 3,
  
  /** Admin user with elevated privileges */
  ADMIN = 10
}

/**
 * Interface for authentication information
 */
export interface AuthInfo {
  userType: UserType;
  userId?: string;
  username?: string;
  email?: string;
  isAuthenticated: boolean;
}
