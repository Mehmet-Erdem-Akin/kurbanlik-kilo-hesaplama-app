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

export default function RegisterScreen() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError("");

    if (!name.trim() || !surname.trim() || !email.trim() || !password) {
      setError("Ad, soyad, e-posta ve şifre zorunludur.");
      return;
    }

    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır.");
      return;
    }

    setSubmitting(true);
    const result = await register({
      name: name.trim(),
      surname: surname.trim(),
      email: email.trim(),
      password,
      phone: phone.trim() || undefined,
      address: address.trim() || undefined,
    });
    setSubmitting(false);

    if (!result.success) {
      setError(result.error ?? "Kayıt başarısız");
      return;
    }

    router.replace("/account");
  };

  return (
    <ScreenScroll>
      <BrandHeader />
      <Text style={styles.pageTitle}>Kayıt Ol</Text>
      <Text style={styles.pageText}>
        Yeni üyelere 3 ücretsiz kredi tanımlanır.
      </Text>

      {error ? <AlertBox message={error} /> : null}

      <Field
        label="Ad"
        icon="person-outline"
        value={name}
        onChangeText={setName}
        placeholder="Adınız"
      />
      <Field
        label="Soyad"
        icon="person-outline"
        value={surname}
        onChangeText={setSurname}
        placeholder="Soyadınız"
      />
      <Field
        label="E-posta"
        icon="mail-outline"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="ornek@email.com"
      />
      <Field
        label="Şifre"
        icon="lock-closed-outline"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="En az 6 karakter"
      />
      <Field
        label="Telefon (opsiyonel)"
        icon="call-outline"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        placeholder="0555 123 45 67"
      />
      <Field
        label="Adres (opsiyonel)"
        icon="location-outline"
        value={address}
        onChangeText={setAddress}
        placeholder="İstanbul / Kadıköy"
      />

      <Button
        label="Hesap Oluştur"
        icon="person-add-outline"
        onPress={handleSubmit}
        loading={submitting}
      />

      <Text style={styles.footer}>
        Zaten hesabınız var mı?{" "}
        <Link href="/auth/login" style={styles.link}>
          Giriş yapın
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
