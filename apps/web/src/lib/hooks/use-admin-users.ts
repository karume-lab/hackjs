import { QUERY_KEYS } from "@repo/api/keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  adminUserQuery,
  adminUsersQuery,
  createUserMutation,
  deleteUserMutation,
  updateUserRoleMutation,
} from "@/lib/queries/admin";

export const useAdminUsers = (page: number, limit: number) => {
  return useQuery(adminUsersQuery(page, limit));
};

export const useAdminUser = (id: string) => {
  return useQuery(adminUserQuery(id));
};

export const useCreateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    ...createUserMutation(),
    onSuccess: () => {
      toast.success("User successfully created and registered");
      qc.invalidateQueries({ queryKey: QUERY_KEYS.admin.users.all() });
    },
    onError: (err: unknown) => {
      const error = err as Error;
      toast.error(error.message || "Failed to create user record");
    },
  });
};

export const useUpdateUserRole = () => {
  const qc = useQueryClient();
  return useMutation({
    ...updateUserRoleMutation(),
    onSuccess: (_, vars) => {
      toast.success("User role updated successfully");
      qc.invalidateQueries({ queryKey: QUERY_KEYS.admin.users.detail(vars.id) });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.admin.users.all() });
    },
    onError: (err: unknown) => {
      const error = err as Error;
      toast.error(error.message || "Failed to edit user");
    },
  });
};

export const useDeleteUser = () => {
  const qc = useQueryClient();
  return useMutation({
    ...deleteUserMutation(),
    onSuccess: () => {
      toast.success("User deleted successfully");
      qc.invalidateQueries({ queryKey: QUERY_KEYS.admin.users.all() });
    },
    onError: (err: unknown) => {
      const error = err as Error;
      toast.error(error.message || "An error occurred");
    },
  });
};
