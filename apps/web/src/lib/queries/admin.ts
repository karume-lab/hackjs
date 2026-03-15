import type { TodoStatus } from "@repo/types";
import { QUERY_KEYS } from "@repo/utils/query-keys";
import type { createUserSchema } from "@repo/validators";
import { queryOptions } from "@tanstack/react-query";
import type { z } from "zod";
import { api } from "@/lib/api";

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const adminUsersQuery = (page: number, limit: number, search?: string) =>
  queryOptions({
    queryKey: QUERY_KEYS.admin.users.list(page, limit, search),
    queryFn: async () => {
      const { data, error } = await api.admin.users.get({
        query: { page, limit, search: search || undefined },
      });
      if (error) throw error.value;
      return data;
    },
  });

export const adminUserQuery = (id: string) =>
  queryOptions({
    queryKey: QUERY_KEYS.admin.users.detail(id),
    queryFn: async () => {
      const { data, error } = await api.admin.users({ id }).get();
      if (error) throw error.value;
      return data;
    },
  });

export const createUserMutation = () => ({
  mutationFn: async (input: CreateUserInput) => {
    const { data, error } = await api.admin.users.post(input);
    if (error) throw error.value;
    return data;
  },
});

export const updateUserRoleMutation = () => ({
  mutationFn: async ({ id, role }: { id: string; role: "admin" | "user" }) => {
    const { data, error } = await api.admin.users({ id }).role.put({ role });
    if (error) throw error.value;
    return data;
  },
});

export const adminTodosQuery = (
  page: number,
  limit: number,
  search?: string,
  status?: TodoStatus,
) =>
  queryOptions({
    queryKey: QUERY_KEYS.admin.todos.list(page, limit, search, status),
    queryFn: async () => {
      const { data, error } = await api.admin.todos.get({
        query: { page, limit, search: search || undefined, status: status },
      });
      if (error) throw error.value;
      return data;
    },
  });

export const deleteUserMutation = () => ({
  mutationFn: async ({ id }: { id: string }) => {
    const { data, error } = await api.admin.users({ id }).delete();
    if (error) throw error.value;
    return data;
  },
});
