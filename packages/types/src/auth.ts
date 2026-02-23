export interface User {
  id: string;
  email: string;
  name: string;
  image?: string | null;
}

export interface Session {
  id: string;
  expiresAt: Date;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
  userId: string;
}

export interface AuthError {
  message: string;
}
