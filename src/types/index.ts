export type SafeUser = {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
  usagePurpose: string;
  remainingCredits: number;
  createdAt: string;
};

export type AdditionalInfo = {
  animalCategory?: string;
  animalType?: string;
  estimatedAge?: string;
  gender?: string;
  healthCondition?: string;
  feedingStatus?: string;
  pregnancyStatus?: string;
  region?: string;
  specialNotes?: string;
  weight?: string;
};

export type AnalysisResult = {
  success: boolean;
  analysisType: string;
  animalType: string;
  breed: string;
  estimatedWeight: number;
  healthScore: number;
  marketValue: number;
  meatYield: {
    totalMeat: number;
    karkasWeight: number;
    bonelessMeat: number;
    boneWeight: number;
    yieldRatios: {
      karkasYield: number;
      bonelessYield: number;
      totalYield: number;
    };
  };
  pricing: {
    liveWeightPrice: number;
    meatPrice: number;
    estimatedMeatValue: number;
  };
  costPerShare: number;
  confidence: number;
  recommendations: string[];
  analysisDate: string;
  totalImages?: number;
  analysisNote?: string;
  user?: SafeUser;
};

export type AnalysisError = {
  errorType: string;
  message: string;
  detectedType?: string;
  analysisType?: string;
  totalImages?: number;
};

export type MarketData = {
  lastUpdated: string;
  region: string;
  currency: string;
  livestock: {
    cattle: MarketAnimal;
    sheep: MarketAnimal;
    goat: MarketAnimal;
  };
  marketInsights: string[];
};

export type MarketAnimal = {
  name: string;
  priceRange: { min: number; max: number; average: number };
  pricePerKg: { min: number; max: number; average: number };
  trend: string;
  changePercent: string;
};

export type HistoryAnalysis = {
  id: string;
  userId?: string;
  createdAt?: string;
  animalType?: string;
  estimatedWeight?: number;
  marketValue?: number;
  analysisDate?: string;
  date?: string;
  estimatedCost?: number;
  [key: string]: unknown;
};
