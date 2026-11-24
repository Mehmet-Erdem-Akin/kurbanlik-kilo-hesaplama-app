import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { fetchHistory } from "@/api/history";
import {
  AlertBox,
  BrandHeader,
  Button,
  Card,
  EmptyState,
  LoadingBlock,
  MenuRow,
  ScreenScroll,
} from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { colors } from "@/theme/colors";
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
      <BrandHeader />
      <Text style={styles.pageTitle}>Hesabım</Text>

      <Card style={styles.profileCard}>
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={22} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>
              {user.name} {user.surname}
            </Text>
            <Text style={styles.email}>{user.email}</Text>
            <View style={styles.badge}>
              <Ionicons name="diamond-outline" size={12} color="#8A6A00" />
              <Text style={styles.badgeText}>Üye</Text>
            </View>
          </View>
        </View>

        <View style={styles.creditRow}>
          <View style={styles.creditBox}>
            <Ionicons name="layers-outline" size={18} color={colors.white} />
            <Text style={styles.creditLabel}>Kalan kredi</Text>
            <Text style={styles.creditValue}>{user.remainingCredits}</Text>
          </View>
          <Button
            label="Kredi Satın Al"
            icon="add"
            variant="secondary"
            flex
            onPress={() => router.push("/pricing")}
          />
        </View>
      </Card>

      <Card style={styles.menuCard}>
        <MenuRow
          icon="person-outline"
          title="Profil Bilgileri"
          subtitle="Ad, e-posta ve üyelik bilgileri"
          onPress={() => {}}
        />
        <MenuRow
          icon="pricetags-outline"
          title="Paketler"
          subtitle="Kredi paketlerini incele ve satın al"
          onPress={() => router.push("/pricing")}
        />
        <MenuRow
          icon="help-circle-outline"
          title="Destek"
          subtitle="Sorularınız için bize ulaşın"
          onPress={() => router.push("/more")}
        />
        <MenuRow
          icon="log-out-outline"
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
                <Ionicons name="paw" size={18} color={colors.primary} />
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
        icon="camera-outline"
        onPress={() => router.push("/analyze")}
      />
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
  profileCard: {
    marginTop: 14,
    gap: 14,
  },
  profileRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontWeight: "800",
    fontSize: 18,
    color: colors.text,
  },
  email: {
    marginTop: 2,
    color: colors.textMuted,
    fontSize: 13,
  },
  badge: {
    marginTop: 6,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.goldSoft,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    color: "#8A6A00",
    fontWeight: "700",
    fontSize: 11,
  },
  creditRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  creditBox: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 14,
    gap: 4,
  },
  creditLabel: {
    color: colors.primarySoft,
    fontSize: 12,
  },
  creditValue: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "800",
  },
  menuCard: {
    marginTop: 14,
  },
  historyHeader: {
    marginTop: 20,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.primary,
  },
  historyCount: {
    color: colors.textMuted,
    fontWeight: "600",
  },
  historyCard: {
    marginBottom: 10,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  historyIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  historyAnimal: {
    fontWeight: "800",
    color: colors.text,
  },
  historyMeta: {
    marginTop: 2,
    color: colors.textMuted,
    fontSize: 12,
  },
  historyValue: {
    marginTop: 4,
    color: colors.primaryDark,
    fontWeight: "700",
    fontSize: 13,
  },
});
