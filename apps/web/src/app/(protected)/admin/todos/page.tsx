import { Suspense } from "react";
import { AdminTodosClient } from "@/features/admin/components/AdminTodosClient";

const AdminTodosPage = () => {
  return (
    <Suspense>
      <AdminTodosClient />
    </Suspense>
  );
};

export default AdminTodosPage;
