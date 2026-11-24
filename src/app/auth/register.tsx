import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Link, router } from "expo-router";
import { UserPlus } from "lucide-react-native";
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

export default function RegisterScreen() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!name.trim() || !surname.trim() || !email.trim() || !password) {
      setError("Tüm alanları doldurun.");
      return;
    }
    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalı.");
      return;
    }

    setLoading(true);
    setError("");
    const result = await register({
      name: name.trim(),
      surname: surname.trim(),
      email: email.trim(),
      password,
    });
    setLoading(false);

    if (!result.success) {
      setError(
        result.error ?? "Kayıt tamamlanamadı. Bilgilerinizi kontrol edin.",
      );
      return;
    }

    router.replace("/account");
  };

  return (
    <ScreenScroll>
      <BrandMark />
      <Text style={styles.pageTitle}>Kayıt Ol</Text>
      <Text style={styles.pageText}>
        Ücretsiz hesap oluşturun ve 3 hoş geldin kredisi kazanın.
      </Text>

      <Card style={styles.card}>
        {error ? <AlertBox message={error} /> : null}
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <TextField
              label="Ad"
              value={name}
              onChangeText={setName}
              autoComplete="given-name"
              placeholder="Adınız"
            />
          </View>
          <View style={{ flex: 1 }}>
            <TextField
              label="Soyad"
              value={surname}
              onChangeText={setSurname}
              autoComplete="family-name"
              placeholder="Soyadınız"
            />
          </View>
        </View>
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
          autoComplete="new-password"
          placeholder="En az 6 karakter"
        />
        <Button
          label="Kayıt Ol"
          icon={UserPlus}
          onPress={handleSubmit}
          loading={loading}
        />
      </Card>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Zaten hesabınız var mı?</Text>
        <Link href="/auth/login" style={styles.link}>
          Giriş Yap
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
  row: {
    flexDirection: "row",
    gap: spacing.sm,
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
