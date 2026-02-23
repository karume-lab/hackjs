import type { InferRouterOutputs } from "@orpc/server";
import type { AppRouter } from "@repo/api";

// This extracts the exact shape of what 'getTodos' returns
type RouterOutput = InferRouterOutputs<AppRouter>;

export type Todo = RouterOutput["todos"]["getTodos"][number];

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
