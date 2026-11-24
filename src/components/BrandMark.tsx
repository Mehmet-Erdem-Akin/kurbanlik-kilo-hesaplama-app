import { StyleSheet, Text, View } from "react-native";
import { AppIcon } from "@/components/AppIcon";
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
    <AppIcon
      name="bull-mark"
      size={size}
      accessibilityLabel="Kurban AI logo"
    />
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
