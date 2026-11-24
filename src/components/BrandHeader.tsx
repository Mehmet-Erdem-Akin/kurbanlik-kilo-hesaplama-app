import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";

export const BrandHeader = ({
  compact = false,
}: {
  compact?: boolean;
}) => (
  <View style={[styles.row, compact && styles.compact]}>
    <View style={styles.logo}>
      <Ionicons name="paw" size={compact ? 16 : 18} color={colors.white} />
    </View>
    <Text style={[styles.brand, compact && styles.brandCompact]}>Kurban AI</Text>
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  compact: {
    gap: 8,
  },
  logo: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  brand: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: -0.3,
  },
  brandCompact: {
    fontSize: 17,
  },
});
