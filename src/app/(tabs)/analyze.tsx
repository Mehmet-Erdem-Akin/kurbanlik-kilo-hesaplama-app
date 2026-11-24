import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { Camera, User } from "lucide-react-native";
import {
  analyzeImages,
  getAnalyzeErrorMessage,
} from "@/api/analyze";
import { saveHistory } from "@/api/history";
import {
  AlertBox,
  AppIcon,
  BrandMark,
  Button,
  Card,
  Chip,
  Field,
  ResultBanner,
  ScreenScroll,
  SuccessState,
} from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import {
  colors,
  fonts,
  radius,
  spacing,
  typography,
} from "@/theme/theme";
import type { AdditionalInfo, AnalysisResult } from "@/types";
import { formatCurrency, formatNumber } from "@/utils/format";

export default function AnalyzeScreen() {
  const { user, setUser } = useAuth();
  const [images, setImages] = useState<string[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfo>({
    animalCategory: "büyükbaş",
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handlePickImages = async (fromCamera: boolean) => {
    setError(null);
    if (fromCamera) {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        setError("Kamera izni gerekli.");
        return;
      }
    } else {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setError("Galeri izni gerekli.");
        return;
      }
    }

    const picked = fromCamera
      ? await ImagePicker.launchCameraAsync({ quality: 0.7, base64: true })
      : await ImagePicker.launchImageLibraryAsync({
          quality: 0.7,
          base64: true,
          allowsMultipleSelection: true,
          selectionLimit: Math.max(1, 4 - images.length),
        });

    if (picked.canceled) return;

    const nextImages = picked.assets
      .filter((asset) => asset.base64)
      .map((asset) => `data:image/jpeg;base64,${asset.base64}`);

    if (nextImages.length === 0) {
      setError("Fotoğraf okunamadı. Tekrar deneyin.");
      return;
    }

    setImages((current) => [...current, ...nextImages].slice(0, 4));
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (images.length === 0) {
      setError("Önce en az bir fotoğraf ekleyin.");
      return;
    }
    if (!user) {
      setError("Analiz için giriş yapmanız gerekiyor.");
      return;
    }
    if (user.remainingCredits <= 0) {
      setError("Kredi hakkınız kalmadı.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    const payload =
      images.length > 1
        ? { analysisType: "multiple" as const, images, additionalInfo }
        : {
            image: images[0],
            imageIndex: 1,
            totalImages: 1,
            additionalInfo,
          };

    const response = await analyzeImages(payload);
    if (!response.ok) {
      setError(
        getAnalyzeErrorMessage(response.errorType, response.detectedType) ||
          response.message,
      );
      if (response.status === 401) router.push("/auth/login");
      setIsAnalyzing(false);
      return;
    }

    setResult(response.data);
    if (response.data.user) setUser(response.data.user);

    try {
      await saveHistory({
        animalType: response.data.animalType,
        estimatedWeight: response.data.estimatedWeight,
        marketValue: response.data.marketValue,
        analysisDate: response.data.analysisDate,
        confidence: response.data.confidence,
      });
    } catch {
      // best-effort
    }

    setIsAnalyzing(false);
  };

  return (
    <ScreenScroll>
      <BrandMark />
      <Text style={styles.pageTitle}>Fotoğrafla AI Analiz</Text>
      <Text style={styles.pageText}>
        Hayvanınızın fotoğraflarını yükleyin; yapay zeka ile tür, kilo ve hisse
        tahminini alın.
      </Text>

      <View style={styles.ctaRow}>
        <Button
          label="Kamera"
          icon={Camera}
          flex
          onPress={() => handlePickImages(true)}
        />
        <Button
          label="Galeri"
          variant="secondary"
          flex
          onPress={() => handlePickImages(false)}
        />
      </View>
      <Text style={styles.slotHint}>
        En fazla 4 fotoğraf ekleyin. Farklı açılar doğruluğu artırır.
      </Text>

      <View style={styles.slotRow}>
        {[0, 1, 2, 3].map((slot) => {
          const image = images[slot];
          return (
            <Pressable
              key={slot}
              onPress={() =>
                image
                  ? setImages((current) =>
                      current.filter((_, index) => index !== slot),
                    )
                  : handlePickImages(false)
              }
              style={[styles.slot, image && styles.slotFilled]}
              accessibilityLabel={
                image
                  ? `Fotoğraf ${slot + 1}, silmek için dokunun`
                  : `${slot + 1}. fotoğraf ekle`
              }
            >
              {image ? (
                <Image source={{ uri: image }} style={styles.slotImage} />
              ) : (
                <>
                  <AppIcon name="photo-add" size={28} />
                  <Text style={styles.slotLabel}>{slot + 1}. Fotoğraf</Text>
                </>
              )}
            </Pressable>
          );
        })}
      </View>

      <View style={styles.chipRow}>
        <Chip
          label="Büyükbaş"
          iconName="cattle"
          selected={additionalInfo.animalCategory === "büyükbaş"}
          onPress={() =>
            setAdditionalInfo((current) => ({
              ...current,
              animalCategory: "büyükbaş",
            }))
          }
        />
        <Chip
          label="Küçükbaş"
          iconName="sheep"
          selected={additionalInfo.animalCategory === "küçükbaş"}
          onPress={() =>
            setAdditionalInfo((current) => ({
              ...current,
              animalCategory: "küçükbaş",
            }))
          }
        />
      </View>

      <Field
        label="Tür / cins"
        iconName="cattle"
        value={additionalInfo.animalType || ""}
        onChangeText={(text) =>
          setAdditionalInfo((current) => ({ ...current, animalType: text }))
        }
        placeholder="Dana, Koç, Keçi..."
      />
      <Field
        label="Tahmini kilo (kg)"
        iconName="weight"
        value={additionalInfo.weight || ""}
        onChangeText={(text) =>
          setAdditionalInfo((current) => ({ ...current, weight: text }))
        }
        keyboardType="numeric"
        placeholder="Örn. 420"
      />
      <Field
        label="Bölge"
        iconName="location"
        value={additionalInfo.region || ""}
        onChangeText={(text) =>
          setAdditionalInfo((current) => ({ ...current, region: text }))
        }
        placeholder="İl / İlçe"
      />
      <Field
        label="Not"
        iconName="report"
        value={additionalInfo.specialNotes || ""}
        onChangeText={(text) =>
          setAdditionalInfo((current) => ({ ...current, specialNotes: text }))
        }
        placeholder="Opsiyonel"
      />

      {!user ? (
        <Card style={styles.loginBanner}>
          <Text style={styles.loginBannerText}>
            Giriş yaparak 3 ücretsiz kredi kazanın. 1 analiz = 1 kredi.
          </Text>
          <Button
            label="Giriş Yap"
            variant="sage"
            onPress={() => router.push("/auth/login")}
          />
        </Card>
      ) : (
        <Text style={styles.creditLine}>
          Kalan kredi: {user.remainingCredits}
        </Text>
      )}

      {error ? <AlertBox message={error} /> : null}

      <Button
        label={isAnalyzing ? "Analiz ediliyor..." : "Analizi Başlat"}
        icon={Camera}
        onPress={handleAnalyze}
        loading={isAnalyzing}
        disabled={images.length === 0 || isAnalyzing}
      />
      {images.length === 0 ? (
        <Text style={styles.helper}>Henüz fotoğraf eklenmedi.</Text>
      ) : null}

      {result ? (
        <View style={styles.resultCard}>
          <SuccessState
            title="Analiz tamamlandı"
            description="Fotoğraflarınız yapay zeka ile başarıyla analiz edildi."
          />

          <Text style={styles.resultAnimal}>
            Tür: {result.animalType} · {result.breed}
          </Text>

          <ResultBanner>
            <Text style={styles.bannerLabel}>Tahmini canlı kilo</Text>
            <Text style={styles.bannerValue}>
              {formatNumber(Number(result.estimatedWeight))} kg
            </Text>
            <View style={styles.bannerGrid}>
              <MiniStat
                label="Karkas değeri"
                value={formatCurrency(Number(result.marketValue))}
                light
              />
              <MiniStat
                label="1/7 hisse"
                value={formatCurrency(Number(result.costPerShare))}
                light
              />
              <MiniStat
                label="Karkas"
                value={`${formatNumber(result.meatYield.karkasWeight)} kg`}
                light
              />
              <MiniStat
                label="Randıman"
                value={`%${formatNumber(result.meatYield.yieldRatios.karkasYield)}`}
                light
              />
            </View>
          </ResultBanner>

          <Text style={styles.disclaimer}>
            Sonuçlar ön tahmindir. Profesyonel tartım ve veteriner kontrolü
            önerilir. 1 kredi kullanıldı.
          </Text>

          <View style={styles.ctaRow}>
            <Button
              label="Yeni Analiz"
              icon={Camera}
              flex
              onPress={() => {
                setResult(null);
                setImages([]);
              }}
            />
            <Button
              label="Hesabım"
              icon={User}
              variant="secondary"
              flex
              onPress={() => router.push("/account")}
            />
          </View>
        </View>
      ) : null}
    </ScreenScroll>
  );
}

const MiniStat = ({
  label,
  value,
  light,
}: {
  label: string;
  value: string;
  light?: boolean;
}) => (
  <View style={[styles.statBlock, light && styles.statBlockLight]}>
    <Text style={[styles.statBlockLabel, light && styles.statBlockLabelLight]}>
      {label}
    </Text>
    <Text style={[styles.statBlockValue, light && styles.statBlockValueLight]}>
      {value}
    </Text>
  </View>
);

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
  ctaRow: {
    marginTop: spacing.lg,
    flexDirection: "row",
    gap: spacing.sm,
  },
  slotHint: {
    ...typography.caption,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    color: colors.textSecondary,
  },
  slotRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  slot: {
    width: "23%",
    aspectRatio: 1,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: colors.freshGreen,
    backgroundColor: colors.sage,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xs,
  },
  slotFilled: {
    borderStyle: "solid",
    padding: 0,
    overflow: "hidden",
  },
  slotImage: {
    width: "100%",
    height: "100%",
  },
  slotLabel: {
    ...typography.caption,
    marginTop: 4,
    fontSize: 9,
    fontFamily: fonts.bold,
    color: colors.freshGreen,
    textAlign: "center",
  },
  chipRow: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    flexDirection: "row",
    gap: spacing.sm,
  },
  loginBanner: {
    marginBottom: spacing.sm,
    backgroundColor: colors.sage,
    borderColor: colors.sage,
    gap: spacing.sm,
  },
  loginBannerText: {
    ...typography.body,
    fontSize: 14,
    color: colors.forest,
  },
  creditLine: {
    ...typography.label,
    marginBottom: spacing.sm,
    color: colors.forest,
  },
  helper: {
    ...typography.caption,
    marginTop: spacing.sm,
    textAlign: "center",
    color: colors.textSecondary,
  },
  resultCard: {
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  resultAnimal: {
    ...typography.cardTitle,
    color: colors.text,
  },
  bannerLabel: {
    ...typography.label,
    color: colors.sage,
  },
  bannerValue: {
    ...typography.result,
    color: colors.white,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  bannerGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  statBlock: {
    flexGrow: 1,
    flexBasis: "45%",
    backgroundColor: colors.softSurface,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  statBlockLight: {
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  statBlockLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  statBlockLabelLight: {
    color: colors.sage,
  },
  statBlockValue: {
    marginTop: 4,
    fontFamily: fonts.extraBold,
    fontSize: 16,
    color: colors.text,
  },
  statBlockValueLight: {
    color: colors.white,
  },
  disclaimer: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
