import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ApiError } from "@/api/client";
import { createShopierPayment, openShopierCheckout } from "@/api/payments";
import {
  AlertBox,
  BrandHeader,
  Button,
  Card,
  ScreenScroll,
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
        "Ödeme tarayıcıda açıldı. Tamamlandıktan sonra kredileriniz güncellenir.",
      );
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Ödeme başlatılırken bir sorun oluştu.",
      );
    } finally {
      setPurchasingId(null);
    }
  };

  return (
    <ScreenScroll>
      <BrandHeader />
      <Text style={styles.pageTitle}>Kredi Paketleri</Text>
      <Text style={styles.pageText}>
        Yapay zeka analizleri ve detaylı tablolar için kredi kullanın.
      </Text>

      {user ? (
        <Text style={styles.credit}>
          Kalan krediniz: {user.remainingCredits}
        </Text>
      ) : null}

      {error ? <AlertBox message={error} /> : null}
      {info ? <AlertBox message={info} tone="success" /> : null}

      <Card style={styles.welcome}>
        <View style={styles.welcomeRow}>
          <Ionicons name="gift-outline" size={22} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.welcomeTitle}>Hoş geldin</Text>
            <Text style={styles.welcomeText}>
              Kayıt olan kullanıcılara 3 ücretsiz kredi
            </Text>
          </View>
        </View>
      </Card>

      {creditPackages.map((pkg) => (
        <Card
          key={pkg.id}
          style={[styles.packageCard, pkg.featured && styles.featured]}
        >
          {pkg.badge ? (
            <View style={styles.badge}>
              <Ionicons name="diamond" size={12} color={colors.white} />
              <Text style={styles.badgeText}>Önerilen</Text>
            </View>
          ) : null}
          <View style={styles.packageTop}>
            <View style={styles.packageIcon}>
              <Ionicons
                name={
                  pkg.id === "standard"
                    ? "diamond-outline"
                    : "layers-outline"
                }
                size={20}
                color={colors.primary}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.packageName}>{pkg.name}</Text>
              <Text style={styles.credits}>{pkg.creditCount} kredi</Text>
            </View>
            <Text style={styles.price}>
              {pkg.price.toLocaleString("tr-TR")} ₺
            </Text>
          </View>
          <Text style={styles.unit}>{pkg.unitPrice}</Text>
          <View style={styles.features}>
            {pkg.features.slice(0, 3).map((feature) => (
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
            icon="cart-outline"
            onPress={() => handlePurchase(pkg.id)}
            loading={purchasingId === pkg.id}
            disabled={purchasingId !== null}
          />
        </Card>
      ))}

      <View style={styles.usageRow}>
        <Card style={styles.usageCard}>
          <Ionicons name="camera-outline" size={18} color={colors.primary} />
          <Text style={styles.usageTitle}>1 analiz = 1 kredi</Text>
          <Text style={styles.usageText}>Fotoğrafla AI analizi</Text>
        </Card>
        <Card style={styles.usageCard}>
          <Ionicons name="grid-outline" size={18} color={colors.primary} />
          <Text style={styles.usageTitle}>Detaylı tablo = 1 kredi</Text>
          <Text style={styles.usageText}>Randıman senaryoları</Text>
        </Card>
      </View>

      <Text style={styles.secure}>
        Güvenli ödeme · Shopier ile yönlendirme
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
    color: colors.textMuted,
    lineHeight: 21,
  },
  credit: {
    marginTop: 10,
    fontWeight: "700",
    color: colors.primaryDark,
  },
  welcome: {
    marginTop: 14,
    backgroundColor: colors.primarySoftAlt,
    borderColor: colors.primarySoft,
  },
  welcomeRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  welcomeTitle: {
    fontWeight: "800",
    color: colors.primaryDark,
  },
  welcomeText: {
    marginTop: 2,
    color: colors.primaryDark,
  },
  packageCard: {
    marginTop: 12,
    gap: 8,
  },
  featured: {
    borderColor: colors.primary,
    borderWidth: 1.5,
    backgroundColor: "#F4FAF6",
  },
  badge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 11,
  },
  packageTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  packageIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  packageName: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
  },
  credits: {
    color: colors.primaryDark,
    fontWeight: "700",
  },
  price: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.primary,
  },
  unit: {
    color: colors.textMuted,
    fontSize: 12,
  },
  features: {
    gap: 4,
  },
  feature: {
    color: colors.textMuted,
    lineHeight: 18,
  },
  usageRow: {
    marginTop: 14,
    flexDirection: "row",
    gap: 10,
  },
  usageCard: {
    flex: 1,
    gap: 6,
  },
  usageTitle: {
    fontWeight: "800",
    color: colors.text,
    fontSize: 13,
  },
  usageText: {
    color: colors.textMuted,
    fontSize: 12,
  },
  secure: {
    marginTop: 14,
    textAlign: "center",
    color: colors.textMuted,
    fontSize: 12,
  },
});
