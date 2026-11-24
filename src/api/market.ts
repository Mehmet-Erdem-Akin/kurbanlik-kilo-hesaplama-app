import { apiRequest } from "@/api/client";
import type { MarketData } from "@/types";

export const fetchMarketPrices = async () =>
  apiRequest<{ success: boolean; data: MarketData }>("/api/market/prices", {
    auth: false,
  });
