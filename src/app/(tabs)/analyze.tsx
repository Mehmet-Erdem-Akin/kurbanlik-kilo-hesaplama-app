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
import {
  analyzeImages,
  getAnalyzeErrorMessage,
} from "@/api/analyze";
import { saveHistory } from "@/api/history";
import {
  AlertBox,
  Button,
  Card,
  Chip,
  Field,
  ScreenScroll,
  SectionLabel,
  Stat,
  Subtitle,
  Title,
} from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { colors } from "@/theme/colors";
import type { AdditionalInfo, AnalysisResult } from "@/types";
import { formatCurrency, formatNumber } from "@/utils/format";

const categories = [
  { id: "büyükbaş", label: "Büyükbaş" },
  { id: "küçükbaş", label: "Küçükbaş" },
] as const;

export default function AnalyzeScreen() {
  const { user, loading: authLoading, setUser } = useAuth();
  const [images, setImages] = useState<string[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfo>({});
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
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setError("Galeri izni gerekli.");
        return;
      }
    }

    const picked = fromCamera
      ? await ImagePicker.launchCameraAsync({
          quality: 0.7,
          base64: true,
          allowsEditing: false,
        })
      : await ImagePicker.launchImageLibraryAsync({
          quality: 0.7,
          base64: true,
          allowsMultipleSelection: true,
          selectionLimit: 4,
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
      if (response.status === 401) {
        router.push("/auth/login");
      }
      setIsAnalyzing(false);
      return;
    }

    setResult(response.data);
    if (response.data.user) {
      setUser(response.data.user);
    }

    try {
      await saveHistory({
        animalType: response.data.animalType,
        estimatedWeight: response.data.estimatedWeight,
        marketValue: response.data.marketValue,
        analysisDate: response.data.analysisDate,
        confidence: response.data.confidence,
      });
    } catch {
      // History is best-effort; analysis already succeeded.
    }

    setIsAnalyzing(false);
  };

  return (
    <ScreenScroll>
      <Title>AI Analiz</Title>
      <Subtitle>
        Aynı hayvana ait 1–4 fotoğraf ekleyin. Web ile ortak Gemini analiz API’si
        kullanılır.
      </Subtitle>

      {!authLoading && !user ? (
        <AlertBox
          tone="warning"
          message="Analiz için giriş yapın. Yeni üyelere 3 ücretsiz kredi verilir."
        />
      ) : null}

      {user ? (
        <Text style={styles.creditLine}>
          Kalan kredi: {user.remainingCredits}
        </Text>
      ) : null}

      <View style={styles.actions}>
        <Button
          label="Kamera"
          onPress={() => handlePickImages(true)}
          accessibilityLabel="Kameradan fotoğraf çek"
        />
        <Button
          label="Galeriden Seç"
          variant="secondary"
          onPress={() => handlePickImages(false)}
        />
      </View>

      {images.length > 0 ? (
        <View style={styles.imageRow}>
          {images.map((image, index) => (
            <Pressable
              key={`${index}-${image.slice(0, 24)}`}
              onPress={() => handleRemoveImage(index)}
              accessibilityLabel={`Fotoğraf ${index + 1}, silmek için dokunun`}
              accessibilityRole="button"
            >
              <Image source={{ uri: image }} style={styles.thumb} />
              <Text style={styles.removeHint}>Sil</Text>
            </Pressable>
          ))}
        </View>
      ) : (
        <Card>
          <Text style={styles.hint}>
            Henüz fotoğraf yok. Farklı açılardan net çekimler ekleyin.
          </Text>
        </Card>
      )}

      <SectionLabel>Ek bilgiler (opsiyonel)</SectionLabel>
      <View style={styles.chipRow}>
        {categories.map((category) => (
          <Chip
            key={category.id}
            label={category.label}
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
        value={additionalInfo.animalType || ""}
        onChangeText={(text) =>
          setAdditionalInfo((current) => ({ ...current, animalType: text }))
        }
        placeholder="Dana, Koç, Keçi..."
      />
      <Field
        label="Tahmini ağırlık (kg)"
        value={additionalInfo.weight || ""}
        onChangeText={(text) =>
          setAdditionalInfo((current) => ({ ...current, weight: text }))
        }
        keyboardType="numeric"
        placeholder="Örn. 420"
      />
      <Field
        label="Bölge"
        value={additionalInfo.region || ""}
        onChangeText={(text) =>
          setAdditionalInfo((current) => ({ ...current, region: text }))
        }
        placeholder="İstanbul, Ankara..."
      />
      <Field
        label="Özel not"
        value={additionalInfo.specialNotes || ""}
        onChangeText={(text) =>
          setAdditionalInfo((current) => ({ ...current, specialNotes: text }))
        }
        placeholder="Ek gözlemleriniz"
        multiline
      />

      {error ? <AlertBox message={error} /> : null}

      <Button
        label={isAnalyzing ? "Analiz ediliyor..." : "Analizi Başlat"}
        onPress={handleAnalyze}
        loading={isAnalyzing}
        disabled={images.length === 0 || isAnalyzing}
      />

      {result ? (
        <Card style={styles.resultCard}>
          <Text style={styles.resultTitle}>
            {result.animalType} · {result.breed}
          </Text>
          <Text style={styles.resultMeta}>
            Güven: %{formatNumber(result.confidence)} ·{" "}
            {result.analysisNote || "Tek fotoğraf analizi"}
          </Text>

          <View style={styles.statsRow}>
            <Stat
              label="Canlı kilo"
              value={`${formatNumber(result.estimatedWeight)} kg`}
            />
            <Stat
              label="Pazar değeri"
              value={formatCurrency(result.marketValue)}
            />
          </View>
          <View style={styles.statsRow}>
            <Stat
              label="Karkas"
              value={`${formatNumber(result.meatYield.karkasWeight)} kg`}
            />
            <Stat
              label="1 hisse"
              value={formatCurrency(result.costPerShare)}
            />
          </View>

          <Text style={styles.recoTitle}>Öneriler</Text>
          {result.recommendations.map((item) => (
            <Text key={item} style={styles.recoItem}>
              • {item}
            </Text>
          ))}
        </Card>
      ) : null}
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  creditLine: {
    marginTop: 10,
    marginBottom: 8,
    fontWeight: "700",
    color: colors.primaryDark,
  },
  actions: {
    marginTop: 14,
    gap: 10,
  },
  imageRow: {
    marginTop: 14,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  thumb: {
    width: 84,
    height: 84,
    borderRadius: 14,
    backgroundColor: colors.surfaceMuted,
  },
  removeHint: {
    marginTop: 4,
    textAlign: "center",
    fontSize: 11,
    color: colors.danger,
    fontWeight: "600",
  },
  hint: {
    color: colors.textMuted,
    lineHeight: 20,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  resultCard: {
    marginTop: 16,
    gap: 10,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
  },
  resultMeta: {
    color: colors.textMuted,
    fontSize: 13,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
  recoTitle: {
    marginTop: 6,
    fontWeight: "700",
    color: colors.text,
  },
  recoItem: {
    color: colors.textMuted,
    lineHeight: 20,
  },
});
