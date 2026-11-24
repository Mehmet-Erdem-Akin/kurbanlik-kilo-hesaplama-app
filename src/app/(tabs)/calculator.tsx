import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { consumeCredit } from "@/api/credits";
import { ApiError } from "@/api/client";
import {
  AlertBox,
  Button,
  Card,
  Chip,
  Field,
  ScreenScroll,
  SectionLabel,
  Stat,
  Subtitle,
  Title,
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
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Sunucuya bağlanılamadı.");
      }
    } finally {
      setUnlocking(false);
    }
  };

  return (
    <ScreenScroll>
      <Title>Kilo & Hisse</Title>
      <Subtitle>
        Canlı kilo ve kg et fiyatıyla karkas değeri ile 1/7 hisse fiyatını anlık
        görün.
      </Subtitle>

      <Card style={styles.card}>
        <Field
          label="Canlı kilo (kg)"
          value={liveWeight}
          onChangeText={(text) => {
            setLiveWeight(text);
            setShowTable(false);
          }}
          keyboardType="numeric"
        />
        <Field
          label="Kg et fiyatı (₺)"
          value={meatPrice}
          onChangeText={(text) => {
            setMeatPrice(text);
            setShowTable(false);
          }}
          keyboardType="numeric"
        />

        <SectionLabel>Randıman profili</SectionLabel>
        <View style={styles.chipRow}>
          <Chip
            label="Erkek ~%60"
            selected={profile === "male"}
            onPress={() => {
              setProfile("male");
              setShowTable(false);
            }}
          />
          <Chip
            label="Dişi ~%53"
            selected={profile === "female"}
            onPress={() => {
              setProfile("female");
              setShowTable(false);
            }}
          />
        </View>

        <SectionLabel>Ölçü ile tahmin (opsiyonel)</SectionLabel>
        <Field
          label="Göğüs çevresi (cm)"
          value={chest}
          onChangeText={setChest}
          keyboardType="numeric"
          placeholder="190"
        />
        <Field
          label="Vücut uzunluğu (cm)"
          value={length}
          onChangeText={setLength}
          keyboardType="numeric"
          placeholder="165"
        />
        {measurementEstimate ? (
          <Button
            label={`Tahmini ${measurementEstimate} kg uygula`}
            variant="secondary"
            onPress={() => setLiveWeight(String(measurementEstimate))}
          />
        ) : null}
      </Card>

      <Card style={styles.resultCard}>
        <Text style={styles.resultLabel}>Tahmini karkas satış değeri</Text>
        <Text style={styles.resultValue}>{formatCurrency(totalSellPrice)}</Text>
        <Text style={styles.resultMeta}>
          {karkasWeight} kg karkas · %{defaultYield} randıman
        </Text>

        <View style={styles.statsRow}>
          <Stat label="Canlı kilo" value={`${liveWeightValue} kg`} />
          <Stat label="1/7 hisse" value={formatCurrency(sharePrice)} />
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.unlockTitle}>Detaylı randıman tablosu</Text>
        <Text style={styles.unlockText}>
          Farklı randıman senaryoları 1 kredi ile açılır.
        </Text>
        {!showTable ? (
          <Button
            label="Tabloyu aç (1 kredi)"
            onPress={handleUnlock}
            loading={unlocking}
          />
        ) : (
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
        )}
        {error ? <AlertBox message={error} /> : null}
      </Card>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    gap: 4,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  resultCard: {
    marginTop: 14,
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },
  resultLabel: {
    color: colors.primaryText,
    fontSize: 13,
    fontWeight: "600",
  },
  resultValue: {
    marginTop: 8,
    color: colors.white,
    fontSize: 34,
    fontWeight: "800",
  },
  resultMeta: {
    marginTop: 6,
    marginBottom: 14,
    color: "#A7F3D0",
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
  unlockTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  unlockText: {
    color: colors.textMuted,
    marginBottom: 12,
    lineHeight: 20,
  },
  table: {
    marginTop: 8,
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
    fontWeight: "600",
    color: colors.text,
  },
});
