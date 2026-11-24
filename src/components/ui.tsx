import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
  type ViewProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { BrandHeader } from "@/components/BrandHeader";
import { FarmFooter } from "@/components/FarmFooter";

export { BrandHeader, FarmFooter };

export const Screen = ({
  children,
  style,
  ...props
}: ViewProps & { children: React.ReactNode }) => (
  <View style={[styles.screen, style]} {...props}>
    {children}
  </View>
);

export const ScreenScroll = ({
  children,
  contentStyle,
  refreshControl,
  showFarmFooter = true,
}: {
  children: React.ReactNode;
  contentStyle?: object;
  refreshControl?: React.ReactElement;
  showFarmFooter?: boolean;
}) => (
  <ScrollView
    style={styles.screen}
    contentContainerStyle={[styles.scrollContent, contentStyle]}
    keyboardShouldPersistTaps="handled"
    showsVerticalScrollIndicator={false}
    refreshControl={refreshControl}
  >
    {children}
    {showFarmFooter ? <FarmFooter /> : null}
  </ScrollView>
);

export const Title = ({ children }: { children: React.ReactNode }) => (
  <Text style={styles.title}>{children}</Text>
);

export const Subtitle = ({ children }: { children: React.ReactNode }) => (
  <Text style={styles.subtitle}>{children}</Text>
);

export const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <Text style={styles.sectionLabel}>{children}</Text>
);

export const Card = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: object;
}) => <View style={[styles.card, style]}>{children}</View>;

export const Pill = ({
  children,
  tone = "sage",
}: {
  children: React.ReactNode;
  tone?: "sage" | "primary" | "gold";
}) => (
  <View
    style={[
      styles.pill,
      tone === "primary" && styles.pillPrimary,
      tone === "gold" && styles.pillGold,
    ]}
  >
    <Text
      style={[
        styles.pillText,
        tone === "primary" && styles.pillTextPrimary,
        tone === "gold" && styles.pillTextGold,
      ]}
    >
      {children}
    </Text>
  </View>
);

export const Button = ({
  label,
  onPress,
  variant = "primary",
  disabled,
  loading,
  accessibilityLabel,
  icon,
  flex,
}: {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger" | "ghost" | "sage";
  disabled?: boolean;
  loading?: boolean;
  accessibilityLabel?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  flex?: boolean;
}) => {
  const isDisabled = disabled || loading;
  const iconColor =
    variant === "secondary" || variant === "ghost" || variant === "sage"
      ? colors.primary
      : colors.white;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        flex && styles.buttonFlex,
        variant === "primary" && styles.buttonPrimary,
        variant === "secondary" && styles.buttonSecondary,
        variant === "danger" && styles.buttonDanger,
        variant === "ghost" && styles.buttonGhost,
        variant === "sage" && styles.buttonSage,
        pressed && !isDisabled && styles.buttonPressed,
        isDisabled && styles.buttonDisabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={iconColor} />
      ) : (
        <View style={styles.buttonInner}>
          {icon ? <Ionicons name={icon} size={18} color={iconColor} /> : null}
          <Text
            style={[
              styles.buttonLabel,
              (variant === "secondary" ||
                variant === "ghost" ||
                variant === "sage") &&
                styles.buttonLabelSecondary,
            ]}
          >
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
};

export const Field = ({
  label,
  error,
  icon,
  ...props
}: TextInputProps & {
  label: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}) => (
  <View style={styles.field}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <View style={[styles.inputWrap, error ? styles.inputError : null]}>
      {icon ? (
        <Ionicons
          name={icon}
          size={18}
          color={colors.textMuted}
          style={styles.inputIcon}
        />
      ) : null}
      <TextInput
        placeholderTextColor={colors.textSoft}
        style={styles.input}
        accessibilityLabel={label}
        {...props}
      />
    </View>
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
);

export const AlertBox = ({
  message,
  tone = "danger",
}: {
  message: string;
  tone?: "danger" | "success" | "warning" | "info";
}) => (
  <View
    style={[
      styles.alert,
      tone === "success" && styles.alertSuccess,
      tone === "warning" && styles.alertWarning,
      tone === "info" && styles.alertInfo,
    ]}
    accessibilityRole="alert"
  >
    <Text
      style={[
        styles.alertText,
        tone === "success" && styles.alertTextSuccess,
        tone === "warning" && styles.alertTextWarning,
        tone === "info" && styles.alertTextInfo,
      ]}
    >
      {message}
    </Text>
  </View>
);

export const EmptyState = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <View style={styles.empty}>
    <Text style={styles.emptyTitle}>{title}</Text>
    <Text style={styles.emptyDescription}>{description}</Text>
  </View>
);

export const LoadingBlock = ({
  label = "Yükleniyor...",
}: {
  label?: string;
}) => (
  <View style={styles.loading}>
    <ActivityIndicator color={colors.primary} size="large" />
    <Text style={styles.loadingText}>{label}</Text>
  </View>
);

export const Stat = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <View style={styles.stat}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

export const Chip = ({
  label,
  selected,
  onPress,
  icon,
}: {
  label: string;
  selected?: boolean;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}) => (
  <Pressable
    accessibilityRole="button"
    accessibilityState={{ selected: !!selected }}
    accessibilityLabel={label}
    onPress={onPress}
    style={[styles.chip, selected && styles.chipSelected]}
  >
    {icon ? (
      <Ionicons
        name={icon}
        size={16}
        color={selected ? colors.white : colors.primary}
      />
    ) : null}
    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
      {label}
    </Text>
  </Pressable>
);

export const IconTile = ({
  icon,
  title,
  text,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  text: string;
  onPress?: () => void;
}) => (
  <Pressable
    onPress={onPress}
    disabled={!onPress}
    accessibilityRole={onPress ? "button" : undefined}
    style={styles.iconTile}
  >
    <View style={styles.iconTileIcon}>
      <Ionicons name={icon} size={22} color={colors.primary} />
    </View>
    <Text style={styles.iconTileTitle}>{title}</Text>
    <Text style={styles.iconTileText}>{text}</Text>
  </Pressable>
);

export const MenuRow = ({
  icon,
  title,
  subtitle,
  onPress,
  danger,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
  danger?: boolean;
}) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={title}
    style={styles.menuRow}
  >
    <View style={[styles.menuIcon, danger && styles.menuIconDanger]}>
      <Ionicons
        name={icon}
        size={18}
        color={danger ? colors.danger : colors.primary}
      />
    </View>
    <View style={styles.menuCopy}>
      <Text style={[styles.menuTitle, danger && { color: colors.danger }]}>
        {title}
      </Text>
      <Text style={styles.menuSubtitle}>{subtitle}</Text>
    </View>
    <Ionicons name="chevron-forward" size={18} color={colors.textSoft} />
  </Pressable>
);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: colors.textMuted,
  },
  sectionLabel: {
    marginBottom: 10,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: colors.textMuted,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    padding: 16,
  },
  pill: {
    alignSelf: "flex-start",
    backgroundColor: colors.primarySoft,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  pillPrimary: {
    backgroundColor: colors.primary,
  },
  pillGold: {
    backgroundColor: colors.goldSoft,
  },
  pillText: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: "700",
  },
  pillTextPrimary: {
    color: colors.white,
  },
  pillTextGold: {
    color: "#8A6A00",
  },
  button: {
    minHeight: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  buttonFlex: {
    flex: 1,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  buttonSecondary: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  buttonSage: {
    backgroundColor: colors.primarySoft,
  },
  buttonDanger: {
    backgroundColor: colors.danger,
  },
  buttonGhost: {
    backgroundColor: "transparent",
  },
  buttonPressed: {
    opacity: 0.88,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  buttonLabel: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "700",
  },
  buttonLabelSecondary: {
    color: colors.primary,
  },
  field: {
    marginBottom: 12,
  },
  fieldLabel: {
    marginBottom: 6,
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
  },
  inputWrap: {
    minHeight: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 12,
  },
  inputError: {
    borderColor: colors.danger,
  },
  errorText: {
    marginTop: 6,
    fontSize: 12,
    color: colors.danger,
  },
  alert: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#FECACA",
    backgroundColor: colors.dangerSoft,
    padding: 12,
    marginBottom: 10,
  },
  alertSuccess: {
    borderColor: "#A6F4C5",
    backgroundColor: colors.primarySoft,
  },
  alertWarning: {
    borderColor: "#FDE68A",
    backgroundColor: colors.warningSoft,
  },
  alertInfo: {
    borderColor: "#B7DFC8",
    backgroundColor: colors.primarySoftAlt,
  },
  alertText: {
    color: colors.danger,
    fontSize: 13,
    lineHeight: 19,
  },
  alertTextSuccess: {
    color: colors.primaryDark,
  },
  alertTextWarning: {
    color: colors.warning,
  },
  alertTextInfo: {
    color: colors.primaryDark,
  },
  empty: {
    alignItems: "center",
    paddingVertical: 28,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  emptyDescription: {
    marginTop: 8,
    textAlign: "center",
    color: colors.textMuted,
    lineHeight: 20,
  },
  loading: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    gap: 12,
  },
  loadingText: {
    color: colors.textMuted,
  },
  stat: {
    flex: 1,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 14,
    padding: 12,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.3,
    color: colors.textMuted,
  },
  statValue: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
  },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.text,
    fontWeight: "700",
    fontSize: 13,
  },
  chipTextSelected: {
    color: colors.white,
  },
  iconTile: {
    flex: 1,
    minWidth: "30%",
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    padding: 14,
    gap: 8,
  },
  iconTileIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  iconTileTitle: {
    fontWeight: "800",
    color: colors.text,
    fontSize: 14,
  },
  iconTileText: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 17,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  menuIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  menuIconDanger: {
    backgroundColor: colors.dangerSoft,
  },
  menuCopy: {
    flex: 1,
  },
  menuTitle: {
    fontWeight: "700",
    color: colors.text,
    fontSize: 15,
  },
  menuSubtitle: {
    marginTop: 2,
    color: colors.textMuted,
    fontSize: 12,
  },
});
