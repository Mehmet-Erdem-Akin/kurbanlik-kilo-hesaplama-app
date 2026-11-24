import { Link, router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Button,
  Card,
  Pill,
  ScreenScroll,
  Subtitle,
  Title,
} from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { colors } from "@/theme/colors";

const features = [
  {
    title: "AI Fotoğraf Analizi",
    text: "Kameradan veya galeriden çekilen fotoğraflarla kilo, randıman ve değer tahmini.",
  },
  {
    title: "Manuel Hisse Hesabı",
    text: "Canlı kilo ve et fiyatıyla 1/7 hisse maliyetini anında görün.",
  },
  {
    title: "Ortak Backend",
    text: "Web ile aynı API: hesap, kredi, analiz ve ödeme altyapısı paylaşılır.",
  },
];

export default function HomeScreen() {
  const { user, loading } = useAuth();

  return (
    <ScreenScroll>
      <LinearGradient
        colors={["#ECFDF5", "#F7F4EF", "#EEF2FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <Pill>Kurban AI · Mobil</Pill>
        <Text style={styles.brand}>Kurbanlık Kilo</Text>
        <Title>Akıllı kurbanlık analizi cebinizde</Title>
        <Subtitle>
          Fotoğraf çekin, kilo ve hisse fiyatını öğrenin. iOS ve Android için Expo
          ile web backend&apos;ine bağlı.
        </Subtitle>

        <View style={styles.heroActions}>
          <Button
            label="Analiz Başlat"
            onPress={() => router.push("/analyze")}
            accessibilityLabel="Analiz başlat"
          />
          <Button
            label="Manuel Hesapla"
            variant="secondary"
            onPress={() => router.push("/calculator")}
          />
        </View>

        {!loading && user ? (
          <Text style={styles.creditHint}>
            Merhaba {user.name} · Kalan kredi: {user.remainingCredits}
          </Text>
        ) : (
          <View style={styles.authRow}>
            <Link href="/auth/login" style={styles.link}>
              Giriş yap
            </Link>
            <Text style={styles.dot}>·</Text>
            <Link href="/auth/register" style={styles.link}>
              Ücretsiz kayıt (3 kredi)
            </Link>
          </View>
        )}
      </LinearGradient>

      <View style={styles.section}>
        {features.map((feature) => (
          <Card key={feature.title} style={styles.featureCard}>
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureText}>{feature.text}</Text>
          </Card>
        ))}
      </View>

      <Card style={styles.ctaCard}>
        <Text style={styles.featureTitle}>Nasıl çalışır?</Text>
        <Text style={styles.featureText}>
          1) Giriş yapın · 2) Fotoğraf ekleyin veya kilo girin · 3) Sonuçları ve
          hisse fiyatını görün.
        </Text>
        <Button
          label="Paketleri Gör"
          variant="secondary"
          onPress={() => router.push("/pricing")}
        />
      </Card>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  brand: {
    marginTop: 14,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.2,
    color: colors.primaryDark,
  },
  heroActions: {
    marginTop: 20,
    gap: 10,
  },
  creditHint: {
    marginTop: 14,
    color: colors.primaryDark,
    fontWeight: "600",
  },
  authRow: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
  },
  link: {
    color: colors.primary,
    fontWeight: "700",
  },
  dot: {
    color: colors.textSoft,
  },
  section: {
    marginTop: 18,
    gap: 12,
  },
  featureCard: {
    gap: 6,
  },
  featureTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
  },
  featureText: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.textMuted,
  },
  ctaCard: {
    marginTop: 12,
    gap: 12,
  },
});
