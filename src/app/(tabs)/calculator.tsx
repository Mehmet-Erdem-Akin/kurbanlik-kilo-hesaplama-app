import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { LockOpen } from "lucide-react-native";
import { consumeCredit } from "@/api/credits";
import { ApiError } from "@/api/client";
import {
  AlertBox,
  AppIcon,
  BrandMark,
  Button,
  Card,
  Chip,
  Field,
  ResultBanner,
  ScreenScroll,
} from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import {
  colors,
  fonts,
  radius,
  spacing,
  typography,
} from "@/theme/theme";
import { formatCurrency, parseNumber } from "@/utils/format";
import {
  calculateYieldRows,
  getDefaultYieldRate,
  type LargeCattleYieldProfile,
} from "@/utils/yieldCalculator";

export default function CalculatorScreen() {
  const { user, setUser } = useAuth();
  const [liveWeight, setLiveWeight] = useState("700");
  const [meatPrice, setMeatPrice] = useState("620");
  const [profile, setProfile] = useState<LargeCattleYieldProfile>("male");
  const [chest, setChest] = useState("");
  const [length, setLength] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [error, setError] = useState("");
  const [unlocking, setUnlocking] = useState(false);

  const liveWeightValue = parseNumber(liveWeight);
  const meatPriceValue = parseNumber(meatPrice);
  const defaultYield = getDefaultYieldRate(profile);
  const karkasWeight = Math.round((liveWeightValue * defaultYield) / 100);
  const totalSellPrice = karkasWeight * meatPriceValue;
  const sharePrice = totalSellPrice / 7;

  const yieldRows = useMemo(
    () =>
      calculateYieldRows({
        liveWeight: liveWeightValue,
        totalValue: totalSellPrice,
        profile,
      }),
    [liveWeightValue, totalSellPrice, profile],
  );

  const measurementEstimate = useMemo(() => {
    const chestValue = parseNumber(chest);
    const lengthValue = parseNumber(length);
    if (chestValue <= 0 || lengthValue <= 0) return null;
    return Math.round((chestValue * chestValue * lengthValue) / 10840);
  }, [chest, length]);

  const handleUnlock = async () => {
    if (!user) {
      setError("Detaylı tablo için giriş yapın.");
      router.push("/auth/login");
      return;
    }
    if (user.remainingCredits <= 0) {
      setError("Kredi hakkınız kalmadı.");
      return;
    }

    setUnlocking(true);
    setError("");
    try {
      const data = await consumeCredit();
      if (!data.success) {
        setError(data.error ?? "Kredi kullanılamadı.");
        return;
      }
      setUser(data.user);
      setShowTable(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Bağlantı hatası.");
    } finally {
      setUnlocking(false);
    }
  };

  return (
    <ScreenScroll>
      <BrandMark />
      <Text style={styles.pageTitle}>Manuel Hesapla</Text>
      <Text style={styles.pageText}>
        Canlı kilo ve et fiyatı girerek karkas ağırlığı, hisse ve toplam değeri
        anlık hesaplayın.
      </Text>

      <Card style={styles.formCard}>
        <Field
          label="Canlı kilo"
          iconName="weight"
          value={liveWeight}
          onChangeText={(text) => {
            setLiveWeight(text);
            setShowTable(false);
          }}
          keyboardType="numeric"
        />
        <Field
          label="Kg et fiyatı"
          iconName="coins"
          value={meatPrice}
          onChangeText={(text) => {
            setMeatPrice(text);
            setShowTable(false);
          }}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Randıman profili</Text>
        <View style={styles.chipRow}>
          <Chip
            label="Erkek · %60"
            iconName="cattle"
            selected={profile === "male"}
            onPress={() => {
              setProfile("male");
              setShowTable(false);
            }}
          />
          <Chip
            label="Dişi · %53"
            iconName="sheep"
            selected={profile === "female"}
            onPress={() => {
              setProfile("female");
              setShowTable(false);
            }}
          />
        </View>

        <Text style={styles.label}>Ölçü ile tahmin</Text>
        <Field
          label="Göğüs çevresi (cm)"
          iconName="measure"
          value={chest}
          onChangeText={setChest}
          keyboardType="numeric"
          placeholder="Opsiyonel"
        />
        <Field
          label="Gövde uzunluğu (cm)"
          iconName="measure"
          value={length}
          onChangeText={setLength}
          keyboardType="numeric"
          placeholder="Opsiyonel"
        />
        {measurementEstimate ? (
          <Button
            label={`Tahmini ${measurementEstimate} kg uygula`}
            variant="sage"
            onPress={() => setLiveWeight(String(measurementEstimate))}
          />
        ) : null}
      </Card>

      <ResultBanner style={styles.resultCard}>
        <Text style={styles.resultLabel}>Tahmini karkas değeri</Text>
        <Text style={styles.resultValue}>{formatCurrency(totalSellPrice)}</Text>
        <View style={styles.resultGrid}>
          <MiniStat label="Canlı kilo" value={`${liveWeightValue} kg`} />
          <MiniStat label="Kg et fiyatı" value={`${meatPriceValue} ₺`} />
          <MiniStat label="Karkas kilo" value={`${karkasWeight} kg`} />
          <MiniStat label="1/7 hisse" value={formatCurrency(sharePrice)} />
        </View>
      </ResultBanner>

      <Card style={styles.lockCard}>
        <View style={styles.lockHeader}>
          <View style={styles.lockTitleRow}>
            <AppIcon name="yield" size={22} />
            <Text style={styles.lockTitle}>Detaylı randıman tablosu</Text>
          </View>
          {!showTable ? (
            <View style={styles.lockPill}>
              <AppIcon name="lock" size={14} />
              <Text style={styles.lockPillText}>Kilitli</Text>
            </View>
          ) : null}
        </View>

        {showTable ? (
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableCell}>%</Text>
              <Text style={styles.tableCell}>Et</Text>
              <Text style={styles.tableCell}>Hisse</Text>
              <Text style={styles.tableCell}>₺/kg</Text>
            </View>
            {yieldRows.map((row) => (
              <View key={row.rate} style={styles.tableRow}>
                <Text style={styles.tableCell}>{row.rate}</Text>
                <Text style={styles.tableCell}>{row.totalMeat}</Text>
                <Text style={styles.tableCell}>{row.shareKg}</Text>
                <Text style={styles.tableCell}>{row.meatKgPrice}</Text>
              </View>
            ))}
          </View>
        ) : (
          <>
            <View style={styles.blurPreview}>
              <Text style={styles.blurText}>But · Sırt · Kol · Döş</Text>
              <Text style={styles.blurText}>Randıman senaryoları kilitli</Text>
            </View>
            <Button
              label="Tabloyu Aç (1 kredi)"
              icon={LockOpen}
              onPress={handleUnlock}
              loading={unlocking}
            />
            {user ? (
              <Text style={styles.creditHint}>
                Hesabınızda {user.remainingCredits} kredi var
              </Text>
            ) : null}
          </>
        )}
        {error ? <AlertBox message={error} /> : null}
      </Card>
    </ScreenScroll>
  );
}

const MiniStat = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.miniStat}>
    <Text style={styles.miniLabel}>{label}</Text>
    <Text style={styles.miniValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  pageTitle: {
    ...typography.pageTitle,
    marginTop: spacing.lg,
    color: colors.primary,
  },
  pageText: {
    ...typography.body,
    marginTop: spacing.sm,
    color: colors.textSecondary,
  },
  formCard: {
    marginTop: spacing.lg,
  },
  label: {
    ...typography.label,
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
    color: colors.text,
  },
  chipRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  resultCard: {
    marginTop: spacing.lg,
  },
  resultLabel: {
    ...typography.label,
    color: colors.sage,
  },
  resultValue: {
    ...typography.result,
    marginTop: spacing.sm,
    color: colors.white,
  },
  resultGrid: {
    marginTop: spacing.lg,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  miniStat: {
    width: "48%",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: radius.md,
    padding: spacing.md,
  },
  miniLabel: {
    ...typography.caption,
    color: "#B7D7C5",
  },
  miniValue: {
    marginTop: 4,
    fontFamily: fonts.extraBold,
    color: colors.white,
  },
  lockCard: {
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  lockHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lockTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flex: 1,
  },
  lockTitle: {
    ...typography.cardTitle,
    color: colors.text,
  },
  lockPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.sage,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  lockPillText: {
    ...typography.caption,
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  blurPreview: {
    borderRadius: radius.lg,
    backgroundColor: colors.softSurface,
    padding: spacing.xl,
    alignItems: "center",
    gap: spacing.xs,
  },
  blurText: {
    ...typography.label,
    color: colors.disabled,
  },
  creditHint: {
    ...typography.caption,
    textAlign: "center",
    color: colors.textSecondary,
  },
  table: {
    gap: spacing.sm,
  },
  tableHeader: {
    flexDirection: "row",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCell: {
    flex: 1,
    fontFamily: fonts.bold,
    color: colors.text,
  },
});
