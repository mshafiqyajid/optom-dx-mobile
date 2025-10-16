import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DesignColors, Spacing, BorderRadius, Typography, IconSizes } from '@/constants/design-system';
import { Layout, getThemedColors } from '@/constants/styles';
import { SeverityChart } from '@/components/severity-chart';

export default function HistoryTakingScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getThemedColors(isDark);

  const [severityValue, setSeverityValue] = useState(9);
  const [reliefFactor, setReliefFactor] = useState('');

  return (
    <ThemedView style={Layout.container}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={IconSizes.lg} color={colors.text} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>History Taking</ThemedText>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={Layout.scrollView} showsVerticalScrollIndicator={false}>
        {/* Section Card */}
        <View style={styles.content}>
          <View style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
            <ThemedText style={styles.sectionTitle}>Section A : General Question</ThemedText>

            {/* Severity Question */}
            <View style={styles.questionContainer}>
              <ThemedText style={styles.questionNumber}>7. Severity</ThemedText>

              {/* Severity Chart */}
              <SeverityChart
                value={severityValue}
                maxValue={10}
                onValueChange={setSeverityValue}
              />
            </View>

            {/* Relief Factor Question */}
            <View style={styles.questionContainer}>
              <ThemedText style={styles.questionNumber}>8. Relief Factor</ThemedText>

              <TextInput
                placeholder="Enter what relief the symptoms"
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={6}
                value={reliefFactor}
                onChangeText={setReliefFactor}
                style={[
                  styles.textArea,
                  {
                    backgroundColor: '#F5F5F5',
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                textAlignVertical="top"
              />
            </View>
          </View>
        </View>

        {/* Bottom padding for button */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={[styles.bottomContainer, { backgroundColor: colors.background }]}>
        <TouchableOpacity style={[styles.nextButton, { backgroundColor: DesignColors.primary }]}>
          <ThemedText style={styles.nextButtonText}>Next</ThemedText>
          <IconSymbol name="chevron.right" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: 60,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
  },
  content: {
    padding: Spacing.lg,
  },
  sectionCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    marginBottom: Spacing.xl,
  },
  questionContainer: {
    marginBottom: Spacing.xl,
  },
  questionNumber: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: Spacing.lg,
  },
  textArea: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    fontSize: Typography.fontSize.base,
    minHeight: 140,
    borderWidth: 1,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
    paddingBottom: 40,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
  },
  nextButtonText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: '#FFFFFF',
  },
});
