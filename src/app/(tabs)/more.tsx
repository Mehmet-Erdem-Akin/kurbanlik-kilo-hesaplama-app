import { Linking, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Globe, LogIn, UserPlus } from "lucide-react-native";
import {
  BrandMark,
  Button,
  Card,
  MenuRow,
  ScreenScroll,
} from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { WEB_SITE_URL } from "@/config/env";
import { colors, fonts, spacing, typography } from "@/theme/theme";

export default function MoreScreen() {
  const { user, loading, logout } = useAuth();

  return (
    <ScreenScroll>
      <BrandMark />
      <Text style={styles.pageTitle}>Daha Fazla</Text>
      <Text style={styles.pageText}>
        Hesap, paketler ve destek bağlantıları.
      </Text>

      <Card style={styles.card}>
        {loading ? (
          <Text style={styles.muted}>Oturum kontrol ediliyor...</Text>
        ) : user ? (
          <>
            <Text style={styles.name}>
              {user.name} {user.surname}
            </Text>
            <Text style={styles.muted}>{user.email}</Text>
            <Text style={styles.credits}>
              Kalan kredi: {user.remainingCredits}
            </Text>
            <View style={styles.actions}>
              <Button
                label="Hesabım"
                onPress={() => router.push("/account")}
              />
              <Button
                label="Paketler"
                variant="secondary"
                onPress={() => router.push("/pricing")}
              />
            </View>
          </>
        ) : (
          <View style={styles.actions}>
            <Button
              label="Giriş Yap"
              icon={LogIn}
              onPress={() => router.push("/auth/login")}
            />
            <Button
              label="Kayıt Ol"
              icon={UserPlus}
              variant="secondary"
              onPress={() => router.push("/auth/register")}
            />
            <Button
              label="Paketler"
              variant="ghost"
              onPress={() => router.push("/pricing")}
            />
          </View>
        )}
      </Card>

      <Card style={styles.card}>
        <MenuRow
          iconName="profile"
          title="Hesabım"
          subtitle="Profil ve kredi bilginiz"
          onPress={() =>
            user ? router.push("/account") : router.push("/auth/login")
          }
        />
        <MenuRow
          iconName="package"
          title="Kredi paketleri"
          subtitle="Analiz kredisi satın alın"
          onPress={() => router.push("/pricing")}
        />
        <MenuRow
          icon={Globe}
          title="Web sitesini aç"
          subtitle="kurbanlikkilohesaplama.com"
          onPress={() => Linking.openURL(WEB_SITE_URL)}
        />
        <MenuRow
          iconName="support"
          title="Destek"
          subtitle="Sorularınız için bize yazın"
          onPress={() =>
            Linking.openURL("mailto:mehmet.erdem.akin@outlook.com")
          }
        />
        {user ? (
          <MenuRow
            iconName="logout"
            title="Çıkış Yap"
            subtitle="Hesabınızdan güvenli çıkış"
            danger
            onPress={async () => {
              await logout();
            }}
          />
        ) : null}
      </Card>
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
  card: {
    marginTop: spacing.lg,
    gap: spacing.xs,
  },
  name: {
    fontFamily: fonts.extraBold,
    fontSize: 20,
    color: colors.text,
  },
  muted: {
    ...typography.body,
    color: colors.textSecondary,
  },
  credits: {
    ...typography.label,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
    color: colors.forest,
  },
  actions: {
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
});
