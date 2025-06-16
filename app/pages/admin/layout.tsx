"use client";
import { useRoleProtection } from "@/app/Services/useRoleProtection";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  useRoleProtection(["admin","admin2","desarrollador"], "/pages/login?error=admin-required");
  return <>{children}</>;
}
