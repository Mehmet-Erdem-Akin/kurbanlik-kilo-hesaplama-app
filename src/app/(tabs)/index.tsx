import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import {
  BarChart3,
  Calculator,
  Camera,
  Leaf,
  ShieldCheck,
  Zap,
} from "lucide-react-native";
import {
  BrandMark,
  Button,
  Card,
  IconTile,
  ScreenScroll,
} from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import {
  colors,
  fonts,
  radius,
  shadows,
  spacing,
  typography,
} from "@/theme/theme";

export default function HomeScreen() {
  const { user, loading } = useAuth();

  return (
    <ScreenScroll>
      <BrandMark />

      <View style={styles.hero}>
        <View style={styles.heroCopy}>
          <Text style={styles.heroTitle}>Kurbanlık Kilo ve Hisse Hesabı</Text>
          <Text style={styles.heroText}>
            Fotoğraf yükleyerek AI analizi yapın veya manuel veri girerek karkas
            ve hisse maliyetini hesaplayın.
          </Text>
        </View>
        <View style={styles.heroMedia}>
          <Image
            source={require("../../../assets/images/heroes/cow-hero.jpg")}
            style={styles.heroImage}
            contentFit="cover"
            transition={200}
            accessibilityLabel="Kurbanlık büyükbaş görseli"
          />
          <LinearGradient
            colors={["rgba(247,243,234,0)", "rgba(247,243,234,0.92)"]}
            style={styles.heroFade}
          />
        </View>
      </View>

      <View style={styles.ctaRow}>
        <Button
          label="Analiz Başlat"
          icon={Camera}
          flex
          onPress={() => router.push("/analyze")}
        />
        <Button
          label="Manuel Hesapla"
          icon={Calculator}
          variant="secondary"
          flex
          onPress={() => router.push("/calculator")}
        />
      </View>

      <Card style={styles.guestCard}>
        {!loading && user ? (
          <View style={styles.guestRow}>
            <View style={styles.avatar}>
              <Leaf size={18} color={colors.primary} strokeWidth={2.2} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.guestTitle}>
                {user.name} {user.surname}
              </Text>
              <Text style={styles.guestText}>
                Kalan kredi: {user.remainingCredits}
              </Text>
            </View>
            <Button
              label="Hesabım"
              variant="sage"
              onPress={() => router.push("/account")}
            />
          </View>
        ) : (
          <View style={styles.guestRow}>
            <View style={styles.avatar}>
              <Leaf size={18} color={colors.primary} strokeWidth={2.2} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.guestTitle}>Misafir kullanıcı</Text>
              <Text style={styles.guestText}>
                Hesapsız temel özellikleri kullanabilirsiniz.
              </Text>
            </View>
            <View style={styles.guestActions}>
              <Button
                label="Giriş"
                variant="ghost"
                onPress={() => router.push("/auth/login")}
              />
              <Button
                label="Kayıt Ol"
                variant="sage"
                onPress={() => router.push("/auth/register")}
              />
            </View>
          </View>
        )}
      </Card>

      <View style={styles.trustBar}>
        <Text style={styles.trustItem}>Web ile ortak backend</Text>
        <Text style={styles.trustDot}>·</Text>
        <Text style={styles.trustItem}>Güvenli giriş</Text>
        <Text style={styles.trustDot}>·</Text>
        <Text style={styles.trustItem}>Kredi sistemi</Text>
      </View>

      <Text style={styles.sectionTitle}>Ana hizmetler</Text>
      <View style={styles.featureRow}>
        <IconTile
          icon={Camera}
          title="AI Analiz"
          text="Fotoğrafla kilo ve hisse tahmini"
          onPress={() => router.push("/analyze")}
        />
        <IconTile
          icon={Calculator}
          title="Manuel"
          text="Canlı kilo ile anlık hesap"
          onPress={() => router.push("/calculator")}
        />
        <IconTile
          icon={BarChart3}
          title="Piyasa"
          text="Güncel fiyat referansları"
          onPress={() => router.push("/market")}
        />
      </View>

      <Text style={styles.sectionTitle}>Neden Kurban AI?</Text>
      <View style={styles.whyRow}>
        {[
          {
            icon: Zap,
            title: "Hızlı sonuç",
            text: "Saniyeler içinde tahmin",
          },
          {
            icon: Leaf,
            title: "Karkas & hisse",
            text: "Canlı kilodan randıman",
          },
          {
            icon: ShieldCheck,
            title: "Güvenilir rehber",
            text: "Güncel referanslarla",
          },
        ].map((item) => (
          <Card key={item.title} style={styles.whyCard}>
            <View style={styles.whyIcon}>
              <item.icon size={18} color={colors.primary} strokeWidth={2.1} />
            </View>
            <Text style={styles.whyTitle}>{item.title}</Text>
            <Text style={styles.whyText}>{item.text}</Text>
          </Card>
        ))}
      </View>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  hero: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  heroCopy: {
    gap: spacing.sm,
  },
  heroTitle: {
    ...typography.hero,
    color: colors.primary,
  },
  heroText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  heroMedia: {
    height: 160,
    borderRadius: radius.xl,
    overflow: "hidden",
    ...shadows.soft,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroFade: {
    ...StyleSheet.absoluteFill,
  },
  ctaRow: {
    marginTop: spacing.xl,
    flexDirection: "row",
    gap: spacing.sm,
  },
  guestCard: {
    marginTop: spacing.lg,
  },
  guestRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.sage,
    alignItems: "center",
    justifyContent: "center",
  },
  guestTitle: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.text,
  },
  guestText: {
    ...typography.caption,
    marginTop: 2,
    color: colors.textSecondary,
  },
  guestActions: {
    gap: spacing.xs,
    alignItems: "flex-end",
  },
  trustBar: {
    marginTop: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.sage,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: spacing.xs,
  },
  trustItem: {
    ...typography.caption,
    fontFamily: fonts.semibold,
    color: colors.forest,
  },
  trustDot: {
    color: colors.freshGreen,
  },
  sectionTitle: {
    ...typography.section,
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
    color: colors.primary,
  },
  featureRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  whyRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  whyCard: {
    flex: 1,
    gap: spacing.sm,
    padding: spacing.md,
  },
  whyIcon: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    backgroundColor: colors.sage,
    alignItems: "center",
    justifyContent: "center",
  },
  whyTitle: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.text,
  },
  whyText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
