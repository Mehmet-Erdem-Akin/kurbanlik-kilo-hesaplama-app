import { Tabs } from "expo-router";
import { Text, type ColorValue } from "react-native";
import { colors } from "@/theme/colors";

const TabLabel = ({
  label,
  color,
}: {
  label: string;
  color: ColorValue;
}) => (
  <Text
    style={{
      color: (color as string | null) ?? colors.tabInactive,
      fontSize: 16,
      fontWeight: "700",
    }}
  >
    {label}
  </Text>
);

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: "700" },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Ana Sayfa",
          tabBarIcon: ({ color }) => <TabLabel label="⌂" color={color} />,
        }}
      />
      <Tabs.Screen
        name="analyze"
        options={{
          title: "Analiz",
          tabBarIcon: ({ color }) => <TabLabel label="◉" color={color} />,
        }}
      />
      <Tabs.Screen
        name="calculator"
        options={{
          title: "Hesapla",
          tabBarIcon: ({ color }) => <TabLabel label="∑" color={color} />,
        }}
      />
      <Tabs.Screen
        name="market"
        options={{
          title: "Piyasa",
          tabBarIcon: ({ color }) => <TabLabel label="₺" color={color} />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "Daha Fazla",
          tabBarIcon: ({ color }) => <TabLabel label="⋯" color={color} />,
        }}
      />
    </Tabs>
  );
}
