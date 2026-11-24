import { useEffect, useState } from "react";
import { RefreshControl, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fetchMarketPrices } from "@/api/market";
import {
  AlertBox,
  BrandHeader,
  Button,
  Card,
  EmptyState,
  LoadingBlock,
  ScreenScroll,
} from "@/components/ui";
import { colors } from "@/theme/colors";
import type { MarketAnimal, MarketData } from "@/types";
import { formatCurrency, formatDate } from "@/utils/format";

const AnimalCard = ({
  animal,
  icon,
}: {
  animal: MarketAnimal;
  icon: keyof typeof Ionicons.glyphMap;
}) => (
  <Card style={styles.card}>
    <View style={styles.cardTop}>
      <View style={styles.animalIcon}>
        <Ionicons name={icon} size={22} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.animalName}>{animal.name}</Text>
        <Text style={styles.animalSub}>Piyasa ortalama fiyatı</Text>
        <Text style={styles.price}>
          {formatCurrency(animal.pricePerKg.average).replace(" ₺", "")}{" "}
          <Text style={styles.priceUnit}>₺/kg</Text>
        </Text>
      </View>
      <View style={styles.trendCol}>
        <View
          style={[
            styles.trendPill,
            animal.trend === "up" ? styles.trendUp : styles.trendDown,
          ]}
        >
          <Text style={styles.trendText}>
            {animal.trend === "up" ? "Yukarı" : "Aşağı"} {animal.changePercent}%
          </Text>
        </View>
      </View>
    </View>
    <Text style={styles.range}>
      Aralık: {formatCurrency(animal.priceRange.min)} –{" "}
      {formatCurrency(animal.priceRange.max)}
    </Text>
  </Card>
);

export default function MarketScreen() {
  const [data, setData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const response = await fetchMarketPrices();
        if (cancelled) return;
        setData(response.data);
        setError("");
      } catch {
        if (cancelled) return;
        setError("Piyasa verileri alınamadı.");
      } finally {
        if (!cancelled) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const handleRefresh = () => {
    setRefreshing(true);
    setReloadKey((value) => value + 1);
  };

  if (loading) {
    return (
      <ScreenScroll>
        <BrandHeader />
        <LoadingBlock label="Piyasa yükleniyor..." />
      </ScreenScroll>
    );
  }

  return (
    <ScreenScroll
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <BrandHeader />
      <Text style={styles.pageTitle}>Piyasa</Text>
      <Text style={styles.pageText}>
        Canlı hayvan piyasasına ilişkin güncel fiyat referansları ve trendler.
      </Text>

      <View style={styles.updateBar}>
        <Text style={styles.updateText}>
          Son güncelleme:{" "}
          {data ? formatDate(data.lastUpdated) : "—"}
        </Text>
        <Button
          label="Güncelle"
          icon="refresh"
          variant="sage"
          onPress={handleRefresh}
        />
      </View>

      {error ? <AlertBox message={error} /> : null}

      {!data ? (
        <EmptyState
          title="Veri yok"
          description="Piyasa verileri şu an gösterilemiyor."
        />
      ) : (
        <>
          <AnimalCard animal={data.livestock.cattle} icon="paw" />
          <AnimalCard animal={data.livestock.sheep} icon="leaf-outline" />
          <AnimalCard animal={data.livestock.goat} icon="nutrition-outline" />

          <Card style={styles.notes}>
            <View style={styles.notesHeader}>
              <Ionicons
                name="document-text-outline"
                size={18}
                color={colors.primary}
              />
              <Text style={styles.notesTitle}>Piyasa Notları</Text>
            </View>
            {data.marketInsights.map((insight) => (
              <Text key={insight} style={styles.note}>
                • {insight}
              </Text>
            ))}
          </Card>
        </>
      )}
    </ScreenScroll>
  );
}

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
  updateBar: {
    marginTop: 14,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  updateText: {
    flex: 1,
    color: colors.textMuted,
    fontSize: 13,
  },
  card: {
    marginTop: 10,
    gap: 10,
  },
  cardTop: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  animalIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  animalName: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.text,
  },
  animalSub: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textMuted,
  },
  price: {
    marginTop: 6,
    fontSize: 24,
    fontWeight: "800",
    color: colors.primary,
  },
  priceUnit: {
    fontSize: 14,
    fontWeight: "600",
  },
  trendCol: {
    alignItems: "flex-end",
  },
  trendPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  trendUp: {
    backgroundColor: colors.primarySoft,
  },
  trendDown: {
    backgroundColor: colors.dangerSoft,
  },
  trendText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.primaryDark,
  },
  range: {
    color: colors.textMuted,
    fontSize: 12,
  },
  notes: {
    marginTop: 12,
    gap: 8,
  },
  notesHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  notesTitle: {
    fontWeight: "800",
    color: colors.text,
    fontSize: 16,
  },
  note: {
    color: colors.textMuted,
    lineHeight: 20,
  },
});
