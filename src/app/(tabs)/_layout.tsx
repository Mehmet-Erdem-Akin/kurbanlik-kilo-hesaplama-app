import { Tabs } from "expo-router";
import {
  BarChart3,
  Calculator,
  Camera,
  Ellipsis,
  Home,
} from "lucide-react-native";
import type { ColorValue } from "react-native";
import { colors, dimensions, fonts } from "@/theme/theme";

const toColor = (color: ColorValue) =>
  (color as string | null) ?? colors.disabled;

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.disabled,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          height: dimensions.tabBar,
          paddingTop: 8,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.semibold,
          fontSize: 11,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Ana Sayfa",
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={toColor(color)} strokeWidth={2.1} />
          ),
        }}
      />
      <Tabs.Screen
        name="analyze"
        options={{
          title: "Analiz",
          tabBarIcon: ({ color, size }) => (
            <Camera size={size} color={toColor(color)} strokeWidth={2.1} />
          ),
        }}
      />
      <Tabs.Screen
        name="calculator"
        options={{
          title: "Hesapla",
          tabBarIcon: ({ color, size }) => (
            <Calculator size={size} color={toColor(color)} strokeWidth={2.1} />
          ),
        }}
      />
      <Tabs.Screen
        name="market"
        options={{
          title: "Piyasa",
          tabBarIcon: ({ color, size }) => (
            <BarChart3 size={size} color={toColor(color)} strokeWidth={2.1} />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "Daha Fazla",
          tabBarIcon: ({ color, size }) => (
            <Ellipsis size={size} color={toColor(color)} strokeWidth={2.1} />
          ),
        }}
      />
    </Tabs>
  );
}
