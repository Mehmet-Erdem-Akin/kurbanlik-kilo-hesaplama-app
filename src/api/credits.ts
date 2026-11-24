import { apiRequest } from "@/api/client";
import type { SafeUser } from "@/types";

export const consumeCredit = async () =>
  apiRequest<{ success: boolean; user: SafeUser; error?: string }>(
    "/api/user/credits/consume",
    { method: "POST" },
  );
