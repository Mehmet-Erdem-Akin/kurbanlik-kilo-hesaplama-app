import { apiRequest, ApiError } from "@/api/client";
import type { AdditionalInfo, AnalysisResult, SafeUser } from "@/types";

type AnalyzePayload = {
  image?: string;
  images?: string[];
  imageIndex?: number;
  totalImages?: number;
  analysisType?: "single" | "multiple";
  additionalInfo?: AdditionalInfo;
};

export type AnalyzeApiResult =
  | { ok: true; data: AnalysisResult }
  | {
      ok: false;
      errorType: string;
      message: string;
      detectedType?: string;
      status: number;
      user?: SafeUser;
    };

export const analyzeImages = async (
  payload: AnalyzePayload,
): Promise<AnalyzeApiResult> => {
  try {
    const data = await apiRequest<AnalysisResult>("/api/analyze", {
      method: "POST",
      body: payload,
    });

    if (data.success === false) {
      return {
        ok: false,
        errorType: "ANALYSIS_FAILED",
        message: "Analiz başarısız oldu",
        status: 400,
      };
    }

    return { ok: true, data };
  } catch (error) {
    if (error instanceof ApiError) {
      const payloadError = error.payload as
        | {
            error?: string;
            message?: string;
            detectedType?: string;
            user?: SafeUser;
          }
        | undefined;

      return {
        ok: false,
        errorType: payloadError?.error || "REQUEST_FAILED",
        message: payloadError?.message || error.message,
        detectedType: payloadError?.detectedType,
        status: error.status,
        user: payloadError?.user,
      };
    }

    return {
      ok: false,
      errorType: "NETWORK_ERROR",
      message: "Sunucuya bağlanılamadı",
      status: 0,
    };
  }
};

export const getAnalyzeErrorMessage = (
  errorType: string,
  detectedType?: string,
) => {
  switch (errorType) {
    case "AUTH_REQUIRED":
      return "Fotoğraf analizi için giriş yapmanız gerekiyor.";
    case "NO_CREDITS":
      return "Kredi hakkınız kalmadı. Paketler ekranından kredi satın alabilirsiniz.";
    case "NO_ANIMAL_DETECTED":
      return "Fotoğrafta kurbanlık hayvan tespit edilemedi. Daha net bir fotoğraf deneyin.";
    case "INVALID_ANIMAL_TYPE":
      return `Tespit edilen hayvan kurbanlık türlerden değil.${detectedType ? ` Tespit: ${detectedType}.` : ""}`;
    case "INCOMPLETE_ANALYSIS":
      return "Hayvan net olarak tespit edilemedi. Daha açık bir fotoğraf yükleyin.";
    case "ANALYSIS_FAILED":
      return "Fotoğraf analizi başarısız oldu. Farklı bir fotoğraf deneyin.";
    case "API_ERROR":
      return "Yapay zeka servisinde geçici bir sorun oluştu. Lütfen tekrar deneyin.";
    default:
      return "Analiz sırasında bir hata oluştu.";
  }
};
