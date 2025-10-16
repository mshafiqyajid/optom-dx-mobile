import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DesignColors, Spacing, BorderRadius, Typography, IconSizes } from '@/constants/design-system';
import { Layout, getThemedColors } from '@/constants/styles';

// Checkpoint steps data
const checkpointSteps = [
  {
    id: 1,
    title: 'Profile Verification',
    status: 'completed' as const,
    completedAt: 'Aug 04, 2025 at 10.00 AM',
  },
  {
    id: 2,
    title: 'History Taking',
    status: 'pending' as const,
  },
  {
    id: 3,
    title: 'Preliminary Test',
    status: 'pending' as const,
  },
  {
    id: 4,
    title: 'Visual Acuity Assessment',
    status: 'pending' as const,
  },
  {
    id: 5,
    title: 'External Eye Examination',
    status: 'pending' as const,
  },
  {
    id: 6,
    title: 'Refraction Assessment',
    status: 'pending' as const,
  },
  {
    id: 7,
    title: 'Referral & Case Submission',
    status: 'pending' as const,
  },
];

export default function CheckpointScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getThemedColors(isDark);

  return (
    <ThemedView style={Layout.container}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={IconSizes.lg} color={colors.text} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Checkpoint</ThemedText>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={Layout.scrollView} showsVerticalScrollIndicator={false}>
        {/* Registration Info */}
        <View style={styles.registrationInfo}>
          <View style={[styles.registrationIcon, { backgroundColor: '#C4A76D' }]}>
            <IconSymbol name="calendar" size={IconSizes.md} color="#FFFFFF" />
          </View>
          <View style={styles.registrationDetails}>
            <ThemedText style={styles.registrationLabel}>Registered</ThemedText>
            <View style={styles.registrationMeta}>
              <ThemedText style={[styles.registrationDate, { color: colors.textSecondary }]}>
                03 AUGUST 2025
              </ThemedText>
              <ThemedText style={[styles.registrationTime, { color: colors.textSecondary }]}>
                |  9:46 AM
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Timeline */}
        <View style={styles.timeline}>
          {checkpointSteps.map((step, index) => (
            <View key={step.id} style={styles.timelineItem}>
              {/* Timeline line */}
              {index < checkpointSteps.length - 1 && (
                <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />
              )}

              {/* Step number */}
              <View
                style={[
                  styles.stepNumber,
                  step.status === 'completed'
                    ? { backgroundColor: DesignColors.success }
                    : { backgroundColor: step.id === 2 ? DesignColors.primary : colors.surface, borderWidth: 2, borderColor: colors.border },
                ]}>
                <ThemedText
                  style={[
                    styles.stepNumberText,
                    step.status === 'completed' || step.id === 2
                      ? { color: '#FFFFFF' }
                      : { color: colors.textSecondary },
                  ]}>
                  {step.id}
                </ThemedText>
              </View>

              {/* Step card */}
              <TouchableOpacity
                style={[styles.stepCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                disabled={step.status === 'completed'}>
                <View style={styles.stepCardContent}>
                  <ThemedText style={styles.stepTitle}>{step.title}</ThemedText>

                  {step.status === 'completed' ? (
                    <View style={[styles.completedBadge, { backgroundColor: '#D4F4DD' }]}>
                      <IconSymbol name="checkmark" size={14} color={DesignColors.success} />
                      <ThemedText style={[styles.completedText, { color: DesignColors.success }]}>
                        Completed
                      </ThemedText>
                    </View>
                  ) : (
                    <View style={styles.startButton}>
                      <ThemedText style={[styles.startText, { color: colors.textSecondary }]}>
                        Start
                      </ThemedText>
                      <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
                    </View>
                  )}
                </View>

                {/* Completed timestamp */}
                {step.status === 'completed' && step.completedAt && (
                  <View style={styles.completedTimestamp}>
                    <IconSymbol name="calendar" size={IconSizes.sm} color={colors.textSecondary} />
                    <ThemedText style={[styles.completedTime, { color: colors.textSecondary }]}>
                      {step.completedAt}
                    </ThemedText>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Bottom padding */}
        <View style={{ height: 100 }} />
      </ScrollView>
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
  registrationInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
    gap: Spacing.md,
  },
  registrationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registrationDetails: {
    flex: 1,
  },
  registrationLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    marginBottom: 4,
  },
  registrationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  registrationDate: {
    fontSize: Typography.fontSize.sm,
    letterSpacing: 0.5,
  },
  registrationTime: {
    fontSize: Typography.fontSize.sm,
  },
  timeline: {
    paddingHorizontal: Spacing.lg,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    position: 'relative',
    marginBottom: Spacing.md,
  },
  timelineLine: {
    position: 'absolute',
    left: 19,
    top: 40,
    width: 2,
    height: '100%',
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    zIndex: 1,
  },
  stepNumberText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
  },
  stepCard: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  stepCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    flex: 1,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
    gap: 4,
  },
  completedText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  startText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
  },
  completedTimestamp: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },
  completedTime: {
    fontSize: Typography.fontSize.sm,
  },
});
