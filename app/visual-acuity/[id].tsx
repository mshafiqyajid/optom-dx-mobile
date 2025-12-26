import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { RadioButton } from '@/components/ui/radio-button';
import { BorderRadius, DesignColors, IconSizes, Spacing, Typography } from '@/constants/design-system';
import { Layout, getThemedColors } from '@/constants/styles';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useGetVisualAcuityAssessment, useCreateOrUpdateVisualAcuityAssessment } from '@/services';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import {
  ActivityIndicator,
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

  const [currentStep, setCurrentStep] = useState(1);
  const [hasLoadedData, setHasLoadedData] = useState(false);

  // Step 1: Distance Visual Acuity Chart
  const [distanceChart, setDistanceChart] = useState<string>('');

  // Step 2: Vision Screening Distance
  const [screeningDistance, setScreeningDistance] = useState<string>('');

  // Step 3: Distance Vision - With Spectacle (backend uses simple string values)
  const [withSpectacleRight, setWithSpectacleRight] = useState('');
  const [withSpectacleLeft, setWithSpectacleLeft] = useState('');

  // Step 4: Distance Vision - Un-Aided
  const [unaidedRight, setUnaidedRight] = useState('');
  const [unaidedLeft, setUnaidedLeft] = useState('');

  // Step 5: Distance Vision - Pin Hole
  const [pinHoleRight, setPinHoleRight] = useState('');
  const [pinHoleLeft, setPinHoleLeft] = useState('');

  // Step 6: Operator Notes (for distance vision)
  const [distanceOperatorObservation, setDistanceOperatorObservation] = useState('');
  const [distanceTestResult, setDistanceTestResult] = useState<'pass' | 'refer' | null>(null);

  // Pre-fill form from existing data (backend uses flat structure)
  useEffect(() => {
    if (data?.data?.description && !hasLoadedData) {
      const desc = data.data.description as VisualAcuityDescription;

      // Screening details
      setDistanceChart(desc.distance_visual_acuity_chart ?? '');
      setScreeningDistance(desc.vision_screening_distance ?? '');

      // Distance vision
      if (desc.distance_vision) {
        setWithSpectacleRight(desc.distance_vision.with_spectacle?.right_eye ?? '');
        setWithSpectacleLeft(desc.distance_vision.with_spectacle?.left_eye ?? '');
        setUnaidedRight(desc.distance_vision.un_aided?.right_eye ?? '');
        setUnaidedLeft(desc.distance_vision.un_aided?.left_eye ?? '');
        setPinHoleRight(desc.distance_vision.pin_hole?.right_eye ?? '');
        setPinHoleLeft(desc.distance_vision.pin_hole?.left_eye ?? '');
        setDistanceOperatorObservation(desc.distance_vision.operator_notes?.operator_observation ?? '');
        setDistanceTestResult((desc.distance_vision.operator_notes?.distance_vision_test_result as 'pass' | 'refer') ?? null);
      }

      setHasLoadedData(true);
    }
  }, [data, hasLoadedData]);

  // Build description data matching backend structure
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
    near_visual_acuity_chart: '', // Can be added if needed
    new_vision: {
      aided: { right_eye: '', left_eye: '' },
      un_aided: { right_eye: '', left_eye: '' },
      operator_notes: {
        operator_observation: '',
        distance_vision_test_result: '',
      },
    },
  });

  const chartOptions = [
    'HOTV',
    'LEA Symbols',
    'Tumbling E',
    'LogMAR',
    'Snellen',
  ];

  const distanceOptions = [
    { value: '1.5', label: '1.5 metres' },
    { value: '3.0', label: '3.0 metres' },
    { value: '6.0', label: '6.0 metres' },
  ];

  const denominatorOptions = ['60', '36', '24', '18', '12', '9', '6'];

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save and navigate back
      saveVisualAcuity(
        {
          registration_id: registrationId,
          description: buildDescriptionData(),
        },
        {
          onSuccess: () => {
            router.back();
          },
          onError: (error) => {
            Alert.alert('Error', error.message || 'Failed to save visual acuity data');
          },
        }
      );
    }
  };

  const Dropdown = ({
    value,
    options,
    onSelect,
    isLarge = true,
  }: {
    value: string;
    options: string[];
    onSelect: (value: string) => void;
    isLarge?: boolean;
  }) => {
    const [visible, setVisible] = useState(false);

    return (
      <>
        <TouchableOpacity
          style={[isLarge ? styles.dropdownButton : styles.dropdownButtonSmall, { borderColor: colors.border }]}
          onPress={() => setVisible(true)}>
          <ThemedText style={isLarge ? styles.dropdownValue : styles.dropdownValueSmall}>{value}</ThemedText>
          <ThemedText style={isLarge ? styles.dropdownArrow : styles.dropdownArrowSmall}>˅</ThemedText>
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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        // Screening Details - Distance Visual Acuity Chart
        return (
          <View style={styles.sectionCard}>
            <View style={[styles.sectionHeader, { backgroundColor: colors.surface }]}>
              <ThemedText style={styles.sectionTitle}>Screening Details</ThemedText>
            </View>

            <View style={styles.questionContent}>
              <ThemedText style={styles.questionLabel}>Distance Visual Acuity Chart</ThemedText>

              {chartOptions.map((option) => (
                <RadioButton
                  key={option}
                  label={option}
                  selected={distanceChart === option.toLowerCase().replace(' ', '_')}
                  onPress={() => setDistanceChart(option.toLowerCase().replace(' ', '_'))}
                />
              ))}
            </View>
          </View>
        );

      case 2:
        // Vision Screening Distance
        return (
          <View style={styles.sectionCard}>
            <View style={[styles.sectionHeader, { backgroundColor: colors.surface }]}>
              <ThemedText style={styles.sectionTitle}>Screening Details</ThemedText>
            </View>

            <View style={styles.questionContent}>
              <ThemedText style={styles.questionLabel}>Vision Screening Distance</ThemedText>

              {distanceOptions.map((option) => (
                <RadioButton
                  key={option.value}
                  label={option.label}
                  selected={screeningDistance === option.value}
                  onPress={() => setScreeningDistance(option.value)}
                />
              ))}
            </View>
          </View>
        );

      case 3:
        // Distance Vision: With Spectacle
        return (
          <View style={styles.sectionCard}>
            <View style={[styles.sectionHeader, { backgroundColor: colors.surface }]}>
              <ThemedText style={styles.sectionTitle}>Distance Vision : With Spectacle</ThemedText>
            </View>

            <View style={styles.questionContent}>
              {/* Right Eye */}
              <View style={styles.visionSection}>
                <ThemedText style={styles.eyeLabel}>Right Eye (R)</ThemedText>

                <View style={styles.visionRowCentered}>
                  <ThemedText style={styles.largeNumber}>6</ThemedText>
                  <ThemedText style={styles.separator}>/</ThemedText>
                  <Dropdown
                    value={withSpectacleRight || '6'}
                    options={denominatorOptions}
                    onSelect={setWithSpectacleRight}
                    isLarge
                  />
                </View>
              </View>

              {/* Left Eye */}
              <View style={styles.visionSection}>
                <ThemedText style={styles.eyeLabel}>Left Eye (L)</ThemedText>

                <View style={styles.visionRowCentered}>
                  <ThemedText style={styles.largeNumber}>6</ThemedText>
                  <ThemedText style={styles.separator}>/</ThemedText>
                  <Dropdown
                    value={withSpectacleLeft || '6'}
                    options={denominatorOptions}
                    onSelect={setWithSpectacleLeft}
                    isLarge
                  />
                </View>
              </View>
            </View>
          </View>
        );

      case 4:
        // Distance Vision: Un-Aided
        return (
          <View style={styles.sectionCard}>
            <View style={[styles.sectionHeader, { backgroundColor: colors.surface }]}>
              <ThemedText style={styles.sectionTitle}>Distance Vision : Un-Aided</ThemedText>
            </View>

            <View style={styles.questionContent}>
              {/* Right Eye */}
              <View style={styles.visionSection}>
                <ThemedText style={styles.eyeLabel}>Right Eye (R)</ThemedText>

                <View style={styles.visionRowCentered}>
                  <ThemedText style={styles.largeNumber}>6</ThemedText>
                  <ThemedText style={styles.separator}>/</ThemedText>
                  <Dropdown
                    value={unaidedRight || '6'}
                    options={denominatorOptions}
                    onSelect={setUnaidedRight}
                    isLarge
                  />
                </View>
              </View>

              {/* Left Eye */}
              <View style={styles.visionSection}>
                <ThemedText style={styles.eyeLabel}>Left Eye (L)</ThemedText>

                <View style={styles.visionRowCentered}>
                  <ThemedText style={styles.largeNumber}>6</ThemedText>
                  <ThemedText style={styles.separator}>/</ThemedText>
                  <Dropdown
                    value={unaidedLeft || '6'}
                    options={denominatorOptions}
                    onSelect={setUnaidedLeft}
                    isLarge
                  />
                </View>
              </View>
            </View>
          </View>
        );

      case 5:
        // Distance Vision: Pin Hole
        return (
          <View style={styles.sectionCard}>
            <View style={[styles.sectionHeader, { backgroundColor: colors.surface }]}>
              <ThemedText style={styles.sectionTitle}>Distance Vision : Pin Hole</ThemedText>
            </View>

            <View style={styles.questionContent}>
              {/* Right Eye */}
              <View style={styles.visionSection}>
                <ThemedText style={styles.eyeLabel}>Right Eye (R)</ThemedText>

                <View style={styles.visionRowCentered}>
                  <ThemedText style={styles.largeNumber}>6</ThemedText>
                  <ThemedText style={styles.separator}>/</ThemedText>
                  <Dropdown
                    value={pinHoleRight || '6'}
                    options={denominatorOptions}
                    onSelect={setPinHoleRight}
                    isLarge
                  />
                </View>
              </View>

              {/* Left Eye */}
              <View style={styles.visionSection}>
                <ThemedText style={styles.eyeLabel}>Left Eye (L)</ThemedText>

                <View style={styles.visionRowCentered}>
                  <ThemedText style={styles.largeNumber}>6</ThemedText>
                  <ThemedText style={styles.separator}>/</ThemedText>
                  <Dropdown
                    value={pinHoleLeft || '6'}
                    options={denominatorOptions}
                    onSelect={setPinHoleLeft}
                    isLarge
                  />
                </View>
              </View>
            </View>
          </View>
        );

      case 6:
        // Operator Notes
        return (
          <View style={styles.sectionCard}>
            <View style={[styles.sectionHeader, { backgroundColor: colors.surface }]}>
              <ThemedText style={styles.sectionTitle}>Distance Vision : Operator Notes</ThemedText>
            </View>

            <View style={styles.questionContent}>
              <View style={styles.questionContainer}>
                <ThemedText style={styles.questionLabel}>Operator&apos;s Observation</ThemedText>

                <TextInput
                  placeholder="Add remarks here"
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  numberOfLines={6}
                  value={distanceOperatorObservation}
                  onChangeText={setDistanceOperatorObservation}
                  style={[
                    styles.textArea,
                    {
                      color: colors.text,
                      borderColor: colors.border,
                    },
                  ]}
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
            </View>
          </View>
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
          <ThemedText style={styles.headerTitle}>Visual Acuity</ThemedText>
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
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={IconSizes.lg} color={colors.text} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Visual Acuity</ThemedText>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={Layout.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>{renderStep()}</View>

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
                {currentStep === 6 ? 'Save' : 'Next'}
              </ThemedText>
              {currentStep < 6 && <IconSymbol name="chevron.right" size={20} color="#FFFFFF" />}
            </>
          )}
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
    fontWeight: Typography.fontWeight.bold,
  },
  content: {
    padding: Spacing.lg,
  },
  sectionCard: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  sectionHeader: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
  questionContent: {
    padding: Spacing.lg,
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
  visionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  visionRowCentered: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  nearVisionRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  visionInput: {
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: 'transparent',
  },
  visionInputLarge: {
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: 'transparent',
    fontSize: 40,
    fontWeight: Typography.fontWeight.bold,
    minWidth: 120,
    minHeight: 80,
  },
  largeInput: {
    fontSize: 72,
    fontWeight: Typography.fontWeight.bold,
    width: 140,
    height: 120,
  },
  smallInput: {
    fontSize: Typography.fontSize.xl,
    width: 80,
    height: 60,
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
  dropdownButtonSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    minWidth: 80,
    minHeight: 60,
  },
  dropdownValue: {
    fontSize: 40,
    fontWeight: Typography.fontWeight.bold,
    lineHeight: 48,
  },
  dropdownValueSmall: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.medium,
  },
  dropdownArrow: {
    fontSize: 16,
    marginLeft: 4,
  },
  dropdownArrowSmall: {
    fontSize: 12,
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
  buttonDisabled: {
    opacity: 0.7,
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
});
