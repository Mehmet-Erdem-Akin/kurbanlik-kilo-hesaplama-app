import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { fetchHistory } from "@/api/history";
import {
  AlertBox,
  Button,
  Card,
  EmptyState,
  LoadingBlock,
  ScreenScroll,
  Stat,
  Subtitle,
  Title,
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
    if (!loading && !user) {
      router.replace("/auth/login");
    }
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

  const memberSince = new Date(user.createdAt).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <ScreenScroll>
      <Title>Hesabım</Title>
      <Subtitle>
        Hoş geldiniz, {user.name}! Web ile ortak hesap ve kredi bakiyeniz.
      </Subtitle>

      <View style={styles.statsRow}>
        <Stat label="Kredi" value={String(user.remainingCredits)} />
        <Stat label="Analiz" value={String(analyses.length)} />
      </View>

      <Card style={styles.card}>
        <Text style={styles.label}>Ad Soyad</Text>
        <Text style={styles.value}>
          {user.name} {user.surname}
        </Text>
        <Text style={styles.label}>E-posta</Text>
        <Text style={styles.value}>{user.email}</Text>
        <Text style={styles.label}>Üyelik</Text>
        <Text style={styles.value}>{memberSince}</Text>
      </Card>

      <View style={styles.actions}>
        <Button label="Yeni Analiz" onPress={() => router.push("/analyze")} />
        <Button
          label="Paket Satın Al"
          variant="secondary"
          onPress={() => router.push("/pricing")}
        />
        <Button
          label="Çıkış Yap"
          variant="danger"
          onPress={async () => {
            await logout();
            router.replace("/auth/login");
          }}
        />
      </View>

      <Text style={styles.section}>Geçmiş analizler</Text>
      {error ? <AlertBox message={error} /> : null}
      {historyLoading ? (
        <LoadingBlock label="Geçmiş yükleniyor..." />
      ) : analyses.length === 0 ? (
        <EmptyState
          title="Henüz analiz yok"
          description="İlk fotoğraf analizinizi yaparak geçmişinizi oluşturun."
        />
      ) : (
        analyses.map((item) => {
          const weight = Number(item.estimatedWeight || 0);
          const value = Number(item.marketValue || item.estimatedCost || 0);
          const dateValue =
            item.createdAt || item.analysisDate || item.date || "";

          return (
            <Card key={item.id} style={styles.historyCard}>
              <Text style={styles.historyTitle}>
                {String(item.animalType || "Analiz")}
              </Text>
              <Text style={styles.historyMeta}>
                {dateValue ? formatDate(String(dateValue)) : "—"}
              </Text>
              <Text style={styles.historyMeta}>
                {weight ? `${weight} kg` : "—"} ·{" "}
                {value ? formatCurrency(value) : "—"}
              </Text>
            </Card>
          );
        })
      )}
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    marginTop: 16,
    flexDirection: "row",
    gap: 10,
  },
  card: {
    marginTop: 14,
    gap: 4,
  },
  label: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "700",
    color: colors.textMuted,
    textTransform: "uppercase",
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  actions: {
    marginTop: 14,
    gap: 10,
  },
  section: {
    marginTop: 22,
    marginBottom: 8,
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  historyCard: {
    marginBottom: 10,
  },
  historyTitle: {
    fontWeight: "700",
    color: colors.text,
    fontSize: 16,
  },
  historyMeta: {
    marginTop: 4,
    color: colors.textMuted,
  },
});
