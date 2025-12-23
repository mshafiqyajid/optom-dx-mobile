import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { BorderRadius, DesignColors, Spacing, Typography } from '@/constants/design-system';
import { getThemedColors } from '@/constants/styles';

export interface FixedBottomButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  showChevron?: boolean;
  variant?: 'primary' | 'danger';
}

export function FixedBottomButton({
  label,
  onPress,
  loading = false,
  disabled = false,
  showChevron = false,
  variant = 'primary',
}: FixedBottomButtonProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getThemedColors(isDark);

  const backgroundColor = variant === 'danger' ? '#FF3B30' : DesignColors.primary;

  return (
    <View style={[styles.bottomContainer, { backgroundColor: colors.background }]}>
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor },
          (disabled || loading) && styles.buttonDisabled,
        ]}
        onPress={onPress}
        disabled={disabled || loading}
        accessibilityLabel={label}
        accessibilityRole="button"
        accessibilityState={{ disabled: disabled || loading }}>
        {loading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <>
            <ThemedText style={styles.buttonText}>{label}</ThemedText>
            {showChevron && <IconSymbol name="chevron.right" size={20} color="#FFFFFF" />}
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
    paddingBottom: 40,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
  },
  buttonText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: '#FFFFFF',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});
