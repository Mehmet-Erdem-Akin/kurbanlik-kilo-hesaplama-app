import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/colors";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Sayfa bulunamadı" }} />
      <View style={styles.container}>
        <Text style={styles.title}>Bu ekran yok</Text>
        <Link href="/" style={styles.link}>
          Ana sayfaya dön
        </Link>
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
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
  },
  link: {
    marginTop: 14,
    color: colors.primary,
    fontWeight: "700",
  },
});
