import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Camera, Plus } from "lucide-react-native";
import { fetchHistory } from "@/api/history";
import {
  AlertBox,
  AppIcon,
  BrandMark,
  Button,
  Card,
  EmptyState,
  LoadingBlock,
  MenuRow,
  ResultBanner,
  ScreenScroll,
} from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { colors, fonts, radius, spacing, typography } from "@/theme/theme";
import type { HistoryAnalysis } from "@/types";
import { formatCurrency, formatDate } from "@/utils/format";

export default function AccountScreen() {
  const { user, loading, logout } = useAuth();
  const [analyses, setAnalyses] = useState<HistoryAnalysis[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) router.replace("/auth/login");
  }, [user, loading]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const run = async () => {
      setHistoryLoading(true);
      try {
        const data = await fetchHistory();
        if (cancelled) return;
        setAnalyses(data.analyses || []);
        setError("");
      } catch {
        if (cancelled) return;
        setError("Geçmiş analizler yüklenemedi.");
        setAnalyses([]);
      } finally {
        if (!cancelled) setHistoryLoading(false);
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (loading || !user) {
    return (
      <ScreenScroll>
        <LoadingBlock />
      </ScreenScroll>
    );
  }

  return (
    <ScreenScroll>
      <BrandMark />
      <Text style={styles.pageTitle}>Hesabım</Text>

      <Card style={styles.profileCard}>
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <AppIcon name="profile" size={28} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>
              {user.name} {user.surname}
            </Text>
            <Text style={styles.email}>{user.email}</Text>
          </View>
        </View>

        <View style={styles.creditRow}>
          <ResultBanner style={styles.creditBox}>
            <AppIcon name="coins" size={22} />
            <Text style={styles.creditLabel}>Kalan kredi</Text>
            <Text style={styles.creditValue}>{user.remainingCredits}</Text>
          </ResultBanner>
          <Button
            label="Kredi Satın Al"
            icon={Plus}
            variant="secondary"
            flex
            onPress={() => router.push("/pricing")}
          />
        </View>
      </Card>

      <Card style={styles.menuCard}>
        <MenuRow
          iconName="package"
          title="Paketler"
          subtitle="Kredi paketlerini incele ve satın al"
          onPress={() => router.push("/pricing")}
        />
        <MenuRow
          iconName="support"
          title="Destek"
          subtitle="Sorularınız için bize ulaşın"
          onPress={() => router.push("/more")}
        />
        <MenuRow
          iconName="logout"
          title="Çıkış Yap"
          subtitle="Hesabınızdan güvenli çıkış"
          danger
          onPress={async () => {
            await logout();
            router.replace("/auth/login");
          }}
        />
      </Card>

      <View style={styles.historyHeader}>
        <Text style={styles.historyTitle}>Analiz Geçmişi</Text>
        <Text style={styles.historyCount}>{analyses.length} kayıt</Text>
      </View>

      {error ? <AlertBox message={error} /> : null}
      {historyLoading ? (
        <LoadingBlock label="Geçmiş yükleniyor..." />
      ) : analyses.length === 0 ? (
        <EmptyState
          icon={Camera}
          title="Henüz analiz yok"
          description="İlk fotoğraf analizinizi yaparak geçmişinizi oluşturun."
        />
      ) : (
        analyses.slice(0, 5).map((item) => {
          const weight = Number(item.estimatedWeight || 0);
          const value = Number(item.marketValue || item.estimatedCost || 0);
          const dateValue =
            item.createdAt || item.analysisDate || item.date || "";

          return (
            <Card key={item.id} style={styles.historyCard}>
              <View style={styles.historyIcon}>
                <AppIcon name="report" size={24} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.historyAnimal}>
                  {String(item.animalType || "Analiz")}
                </Text>
                <Text style={styles.historyMeta}>
                  {dateValue ? formatDate(String(dateValue)) : "—"}
                </Text>
                <Text style={styles.historyValue}>
                  {weight
                    ? `Tahmini kilo: ${weight} kg`
                    : value
                      ? `Tahmini değer: ${formatCurrency(value)}`
                      : "Detay yok"}
                </Text>
              </View>
            </Card>
          );
        })
      )}

      <Button
        label="Yeni Analiz"
        icon={Camera}
        onPress={() => router.push("/analyze")}
      />
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  pageTitle: {
    ...typography.pageTitle,
    marginTop: spacing.lg,
    color: colors.primary,
  },
  profileCard: {
    marginTop: spacing.lg,
    gap: spacing.lg,
  },
  profileRow: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "center",
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.sage,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontFamily: fonts.extraBold,
    fontSize: 18,
    color: colors.text,
  },
  email: {
    ...typography.caption,
    marginTop: 2,
    color: colors.textSecondary,
  },
  creditRow: {
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "center",
  },
  creditBox: {
    flex: 1,
    padding: spacing.md,
    gap: 4,
  },
  creditLabel: {
    ...typography.caption,
    color: colors.sage,
  },
  creditValue: {
    fontFamily: fonts.extraBold,
    fontSize: 28,
    color: colors.white,
  },
  menuCard: {
    marginTop: spacing.lg,
  },
  historyHeader: {
    marginTop: spacing.xxl,
    marginBottom: spacing.sm,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  historyTitle: {
    ...typography.section,
    color: colors.primary,
  },
  historyCount: {
    ...typography.caption,
    fontFamily: fonts.semibold,
    color: colors.textSecondary,
  },
  historyCard: {
    marginBottom: spacing.sm,
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "center",
  },
  historyIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: colors.sage,
    alignItems: "center",
    justifyContent: "center",
  },
  historyAnimal: {
    fontFamily: fonts.bold,
    color: colors.text,
  },
  historyMeta: {
    ...typography.caption,
    marginTop: 2,
    color: colors.textSecondary,
  },
  historyValue: {
    ...typography.label,
    marginTop: 4,
    color: colors.forest,
  },
});
