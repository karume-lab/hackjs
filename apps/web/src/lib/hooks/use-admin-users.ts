"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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
      toast.success("User successfully created and registered");
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (err: unknown) => {
      const error = err as Error;
      toast.error(error.message || "Failed to create user record");
    },
  });
}

export function useUpdateUserRole() {
  const qc = useQueryClient();
  return useMutation({
    ...updateUserRoleMutation(),
    onSuccess: (_, vars) => {
      toast.success("User role updated successfully");
      qc.invalidateQueries({ queryKey: ["admin", "user", vars.id] });
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (err: unknown) => {
      const error = err as Error;
      toast.error(error.message || "Failed to edit user");
    },
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    ...deleteUserMutation(),
    onSuccess: () => {
      toast.success("User deleted successfully");
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (err: unknown) => {
      const error = err as Error;
      toast.error(error.message || "An error occurred");
    },
  });
}
