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
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { LucideIcon } from "lucide-react-native";
import {
  colors,
  dimensions,
  fonts,
  radius,
  shadows,
  spacing,
  typography,
} from "@/theme/theme";
import { BrandMark } from "@/components/BrandMark";

export { BrandMark };

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
  padded = true,
}: {
  children: React.ReactNode;
  contentStyle?: object;
  refreshControl?: React.ReactElement;
  padded?: boolean;
}) => {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.scrollContent,
        padded && { paddingHorizontal: dimensions.screenPadding },
        {
          paddingTop: Math.max(insets.top, spacing.lg),
          paddingBottom: insets.bottom + spacing.xxxl,
        },
        contentStyle,
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      refreshControl={refreshControl}
    >
      {children}
    </ScrollView>
  );
};

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

export const SoftCard = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: object;
}) => <View style={[styles.softCard, style]}>{children}</View>;

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
        tone === "primary" && styles.pillTextOnDark,
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
  icon: Icon,
  flex,
}: {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger" | "ghost" | "sage";
  disabled?: boolean;
  loading?: boolean;
  accessibilityLabel?: string;
  icon?: LucideIcon;
  flex?: boolean;
}) => {
  const isDisabled = disabled || loading;
  const iconColor =
    variant === "primary" || variant === "danger"
      ? colors.white
      : colors.primary;

  const content = loading ? (
    <ActivityIndicator color={iconColor} />
  ) : (
    <View style={styles.buttonInner}>
      {Icon ? <Icon size={20} color={iconColor} strokeWidth={2.2} /> : null}
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
  );

  if (variant === "primary" && !isDisabled) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || label}
        accessibilityState={{ disabled: isDisabled }}
        onPress={onPress}
        style={({ pressed }) => [
          flex && styles.buttonFlex,
          pressed && styles.buttonPressed,
        ]}
      >
        <LinearGradient
          colors={[...gradientsSafe.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.button}
        >
          {content}
        </LinearGradient>
      </Pressable>
    );
  }

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
        variant === "secondary" && styles.buttonSecondary,
        variant === "danger" && styles.buttonDanger,
        variant === "ghost" && styles.buttonGhost,
        variant === "sage" && styles.buttonSage,
        variant === "primary" && styles.buttonPrimaryFlat,
        pressed && !isDisabled && styles.buttonPressed,
        isDisabled && styles.buttonDisabled,
      ]}
    >
      {content}
    </Pressable>
  );
};

const gradientsSafe = {
  primary: ["#117647", "#03432A"] as [string, string],
  result: ["#087044", "#033C26"] as [string, string],
};

export const ResultBanner = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: object;
}) => (
  <LinearGradient
    colors={gradientsSafe.result}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={[styles.resultBanner, style]}
  >
    {children}
  </LinearGradient>
);

export const Field = ({
  label,
  error,
  icon: Icon,
  ...props
}: TextInputProps & {
  label: string;
  error?: string;
  icon?: LucideIcon;
}) => (
  <View style={styles.field}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <View style={[styles.inputWrap, error ? styles.inputError : null]}>
      {Icon ? (
        <Icon
          size={18}
          color={colors.textSecondary}
          strokeWidth={2}
          style={styles.inputIcon}
        />
      ) : null}
      <TextInput
        placeholderTextColor={colors.disabled}
        style={styles.input}
        accessibilityLabel={label}
        {...props}
      />
    </View>
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
);

/** Alias for form screens */
export const TextField = Field;

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
        tone === "success" && { color: colors.success },
        tone === "warning" && { color: colors.warning },
        tone === "info" && { color: colors.info },
      ]}
    >
      {message}
    </Text>
  </View>
);

export const EmptyState = ({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon?: LucideIcon;
}) => (
  <View style={styles.empty}>
    {Icon ? (
      <View style={styles.emptyIcon}>
        <Icon size={24} color={colors.primary} strokeWidth={2} />
      </View>
    ) : null}
    <Text style={styles.emptyTitle}>{title}</Text>
    <Text style={styles.emptyDescription}>{description}</Text>
  </View>
);

export const LockedState = ({
  title,
  description,
  actionLabel,
  onUnlock,
  loading,
}: {
  title: string;
  description: string;
  actionLabel: string;
  onUnlock: () => void;
  loading?: boolean;
}) => (
  <View style={styles.locked}>
    <Text style={styles.lockedTitle}>{title}</Text>
    <Text style={styles.lockedDescription}>{description}</Text>
    <Button label={actionLabel} onPress={onUnlock} loading={loading} />
  </View>
);

export const SuccessState = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <View style={styles.successState}>
    <Text style={styles.successStateTitle}>{title}</Text>
    <Text style={styles.successStateDescription}>{description}</Text>
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

export const Skeleton = ({
  height = 16,
  width = "100%",
  style,
}: {
  height?: number;
  width?: number | `${number}%`;
  style?: object;
}) => (
  <View style={[styles.skeleton, { height, width }, style]} />
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
  icon: Icon,
}: {
  label: string;
  selected?: boolean;
  onPress: () => void;
  icon?: LucideIcon;
}) => (
  <Pressable
    accessibilityRole="button"
    accessibilityState={{ selected: !!selected }}
    accessibilityLabel={label}
    onPress={onPress}
    style={[styles.chip, selected && styles.chipSelected]}
  >
    {Icon ? (
      <Icon
        size={16}
        color={selected ? colors.white : colors.primary}
        strokeWidth={2.2}
      />
    ) : null}
    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
      {label}
    </Text>
  </Pressable>
);

export const IconTile = ({
  icon: Icon,
  title,
  text,
  onPress,
}: {
  icon: LucideIcon;
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
      <Icon size={22} color={colors.primary} strokeWidth={2.1} />
    </View>
    <Text style={styles.iconTileTitle}>{title}</Text>
    <Text style={styles.iconTileText}>{text}</Text>
  </Pressable>
);

export const MenuRow = ({
  icon: Icon,
  title,
  subtitle,
  onPress,
  danger,
}: {
  icon: LucideIcon;
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
      <Icon
        size={18}
        color={danger ? colors.error : colors.primary}
        strokeWidth={2.1}
      />
    </View>
    <View style={styles.menuCopy}>
      <Text style={[styles.menuTitle, danger && { color: colors.error }]}>
        {title}
      </Text>
      <Text style={styles.menuSubtitle}>{subtitle}</Text>
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  title: {
    ...typography.pageTitle,
    color: colors.primary,
  },
  subtitle: {
    ...typography.body,
    marginTop: spacing.sm,
    color: colors.textSecondary,
  },
  sectionLabel: {
    ...typography.label,
    marginBottom: spacing.sm,
    letterSpacing: 0.4,
    textTransform: "uppercase",
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    ...shadows.card,
  },
  softCard: {
    backgroundColor: colors.softSurface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  pill: {
    alignSelf: "flex-start",
    backgroundColor: colors.sage,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
  },
  pillPrimary: {
    backgroundColor: colors.primary,
  },
  pillGold: {
    backgroundColor: "#F4E9D5",
  },
  pillText: {
    ...typography.caption,
    fontFamily: fonts.bold,
    color: colors.forest,
  },
  pillTextOnDark: {
    color: colors.white,
  },
  pillTextGold: {
    color: "#8A6A2E",
  },
  button: {
    minHeight: dimensions.buttonHeight,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  buttonFlex: {
    flex: 1,
  },
  buttonPrimaryFlat: {
    backgroundColor: colors.primary,
  },
  buttonSecondary: {
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  buttonSage: {
    backgroundColor: colors.sage,
  },
  buttonDanger: {
    backgroundColor: colors.error,
  },
  buttonGhost: {
    backgroundColor: "transparent",
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  buttonLabel: {
    ...typography.button,
    color: colors.white,
  },
  buttonLabelSecondary: {
    color: colors.primary,
  },
  resultBanner: {
    borderRadius: radius.xl,
    padding: spacing.xl,
  },
  field: {
    marginBottom: spacing.md,
  },
  fieldLabel: {
    ...typography.label,
    marginBottom: spacing.xs + 2,
    color: colors.text,
  },
  inputWrap: {
    minHeight: dimensions.inputHeight,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.text,
    paddingVertical: spacing.md,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    ...typography.caption,
    marginTop: spacing.xs,
    color: colors.error,
  },
  alert: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: "#F3B4B4",
    backgroundColor: "#FCECEC",
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  alertSuccess: {
    borderColor: "#B8E0C4",
    backgroundColor: colors.sage,
  },
  alertWarning: {
    borderColor: "#EBD3A4",
    backgroundColor: "#F8EFDC",
  },
  alertInfo: {
    borderColor: "#B7CFE0",
    backgroundColor: "#EAF2F8",
  },
  alertText: {
    ...typography.body,
    fontSize: 14,
    color: colors.error,
  },
  empty: {
    alignItems: "center",
    paddingVertical: spacing.xxxl,
    gap: spacing.sm,
  },
  emptyIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.sage,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
  emptyTitle: {
    ...typography.cardTitle,
    color: colors.text,
  },
  emptyDescription: {
    ...typography.body,
    textAlign: "center",
    color: colors.textSecondary,
  },
  locked: {
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  lockedTitle: {
    ...typography.cardTitle,
    color: colors.text,
  },
  lockedDescription: {
    ...typography.body,
    color: colors.textSecondary,
  },
  successState: {
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: "#B8E0C4",
    backgroundColor: colors.sage,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  successStateTitle: {
    ...typography.cardTitle,
    color: colors.forest,
  },
  successStateDescription: {
    ...typography.body,
    fontSize: 14,
    color: colors.forest,
  },
  loading: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxxl,
    gap: spacing.md,
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  skeleton: {
    backgroundColor: colors.softSurface,
    borderRadius: radius.sm,
  },
  stat: {
    flex: 1,
    backgroundColor: colors.softSurface,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  statLabel: {
    ...typography.caption,
    fontFamily: fonts.bold,
    textTransform: "uppercase",
    letterSpacing: 0.3,
    color: colors.textSecondary,
  },
  statValue: {
    marginTop: spacing.xs,
    fontFamily: fonts.extraBold,
    fontSize: 16,
    color: colors.text,
  },
  chip: {
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs + 2,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    ...typography.label,
    color: colors.text,
  },
  chipTextSelected: {
    color: colors.white,
  },
  iconTile: {
    flex: 1,
    minWidth: "30%",
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
    ...shadows.soft,
  },
  iconTileIcon: {
    width: dimensions.iconTile,
    height: dimensions.iconTile,
    borderRadius: radius.md,
    backgroundColor: colors.sage,
    alignItems: "center",
    justifyContent: "center",
  },
  iconTileTitle: {
    ...typography.label,
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.text,
  },
  iconTileText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.sage,
    alignItems: "center",
    justifyContent: "center",
  },
  menuIconDanger: {
    backgroundColor: "#FCECEC",
  },
  menuCopy: {
    flex: 1,
  },
  menuTitle: {
    ...typography.label,
    fontSize: 15,
    fontFamily: fonts.bold,
    color: colors.text,
  },
  menuSubtitle: {
    ...typography.caption,
    marginTop: 2,
    color: colors.textSecondary,
  },
});
