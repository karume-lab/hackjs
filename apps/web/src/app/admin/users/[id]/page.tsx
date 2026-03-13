import { AdminUserEditContent } from "@/features/admin/components/AdminUserEditContent";

export default async function AdminUserEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminUserEditContent userId={id} />;
}
