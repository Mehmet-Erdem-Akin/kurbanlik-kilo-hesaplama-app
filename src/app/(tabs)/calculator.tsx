import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { consumeCredit } from "@/api/credits";
import { ApiError } from "@/api/client";
import {
  AlertBox,
  BrandHeader,
  Button,
  Card,
  Chip,
  Field,
  ScreenScroll,
} from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { colors } from "@/theme/colors";
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
  const [chest, setChest] = useState("240");
  const [length, setLength] = useState("180");
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
      <BrandHeader />
      <Text style={styles.pageTitle}>Manuel Hesapla</Text>
      <Text style={styles.pageText}>
        Canlı kilo ve et fiyatı girerek karkas ağırlığı, hisse ve toplam değeri
        anlık hesaplayın.
      </Text>

      <Card style={styles.formCard}>
        <Field
          label="Canlı kilo"
          icon="bag-handle-outline"
          value={liveWeight}
          onChangeText={(text) => {
            setLiveWeight(text);
            setShowTable(false);
          }}
          keyboardType="numeric"
        />
        <Field
          label="Kg et fiyatı"
          icon="cash-outline"
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
            selected={profile === "male"}
            onPress={() => {
              setProfile("male");
              setShowTable(false);
            }}
          />
          <Chip
            label="Dişi · %53"
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
          icon="resize-outline"
          value={chest}
          onChangeText={setChest}
          keyboardType="numeric"
        />
        <Field
          label="Gövde uzunluğu (cm)"
          icon="swap-horizontal-outline"
          value={length}
          onChangeText={setLength}
          keyboardType="numeric"
        />
        {measurementEstimate ? (
          <Button
            label={`Tahmini ${measurementEstimate} kg uygula`}
            variant="sage"
            icon="arrow-forward"
            onPress={() => setLiveWeight(String(measurementEstimate))}
          />
        ) : null}
      </Card>

      <View style={styles.resultCard}>
        <Text style={styles.resultLabel}>Tahmini karkas değeri</Text>
        <Text style={styles.resultValue}>{formatCurrency(totalSellPrice)}</Text>
        <View style={styles.resultGrid}>
          <MiniStat label="Canlı kilo" value={`${liveWeightValue} kg`} />
          <MiniStat label="Kg et fiyatı" value={`${meatPriceValue} ₺`} />
          <MiniStat label="Karkas kilo" value={`${karkasWeight} kg`} />
          <MiniStat label="1/7 hisse" value={formatCurrency(sharePrice)} />
        </View>
      </View>

      <Card style={styles.lockCard}>
        <View style={styles.lockHeader}>
          <Text style={styles.lockTitle}>Detaylı randıman tablosu</Text>
          {!showTable ? (
            <View style={styles.lockPill}>
              <Ionicons name="lock-closed" size={12} color={colors.primary} />
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
              icon="lock-open-outline"
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
    marginTop: 16,
    fontSize: 28,
    fontWeight: "800",
    color: colors.primary,
  },
  pageText: {
    marginTop: 8,
    color: colors.textMuted,
    lineHeight: 21,
  },
  formCard: {
    marginTop: 16,
  },
  label: {
    marginBottom: 8,
    marginTop: 4,
    fontWeight: "700",
    color: colors.text,
  },
  chipRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  resultCard: {
    marginTop: 14,
    borderRadius: 22,
    backgroundColor: colors.resultCard,
    padding: 18,
  },
  resultLabel: {
    color: colors.primarySoft,
    fontWeight: "600",
  },
  resultValue: {
    marginTop: 8,
    color: colors.white,
    fontSize: 34,
    fontWeight: "800",
  },
  resultGrid: {
    marginTop: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  miniStat: {
    width: "48%",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 10,
  },
  miniLabel: {
    color: "#B7D7C5",
    fontSize: 11,
  },
  miniValue: {
    marginTop: 4,
    color: colors.white,
    fontWeight: "800",
  },
  lockCard: {
    marginTop: 14,
    gap: 12,
  },
  lockHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lockTitle: {
    fontWeight: "800",
    color: colors.text,
    fontSize: 16,
  },
  lockPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.primarySoft,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  lockPillText: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 11,
  },
  blurPreview: {
    borderRadius: 14,
    backgroundColor: colors.surfaceMuted,
    padding: 18,
    alignItems: "center",
    gap: 6,
  },
  blurText: {
    color: colors.textSoft,
    fontWeight: "600",
  },
  creditHint: {
    textAlign: "center",
    color: colors.textMuted,
    fontSize: 12,
  },
  table: {
    gap: 8,
  },
  tableHeader: {
    flexDirection: "row",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCell: {
    flex: 1,
    fontWeight: "700",
    color: colors.text,
  },
});
