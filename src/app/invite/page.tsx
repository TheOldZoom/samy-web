"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const INVITE_URL =
  "https://discord.com/oauth2/authorize?client_id=1088623902332293212";

export default function InvitePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(INVITE_URL);
  }, [router]);

  return null;
}
