import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-zinc-50 dark:bg-black">{children}</div>;
}
