import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import type { ColorValue } from "react-native";
import { colors } from "@/theme/colors";

const toIconColor = (color: ColorValue) =>
  (color as string | null) ?? colors.tabInactive;

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.borderSoft,
          height: 64,
          paddingTop: 6,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Ana Sayfa",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="home-outline"
              size={size}
              color={toIconColor(color)}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="analyze"
        options={{
          title: "Analiz",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "camera" : "camera-outline"}
              size={size}
              color={toIconColor(color)}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="calculator"
        options={{
          title: "Hesapla",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="calculator-outline"
              size={size}
              color={toIconColor(color)}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="market"
        options={{
          title: "Piyasa",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="bar-chart-outline"
              size={size}
              color={toIconColor(color)}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "Daha Fazla",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="ellipsis-horizontal"
              size={size}
              color={toIconColor(color)}
            />
          ),
        }}
      />
    </Tabs>
  );
}
