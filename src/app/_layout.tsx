import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "@/context/AuthContext";
import { colors } from "@/theme/colors";

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.primaryDark,
          headerTitleStyle: { fontWeight: "700", color: colors.text },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="auth/login"
          options={{ title: "Giriş Yap", presentation: "modal" }}
        />
        <Stack.Screen
          name="auth/register"
          options={{ title: "Kayıt Ol", presentation: "modal" }}
        />
        <Stack.Screen name="account" options={{ title: "Hesabım" }} />
        <Stack.Screen name="pricing" options={{ title: "Paketler" }} />
      </Stack>
    </AuthProvider>
  );
}
