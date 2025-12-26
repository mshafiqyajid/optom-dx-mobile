import { memo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { BorderRadius, DesignColors, Spacing, Typography } from '@/constants/design-system';
import { getThemedColors } from '@/constants/styles';

export interface DropdownOption {
  value: string;
  label: string;
}

export interface DropdownProps {
  value: string;
  options: DropdownOption[];
  onSelect: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const Dropdown = memo(function Dropdown({
  value,
  options,
  onSelect,
  placeholder = 'Select...',
  disabled = false,
}: DropdownProps) {
  const [visible, setVisible] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getThemedColors(isDark);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayText = selectedOption?.label || placeholder;

  return (
    <>
      <TouchableOpacity
        style={[
          styles.dropdownButton,
          {
            borderColor: colors.border,
            opacity: disabled ? 0.5 : 1,
          },
        ]}
        onPress={() => !disabled && setVisible(true)}
        disabled={disabled}
        accessibilityRole="combobox"
        accessibilityState={{ expanded: visible, disabled }}
        accessibilityLabel={displayText}>
        <ThemedText
          style={[styles.dropdownValue, !selectedOption && { color: colors.textSecondary }]}>
          {displayText}
        </ThemedText>
        <IconSymbol name="chevron.down" size={16} color={colors.textSecondary} />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setVisible(false)}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[styles.dropdownItem, value === option.value && styles.dropdownItemSelected]}
                  onPress={() => {
                    onSelect(option.value);
                    setVisible(false);
                  }}
                  accessibilityRole="option"
                  accessibilityState={{ selected: value === option.value }}>
                  <ThemedText style={styles.dropdownItemText}>{option.label}</ThemedText>
                  {value === option.value && (
                    <View style={styles.checkmark}>
                      <IconSymbol name="checkmark" size={16} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </>
  );
});

const styles = StyleSheet.create({
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: 'transparent',
  },
  dropdownValue: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.xl,
    minWidth: 280,
    maxWidth: '80%',
    maxHeight: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  dropdownItemSelected: {
    backgroundColor: 'rgba(74, 108, 247, 0.1)',
  },
  dropdownItemText: {
    fontSize: Typography.fontSize.base,
    flex: 1,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: DesignColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
