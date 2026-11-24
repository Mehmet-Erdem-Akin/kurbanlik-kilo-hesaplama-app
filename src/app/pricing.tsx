import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { ApiError } from "@/api/client";
import { createShopierPayment, openShopierCheckout } from "@/api/payments";
import {
  AlertBox,
  Button,
  Card,
  ScreenScroll,
  Subtitle,
  Title,
} from "@/components/ui";
import {
  creditPackages,
  type CreditPackageId,
} from "@/config/creditPackages";
import { useAuth } from "@/context/AuthContext";
import { colors } from "@/theme/colors";

export default function PricingScreen() {
  const { user } = useAuth();
  const [purchasingId, setPurchasingId] = useState<CreditPackageId | null>(
    null,
  );
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const handlePurchase = async (packageId: CreditPackageId) => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    setPurchasingId(packageId);
    setError("");
    setInfo("");

    try {
      const data = await createShopierPayment(packageId);
      if (!data.success || !data.paymentUrl || !data.fields) {
        setError(data.error ?? "Ödeme başlatılamadı.");
        return;
      }

      await openShopierCheckout(data.paymentUrl, data.fields);
      setInfo(
        "Ödeme tarayıcıda açıldı. Tamamlandıktan sonra hesabınızdaki krediler güncellenir.",
      );
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Ödeme başlatılırken bir sorun oluştu.");
      }
    } finally {
      setPurchasingId(null);
    }
  };

  return (
    <ScreenScroll>
      <Title>Paketler</Title>
      <Subtitle>
        Web ile aynı kredi paketleri. Ödeme Shopier üzerinden alınır.
      </Subtitle>

      {user ? (
        <Text style={styles.credit}>
          Kalan krediniz: {user.remainingCredits}
        </Text>
      ) : null}

      {error ? <AlertBox message={error} /> : null}
      {info ? <AlertBox message={info} tone="success" /> : null}

      <Card style={styles.welcome}>
        <Text style={styles.welcomeTitle}>Hoş Geldin Paketi</Text>
        <Text style={styles.welcomeText}>
          Yeni kayıtlara 3 ücretsiz kredi. Fotoğraf analizi ve manuel hesapta
          ortak kullanılır.
        </Text>
      </Card>

      {creditPackages.map((pkg) => (
        <Card
          key={pkg.id}
          style={[styles.packageCard, pkg.featured && styles.featured]}
        >
          {pkg.badge ? <Text style={styles.badge}>{pkg.badge}</Text> : null}
          <Text style={styles.packageName}>{pkg.name}</Text>
          <Text style={styles.price}>{pkg.price.toLocaleString("tr-TR")} TL</Text>
          <Text style={styles.credits}>{pkg.creditCount} kredi</Text>
          <Text style={styles.unit}>{pkg.unitPrice}</Text>
          <View style={styles.features}>
            {pkg.features.map((feature) => (
              <Text key={feature} style={styles.feature}>
                ✓ {feature}
              </Text>
            ))}
          </View>
          <Button
            label={
              !user
                ? "Giriş Yap ve Satın Al"
                : purchasingId === pkg.id
                  ? "Yönlendiriliyor..."
                  : "Satın Al"
            }
            onPress={() => handlePurchase(pkg.id)}
            loading={purchasingId === pkg.id}
            disabled={purchasingId !== null}
          />
        </Card>
      ))}
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  credit: {
    marginTop: 10,
    fontWeight: "700",
    color: colors.primaryDark,
  },
  welcome: {
    marginTop: 14,
    backgroundColor: colors.primarySoft,
    borderColor: "#A7F3D0",
  },
  welcomeTitle: {
    fontWeight: "700",
    color: colors.primaryDark,
    fontSize: 16,
  },
  welcomeText: {
    marginTop: 6,
    color: colors.primaryDark,
    lineHeight: 20,
  },
  packageCard: {
    marginTop: 14,
    gap: 6,
  },
  featured: {
    borderColor: colors.primary,
    backgroundColor: "#F0FDF4",
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: colors.primary,
    overflow: "hidden",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 11,
    fontWeight: "700",
    color: colors.white,
  },
  packageName: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
  },
  price: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.text,
  },
  credits: {
    fontWeight: "700",
    color: colors.primaryDark,
  },
  unit: {
    color: colors.textMuted,
    fontSize: 12,
  },
  features: {
    marginVertical: 8,
    gap: 4,
  },
  feature: {
    color: colors.textMuted,
    lineHeight: 20,
  },
});
