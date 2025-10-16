import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DesignColors, Spacing } from '@/constants/design-system';

export interface StatusBadgeProps {
  text: string;
  color?: string;
  online?: boolean;
}

export function StatusBadge({ text, color, online = true }: StatusBadgeProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const statusColor = color || (online ? DesignColors.success : '#999999');

  return (
    <View style={styles.container}>
      <View style={[styles.dot, { backgroundColor: statusColor }]} />
      <ThemedText
        style={[
          styles.text,
          { color: isDark ? DesignColors.dark.textSecondary : DesignColors.light.textSecondary },
        ]}>
        {text}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  text: {
    fontSize: 14,
  },
});
