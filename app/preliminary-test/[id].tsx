import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { RadioButton } from '@/components/ui/radio-button';
import { BorderRadius, DesignColors, IconSizes, Spacing, Typography } from '@/constants/design-system';
import { Layout, getThemedColors } from '@/constants/styles';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useGetPreliminaryTest, useCreateOrUpdatePreliminaryTest } from '@/services';
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
} from 'react-native';

// Backend API structure for Preliminary Test
// Section A: Old Prescription uses {a, b, c, d} format
interface EyePrescription {
  a: string; // sphere
  b: string; // cylinder
  c: string; // axis
  d: string; // VA
}

interface SectionAData {
  right_eye: EyePrescription;
  left_eye: EyePrescription;
}

// Section B: Pupillary Distance uses {mm: value} format
interface EyePD {
  mm: number;
}

interface SectionBData {
  right_eye: EyePD;
  left_eye: EyePD;
  pd_distance: EyePD;
}

// Section C: Cover Test uses {answer: value} format
interface AnswerField {
  answer: string;
}

interface SectionCData {
  deviation_size: AnswerField;
  type_of_deviation: AnswerField;
}

export default function PreliminaryTestScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getThemedColors(isDark);

  const registrationId = typeof id === 'string' ? parseInt(id, 10) : 0;

  // API hooks
  const { data, isLoading: isFetching } = useGetPreliminaryTest(registrationId);
  const { mutate: savePreliminaryTest, isPending: isSaving } = useCreateOrUpdatePreliminaryTest();

  const [currentStep, setCurrentStep] = useState(1);
  const [hasLoadedData, setHasLoadedData] = useState(false);

  // Section A: Old Prescription (OLD RX)
  // Right Eye
  const [rightEyeSphere, setRightEyeSphere] = useState('');
  const [rightEyeCylinder, setRightEyeCylinder] = useState('');
  const [rightEyeAxis, setRightEyeAxis] = useState('');
  const [rightEyeVA, setRightEyeVA] = useState('');

  // Left Eye
  const [leftEyeSphere, setLeftEyeSphere] = useState('');
  const [leftEyeCylinder, setLeftEyeCylinder] = useState('');
  const [leftEyeAxis, setLeftEyeAxis] = useState('');
  const [leftEyeVA, setLeftEyeVA] = useState('');

  // Section B: Pupillary Distance
  const [rightEyePD, setRightEyePD] = useState('');
  const [leftEyePD, setLeftEyePD] = useState('');
  const [pdDistance, setPdDistance] = useState('');

  // Section C: Cover Test
  const [deviationSize, setDeviationSize] = useState<'small' | 'big' | null>(null);
  const [deviationType, setDeviationType] = useState<'exophoria' | 'esophoria' | null>(null);

  // Pre-fill form from existing data (backend uses a, b, c, d format)
  useEffect(() => {
    if (data?.data && !hasLoadedData) {
      const { section_a, section_b, section_c } = data.data;

      if (section_a) {
        const sectionA = section_a as SectionAData;
        // Right eye uses a, b, c, d
        setRightEyeSphere(sectionA.right_eye?.a ?? '');
        setRightEyeCylinder(sectionA.right_eye?.b ?? '');
        setRightEyeAxis(sectionA.right_eye?.c ?? '');
        setRightEyeVA(sectionA.right_eye?.d ?? '');
        // Left eye (note: backend uses "lefy_eye" typo)
        setLeftEyeSphere(sectionA.lefy_eye?.a ?? '');
        setLeftEyeCylinder(sectionA.lefy_eye?.b ?? '');
        setLeftEyeAxis(sectionA.lefy_eye?.c ?? '');
        setLeftEyeVA(sectionA.lefy_eye?.d ?? '');
      }

      if (section_b) {
        const sectionB = section_b as SectionBData;
        // Backend uses {mm: value} structure
        setRightEyePD(String(sectionB.right_eye?.mm ?? ''));
        setLeftEyePD(String(sectionB.left_eye?.mm ?? ''));
        setPdDistance(String(sectionB.pd_distance?.mm ?? ''));
      }

      if (section_c) {
        const sectionC = section_c as SectionCData;
        // Backend uses {answer: value} structure
        setDeviationSize((sectionC.deviation_size?.answer as 'small' | 'big') ?? null);
        setDeviationType((sectionC.type_of_deviation?.answer as 'exophoria' | 'esophoria') ?? null);
      }

      setHasLoadedData(true);
    }
  }, [data, hasLoadedData]);

  // Build section data matching backend structure
  const buildSectionAData = (): SectionAData => ({
    right_eye: {
      a: rightEyeSphere,
      b: rightEyeCylinder,
      c: rightEyeAxis,
      d: rightEyeVA,
    },
    lefy_eye: { // Note: Backend typo - must use "lefy_eye"
      a: leftEyeSphere,
      b: leftEyeCylinder,
      c: leftEyeAxis,
      d: leftEyeVA,
    },
  });

  const buildSectionBData = (): SectionBData => ({
    right_eye: { mm: parseFloat(rightEyePD) || 0 },
    left_eye: { mm: parseFloat(leftEyePD) || 0 },
    pd_distance: { mm: parseFloat(pdDistance) || 0 },
  });

  const buildSectionCData = (): SectionCData => ({
    deviation_size: { answer: deviationSize ?? '' },
    type_of_deviation: { answer: deviationType ?? '' },
  });

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save and navigate back
      savePreliminaryTest(
        {
          registration_id: registrationId,
          section_a: buildSectionAData(),
          section_b: buildSectionBData(),
          section_c: buildSectionCData(),
        },
        {
          onSuccess: () => {
            router.back();
          },
          onError: (error) => {
            Alert.alert('Error', error.message || 'Failed to save preliminary test data');
          },
        }
      );
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        // Section A & B
        return (
          <>
            {/* Section A Card */}
            <View style={styles.sectionCard}>
              <View style={[styles.sectionHeader, { backgroundColor: colors.surface }]}>
                <ThemedText style={styles.sectionTitle}>
                  Section A : Old Prescription (OLD RX)
                </ThemedText>
              </View>

              <View style={styles.questionContent}>
                {/* Right Eye */}
                <View style={styles.eyeSection}>
                  <ThemedText style={styles.eyeLabel}>Right Eye (R)</ThemedText>

                  <View style={styles.prescriptionRow}>
                    <TextInput
                      value={rightEyeSphere}
                      onChangeText={setRightEyeSphere}
                      style={[
                        styles.inputField,
                        styles.prescriptionInput,
                        { color: colors.text, borderColor: colors.border },
                      ]}
                      textAlign="center"
                    />
                    <ThemedText style={styles.separator}>/</ThemedText>
                    <TextInput
                      value={rightEyeCylinder}
                      onChangeText={setRightEyeCylinder}
                      style={[
                        styles.inputField,
                        styles.prescriptionInput,
                        { color: colors.text, borderColor: colors.border },
                      ]}
                      textAlign="center"
                    />
                    <ThemedText style={styles.separator}>x</ThemedText>
                    <TextInput
                      value={rightEyeAxis}
                      onChangeText={setRightEyeAxis}
                      style={[
                        styles.inputField,
                        styles.prescriptionInput,
                        { color: colors.text, borderColor: colors.border },
                      ]}
                      textAlign="center"
                    />
                    <TextInput
                      value={rightEyeVA}
                      onChangeText={setRightEyeVA}
                      style={[
                        styles.inputField,
                        styles.vaInput,
                        { color: colors.text, borderColor: colors.border },
                      ]}
                      textAlign="center"
                    />
                  </View>
                </View>

                {/* Left Eye */}
                <View style={styles.eyeSection}>
                  <ThemedText style={styles.eyeLabel}>Left Eye (L)</ThemedText>

                  <View style={styles.prescriptionRow}>
                    <TextInput
                      value={leftEyeSphere}
                      onChangeText={setLeftEyeSphere}
                      style={[
                        styles.inputField,
                        styles.prescriptionInput,
                        { color: colors.text, borderColor: colors.border },
                      ]}
                      textAlign="center"
                    />
                    <ThemedText style={styles.separator}>/</ThemedText>
                    <TextInput
                      value={leftEyeCylinder}
                      onChangeText={setLeftEyeCylinder}
                      style={[
                        styles.inputField,
                        styles.prescriptionInput,
                        { color: colors.text, borderColor: colors.border },
                      ]}
                      textAlign="center"
                    />
                    <ThemedText style={styles.separator}>x</ThemedText>
                    <TextInput
                      value={leftEyeAxis}
                      onChangeText={setLeftEyeAxis}
                      style={[
                        styles.inputField,
                        styles.prescriptionInput,
                        { color: colors.text, borderColor: colors.border },
                      ]}
                      textAlign="center"
                    />
                    <TextInput
                      value={leftEyeVA}
                      onChangeText={setLeftEyeVA}
                      style={[
                        styles.inputField,
                        styles.vaInput,
                        { color: colors.text, borderColor: colors.border },
                      ]}
                      textAlign="center"
                    />
                  </View>
                </View>
              </View>
            </View>

            {/* Section B Card */}
            <View style={styles.sectionCard}>
              <View style={[styles.sectionHeader, { backgroundColor: colors.surface }]}>
                <ThemedText style={styles.sectionTitle}>Section B : Pupillary Distance</ThemedText>
              </View>

              <View style={styles.questionContent}>
                <View style={styles.pdRow}>
                  <View style={styles.pdColumn}>
                    <ThemedText style={styles.pdLabel}>Right Eye (R)</ThemedText>
                    <View style={styles.pdInputContainer}>
                      <TextInput
                        value={rightEyePD}
                        onChangeText={setRightEyePD}
                        style={[
                          styles.inputField,
                          styles.pdInput,
                          { color: colors.text, borderColor: colors.border },
                        ]}
                        textAlign="center"
                      />
                      <ThemedText style={styles.unit}>mm</ThemedText>
                    </View>
                  </View>

                  <View style={styles.pdColumn}>
                    <ThemedText style={styles.pdLabel}>Left Eye (L)</ThemedText>
                    <View style={styles.pdInputContainer}>
                      <TextInput
                        value={leftEyePD}
                        onChangeText={setLeftEyePD}
                        style={[
                          styles.inputField,
                          styles.pdInput,
                          { color: colors.text, borderColor: colors.border },
                        ]}
                        textAlign="center"
                      />
                      <ThemedText style={styles.unit}>mm</ThemedText>
                    </View>
                  </View>

                  <View style={styles.pdColumn}>
                    <ThemedText style={styles.pdLabel}>PD Distance</ThemedText>
                    <View style={styles.pdInputContainer}>
                      <TextInput
                        value={pdDistance}
                        onChangeText={setPdDistance}
                        style={[
                          styles.inputField,
                          styles.pdInput,
                          { color: colors.text, borderColor: colors.border },
                        ]}
                        textAlign="center"
                      />
                      <ThemedText style={styles.unit}>mm</ThemedText>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </>
        );

      case 2:
        // Section C: Cover Test
        return (
          <View style={styles.sectionCard}>
            <View style={[styles.sectionHeader, { backgroundColor: colors.surface }]}>
              <ThemedText style={styles.sectionTitle}>Section C : Cover Test</ThemedText>
            </View>

            <View style={styles.questionContent}>
              <View style={styles.questionContainer}>
                <ThemedText style={styles.questionLabel}>Deviation Size</ThemedText>

                <RadioButton
                  label="Small"
                  selected={deviationSize === 'small'}
                  onPress={() => setDeviationSize('small')}
                />
                <RadioButton
                  label="Big"
                  selected={deviationSize === 'big'}
                  onPress={() => setDeviationSize('big')}
                />
              </View>

              <View style={styles.questionContainer}>
                <ThemedText style={styles.questionLabel}>Type of Deviation</ThemedText>

                <RadioButton
                  label="Exophoria"
                  selected={deviationType === 'exophoria'}
                  onPress={() => setDeviationType('exophoria')}
                />
                <RadioButton
                  label="Esophoria"
                  selected={deviationType === 'esophoria'}
                  onPress={() => setDeviationType('esophoria')}
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
          <ThemedText style={styles.headerTitle}>Preliminary Test</ThemedText>
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
        <ThemedText style={styles.headerTitle}>Preliminary Test</ThemedText>
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
                {currentStep === 2 ? 'Save' : 'Next'}
              </ThemedText>
              {currentStep < 2 && <IconSymbol name="chevron.right" size={20} color="#FFFFFF" />}
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
  questionContent: {
    padding: Spacing.lg,
  },
  eyeSection: {
    marginBottom: Spacing.lg,
  },
  eyeLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: Spacing.md,
  },
  prescriptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  inputField: {
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: Typography.fontSize.base,
    backgroundColor: 'transparent',
  },
  prescriptionInput: {
    flex: 1,
    minWidth: 60,
  },
  vaInput: {
    flex: 1.2,
    minWidth: 70,
  },
  separator: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.medium,
  },
  pdRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  pdColumn: {
    flex: 1,
  },
  pdLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  pdInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  pdInput: {
    flex: 1,
  },
  unit: {
    fontSize: Typography.fontSize.sm,
    color: '#666666',
  },
  questionContainer: {
    marginBottom: Spacing.xl,
  },
  questionLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: Spacing.md,
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
