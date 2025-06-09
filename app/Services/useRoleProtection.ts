import { useEffect } from "react";
import { useRouter } from "next/navigation";
import StorageNavegador from "@/app/Services/StorageNavegador";

export function useRoleProtection(allowedRoles: string[], redirectUrl: string) {
  const router = useRouter();
  useEffect(() => {
    const user = StorageNavegador.getItemWithExpiry<any>("user");
    if (!user || !allowedRoles.includes(user.rol)) {
      router.replace(redirectUrl);
    }
  }, [router, allowedRoles, redirectUrl]);
}
