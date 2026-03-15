import { QUERY_KEYS } from "@repo/utils/query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminUserQuery,
  adminUsersQuery,
  createUserMutation,
  deleteUserMutation,
  updateUserRoleMutation,
} from "@/lib/queries/admin";

export function useAdminUsers(page: number, limit: number) {
  return useQuery(adminUsersQuery(page, limit));
}

export function useAdminUser(id: string) {
  return useQuery(adminUserQuery(id));
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    ...createUserMutation(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.admin.users.all() });
    },
  });
}

export function useUpdateUserRole() {
  const qc = useQueryClient();
  return useMutation({
    ...updateUserRoleMutation(),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.admin.users.detail(vars.id) });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.admin.users.all() });
    },
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    ...deleteUserMutation(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.admin.users.all() });
    },
  });
}
