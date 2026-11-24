export const formatCurrency = (value: number) =>
  `${Math.round(value).toLocaleString("tr-TR")} ₺`;

export const formatNumber = (value: number) =>
  value.toLocaleString("tr-TR");

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export const parseNumber = (value: string) => {
  const parsedValue = Number(value.replace(",", "."));
  return Number.isFinite(parsedValue) ? parsedValue : 0;
};
