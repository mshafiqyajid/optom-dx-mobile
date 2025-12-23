import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { BorderRadius, Spacing, Typography } from '@/constants/design-system';
import { getThemedColors } from '@/constants/styles';

export interface SectionCardProps {
  title: string;
  children: React.ReactNode;
  headerBackgroundColor?: string;
}

export function SectionCard({ title, children, headerBackgroundColor }: SectionCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getThemedColors(isDark);

  return (
    <View style={styles.sectionCard}>
      <View style={[styles.sectionHeader, { backgroundColor: headerBackgroundColor || colors.surface }]}>
        <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
      </View>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionCard: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
  sectionContent: {
    padding: Spacing.lg,
  },
});
