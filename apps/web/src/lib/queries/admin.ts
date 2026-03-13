import { createMutationOptions, createQueryOptions } from "@repo/api/query";
import type { createUserSchema } from "@repo/validators";
import type { z } from "zod";
import { api } from "@/lib/api";

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const adminUsersQuery = (page: number, limit: number) =>
  createQueryOptions(["admin", "users", String(page), String(limit)], async () => {
    const { data, error } = await api.admin.users.get({
      query: { page, limit },
    });
    if (error) throw error.value;
    return data;
  });

export const adminUserQuery = (id: string) =>
  createQueryOptions(["admin", "user", id], async () => {
    const { data, error } = await api.admin.users({ id }).get();
    if (error) throw error.value;
    return data;
  });

export const createUserMutation = () =>
  createMutationOptions(async (input: CreateUserInput) => {
    const { data, error } = await api.admin.users.post(input);
    if (error) throw error.value;
    return data;
  });

export const updateUserRoleMutation = () =>
  createMutationOptions(async ({ id, role }: { id: string; role: "admin" | "user" }) => {
    const { data, error } = await api.admin.users({ id }).role.put({ role });
    if (error) throw error.value;
    return data;
  });

export const deleteUserMutation = () =>
  createMutationOptions(async ({ id }: { id: string }) => {
    const { data, error } = await api.admin.users({ id }).delete();
    if (error) throw error.value;
    return data;
  });
