import { useEffect, useState } from "react";
import { RefreshControl, StyleSheet, Text, View } from "react-native";
import { fetchMarketPrices } from "@/api/market";
import {
  AlertBox,
  Card,
  EmptyState,
  LoadingBlock,
  ScreenScroll,
  Stat,
  Subtitle,
  Title,
} from "@/components/ui";
import { colors } from "@/theme/colors";
import type { MarketAnimal, MarketData } from "@/types";
import { formatCurrency, formatDate } from "@/utils/format";

const AnimalCard = ({ animal }: { animal: MarketAnimal }) => (
  <Card style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.animalName}>{animal.name}</Text>
      <Text
        style={[
          styles.trend,
          animal.trend === "up" ? styles.trendUp : styles.trendDown,
        ]}
      >
        {animal.trend === "up" ? "▲" : "▼"} {animal.changePercent}%
      </Text>
    </View>
    <View style={styles.statsRow}>
      <Stat
        label="Ortalama"
        value={formatCurrency(animal.priceRange.average)}
      />
      <Stat
        label="₺/kg ort."
        value={formatCurrency(animal.pricePerKg.average)}
      />
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
        if (cancelled) return;
        setLoading(false);
        setRefreshing(false);
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
      <Title>Piyasa</Title>
      <Subtitle>
        Web backend&apos;indeki güncel canlı hayvan fiyat referansları.
      </Subtitle>

      {error ? <AlertBox message={error} /> : null}

      {!data ? (
        <EmptyState
          title="Veri yok"
          description="Piyasa verileri şu an gösterilemiyor."
        />
      ) : (
        <>
          <Text style={styles.meta}>
            {data.region} · Son güncelleme {formatDate(data.lastUpdated)}
          </Text>
          <AnimalCard animal={data.livestock.cattle} />
          <AnimalCard animal={data.livestock.sheep} />
          <AnimalCard animal={data.livestock.goat} />

          <Card style={styles.insights}>
            <Text style={styles.insightsTitle}>Piyasa notları</Text>
            {data.marketInsights.map((insight) => (
              <Text key={insight} style={styles.insight}>
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
  meta: {
    marginTop: 10,
    marginBottom: 8,
    color: colors.textMuted,
    fontSize: 13,
  },
  card: {
    marginTop: 12,
    gap: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  animalName: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
  },
  trend: {
    fontWeight: "700",
    fontSize: 13,
  },
  trendUp: {
    color: colors.success,
  },
  trendDown: {
    color: colors.danger,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
  range: {
    color: colors.textMuted,
    fontSize: 13,
  },
  insights: {
    marginTop: 12,
    gap: 8,
  },
  insightsTitle: {
    fontWeight: "700",
    color: colors.text,
    fontSize: 16,
  },
  insight: {
    color: colors.textMuted,
    lineHeight: 20,
  },
});
