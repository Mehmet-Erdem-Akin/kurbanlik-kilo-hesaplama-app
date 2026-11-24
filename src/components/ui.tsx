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
import { colors } from "@/theme/colors";

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
}: {
  children: React.ReactNode;
  contentStyle?: object;
  refreshControl?: React.ReactElement;
}) => (
  <ScrollView
    style={styles.screen}
    contentContainerStyle={[styles.scrollContent, contentStyle]}
    keyboardShouldPersistTaps="handled"
    showsVerticalScrollIndicator={false}
    refreshControl={refreshControl}
  >
    {children}
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

export const Pill = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.pill}>
    <Text style={styles.pillText}>{children}</Text>
  </View>
);

export const Button = ({
  label,
  onPress,
  variant = "primary",
  disabled,
  loading,
  accessibilityLabel,
}: {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  disabled?: boolean;
  loading?: boolean;
  accessibilityLabel?: string;
}) => {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === "primary" && styles.buttonPrimary,
        variant === "secondary" && styles.buttonSecondary,
        variant === "danger" && styles.buttonDanger,
        variant === "ghost" && styles.buttonGhost,
        pressed && !isDisabled && styles.buttonPressed,
        isDisabled && styles.buttonDisabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === "secondary" ? colors.primary : colors.white} />
      ) : (
        <Text
          style={[
            styles.buttonLabel,
            variant === "secondary" && styles.buttonLabelSecondary,
            variant === "ghost" && styles.buttonLabelGhost,
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
};

export const Field = ({
  label,
  error,
  ...props
}: TextInputProps & { label: string; error?: string }) => (
  <View style={styles.field}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <TextInput
      placeholderTextColor={colors.textSoft}
      style={[styles.input, error ? styles.inputError : null]}
      accessibilityLabel={label}
      {...props}
    />
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
);

export const AlertBox = ({
  message,
  tone = "danger",
}: {
  message: string;
  tone?: "danger" | "success" | "warning";
}) => (
  <View
    style={[
      styles.alert,
      tone === "success" && styles.alertSuccess,
      tone === "warning" && styles.alertWarning,
    ]}
    accessibilityRole="alert"
  >
    <Text
      style={[
        styles.alertText,
        tone === "success" && styles.alertTextSuccess,
        tone === "warning" && styles.alertTextWarning,
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

export const LoadingBlock = ({ label = "Yükleniyor..." }: { label?: string }) => (
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
}: {
  label: string;
  selected?: boolean;
  onPress: () => void;
}) => (
  <Pressable
    accessibilityRole="button"
    accessibilityState={{ selected: !!selected }}
    accessibilityLabel={label}
    onPress={onPress}
    style={[styles.chip, selected && styles.chipSelected]}
  >
    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
      {label}
    </Text>
  </Pressable>
);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: colors.text,
    letterSpacing: -0.6,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textMuted,
  },
  sectionLabel: {
    marginBottom: 10,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    color: colors.textMuted,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
  },
  pill: {
    alignSelf: "flex-start",
    backgroundColor: colors.primarySoft,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  pillText: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: "700",
  },
  button: {
    minHeight: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  buttonSecondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
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
    opacity: 0.55,
  },
  buttonLabel: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  buttonLabelSecondary: {
    color: colors.text,
  },
  buttonLabelGhost: {
    color: colors.primary,
  },
  field: {
    marginBottom: 14,
  },
  fieldLabel: {
    marginBottom: 6,
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
  },
  input: {
    minHeight: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    fontSize: 16,
    color: colors.text,
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
  },
  alertSuccess: {
    borderColor: "#A7F3D0",
    backgroundColor: colors.primarySoft,
  },
  alertWarning: {
    borderColor: "#FDE68A",
    backgroundColor: colors.warningSoft,
  },
  alertText: {
    color: colors.danger,
    fontSize: 14,
    lineHeight: 20,
  },
  alertTextSuccess: {
    color: colors.primaryDark,
  },
  alertTextWarning: {
    color: colors.warning,
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
    borderRadius: 16,
    padding: 14,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    color: colors.textMuted,
  },
  statValue: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.text,
    fontWeight: "600",
    fontSize: 13,
  },
  chipTextSelected: {
    color: colors.white,
  },
});
