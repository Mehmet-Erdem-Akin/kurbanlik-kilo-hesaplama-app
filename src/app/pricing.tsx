import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Camera, Gift, Grid2X2, Layers, ShoppingCart, Sparkles } from "lucide-react-native";
import { ApiError } from "@/api/client";
import { createShopierPayment, openShopierCheckout } from "@/api/payments";
import {
  AlertBox,
  BrandMark,
  Button,
  Card,
  ScreenScroll,
} from "@/components/ui";
import {
  creditPackages,
  type CreditPackageId,
} from "@/config/creditPackages";
import { useAuth } from "@/context/AuthContext";
import { colors, fonts, radius, spacing, typography } from "@/theme/theme";

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
      <BrandMark />
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
          <Gift size={22} color={colors.primary} strokeWidth={2.1} />
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
              <Sparkles size={12} color={colors.white} strokeWidth={2.2} />
              <Text style={styles.badgeText}>Önerilen</Text>
            </View>
          ) : null}
          <View style={styles.packageTop}>
            <View style={styles.packageIcon}>
              {pkg.id === "standard" ? (
                <Sparkles size={20} color={colors.primary} strokeWidth={2.1} />
              ) : (
                <Layers size={20} color={colors.primary} strokeWidth={2.1} />
              )}
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
            icon={ShoppingCart}
            onPress={() => handlePurchase(pkg.id)}
            loading={purchasingId === pkg.id}
            disabled={purchasingId !== null}
          />
        </Card>
      ))}

      <View style={styles.usageRow}>
        <Card style={styles.usageCard}>
          <Camera size={18} color={colors.primary} strokeWidth={2.1} />
          <Text style={styles.usageTitle}>1 analiz = 1 kredi</Text>
          <Text style={styles.usageText}>Fotoğrafla AI analizi</Text>
        </Card>
        <Card style={styles.usageCard}>
          <Grid2X2 size={18} color={colors.primary} strokeWidth={2.1} />
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
    ...typography.pageTitle,
    marginTop: spacing.lg,
    color: colors.primary,
  },
  pageText: {
    ...typography.body,
    marginTop: spacing.sm,
    color: colors.textSecondary,
  },
  credit: {
    ...typography.label,
    marginTop: spacing.sm,
    color: colors.forest,
  },
  welcome: {
    marginTop: spacing.lg,
    backgroundColor: colors.sage,
    borderColor: colors.sage,
  },
  welcomeRow: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "center",
  },
  welcomeTitle: {
    fontFamily: fonts.bold,
    color: colors.forest,
  },
  welcomeText: {
    ...typography.body,
    fontSize: 14,
    marginTop: 2,
    color: colors.forest,
  },
  packageCard: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  featured: {
    borderColor: colors.primary,
    borderWidth: 1.5,
    backgroundColor: "#F5FAF6",
  },
  badge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  badgeText: {
    ...typography.caption,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  packageTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  packageIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.sage,
    alignItems: "center",
    justifyContent: "center",
  },
  packageName: {
    ...typography.cardTitle,
    color: colors.text,
  },
  credits: {
    ...typography.label,
    color: colors.forest,
  },
  price: {
    fontFamily: fonts.extraBold,
    fontSize: 24,
    color: colors.primary,
  },
  unit: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  features: {
    gap: 4,
  },
  feature: {
    ...typography.body,
    fontSize: 14,
    color: colors.textSecondary,
  },
  usageRow: {
    marginTop: spacing.lg,
    flexDirection: "row",
    gap: spacing.sm,
  },
  usageCard: {
    flex: 1,
    gap: spacing.xs,
  },
  usageTitle: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.text,
  },
  usageText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  secure: {
    ...typography.caption,
    marginTop: spacing.lg,
    textAlign: "center",
    color: colors.textSecondary,
  },
});
