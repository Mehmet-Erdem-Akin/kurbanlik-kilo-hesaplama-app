import { useEffect, useState } from "react";
import { RefreshControl, StyleSheet, Text, View } from "react-native";
import { FileText, Leaf, RefreshCw, TrendingDown, TrendingUp } from "lucide-react-native";
import { fetchMarketPrices } from "@/api/market";
import {
  AlertBox,
  BrandMark,
  Button,
  Card,
  EmptyState,
  LoadingBlock,
  ScreenScroll,
  Skeleton,
} from "@/components/ui";
import { colors, fonts, radius, spacing, typography } from "@/theme/theme";
import type { MarketAnimal, MarketData } from "@/types";
import { formatCurrency, formatDate } from "@/utils/format";

const AnimalCard = ({ animal }: { animal: MarketAnimal }) => {
  const isUp = animal.trend === "up";
  return (
    <Card style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.animalIcon}>
          <Leaf size={22} color={colors.primary} strokeWidth={2.1} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.animalName}>{animal.name}</Text>
          <Text style={styles.animalSub}>Piyasa ortalama fiyatı</Text>
          <Text style={styles.price}>
            {Math.round(animal.pricePerKg.average).toLocaleString("tr-TR")}{" "}
            <Text style={styles.priceUnit}>₺/kg</Text>
          </Text>
        </View>
        <View
          style={[styles.trendPill, isUp ? styles.trendUp : styles.trendDown]}
        >
          {isUp ? (
            <TrendingUp size={12} color={colors.success} strokeWidth={2.2} />
          ) : (
            <TrendingDown size={12} color={colors.error} strokeWidth={2.2} />
          )}
          <Text style={styles.trendText}>
            {isUp ? "Yukarı" : "Aşağı"} {animal.changePercent}%
          </Text>
        </View>
      </View>
      <Text style={styles.range}>
        Aralık: {formatCurrency(animal.priceRange.min)} –{" "}
        {formatCurrency(animal.priceRange.max)}
      </Text>
    </Card>
  );
};

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
        <BrandMark />
        <LoadingBlock label="Piyasa yükleniyor..." />
        <Skeleton height={88} style={{ marginBottom: 12 }} />
        <Skeleton height={88} style={{ marginBottom: 12 }} />
        <Skeleton height={88} />
      </ScreenScroll>
    );
  }

  return (
    <ScreenScroll
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <BrandMark />
      <Text style={styles.pageTitle}>Piyasa</Text>
      <Text style={styles.pageText}>
        Canlı hayvan piyasasına ilişkin güncel fiyat referansları ve trendler.
      </Text>

      <View style={styles.updateBar}>
        <Text style={styles.updateText}>
          Son güncelleme: {data ? formatDate(data.lastUpdated) : "—"}
        </Text>
        <Button
          label="Güncelle"
          icon={RefreshCw}
          variant="sage"
          onPress={handleRefresh}
        />
      </View>

      {error ? <AlertBox message={error} /> : null}

      {!data ? (
        <EmptyState
          icon={Leaf}
          title="Veri yok"
          description="Piyasa verileri şu an gösterilemiyor."
        />
      ) : (
        <>
          <AnimalCard animal={data.livestock.cattle} />
          <AnimalCard animal={data.livestock.sheep} />
          <AnimalCard animal={data.livestock.goat} />

          <Card style={styles.notes}>
            <View style={styles.notesHeader}>
              <FileText size={18} color={colors.primary} strokeWidth={2.1} />
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
    ...typography.pageTitle,
    marginTop: spacing.lg,
    color: colors.primary,
  },
  pageText: {
    ...typography.body,
    marginTop: spacing.sm,
    color: colors.textSecondary,
  },
  updateBar: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  updateText: {
    flex: 1,
    ...typography.caption,
    color: colors.textSecondary,
  },
  card: {
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  cardTop: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "flex-start",
  },
  animalIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.sage,
    alignItems: "center",
    justifyContent: "center",
  },
  animalName: {
    ...typography.cardTitle,
    color: colors.text,
  },
  animalSub: {
    ...typography.caption,
    marginTop: 2,
    color: colors.textSecondary,
  },
  price: {
    marginTop: spacing.sm,
    fontFamily: fonts.extraBold,
    fontSize: 24,
    color: colors.primary,
  },
  priceUnit: {
    fontSize: 14,
    fontFamily: fonts.semibold,
  },
  trendPill: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  trendUp: {
    backgroundColor: colors.sage,
  },
  trendDown: {
    backgroundColor: "#FCECEC",
  },
  trendText: {
    ...typography.caption,
    fontFamily: fonts.bold,
    color: colors.forest,
  },
  range: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  notes: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  notesHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  notesTitle: {
    ...typography.cardTitle,
    color: colors.text,
  },
  note: {
    ...typography.body,
    fontSize: 14,
    color: colors.textSecondary,
  },
});
