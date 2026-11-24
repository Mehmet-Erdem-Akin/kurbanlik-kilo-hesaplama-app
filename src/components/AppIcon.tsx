import { Image } from "expo-image";
import type { ImageStyle, StyleProp } from "react-native";
import {
  BarChart3,
  Calculator,
  Camera,
  Coins,
  Ellipsis,
  Gift,
  Home,
  ImagePlus,
  Images,
  Lock,
  MapPin,
  Package,
  PawPrint,
  Sparkles,
  type LucideIcon,
} from "lucide-react-native";
import { colors } from "@/theme/theme";

export type AppIconName =
  | "bull-mark"
  | "cattle"
  | "sheep"
  | "goat"
  | "home"
  | "camera-ai"
  | "calculator"
  | "market"
  | "more"
  | "gallery"
  | "photo-add"
  | "weight"
  | "coins"
  | "yield"
  | "share-pie"
  | "measure"
  | "location"
  | "report"
  | "profile"
  | "gift"
  | "package"
  | "crown"
  | "lock"
  | "shield-check"
  | "support"
  | "logout"
  | "sparkles"
  | "refresh";

const pngSources: Record<AppIconName, number> = {
  "bull-mark": require("../../assets/images/icons/png-256/bull-mark.png"),
  cattle: require("../../assets/images/icons/png-256/cattle.png"),
  sheep: require("../../assets/images/icons/png-256/sheep.png"),
  goat: require("../../assets/images/icons/png-256/goat.png"),
  home: require("../../assets/images/icons/png-256/home.png"),
  "camera-ai": require("../../assets/images/icons/png-256/camera-ai.png"),
  calculator: require("../../assets/images/icons/png-256/calculator.png"),
  market: require("../../assets/images/icons/png-256/market.png"),
  more: require("../../assets/images/icons/png-256/more.png"),
  gallery: require("../../assets/images/icons/png-256/gallery.png"),
  "photo-add": require("../../assets/images/icons/png-256/photo-add.png"),
  weight: require("../../assets/images/icons/png-256/weight.png"),
  coins: require("../../assets/images/icons/png-256/coins.png"),
  yield: require("../../assets/images/icons/png-256/yield.png"),
  "share-pie": require("../../assets/images/icons/png-256/share-pie.png"),
  measure: require("../../assets/images/icons/png-256/measure.png"),
  location: require("../../assets/images/icons/png-256/location.png"),
  report: require("../../assets/images/icons/png-256/report.png"),
  profile: require("../../assets/images/icons/png-256/profile.png"),
  gift: require("../../assets/images/icons/png-256/gift.png"),
  package: require("../../assets/images/icons/png-256/package.png"),
  crown: require("../../assets/images/icons/png-256/crown.png"),
  lock: require("../../assets/images/icons/png-256/lock.png"),
  "shield-check": require("../../assets/images/icons/png-256/shield-check.png"),
  support: require("../../assets/images/icons/png-256/support.png"),
  logout: require("../../assets/images/icons/png-256/logout.png"),
  sparkles: require("../../assets/images/icons/png-256/sparkles.png"),
  refresh: require("../../assets/images/icons/png-256/refresh.png"),
};

/** Outline Lucide fallbacks when tintable icons are required (e.g. tab inactive). */
const lucideFallbacks: Record<AppIconName, LucideIcon> = {
  home: Home,
  "camera-ai": Camera,
  calculator: Calculator,
  market: BarChart3,
  more: Ellipsis,
  gallery: Images,
  "photo-add": ImagePlus,
  cattle: PawPrint,
  sheep: PawPrint,
  goat: PawPrint,
  "bull-mark": PawPrint,
  location: MapPin,
  gift: Gift,
  package: Package,
  coins: Coins,
  crown: Sparkles,
  lock: Lock,
  sparkles: Sparkles,
  weight: Calculator,
  yield: Package,
  "share-pie": Package,
  measure: Calculator,
  report: Package,
  profile: Home,
  support: Gift,
  logout: Lock,
  refresh: Sparkles,
  "shield-check": Sparkles,
};

type AppIconProps = {
  name: AppIconName;
  size?: number;
  color?: string;
  /** Force Lucide outline (for tintable tab bar). */
  outline?: boolean;
  opacity?: number;
  style?: StyleProp<ImageStyle>;
  accessibilityLabel?: string;
};

export const AppIcon = ({
  name,
  size = 24,
  color = colors.primary,
  outline = false,
  opacity = 1,
  style,
  accessibilityLabel,
}: AppIconProps) => {
  if (!outline) {
    return (
      <Image
        source={pngSources[name]}
        style={[{ width: size, height: size, opacity }, style]}
        contentFit="contain"
        accessibilityLabel={accessibilityLabel || name}
      />
    );
  }

  const Fallback = lucideFallbacks[name];
  return (
    <Fallback
      size={size}
      color={color}
      strokeWidth={2.1}
      opacity={opacity}
      accessibilityLabel={accessibilityLabel || name}
    />
  );
};

export const hasCustomIcon = (name: AppIconName) => Boolean(pngSources[name]);
