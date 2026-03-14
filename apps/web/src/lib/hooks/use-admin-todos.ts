import type { TodoStatus } from "@repo/types";
import { useQuery } from "@tanstack/react-query";
import { adminTodosQuery } from "@/lib/queries/admin";

export const useAdminTodos = (
  page: number,
  limit: number,
  search?: string,
  status?: TodoStatus,
) => {
  return useQuery(adminTodosQuery(page, limit, search, status));
};
