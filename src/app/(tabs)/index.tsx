import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  BrandHeader,
  Button,
  Card,
  IconTile,
  ScreenScroll,
} from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { colors } from "@/theme/colors";

export default function HomeScreen() {
  const { user, loading } = useAuth();

  return (
    <ScreenScroll>
      <BrandHeader />

      <View style={styles.hero}>
        <View style={styles.heroCopy}>
          <Text style={styles.heroTitle}>Kurbanlık Kilo ve Hisse Hesabı</Text>
          <Text style={styles.heroText}>
            Fotoğraf yükleyerek AI analizi yapın veya manuel veri girerek karkas
            ve hisse maliyetini hesaplayın.
          </Text>
        </View>
        <View style={styles.heroBadge}>
          <Ionicons name="leaf" size={28} color={colors.primary} />
        </View>
      </View>

      <View style={styles.ctaRow}>
        <Button
          label="Analiz Başlat"
          icon="camera-outline"
          flex
          onPress={() => router.push("/analyze")}
        />
        <Button
          label="Manuel Hesapla"
          icon="calculator-outline"
          variant="secondary"
          flex
          onPress={() => router.push("/calculator")}
        />
      </View>

      <Card style={styles.guestCard}>
        {!loading && user ? (
          <>
            <View style={styles.guestRow}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={18} color={colors.primary} />
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
          </>
        ) : (
          <View style={styles.guestRow}>
            <View style={styles.avatar}>
              <Ionicons name="person-outline" size={18} color={colors.primary} />
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
          icon="camera-outline"
          title="AI Analiz"
          text="Fotoğrafla kilo ve hisse tahmini"
          onPress={() => router.push("/analyze")}
        />
        <IconTile
          icon="calculator-outline"
          title="Manuel"
          text="Canlı kilo ile anlık hesap"
          onPress={() => router.push("/calculator")}
        />
        <IconTile
          icon="bar-chart-outline"
          title="Piyasa"
          text="Güncel fiyat referansları"
          onPress={() => router.push("/market")}
        />
      </View>

      <Text style={styles.sectionTitle}>Neden Kurban AI?</Text>
      <View style={styles.whyRow}>
        {[
          {
            icon: "flash-outline" as const,
            title: "Hızlı sonuç",
            text: "Saniyeler içinde tahmin",
          },
          {
            icon: "layers-outline" as const,
            title: "Karkas & hisse",
            text: "Canlı kilodan randıman",
          },
          {
            icon: "shield-checkmark-outline" as const,
            title: "Güvenilir rehber",
            text: "Güncel referanslarla",
          },
        ].map((item) => (
          <Card key={item.title} style={styles.whyCard}>
            <View style={styles.whyIcon}>
              <Ionicons name={item.icon} size={18} color={colors.primary} />
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
    marginTop: 18,
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  heroCopy: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: -0.6,
    lineHeight: 36,
  },
  heroText: {
    marginTop: 10,
    color: colors.textMuted,
    lineHeight: 21,
    fontSize: 14,
  },
  heroBadge: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaRow: {
    marginTop: 18,
    flexDirection: "row",
    gap: 10,
  },
  guestCard: {
    marginTop: 14,
  },
  guestRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  guestTitle: {
    fontWeight: "800",
    color: colors.text,
  },
  guestText: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textMuted,
  },
  guestActions: {
    gap: 4,
    alignItems: "flex-end",
  },
  trustBar: {
    marginTop: 12,
    borderRadius: 14,
    backgroundColor: colors.primarySoftAlt,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 6,
  },
  trustItem: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primaryDark,
  },
  trustDot: {
    color: colors.primaryMid,
  },
  sectionTitle: {
    marginTop: 22,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "800",
    color: colors.primary,
  },
  featureRow: {
    flexDirection: "row",
    gap: 8,
  },
  whyRow: {
    flexDirection: "row",
    gap: 8,
  },
  whyCard: {
    flex: 1,
    gap: 6,
    padding: 12,
  },
  whyIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  whyTitle: {
    fontWeight: "800",
    fontSize: 13,
    color: colors.text,
  },
  whyText: {
    fontSize: 11,
    color: colors.textMuted,
    lineHeight: 15,
  },
});
