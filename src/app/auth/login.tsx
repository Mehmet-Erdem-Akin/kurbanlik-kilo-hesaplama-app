import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Link, router } from "expo-router";
import { LogIn } from "lucide-react-native";
import {
  AlertBox,
  BrandMark,
  Button,
  Card,
  ScreenScroll,
  TextField,
} from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { colors, fonts, spacing, typography } from "@/theme/theme";

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email.trim() || !password) {
      setError("E-posta ve şifre gerekli.");
      return;
    }

    setLoading(true);
    setError("");
    const result = await login(email.trim(), password);
    setLoading(false);

    if (!result.success) {
      setError(result.error ?? "Giriş yapılamadı. Bilgilerinizi kontrol edin.");
      return;
    }

    router.replace("/account");
  };

  return (
    <ScreenScroll>
      <BrandMark />
      <Text style={styles.pageTitle}>Giriş Yap</Text>
      <Text style={styles.pageText}>
        Hesabınıza giriş yaparak analizlerinize ve kredilerinize erişin.
      </Text>

      <Card style={styles.card}>
        {error ? <AlertBox message={error} /> : null}
        <TextField
          label="E-posta"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          placeholder="ornek@mail.com"
        />
        <TextField
          label="Şifre"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="password"
          placeholder="••••••••"
        />
        <Button
          label="Giriş Yap"
          icon={LogIn}
          onPress={handleSubmit}
          loading={loading}
        />
      </Card>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Hesabınız yok mu?</Text>
        <Link href="/auth/register" style={styles.link}>
          Kayıt Ol
        </Link>
      </View>
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
    marginBottom: spacing.lg,
    color: colors.textSecondary,
  },
  card: {
    gap: spacing.md,
  },
  footer: {
    marginTop: spacing.xl,
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.xs,
  },
  footerText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  link: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.primary,
  },
});
