import { useState } from "react";
import { StyleSheet, Text } from "react-native";
import { Link, router } from "expo-router";
import {
  AlertBox,
  BrandHeader,
  Button,
  Field,
  ScreenScroll,
} from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { colors } from "@/theme/colors";

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!email.trim() || !password) {
      setError("E-posta ve şifre gerekli.");
      return;
    }

    setSubmitting(true);
    const result = await login(email.trim(), password);
    setSubmitting(false);

    if (!result.success) {
      setError(result.error ?? "Giriş başarısız");
      return;
    }

    router.replace("/account");
  };

  return (
    <ScreenScroll>
      <BrandHeader />
      <Text style={styles.pageTitle}>Giriş Yap</Text>
      <Text style={styles.pageText}>
        Web hesabınızla aynı e-posta ve şifreyi kullanın.
      </Text>

      {error ? <AlertBox message={error} /> : null}

      <Field
        label="E-posta"
        icon="mail-outline"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
        placeholder="ornek@email.com"
      />
      <Field
        label="Şifre"
        icon="lock-closed-outline"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="password"
        placeholder="••••••••"
      />

      <Button
        label="Giriş Yap"
        icon="log-in-outline"
        onPress={handleSubmit}
        loading={submitting}
      />

      <Text style={styles.footer}>
        Hesabınız yok mu?{" "}
        <Link href="/auth/register" style={styles.link}>
          Kayıt olun
        </Link>
      </Text>
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
    marginBottom: 14,
    color: colors.textMuted,
    lineHeight: 21,
  },
  footer: {
    marginTop: 18,
    textAlign: "center",
    color: colors.textMuted,
  },
  link: {
    color: colors.primary,
    fontWeight: "700",
  },
});
