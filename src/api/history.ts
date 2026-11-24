import { apiRequest } from "@/api/client";
import type { HistoryAnalysis } from "@/types";

export const fetchHistory = async () =>
  apiRequest<{ success: boolean; analyses: HistoryAnalysis[] }>(
    "/api/user/history",
  );

export const saveHistory = async (analysis: Record<string, unknown>) =>
  apiRequest<{ success: boolean }>("/api/user/history", {
    method: "POST",
    body: { analysis },
  });
