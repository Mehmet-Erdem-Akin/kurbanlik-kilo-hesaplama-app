import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { colors, fonts, spacing } from "@/theme/theme";

type BrandMarkProps = {
  size?: number;
  showWordmark?: boolean;
};

export const BrandMark = ({
  size = 34,
  showWordmark = true,
}: BrandMarkProps) => (
  <View style={styles.row} accessibilityRole="header">
    <Svg width={size} height={size} viewBox="0 0 64 64" accessibilityLabel="Kurban AI logo">
      <Circle cx="32" cy="32" r="32" fill={colors.primary} />
      <Path
        d="M20 40c2.5-8 7-14 12-14s9.5 6 12 14"
        stroke={colors.card}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <Circle cx="24.5" cy="28" r="2.2" fill={colors.card} />
      <Circle cx="39.5" cy="28" r="2.2" fill={colors.card} />
      <Path
        d="M28 34.5c1.4 1.4 5.6 1.4 7 0"
        stroke={colors.sage}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <Path
        d="M18 22c2-4 5-6 8-5M46 22c-2-4-5-6-8-5"
        stroke={colors.sand}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </Svg>
    {showWordmark ? <Text style={styles.wordmark}>Kurban AI</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  wordmark: {
    fontFamily: fonts.extraBold,
    fontSize: 20,
    color: colors.primary,
    letterSpacing: -0.3,
  },
});
