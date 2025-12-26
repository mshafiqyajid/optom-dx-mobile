import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { CheckpointStep, CheckpointStepStatus } from '@/constants/checkpoint';
import { BorderRadius, DesignColors, IconSizes, Spacing, Typography } from '@/constants/design-system';
import { Layout, getThemedColors } from '@/constants/styles';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useGetCheckpoints, RegistrationCheckpoint, RegistrationCheckpointType } from '@/services';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

// Map API checkpoint types to UI display titles
const CHECKPOINT_TITLE_MAP: Record<RegistrationCheckpointType, string> = {
  profile_verification: 'Profile Verification',
  history_taking: 'History Taking',
  preliminary_test: 'Preliminary Test',
  visual_acuity_assessment: 'Visual Acuity Assessment',
  external_eye_examination: 'External Eye Examination',
  refraction_assessment: 'Refraction Assessment',
  case_submission: 'Referral & Case Submission',
};

// Format date for display
const formatCompletedDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };
  const formatted = date.toLocaleDateString('en-US', options);
  // Format: "Aug 04, 2025 at 10:00 AM"
  return formatted.replace(',', '').replace(' at', ' at');
};

// Transform API checkpoint to UI step format
const transformCheckpointToStep = (
  checkpoint: RegistrationCheckpoint,
  index: number
): CheckpointStep => ({
  id: index + 1,
  title: CHECKPOINT_TITLE_MAP[checkpoint.checkpoint],
  status: checkpoint.completed_at
    ? CheckpointStepStatus.COMPLETED
    : CheckpointStepStatus.PENDING,
  completedAt: checkpoint.completed_at
    ? formatCompletedDate(checkpoint.completed_at)
    : undefined,
});

export default function CheckpointScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getThemedColors(isDark);

  const registrationId = typeof id === 'string' ? parseInt(id, 10) : 0;
  const { data, isLoading, error } = useGetCheckpoints(registrationId);

  // Transform API data to UI format
  const checkpointSteps: CheckpointStep[] = data?.data?.checkpoints
    ? data.data.checkpoints.map(transformCheckpointToStep)
    : [];

  // Find the first incomplete step to highlight
  const firstIncompleteIndex = checkpointSteps.findIndex(
    (step) => step.status !== CheckpointStepStatus.COMPLETED
  );

  // Get registration date from data
  const registrationDate = data?.data?.checkpoints?.[0]?.created_at
    ? new Date(data.data.checkpoints[0].created_at)
    : null;

  // Loading state
  if (isLoading) {
    return (
      <ThemedView style={Layout.container}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol name="chevron.left" size={IconSizes.lg} color={colors.text} />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Checkpoint</ThemedText>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={DesignColors.primary} />
          <ThemedText style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading checkpoints...
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  // Error state
  if (error) {
    return (
      <ThemedView style={Layout.container}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol name="chevron.left" size={IconSizes.lg} color={colors.text} />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Checkpoint</ThemedText>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.errorContainer}>
          <IconSymbol name="exclamationmark.triangle" size={48} color={DesignColors.error} />
          <ThemedText style={styles.errorTitle}>Failed to load checkpoints</ThemedText>
          <ThemedText style={[styles.errorText, { color: colors.textSecondary }]}>
            {error.message || 'An error occurred while loading the checkpoints.'}
          </ThemedText>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: DesignColors.primary }]}
            onPress={() => router.back()}>
            <ThemedText style={styles.retryButtonText}>Go Back</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

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
                {registrationDate
                  ? registrationDate.toLocaleDateString('en-US', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    }).toUpperCase()
                  : '--'}
              </ThemedText>
              <ThemedText style={[styles.registrationTime, { color: colors.textSecondary }]}>
                |  {registrationDate
                  ? registrationDate.toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })
                  : '--'}
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
                  step.status === CheckpointStepStatus.COMPLETED
                    ? { backgroundColor: DesignColors.success }
                    : {
                        backgroundColor:
                          index === firstIncompleteIndex ? DesignColors.primary : colors.surface,
                        borderWidth: 2,
                        borderColor: colors.border,
                      },
                ]}>
                <ThemedText
                  style={[
                    styles.stepNumberText,
                    step.status === CheckpointStepStatus.COMPLETED || index === firstIncompleteIndex
                      ? { color: '#FFFFFF' }
                      : { color: colors.textSecondary },
                  ]}>
                  {step.id}
                </ThemedText>
              </View>

              {/* Step card */}
              <TouchableOpacity
                style={[styles.stepCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                disabled={step.status === CheckpointStepStatus.COMPLETED}
                onPress={() => {
                  switch (step.title) {
                    case 'History Taking':
                      router.push(`/history-taking/${id}`);
                      break;
                    case 'Preliminary Test':
                      router.push(`/preliminary-test/${id}`);
                      break;
                    case 'Visual Acuity Assessment':
                      router.push(`/visual-acuity/${id}`);
                      break;
                    case 'External Eye Examination':
                      router.push(`/external-eye/${id}`);
                      break;
                    case 'Refraction Assessment':
                      router.push(`/refraction/${id}`);
                      break;
                    case 'Referral & Case Submission':
                      router.push(`/case-submission/${id}`);
                      break;
                    default:
                      break;
                  }
                }}>
                <View style={styles.stepCardContent}>
                  <ThemedText style={styles.stepTitle}>{step.title}</ThemedText>

                  {step.status === CheckpointStepStatus.COMPLETED ? (
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
                {step.status === CheckpointStepStatus.COMPLETED && step.completedAt && (
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  loadingText: {
    fontSize: Typography.fontSize.base,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  errorTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    marginTop: Spacing.sm,
  },
  errorText: {
    fontSize: Typography.fontSize.base,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.md,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
});
