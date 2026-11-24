import { StyleSheet, View } from "react-native";
import { colors } from "@/theme/colors";

/** Soft farm silhouette band under scroll content (design motif). */
export const FarmFooter = () => (
  <View style={styles.wrap} accessibilityElementsHidden>
    <View style={[styles.hill, styles.hillBack]} />
    <View style={[styles.hill, styles.hillFront]} />
    <View style={styles.barn} />
    <View style={[styles.cow, styles.cowLeft]} />
    <View style={[styles.cow, styles.cowRight]} />
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    height: 72,
    marginTop: 18,
    marginHorizontal: -4,
    overflow: "hidden",
    opacity: 0.35,
  },
  hill: {
    position: "absolute",
    bottom: 0,
    height: 42,
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
    backgroundColor: colors.primarySoft,
  },
  hillBack: {
    left: -20,
    right: 40,
    height: 48,
    backgroundColor: "#D5E4D8",
  },
  hillFront: {
    left: 50,
    right: -30,
  },
  barn: {
    position: "absolute",
    bottom: 18,
    left: "42%",
    width: 28,
    height: 22,
    borderRadius: 4,
    backgroundColor: colors.primaryMid,
  },
  cow: {
    position: "absolute",
    bottom: 14,
    width: 16,
    height: 10,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  cowLeft: {
    left: "28%",
  },
  cowRight: {
    right: "22%",
  },
});
