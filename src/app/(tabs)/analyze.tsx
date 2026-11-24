import { useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  analyzeImages,
  getAnalyzeErrorMessage,
} from "@/api/analyze";
import { saveHistory } from "@/api/history";
import {
  AlertBox,
  BrandHeader,
  Button,
  Card,
  Chip,
  Field,
  ScreenScroll,
} from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { colors } from "@/theme/colors";
import type { AdditionalInfo, AnalysisResult } from "@/types";
import { formatCurrency, formatNumber } from "@/utils/format";

const categories = [
  { id: "büyükbaş", label: "Büyükbaş", icon: "paw" as const },
  { id: "küçükbaş", label: "Küçükbaş", icon: "rose-outline" as const },
];

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
      ? await ImagePicker.launchCameraAsync({
          quality: 0.7,
          base64: true,
        })
      : await ImagePicker.launchImageLibraryAsync({
          quality: 0.7,
          base64: true,
          allowsMultipleSelection: true,
          selectionLimit: 4 - images.length,
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

  const handleRemoveImage = (index: number) => {
    setImages((current) => current.filter((_, i) => i !== index));
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
        ? {
            analysisType: "multiple" as const,
            images,
            additionalInfo,
          }
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

  const slots = [0, 1, 2, 3];

  return (
    <ScreenScroll>
      <BrandHeader />
      <Text style={styles.pageTitle}>Fotoğrafla AI Analiz</Text>
      <Text style={styles.pageText}>
        Hayvanınızın fotoğraflarını yükleyin; yapay zeka ile tür, kilo ve hisse
        tahminini alın.
      </Text>

      <View style={styles.ctaRow}>
        <Button
          label="Kamera"
          icon="camera-outline"
          flex
          onPress={() => handlePickImages(true)}
        />
        <Button
          label="Galeri"
          icon="images-outline"
          variant="secondary"
          flex
          onPress={() => handlePickImages(false)}
        />
      </View>

      <Text style={styles.slotHint}>
        En fazla 4 fotoğraf ekleyin. Farklı açılar (yan, ön, arka) doğruluğu
        artırır.
      </Text>

      <View style={styles.slotRow}>
        {slots.map((slot) => {
          const image = images[slot];
          return (
            <Pressable
              key={slot}
              onPress={() =>
                image ? handleRemoveImage(slot) : handlePickImages(false)
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
                  <Ionicons name="add" size={22} color={colors.primaryMid} />
                  <Text style={styles.slotLabel}>{slot + 1}. Fotoğraf</Text>
                </>
              )}
            </Pressable>
          );
        })}
      </View>

      <View style={styles.chipRow}>
        {categories.map((category) => (
          <Chip
            key={category.id}
            label={category.label}
            icon={category.icon}
            selected={additionalInfo.animalCategory === category.id}
            onPress={() =>
              setAdditionalInfo((current) => ({
                ...current,
                animalCategory: category.id,
              }))
            }
          />
        ))}
      </View>

      <Field
        label="Tür / cins"
        icon="paw-outline"
        value={additionalInfo.animalType || ""}
        onChangeText={(text) =>
          setAdditionalInfo((current) => ({ ...current, animalType: text }))
        }
        placeholder="Dana, Koç, Keçi..."
      />
      <Field
        label="Tahmini kilo (kg)"
        icon="bag-outline"
        value={additionalInfo.weight || ""}
        onChangeText={(text) =>
          setAdditionalInfo((current) => ({ ...current, weight: text }))
        }
        keyboardType="numeric"
        placeholder="Örn. 420"
      />
      <Field
        label="Bölge"
        icon="location-outline"
        value={additionalInfo.region || ""}
        onChangeText={(text) =>
          setAdditionalInfo((current) => ({ ...current, region: text }))
        }
        placeholder="İl / İlçe"
      />
      <Field
        label="Not"
        icon="document-text-outline"
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
        icon="stats-chart-outline"
        onPress={handleAnalyze}
        loading={isAnalyzing}
        disabled={images.length === 0 || isAnalyzing}
      />
      {images.length === 0 ? (
        <Text style={styles.helper}>Henüz fotoğraf eklenmedi.</Text>
      ) : null}

      {result ? (
        <Card style={styles.resultCard}>
          <View style={styles.successBanner}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={colors.primary}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.successTitle}>Analiz tamamlandı</Text>
              <Text style={styles.successText}>
                Fotoğraflarınız yapay zeka ile başarıyla analiz edildi.
              </Text>
            </View>
          </View>

          <Text style={styles.resultAnimal}>
            Tür: {result.animalType} · {result.breed}
          </Text>

          <View style={styles.metrics}>
            <StatBlock
              label="Canlı kilo"
              value={`${formatNumber(result.estimatedWeight)} kg`}
            />
            <StatBlock
              label="Randıman"
              value={`%${formatNumber(result.meatYield.yieldRatios.karkasYield)}`}
            />
            <StatBlock
              label="Karkas"
              value={`${formatNumber(result.meatYield.karkasWeight)} kg`}
            />
          </View>

          <View style={styles.valueRow}>
            <View style={styles.valueDark}>
              <Text style={styles.valueDarkLabel}>Tahmini karkas değeri</Text>
              <Text style={styles.valueDarkValue}>
                {formatCurrency(result.marketValue)}
              </Text>
            </View>
            <View style={styles.valueLight}>
              <Text style={styles.valueLightLabel}>1/7 hisse</Text>
              <Text style={styles.valueLightValue}>
                {formatCurrency(result.costPerShare)}
              </Text>
            </View>
          </View>

          <Text style={styles.disclaimer}>
            Sonuçlar ön tahmindir. Profesyonel tartım ve veteriner kontrolü
            önerilir. 1 kredi kullanıldı.
          </Text>

          <View style={styles.ctaRow}>
            <Button
              label="Yeni Analiz"
              icon="camera-outline"
              flex
              onPress={() => {
                setResult(null);
                setImages([]);
              }}
            />
            <Button
              label="Hesabım"
              icon="person-outline"
              variant="secondary"
              flex
              onPress={() => router.push("/account")}
            />
          </View>
        </Card>
      ) : null}
    </ScreenScroll>
  );
}

const StatBlock = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.statBlock}>
    <Text style={styles.statBlockLabel}>{label}</Text>
    <Text style={styles.statBlockValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  pageTitle: {
    marginTop: 16,
    fontSize: 28,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: -0.4,
  },
  pageText: {
    marginTop: 8,
    color: colors.textMuted,
    lineHeight: 21,
  },
  ctaRow: {
    marginTop: 16,
    flexDirection: "row",
    gap: 10,
  },
  slotHint: {
    marginTop: 14,
    marginBottom: 10,
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  slotRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  slot: {
    width: "23%",
    aspectRatio: 1,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: colors.primaryMid,
    backgroundColor: colors.primarySoftAlt,
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
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
    marginTop: 4,
    fontSize: 9,
    fontWeight: "700",
    color: colors.primaryMid,
    textAlign: "center",
  },
  chipRow: {
    marginTop: 16,
    marginBottom: 8,
    flexDirection: "row",
    gap: 8,
  },
  loginBanner: {
    marginBottom: 10,
    backgroundColor: colors.primarySoftAlt,
    borderColor: colors.primarySoft,
    gap: 10,
  },
  loginBannerText: {
    color: colors.primaryDark,
    fontWeight: "600",
    lineHeight: 20,
  },
  creditLine: {
    marginBottom: 10,
    fontWeight: "700",
    color: colors.primaryDark,
  },
  helper: {
    marginTop: 8,
    textAlign: "center",
    color: colors.textMuted,
    fontSize: 12,
  },
  resultCard: {
    marginTop: 16,
    gap: 12,
  },
  successBanner: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: colors.primarySoft,
    borderRadius: 14,
    padding: 12,
    alignItems: "flex-start",
  },
  successTitle: {
    fontWeight: "800",
    color: colors.primaryDark,
  },
  successText: {
    marginTop: 2,
    color: colors.primaryDark,
    fontSize: 12,
  },
  resultAnimal: {
    fontWeight: "800",
    color: colors.text,
    fontSize: 16,
  },
  metrics: {
    flexDirection: "row",
    gap: 8,
  },
  statBlock: {
    flex: 1,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 12,
    padding: 10,
  },
  statBlockLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: "600",
  },
  statBlockValue: {
    marginTop: 4,
    fontWeight: "800",
    color: colors.text,
  },
  valueRow: {
    flexDirection: "row",
    gap: 8,
  },
  valueDark: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 14,
    padding: 12,
  },
  valueDarkLabel: {
    color: colors.primarySoft,
    fontSize: 12,
  },
  valueDarkValue: {
    marginTop: 6,
    color: colors.white,
    fontWeight: "800",
    fontSize: 18,
  },
  valueLight: {
    flex: 1,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 14,
    padding: 12,
  },
  valueLightLabel: {
    color: colors.textMuted,
    fontSize: 12,
  },
  valueLightValue: {
    marginTop: 6,
    color: colors.primary,
    fontWeight: "800",
    fontSize: 18,
  },
  disclaimer: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 17,
  },
});
