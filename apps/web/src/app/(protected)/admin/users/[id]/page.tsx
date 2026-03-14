import { AdminUserEditClient } from "@/features/admin/components/AdminUserEditClient";

export default async function AdminUserEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminUserEditClient userId={id} />;
}
