"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/api";

export function RedirectIfAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (token) {
      router.replace("/dashboard");
      return;
    }
    setTimeout(() => {
      setMounted(true);
    }, 0);
  }, [router]);

  if (!mounted) {
    return null;
  }

  return <>{children}</>;
}
