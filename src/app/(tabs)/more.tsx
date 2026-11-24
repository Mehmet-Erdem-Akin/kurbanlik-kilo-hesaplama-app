import { Linking, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import {
  BrandHeader,
  Button,
  Card,
  MenuRow,
  ScreenScroll,
} from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { WEB_SITE_URL } from "@/config/env";
import { colors } from "@/theme/colors";

export default function MoreScreen() {
  const { user, loading, logout } = useAuth();

  return (
    <ScreenScroll>
      <BrandHeader />
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
                icon="person-outline"
                onPress={() => router.push("/account")}
              />
              <Button
                label="Paketler"
                icon="cart-outline"
                variant="secondary"
                onPress={() => router.push("/pricing")}
              />
            </View>
          </>
        ) : (
          <View style={styles.actions}>
            <Button
              label="Giriş Yap"
              icon="log-in-outline"
              onPress={() => router.push("/auth/login")}
            />
            <Button
              label="Kayıt Ol"
              icon="person-add-outline"
              variant="secondary"
              onPress={() => router.push("/auth/register")}
            />
            <Button
              label="Paketler"
              icon="pricetag-outline"
              variant="ghost"
              onPress={() => router.push("/pricing")}
            />
          </View>
        )}
      </Card>

      <Card style={styles.card}>
        <MenuRow
          icon="globe-outline"
          title="Web sitesini aç"
          subtitle="kurbanlikkilohesaplama.com"
          onPress={() => Linking.openURL(WEB_SITE_URL)}
        />
        <MenuRow
          icon="mail-outline"
          title="Destek"
          subtitle="Sorularınız için bize yazın"
          onPress={() =>
            Linking.openURL("mailto:mehmet.erdem.akin@outlook.com")
          }
        />
        {user ? (
          <MenuRow
            icon="log-out-outline"
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
  card: {
    marginTop: 16,
    gap: 4,
  },
  name: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
  },
  muted: {
    color: colors.textMuted,
  },
  credits: {
    marginTop: 6,
    marginBottom: 8,
    fontWeight: "700",
    color: colors.primaryDark,
  },
  actions: {
    marginTop: 8,
    gap: 10,
  },
});
