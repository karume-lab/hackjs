import { AdminUserEditClient } from "@/features/admin/components/AdminUserEditClient";

const AdminUserEditPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <AdminUserEditClient userId={id} />;
};

export default AdminUserEditPage;
