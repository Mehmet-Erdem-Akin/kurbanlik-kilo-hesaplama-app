import { Tabs } from "expo-router";
import { AppIcon, type AppIconName } from "@/components/AppIcon";
import { colors, dimensions, fonts } from "@/theme/theme";

const TabGlyph = ({
  name,
  focused,
  size,
}: {
  name: AppIconName;
  focused: boolean;
  size: number;
}) => (
  <AppIcon
    name={name}
    size={size}
    opacity={focused ? 1 : 0.45}
    accessibilityLabel={name}
  />
);

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
          tabBarIcon: ({ focused, size }) => (
            <TabGlyph name="home" focused={focused} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="analyze"
        options={{
          title: "Analiz",
          tabBarIcon: ({ focused, size }) => (
            <TabGlyph name="camera-ai" focused={focused} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="calculator"
        options={{
          title: "Hesapla",
          tabBarIcon: ({ focused, size }) => (
            <TabGlyph name="calculator" focused={focused} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="market"
        options={{
          title: "Piyasa",
          tabBarIcon: ({ focused, size }) => (
            <TabGlyph name="market" focused={focused} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "Daha Fazla",
          tabBarIcon: ({ focused, size }) => (
            <TabGlyph name="more" focused={focused} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
