import { Stack, router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { BrandMark, Button } from "@/components/ui";
import { colors, spacing, typography } from "@/theme/theme";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Sayfa bulunamadı" }} />
      <View style={styles.container}>
        <BrandMark />
        <Text style={styles.title}>Bu ekran yok</Text>
        <Text style={styles.text}>
          Aradığınız sayfa bulunamadı veya taşınmış olabilir.
        </Text>
        <Button label="Ana sayfaya dön" onPress={() => router.replace("/")} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    padding: spacing.xl,
    gap: spacing.md,
  },
  title: {
    ...typography.section,
    color: colors.primary,
  },
  text: {
    ...typography.body,
    textAlign: "center",
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
});
