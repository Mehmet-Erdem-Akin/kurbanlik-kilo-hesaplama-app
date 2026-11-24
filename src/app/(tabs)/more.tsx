import { Linking, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Button, Card, ScreenScroll, Subtitle, Title } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { WEB_SITE_URL } from "@/config/env";
import { colors } from "@/theme/colors";

export default function MoreScreen() {
  const { user, loading, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <ScreenScroll>
      <Title>Daha Fazla</Title>
      <Subtitle>Hesap, paketler ve web sitesi bağlantıları.</Subtitle>

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
              <Button label="Hesabım" onPress={() => router.push("/account")} />
              <Button
                label="Paketler"
                variant="secondary"
                onPress={() => router.push("/pricing")}
              />
              <Button
                label="Çıkış Yap"
                variant="danger"
                onPress={handleLogout}
              />
            </View>
          </>
        ) : (
          <View style={styles.actions}>
            <Button
              label="Giriş Yap"
              onPress={() => router.push("/auth/login")}
            />
            <Button
              label="Kayıt Ol"
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
        <Text style={styles.sectionTitle}>Web & destek</Text>
        <Button
          label="Web sitesini aç"
          variant="secondary"
          onPress={() => Linking.openURL(WEB_SITE_URL)}
        />
        <Button
          label="İletişim (e-posta)"
          variant="ghost"
          onPress={() =>
            Linking.openURL("mailto:mehmet.erdem.akin@outlook.com")
          }
        />
      </Card>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    gap: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
  },
  muted: {
    color: colors.textMuted,
  },
  credits: {
    marginTop: 4,
    fontWeight: "700",
    color: colors.primaryDark,
  },
  actions: {
    marginTop: 8,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
});
