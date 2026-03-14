import { Suspense } from "react";
import { AdminUsersClient } from "@/features/admin/components/AdminUsersClient";

const AdminUsersPage = () => {
  return (
    <Suspense>
      <AdminUsersClient />
    </Suspense>
  );
};

export default AdminUsersPage;
