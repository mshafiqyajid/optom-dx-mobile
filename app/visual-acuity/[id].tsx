import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { RadioButton } from '@/components/ui/radio-button';
import { ScreenHeader, LoadingState, FixedBottomButton, SectionCard } from '@/components/ui';
import { BorderRadius, DesignColors, Spacing, Typography } from '@/constants/design-system';
import { Layout, getThemedColors } from '@/constants/styles';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useMultiStepForm, useFormDataLoader } from '@/hooks/use-multi-step-form';
import { useGetVisualAcuityAssessment, useCreateOrUpdateVisualAcuityAssessment } from '@/services';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// Backend API structure for Visual Acuity Assessment
interface EyeValue {
  right_eye: string;
  left_eye: string;
}

interface OperatorNotes {
  operator_observation: string;
  distance_vision_test_result: string;
}

interface DistanceVision {
  with_spectacle: EyeValue;
  un_aided: EyeValue;
  pin_hole: EyeValue;
  operator_notes: OperatorNotes;
}

interface NearVision {
  aided: EyeValue;
  un_aided: EyeValue;
  operator_notes: OperatorNotes;
}

interface VisualAcuityDescription {
  distance_visual_acuity_chart: string;
  vision_screening_distance: string;
  distance_vision: DistanceVision;
  near_visual_acuity_chart: string;
  new_vision: NearVision; // Note: Backend uses "new_vision" not "near_vision"
}

const TOTAL_STEPS = 6;

const CHART_OPTIONS = ['HOTV', 'LEA Symbols', 'Tumbling E', 'LogMAR', 'Snellen'];
const DISTANCE_OPTIONS = [
  { value: '1.5', label: '1.5 metres' },
  { value: '3.0', label: '3.0 metres' },
  { value: '6.0', label: '6.0 metres' },
];
const DENOMINATOR_OPTIONS = ['60', '36', '24', '18', '12', '9', '6'];

export default function VisualAcuityScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getThemedColors(isDark);

  const registrationId = typeof id === 'string' ? parseInt(id, 10) : 0;

  // API hooks
  const { data, isLoading: isFetching } = useGetVisualAcuityAssessment(registrationId);
  const { mutate: saveVisualAcuity, isPending: isSaving } = useCreateOrUpdateVisualAcuityAssessment();

  // Multi-step form management
  const { currentStep, isLastStep, nextStep } = useMultiStepForm({ totalSteps: TOTAL_STEPS });
  const { hasLoaded, markAsLoaded } = useFormDataLoader();

  // Form state
  const [distanceChart, setDistanceChart] = useState('');
  const [screeningDistance, setScreeningDistance] = useState('');
  const [withSpectacleRight, setWithSpectacleRight] = useState('');
  const [withSpectacleLeft, setWithSpectacleLeft] = useState('');
  const [unaidedRight, setUnaidedRight] = useState('');
  const [unaidedLeft, setUnaidedLeft] = useState('');
  const [pinHoleRight, setPinHoleRight] = useState('');
  const [pinHoleLeft, setPinHoleLeft] = useState('');
  const [distanceOperatorObservation, setDistanceOperatorObservation] = useState('');
  const [distanceTestResult, setDistanceTestResult] = useState<'pass' | 'refer' | null>(null);

  // Pre-fill form from existing data
  useEffect(() => {
    if (data?.data?.description && !hasLoaded) {
      const desc = data.data.description as VisualAcuityDescription;

      setDistanceChart(desc.distance_visual_acuity_chart ?? '');
      setScreeningDistance(desc.vision_screening_distance ?? '');

      if (desc.distance_vision) {
        setWithSpectacleRight(desc.distance_vision.with_spectacle?.right_eye ?? '');
        setWithSpectacleLeft(desc.distance_vision.with_spectacle?.left_eye ?? '');
        setUnaidedRight(desc.distance_vision.un_aided?.right_eye ?? '');
        setUnaidedLeft(desc.distance_vision.un_aided?.left_eye ?? '');
        setPinHoleRight(desc.distance_vision.pin_hole?.right_eye ?? '');
        setPinHoleLeft(desc.distance_vision.pin_hole?.left_eye ?? '');
        setDistanceOperatorObservation(desc.distance_vision.operator_notes?.operator_observation ?? '');
        setDistanceTestResult(
          (desc.distance_vision.operator_notes?.distance_vision_test_result as 'pass' | 'refer') ?? null
        );
      }

      markAsLoaded();
    }
  }, [data, hasLoaded, markAsLoaded]);

  const buildDescriptionData = (): VisualAcuityDescription => ({
    distance_visual_acuity_chart: distanceChart,
    vision_screening_distance: screeningDistance,
    distance_vision: {
      with_spectacle: { right_eye: withSpectacleRight, left_eye: withSpectacleLeft },
      un_aided: { right_eye: unaidedRight, left_eye: unaidedLeft },
      pin_hole: { right_eye: pinHoleRight, left_eye: pinHoleLeft },
      operator_notes: {
        operator_observation: distanceOperatorObservation,
        distance_vision_test_result: distanceTestResult ?? '',
      },
    },
    near_visual_acuity_chart: '',
    new_vision: {
      aided: { right_eye: '', left_eye: '' },
      un_aided: { right_eye: '', left_eye: '' },
      operator_notes: { operator_observation: '', distance_vision_test_result: '' },
    },
  });

  const handleNext = () => {
    if (isLastStep) {
      saveVisualAcuity(
        { registration_id: registrationId, description: buildDescriptionData() },
        {
          onSuccess: () => router.back(),
          onError: (error) => Alert.alert('Error', error.message || 'Failed to save visual acuity data'),
        }
      );
    } else {
      nextStep();
    }
  };

  // Reusable Dropdown component for this screen
  const Dropdown = ({
    value,
    options,
    onSelect,
  }: {
    value: string;
    options: string[];
    onSelect: (value: string) => void;
  }) => {
    const [visible, setVisible] = useState(false);

    return (
      <>
        <TouchableOpacity
          style={[styles.dropdownButton, { borderColor: colors.border }]}
          onPress={() => setVisible(true)}>
          <ThemedText style={styles.dropdownValue}>{value}</ThemedText>
          <ThemedText style={styles.dropdownArrow}>˅</ThemedText>
        </TouchableOpacity>

        <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
          <Pressable style={styles.modalOverlay} onPress={() => setVisible(false)}>
            <View style={styles.modalContent}>
              <ScrollView>
                {options.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[styles.dropdownItem, value === option && styles.dropdownItemSelected]}
                    onPress={() => {
                      onSelect(option);
                      setVisible(false);
                    }}>
                    <ThemedText style={styles.dropdownItemText}>{option}</ThemedText>
                    {value === option && (
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
  };

  // Vision row component for eye measurements
  const VisionRow = ({
    label,
    value,
    onSelect,
  }: {
    label: string;
    value: string;
    onSelect: (v: string) => void;
  }) => (
    <View style={styles.visionSection}>
      <ThemedText style={styles.eyeLabel}>{label}</ThemedText>
      <View style={styles.visionRowCentered}>
        <ThemedText style={styles.largeNumber}>6</ThemedText>
        <ThemedText style={styles.separator}>/</ThemedText>
        <Dropdown value={value || '6'} options={DENOMINATOR_OPTIONS} onSelect={onSelect} />
      </View>
    </View>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <SectionCard title="Screening Details">
            <ThemedText style={styles.questionLabel}>Distance Visual Acuity Chart</ThemedText>
            {CHART_OPTIONS.map((option) => (
              <RadioButton
                key={option}
                label={option}
                selected={distanceChart === option.toLowerCase().replace(' ', '_')}
                onPress={() => setDistanceChart(option.toLowerCase().replace(' ', '_'))}
              />
            ))}
          </SectionCard>
        );

      case 2:
        return (
          <SectionCard title="Screening Details">
            <ThemedText style={styles.questionLabel}>Vision Screening Distance</ThemedText>
            {DISTANCE_OPTIONS.map((option) => (
              <RadioButton
                key={option.value}
                label={option.label}
                selected={screeningDistance === option.value}
                onPress={() => setScreeningDistance(option.value)}
              />
            ))}
          </SectionCard>
        );

      case 3:
        return (
          <SectionCard title="Distance Vision : With Spectacle">
            <VisionRow label="Right Eye (R)" value={withSpectacleRight} onSelect={setWithSpectacleRight} />
            <VisionRow label="Left Eye (L)" value={withSpectacleLeft} onSelect={setWithSpectacleLeft} />
          </SectionCard>
        );

      case 4:
        return (
          <SectionCard title="Distance Vision : Un-Aided">
            <VisionRow label="Right Eye (R)" value={unaidedRight} onSelect={setUnaidedRight} />
            <VisionRow label="Left Eye (L)" value={unaidedLeft} onSelect={setUnaidedLeft} />
          </SectionCard>
        );

      case 5:
        return (
          <SectionCard title="Distance Vision : Pin Hole">
            <VisionRow label="Right Eye (R)" value={pinHoleRight} onSelect={setPinHoleRight} />
            <VisionRow label="Left Eye (L)" value={pinHoleLeft} onSelect={setPinHoleLeft} />
          </SectionCard>
        );

      case 6:
        return (
          <SectionCard title="Distance Vision : Operator Notes">
            <View style={styles.questionContainer}>
              <ThemedText style={styles.questionLabel}>Operator&apos;s Observation</ThemedText>
              <TextInput
                placeholder="Add remarks here"
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={6}
                value={distanceOperatorObservation}
                onChangeText={setDistanceOperatorObservation}
                style={[styles.textArea, { color: colors.text, borderColor: colors.border }]}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.questionContainer}>
              <ThemedText style={styles.questionLabel}>Distance Vision Test Result</ThemedText>
              <RadioButton
                label="Pass"
                selected={distanceTestResult === 'pass'}
                onPress={() => setDistanceTestResult('pass')}
              />
              <RadioButton
                label="Refer"
                selected={distanceTestResult === 'refer'}
                onPress={() => setDistanceTestResult('refer')}
              />
            </View>
          </SectionCard>
        );

      default:
        return null;
    }
  };

  // Loading state using shared component
  if (isFetching) {
    return (
      <ThemedView style={Layout.container}>
        <ScreenHeader title="Visual Acuity" />
        <LoadingState message="Loading..." fullScreen />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={Layout.container}>
      <ScreenHeader title="Visual Acuity" />

      <ScrollView style={Layout.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>{renderStep()}</View>
        <View style={styles.bottomPadding} />
      </ScrollView>

      <FixedBottomButton
        label={isLastStep ? 'Save' : 'Next'}
        onPress={handleNext}
        loading={isSaving}
        showChevron={!isLastStep}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.lg,
  },
  bottomPadding: {
    height: 120,
  },
  questionContainer: {
    marginBottom: Spacing.xl,
  },
  questionLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: Spacing.md,
  },
  visionSection: {
    marginBottom: Spacing.xl,
  },
  eyeLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: Spacing.md,
  },
  visionRowCentered: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  largeNumber: {
    fontSize: 40,
    fontWeight: Typography.fontWeight.bold,
    lineHeight: 48,
  },
  separator: {
    fontSize: 40,
    fontWeight: Typography.fontWeight.bold,
    marginHorizontal: Spacing.sm,
    lineHeight: 48,
  },
  textArea: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    fontSize: Typography.fontSize.base,
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: 'transparent',
  },
  // Dropdown styles (specific to this screen's large number display)
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    minWidth: 120,
    minHeight: 80,
  },
  dropdownValue: {
    fontSize: 40,
    fontWeight: Typography.fontWeight.bold,
    lineHeight: 48,
  },
  dropdownArrow: {
    fontSize: 16,
    marginLeft: 4,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  dropdownItemSelected: {
    backgroundColor: 'rgba(74, 108, 247, 0.1)',
  },
  dropdownItemText: {
    fontSize: Typography.fontSize.lg,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: DesignColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
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
    minWidth: 200,
    maxHeight: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
});
