// Kurban AI — design tokens (Premium AgriTech)
export const colors = {
  forest: "#053D26",
  primary: "#075E3D",
  freshGreen: "#218447",
  sage: "#DFEAD2",
  background: "#F7F3EA",
  sand: "#DCC49B",
  card: "#FFFDFA",
  softSurface: "#F0F3E8",
  border: "#E4DFD3",
  text: "#17231D",
  textSecondary: "#59635E",
  disabled: "#A6B0A8",
  success: "#258446",
  warning: "#C58B32",
  error: "#D64545",
  info: "#467A9E",
  white: "#FFFFFF",
} as const;

export const gradients = {
  primary: ["#117647", "#03432A"] as const,
  result: ["#087044", "#033C26"] as const,
  background: ["#FFFDFA", "#F1EBDD"] as const,
  soft: ["#F1F6E9", "#DDEACD"] as const,
} as const;

export const fonts = {
  regular: "Manrope_400Regular",
  medium: "Manrope_500Medium",
  semibold: "Manrope_600SemiBold",
  bold: "Manrope_700Bold",
  extraBold: "Manrope_800ExtraBold",
} as const;

export const typography = {
  hero: { fontFamily: fonts.extraBold, fontSize: 32, lineHeight: 38 },
  pageTitle: { fontFamily: fonts.extraBold, fontSize: 28, lineHeight: 34 },
  section: { fontFamily: fonts.bold, fontSize: 22, lineHeight: 28 },
  cardTitle: { fontFamily: fonts.bold, fontSize: 18, lineHeight: 24 },
  result: { fontFamily: fonts.extraBold, fontSize: 40, lineHeight: 48 },
  body: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 22 },
  button: { fontFamily: fonts.bold, fontSize: 16, lineHeight: 22 },
  label: { fontFamily: fonts.semibold, fontSize: 13, lineHeight: 18 },
  caption: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 17 },
  tab: { fontFamily: fonts.semibold, fontSize: 11, lineHeight: 15 },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radius = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  pill: 999,
} as const;

export const dimensions = {
  screenPadding: 20,
  buttonHeight: 56,
  inputHeight: 56,
  icon: 24,
  iconTile: 48,
  tabBar: 68,
} as const;

export const shadows = {
  card: {
    shadowColor: "#053D26",
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  soft: {
    shadowColor: "#053D26",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
} as const;

/** @deprecated Prefer importing from `@/theme/theme` */
export default {
  colors,
  gradients,
  fonts,
  typography,
  spacing,
  radius,
  dimensions,
  shadows,
};
