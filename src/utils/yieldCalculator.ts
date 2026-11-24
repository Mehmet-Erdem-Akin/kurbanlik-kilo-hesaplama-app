export type LargeCattleYieldProfile = "male" | "female";

export type YieldTableRow = {
  rate: number;
  totalMeat: number;
  shareKg: number;
  meatKgPrice: number;
};

export const MALE_LARGE_CATTLE_YIELD_RATES = [55, 58, 60, 62, 65] as const;
export const FEMALE_LARGE_CATTLE_YIELD_RATES = [50, 52, 53, 54, 55] as const;

export const DEFAULT_LARGE_CATTLE_YIELD_RATES: Record<
  LargeCattleYieldProfile,
  number
> = {
  male: 60,
  female: 53,
};

type YieldCalculationInput = {
  liveWeight: number;
  totalValue: number;
  profile: LargeCattleYieldProfile;
  shareCount?: number;
};

export const getYieldRates = (
  profile: LargeCattleYieldProfile,
): readonly number[] => {
  return profile === "female"
    ? FEMALE_LARGE_CATTLE_YIELD_RATES
    : MALE_LARGE_CATTLE_YIELD_RATES;
};

export const getDefaultYieldRate = (profile: LargeCattleYieldProfile) =>
  DEFAULT_LARGE_CATTLE_YIELD_RATES[profile];

export const calculateYieldRows = ({
  liveWeight,
  totalValue,
  profile,
  shareCount = 7,
}: YieldCalculationInput): YieldTableRow[] => {
  const rates = getYieldRates(profile);

  return rates.map((rate) => {
    const totalMeat = Math.round((liveWeight * rate) / 100);
    const shareKg = Math.round(totalMeat / shareCount);
    const meatKgPrice = totalMeat > 0 ? Math.round(totalValue / totalMeat) : 0;

    return {
      rate,
      totalMeat,
      shareKg,
      meatKgPrice,
    };
  });
};

export const getYieldProfileLabel = (profile: LargeCattleYieldProfile) =>
  profile === "female" ? "Dişi büyükbaş" : "Erkek büyükbaş";
