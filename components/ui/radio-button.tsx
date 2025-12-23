import { memo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { BorderRadius, DesignColors, Spacing, Typography } from '@/constants/design-system';
import { getThemedColors } from '@/constants/styles';

export interface RadioButtonProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
}

export const RadioButton = memo(function RadioButton({ label, selected, onPress, disabled = false }: RadioButtonProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getThemedColors(isDark);

  return (
    <TouchableOpacity
      style={[
        styles.radioButton,
        {
          borderColor: selected ? DesignColors.primary : colors.border,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected, disabled }}
      accessibilityLabel={label}>
      <ThemedText style={styles.radioLabel}>{label}</ThemedText>
      <View
        style={[
          styles.radioCircle,
          { borderColor: selected ? DesignColors.primary : colors.border },
        ]}>
        {selected && <View style={[styles.radioCircleInner, { backgroundColor: DesignColors.primary }]} />}
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    marginBottom: Spacing.sm,
  },
  radioLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
