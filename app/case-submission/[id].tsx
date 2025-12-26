import { SectionCard } from '@/components/ui/section-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { RadioButton } from '@/components/ui/radio-button';
import { BorderRadius, DesignColors, IconSizes, Spacing, Typography } from '@/constants/design-system';
import { Layout, getThemedColors } from '@/constants/styles';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useGetCaseSubmission, useCreateOrUpdateCaseSubmission } from '@/services';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  Pressable,
} from 'react-native';

// Mock data for screening summary - in real app, this would come from API/state
const mockScreeningSummary = {
  visualAcuity: {
    status: 'pass' as const,
    near: {
      right: { aided: '6/6', unAided: '6/6', pinHole: '6/6' },
      left: { aided: '6/6', unAided: '6/6', pinHole: '6/6' },
    },
    distance: {
      right: { aided: '6/6', unAided: '6/6', pinHole: '6/6' },
      left: { aided: '6/6', unAided: '6/6', pinHole: '6/6' },
    },
  },
  externalEye: {
    status: 'failed' as const,
    exterior: {
      right: 'NAD, Eye Lashes turn Inward',
      left: 'Cataract, ARM Degeneration',
    },
    fundus: {
      right: 'Normal, Diabetic, Cataract',
      left: 'Cataract, ARM Degeneration',
    },
  },
  refraction: {
    status: 'pass' as const,
    objective: {
      right: { sph: '-1.00', cyl: '-0.50', axis: '90', va: '6 / 6' },
      left: { sph: '-1.00', cyl: '-0.50', axis: '90', va: '6 / 6' },
    },
    subjective: {
      right: { sph: '-1.00', cyl: '-0.50', axis: '90', va: '6 / 6' },
      left: { sph: '-1.00', cyl: '-0.50', axis: '90', va: '6 / 6' },
    },
  },
};

interface StatusBadgeProps {
  status: 'pass' | 'failed';
}

function StatusBadge({ status }: StatusBadgeProps) {
  const isPass = status === 'pass';
  return (
    <View style={[styles.statusBadge, { backgroundColor: isPass ? '#D4F4DD' : '#FFE5E5' }]}>
      <IconSymbol
        name={isPass ? 'checkmark.circle.fill' : 'exclamationmark.circle.fill'}
        size={16}
        color={isPass ? DesignColors.success : '#FF3B30'}
      />
      <ThemedText style={[styles.statusText, { color: isPass ? DesignColors.success : '#FF3B30' }]}>
        {isPass ? 'Pass' : 'Failed'}
      </ThemedText>
    </View>
  );
}

// Case Submission description data structure
interface CaseSubmissionDescription {
  referral: {
    enter_referral_list: 'yes' | 'no';
    follow_up: 'no_need' | '3_months' | '1_month';
  };
  overall_result: 'pass' | 'refer' | 'urgent_refer';
  note: string;
}

export default function CaseSubmissionScreen() {
  const { id } = useLocalSearchParams();
  const registrationId = typeof id === 'string' ? parseInt(id, 10) : 0;
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getThemedColors(isDark);

  // API hooks
  const { data, isLoading: isFetching } = useGetCaseSubmission(registrationId);
  const { mutate: saveCaseSubmission, isPending: isSaving } = useCreateOrUpdateCaseSubmission();

  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [hasLoadedData, setHasLoadedData] = useState(false);

  // Step 2: Referral
  const [enterReferralList, setEnterReferralList] = useState<'yes' | 'no'>('no');
  const [referralFollowUp, setReferralFollowUp] = useState<'no_need' | '3_months' | '1_month'>('no_need');

  // Step 3: Overall Result
  const [overallResult, setOverallResult] = useState<'pass' | 'refer' | 'urgent_refer'>('pass');
  const [note, setNote] = useState('');

  // Pre-fill form from existing data
  useEffect(() => {
    if (data?.data?.description && !hasLoadedData) {
      const desc = data.data.description as unknown as CaseSubmissionDescription;

      if (desc.referral) {
        setEnterReferralList(desc.referral.enter_referral_list ?? 'no');
        setReferralFollowUp(desc.referral.follow_up ?? 'no_need');
      }

      setOverallResult(desc.overall_result ?? 'pass');
      setNote(desc.note ?? '');
      setHasLoadedData(true);
    }
  }, [data, hasLoadedData]);

  // Build description data from form state
  const buildDescriptionData = (): CaseSubmissionDescription => ({
    referral: {
      enter_referral_list: enterReferralList,
      follow_up: referralFollowUp,
    },
    overall_result: overallResult,
    note: note,
  });

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit and show success modal
      saveCaseSubmission(
        {
          registration_id: registrationId,
          description: buildDescriptionData() as unknown as Record<string, unknown>,
        },
        {
          onSuccess: () => {
            setShowSuccessModal(true);
          },
          onError: (error) => {
            Alert.alert('Error', error.message || 'Failed to submit case');
          },
        }
      );
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
    router.back();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        // Eye Screening Summary
        return (
          <SectionCard title="Eye Screening Summary">
            {/* Visual Acuity */}
            <View style={styles.summarySection}>
              <View style={styles.summaryHeader}>
                <ThemedText style={styles.summaryTitle}>Visual Acuity</ThemedText>
                <StatusBadge status={mockScreeningSummary.visualAcuity.status} />
              </View>

              {/* Near */}
              <ThemedText style={[styles.subSectionLabel, { color: colors.textSecondary }]}>Near</ThemedText>
              <View style={styles.vaTable}>
                <View style={styles.vaHeaderRow}>
                  <View style={styles.vaCell} />
                  <ThemedText style={[styles.vaHeaderText, { color: colors.textSecondary }]}>Aid</ThemedText>
                  <ThemedText style={[styles.vaHeaderText, { color: colors.textSecondary }]}>Un-Aided</ThemedText>
                  <ThemedText style={[styles.vaHeaderText, { color: colors.textSecondary }]}>Pin-hole</ThemedText>
                </View>
                <View style={styles.vaRow}>
                  <ThemedText style={[styles.vaEyeLabel, { color: colors.textSecondary }]}>R</ThemedText>
                  <ThemedText style={styles.vaValue}>{mockScreeningSummary.visualAcuity.near.right.aided}</ThemedText>
                  <ThemedText style={styles.vaValue}>{mockScreeningSummary.visualAcuity.near.right.unAided}</ThemedText>
                  <ThemedText style={styles.vaValue}>{mockScreeningSummary.visualAcuity.near.right.pinHole}</ThemedText>
                </View>
                <View style={styles.vaRow}>
                  <ThemedText style={[styles.vaEyeLabel, { color: colors.textSecondary }]}>L</ThemedText>
                  <ThemedText style={styles.vaValue}>{mockScreeningSummary.visualAcuity.near.left.aided}</ThemedText>
                  <ThemedText style={styles.vaValue}>{mockScreeningSummary.visualAcuity.near.left.unAided}</ThemedText>
                  <ThemedText style={styles.vaValue}>{mockScreeningSummary.visualAcuity.near.left.pinHole}</ThemedText>
                </View>
              </View>

              {/* Distance */}
              <ThemedText style={[styles.subSectionLabel, { color: colors.textSecondary }]}>Distance</ThemedText>
              <View style={styles.vaTable}>
                <View style={styles.vaHeaderRow}>
                  <View style={styles.vaCell} />
                  <ThemedText style={[styles.vaHeaderText, { color: colors.textSecondary }]}>Aid</ThemedText>
                  <ThemedText style={[styles.vaHeaderText, { color: colors.textSecondary }]}>Un-Aided</ThemedText>
                  <ThemedText style={[styles.vaHeaderText, { color: colors.textSecondary }]}>Pin-hole</ThemedText>
                </View>
                <View style={styles.vaRow}>
                  <ThemedText style={[styles.vaEyeLabel, { color: colors.textSecondary }]}>R</ThemedText>
                  <ThemedText style={styles.vaValue}>{mockScreeningSummary.visualAcuity.distance.right.aided}</ThemedText>
                  <ThemedText style={styles.vaValue}>{mockScreeningSummary.visualAcuity.distance.right.unAided}</ThemedText>
                  <ThemedText style={styles.vaValue}>{mockScreeningSummary.visualAcuity.distance.right.pinHole}</ThemedText>
                </View>
                <View style={styles.vaRow}>
                  <ThemedText style={[styles.vaEyeLabel, { color: colors.textSecondary }]}>L</ThemedText>
                  <ThemedText style={styles.vaValue}>{mockScreeningSummary.visualAcuity.distance.left.aided}</ThemedText>
                  <ThemedText style={styles.vaValue}>{mockScreeningSummary.visualAcuity.distance.left.unAided}</ThemedText>
                  <ThemedText style={styles.vaValue}>{mockScreeningSummary.visualAcuity.distance.left.pinHole}</ThemedText>
                </View>
              </View>
            </View>

            {/* External Eye Examination */}
            <View style={styles.summarySection}>
              <View style={styles.summaryHeader}>
                <ThemedText style={styles.summaryTitle}>External Eye Examination</ThemedText>
                <StatusBadge status={mockScreeningSummary.externalEye.status} />
              </View>

              <ThemedText style={[styles.subSectionLabel, { color: colors.textSecondary }]}>Exterior</ThemedText>
              <View style={styles.examRow}>
                <ThemedText style={[styles.examEyeLabel, { color: colors.textSecondary }]}>R</ThemedText>
                <ThemedText style={styles.examValue}>{mockScreeningSummary.externalEye.exterior.right}</ThemedText>
              </View>
              <View style={styles.examRow}>
                <ThemedText style={[styles.examEyeLabel, { color: colors.textSecondary }]}>L</ThemedText>
                <ThemedText style={styles.examValue}>{mockScreeningSummary.externalEye.exterior.left}</ThemedText>
              </View>

              <ThemedText style={[styles.subSectionLabel, { color: colors.textSecondary }]}>Fundus</ThemedText>
              <View style={styles.examRow}>
                <ThemedText style={[styles.examEyeLabel, { color: colors.textSecondary }]}>R</ThemedText>
                <ThemedText style={styles.examValue}>{mockScreeningSummary.externalEye.fundus.right}</ThemedText>
              </View>
              <View style={styles.examRow}>
                <ThemedText style={[styles.examEyeLabel, { color: colors.textSecondary }]}>L</ThemedText>
                <ThemedText style={styles.examValue}>{mockScreeningSummary.externalEye.fundus.left}</ThemedText>
              </View>
            </View>

            {/* Refraction Assessment */}
            <View style={styles.summarySection}>
              <View style={styles.summaryHeader}>
                <ThemedText style={styles.summaryTitle}>Refraction Assessment</ThemedText>
                <StatusBadge status={mockScreeningSummary.refraction.status} />
              </View>

              <ThemedText style={[styles.subSectionLabel, { color: colors.textSecondary }]}>Objective</ThemedText>
              <View style={styles.refractionRow}>
                <ThemedText style={[styles.refractionEyeLabel, { color: colors.textSecondary }]}>R</ThemedText>
                <ThemedText style={styles.refractionValue}>{mockScreeningSummary.refraction.objective.right.sph}</ThemedText>
                <ThemedText style={[styles.refractionSeparator, { color: colors.textSecondary }]}>/</ThemedText>
                <ThemedText style={styles.refractionValue}>{mockScreeningSummary.refraction.objective.right.cyl}</ThemedText>
                <ThemedText style={[styles.refractionSeparator, { color: colors.textSecondary }]}>x</ThemedText>
                <ThemedText style={styles.refractionValue}>{mockScreeningSummary.refraction.objective.right.axis}</ThemedText>
                <ThemedText style={styles.refractionVa}>( {mockScreeningSummary.refraction.objective.right.va} )</ThemedText>
              </View>
              <View style={styles.refractionRow}>
                <ThemedText style={[styles.refractionEyeLabel, { color: colors.textSecondary }]}>L</ThemedText>
                <ThemedText style={styles.refractionValue}>{mockScreeningSummary.refraction.objective.left.sph}</ThemedText>
                <ThemedText style={[styles.refractionSeparator, { color: colors.textSecondary }]}>/</ThemedText>
                <ThemedText style={styles.refractionValue}>{mockScreeningSummary.refraction.objective.left.cyl}</ThemedText>
                <ThemedText style={[styles.refractionSeparator, { color: colors.textSecondary }]}>x</ThemedText>
                <ThemedText style={styles.refractionValue}>{mockScreeningSummary.refraction.objective.left.axis}</ThemedText>
                <ThemedText style={styles.refractionVa}>( {mockScreeningSummary.refraction.objective.left.va} )</ThemedText>
              </View>

              <ThemedText style={[styles.subSectionLabel, { color: colors.textSecondary }]}>Subjective</ThemedText>
              <View style={styles.refractionRow}>
                <ThemedText style={[styles.refractionEyeLabel, { color: colors.textSecondary }]}>R</ThemedText>
                <ThemedText style={styles.refractionValue}>{mockScreeningSummary.refraction.subjective.right.sph}</ThemedText>
                <ThemedText style={[styles.refractionSeparator, { color: colors.textSecondary }]}>/</ThemedText>
                <ThemedText style={styles.refractionValue}>{mockScreeningSummary.refraction.subjective.right.cyl}</ThemedText>
                <ThemedText style={[styles.refractionSeparator, { color: colors.textSecondary }]}>x</ThemedText>
                <ThemedText style={styles.refractionValue}>{mockScreeningSummary.refraction.subjective.right.axis}</ThemedText>
                <ThemedText style={styles.refractionVa}>( {mockScreeningSummary.refraction.subjective.right.va} )</ThemedText>
              </View>
              <View style={styles.refractionRow}>
                <ThemedText style={[styles.refractionEyeLabel, { color: colors.textSecondary }]}>L</ThemedText>
                <ThemedText style={styles.refractionValue}>{mockScreeningSummary.refraction.subjective.left.sph}</ThemedText>
                <ThemedText style={[styles.refractionSeparator, { color: colors.textSecondary }]}>/</ThemedText>
                <ThemedText style={styles.refractionValue}>{mockScreeningSummary.refraction.subjective.left.cyl}</ThemedText>
                <ThemedText style={[styles.refractionSeparator, { color: colors.textSecondary }]}>x</ThemedText>
                <ThemedText style={styles.refractionValue}>{mockScreeningSummary.refraction.subjective.left.axis}</ThemedText>
                <ThemedText style={styles.refractionVa}>( {mockScreeningSummary.refraction.subjective.left.va} )</ThemedText>
              </View>
            </View>
          </SectionCard>
        );

      case 2:
        // Referral
        return (
          <SectionCard title="Referral">
            <View style={styles.formField}>
              <ThemedText style={styles.fieldLabel}>Enter to referral list?</ThemedText>
              <RadioButton
                label="Yes"
                selected={enterReferralList === 'yes'}
                onPress={() => setEnterReferralList('yes')}
              />
              <RadioButton
                label="No"
                selected={enterReferralList === 'no'}
                onPress={() => setEnterReferralList('no')}
              />
            </View>

            <View style={styles.formField}>
              <ThemedText style={styles.fieldLabel}>Referral follow-up</ThemedText>
              <RadioButton
                label="No Need"
                selected={referralFollowUp === 'no_need'}
                onPress={() => setReferralFollowUp('no_need')}
              />
              <RadioButton
                label="3 Months"
                selected={referralFollowUp === '3_months'}
                onPress={() => setReferralFollowUp('3_months')}
              />
              <RadioButton
                label="1 Month"
                selected={referralFollowUp === '1_month'}
                onPress={() => setReferralFollowUp('1_month')}
              />
            </View>
          </SectionCard>
        );

      case 3:
        // Overall Result
        return (
          <SectionCard title="Overall Result">
            <View style={styles.formField}>
              <ThemedText style={styles.fieldLabel}>Enter to referral list?</ThemedText>
              <RadioButton
                label="PASS"
                selected={overallResult === 'pass'}
                onPress={() => setOverallResult('pass')}
              />
              <RadioButton
                label="REFER"
                selected={overallResult === 'refer'}
                onPress={() => setOverallResult('refer')}
              />
              <RadioButton
                label="URGENT REFER"
                selected={overallResult === 'urgent_refer'}
                onPress={() => setOverallResult('urgent_refer')}
              />
            </View>

            <View style={styles.formField}>
              <ThemedText style={styles.fieldLabel}>Note</ThemedText>
              <TextInput
                placeholder="Insert note here"
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={6}
                value={note}
                onChangeText={setNote}
                style={[styles.textArea, { color: colors.text, borderColor: colors.border }]}
                textAlignVertical="top"
              />
            </View>
          </SectionCard>
        );

      case 4:
        // Confirm & Complete Assessment
        return (
          <SectionCard title="Confirm & Complete Assessment">
            <View style={styles.confirmContent}>
              <ThemedText style={[styles.confirmText, { color: colors.textSecondary }]}>
                I have reviewed all findings, ensured all required fields are completed, and confirm that this assessment is accurate to the best of my knowledge.
              </ThemedText>

              <ThemedText style={[styles.submitNote, { color: colors.textSecondary }]}>
                Submitting will complete the screening process for this patient.
              </ThemedText>
            </View>
          </SectionCard>
        );

      default:
        return null;
    }
  };

  // Loading state
  if (isFetching) {
    return (
      <ThemedView style={Layout.container}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol name="chevron.left" size={IconSizes.lg} color={colors.text} />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Case Submission</ThemedText>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={DesignColors.primary} />
          <ThemedText style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading...
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={Layout.container}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={IconSizes.lg} color={colors.text} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Case Submission</ThemedText>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={Layout.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {renderStep()}
        </View>

        {/* Bottom padding for button */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={[styles.bottomContainer, { backgroundColor: colors.background }]}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            { backgroundColor: DesignColors.primary },
            isSaving && styles.buttonDisabled,
          ]}
          onPress={handleNext}
          disabled={isSaving}>
          {isSaving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <ThemedText style={styles.nextButtonText}>
                {currentStep === 4 ? 'Confirm & Complete Assessment' : 'Next'}
              </ThemedText>
              {currentStep < 4 && <IconSymbol name="chevron.right" size={20} color="#FFFFFF" />}
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Success Modal */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={handleCloseSuccess}>
          <View style={styles.modalContent}>
            <View style={styles.successIconContainer}>
              <IconSymbol name="checkmark.circle.fill" size={48} color={DesignColors.success} />
            </View>
            <ThemedText style={styles.successTitle}>Completed!</ThemedText>
            <ThemedText style={[styles.successMessage, { color: colors.textSecondary }]}>
              Assessment submitted successfully. Patient record is now complete.
            </ThemedText>
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: DesignColors.primary }]}
              onPress={handleCloseSuccess}>
              <ThemedText style={styles.closeButtonText}>Close</ThemedText>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
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
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
  },
  content: {
    padding: Spacing.lg,
  },
  summarySection: {
    marginBottom: Spacing.xl,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  summaryTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  statusText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  subSectionLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  vaTable: {
    marginBottom: Spacing.sm,
  },
  vaHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  vaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  vaCell: {
    width: 30,
  },
  vaHeaderText: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    textAlign: 'center',
  },
  vaEyeLabel: {
    width: 30,
    fontSize: Typography.fontSize.sm,
  },
  vaValue: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    textAlign: 'center',
  },
  examRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  examEyeLabel: {
    width: 30,
    fontSize: Typography.fontSize.sm,
  },
  examValue: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
  },
  refractionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    gap: Spacing.sm,
  },
  refractionEyeLabel: {
    width: 20,
    fontSize: Typography.fontSize.sm,
  },
  refractionValue: {
    fontSize: Typography.fontSize.sm,
  },
  refractionSeparator: {
    fontSize: Typography.fontSize.sm,
  },
  refractionVa: {
    fontSize: Typography.fontSize.sm,
    marginLeft: Spacing.sm,
  },
  formField: {
    marginBottom: Spacing.lg,
  },
  fieldLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: Spacing.sm,
  },
  textArea: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    fontSize: Typography.fontSize.base,
    minHeight: 150,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  confirmContent: {
    paddingVertical: Spacing.xxxl,
    alignItems: 'center',
  },
  confirmText: {
    fontSize: Typography.fontSize.base,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: Spacing.lg,
  },
  submitNote: {
    fontSize: Typography.fontSize.sm,
    textAlign: 'center',
    marginTop: Spacing.xxxl,
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
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: '#FFFFFF',
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
    padding: Spacing.xl,
    marginHorizontal: Spacing.xl,
    alignItems: 'center',
    minWidth: 280,
  },
  successIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#D4F4DD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  successTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.sm,
  },
  successMessage: {
    fontSize: Typography.fontSize.base,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  closeButton: {
    width: '100%',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: '#FFFFFF',
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
  buttonDisabled: {
    opacity: 0.7,
  },
});
