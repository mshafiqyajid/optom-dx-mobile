import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { RadioButton } from '@/components/ui/radio-button';
import { ScreenHeader, LoadingState, FixedBottomButton, SectionCard } from '@/components/ui';
import { BorderRadius, Spacing, Typography } from '@/constants/design-system';
import { Layout, getThemedColors } from '@/constants/styles';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useMultiStepForm, useFormDataLoader } from '@/hooks/use-multi-step-form';
import { useGetPreliminaryTest, useCreateOrUpdatePreliminaryTest } from '@/services';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
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

const TOTAL_STEPS = 2;

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

  // Multi-step form management
  const { currentStep, isLastStep, nextStep } = useMultiStepForm({ totalSteps: TOTAL_STEPS });
  const { hasLoaded, markAsLoaded } = useFormDataLoader();

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
    if (data?.data && !hasLoaded) {
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

      markAsLoaded();
    }
  }, [data, hasLoaded, markAsLoaded]);

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
    if (isLastStep) {
      // Save and navigate back
      savePreliminaryTest(
        {
          registration_id: registrationId,
          section_a: buildSectionAData(),
          section_b: buildSectionBData(),
          section_c: buildSectionCData(),
        },
        {
          onSuccess: () => router.back(),
          onError: (error) => Alert.alert('Error', error.message || 'Failed to save preliminary test data'),
        }
      );
    } else {
      nextStep();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        // Section A & B
        return (
          <>
            {/* Section A Card */}
            <SectionCard title="Section A : Old Prescription (OLD RX)">
              {/* Right Eye */}
              <View style={styles.eyeSection}>
                <ThemedText style={styles.eyeLabel}>Right Eye (R)</ThemedText>
                <View style={styles.prescriptionRow}>
                  <TextInput
                    value={rightEyeSphere}
                    onChangeText={setRightEyeSphere}
                    style={[styles.inputField, styles.prescriptionInput, { color: colors.text, borderColor: colors.border }]}
                    textAlign="center"
                  />
                  <ThemedText style={styles.separator}>/</ThemedText>
                  <TextInput
                    value={rightEyeCylinder}
                    onChangeText={setRightEyeCylinder}
                    style={[styles.inputField, styles.prescriptionInput, { color: colors.text, borderColor: colors.border }]}
                    textAlign="center"
                  />
                  <ThemedText style={styles.separator}>x</ThemedText>
                  <TextInput
                    value={rightEyeAxis}
                    onChangeText={setRightEyeAxis}
                    style={[styles.inputField, styles.prescriptionInput, { color: colors.text, borderColor: colors.border }]}
                    textAlign="center"
                  />
                  <TextInput
                    value={rightEyeVA}
                    onChangeText={setRightEyeVA}
                    style={[styles.inputField, styles.vaInput, { color: colors.text, borderColor: colors.border }]}
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
                    style={[styles.inputField, styles.prescriptionInput, { color: colors.text, borderColor: colors.border }]}
                    textAlign="center"
                  />
                  <ThemedText style={styles.separator}>/</ThemedText>
                  <TextInput
                    value={leftEyeCylinder}
                    onChangeText={setLeftEyeCylinder}
                    style={[styles.inputField, styles.prescriptionInput, { color: colors.text, borderColor: colors.border }]}
                    textAlign="center"
                  />
                  <ThemedText style={styles.separator}>x</ThemedText>
                  <TextInput
                    value={leftEyeAxis}
                    onChangeText={setLeftEyeAxis}
                    style={[styles.inputField, styles.prescriptionInput, { color: colors.text, borderColor: colors.border }]}
                    textAlign="center"
                  />
                  <TextInput
                    value={leftEyeVA}
                    onChangeText={setLeftEyeVA}
                    style={[styles.inputField, styles.vaInput, { color: colors.text, borderColor: colors.border }]}
                    textAlign="center"
                  />
                </View>
              </View>
            </SectionCard>

            {/* Section B Card */}
            <SectionCard title="Section B : Pupillary Distance">
              <View style={styles.pdRow}>
                <View style={styles.pdColumn}>
                  <ThemedText style={styles.pdLabel}>Right Eye (R)</ThemedText>
                  <View style={styles.pdInputContainer}>
                    <TextInput
                      value={rightEyePD}
                      onChangeText={setRightEyePD}
                      style={[styles.inputField, styles.pdInput, { color: colors.text, borderColor: colors.border }]}
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
                      style={[styles.inputField, styles.pdInput, { color: colors.text, borderColor: colors.border }]}
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
                      style={[styles.inputField, styles.pdInput, { color: colors.text, borderColor: colors.border }]}
                      textAlign="center"
                    />
                    <ThemedText style={styles.unit}>mm</ThemedText>
                  </View>
                </View>
              </View>
            </SectionCard>
          </>
        );

      case 2:
        // Section C: Cover Test
        return (
          <SectionCard title="Section C : Cover Test">
            <View style={styles.questionContainer}>
              <ThemedText style={styles.questionLabel}>Deviation Size</ThemedText>
              <RadioButton label="Small" selected={deviationSize === 'small'} onPress={() => setDeviationSize('small')} />
              <RadioButton label="Big" selected={deviationSize === 'big'} onPress={() => setDeviationSize('big')} />
            </View>

            <View style={styles.questionContainer}>
              <ThemedText style={styles.questionLabel}>Type of Deviation</ThemedText>
              <RadioButton label="Exophoria" selected={deviationType === 'exophoria'} onPress={() => setDeviationType('exophoria')} />
              <RadioButton label="Esophoria" selected={deviationType === 'esophoria'} onPress={() => setDeviationType('esophoria')} />
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
        <ScreenHeader title="Preliminary Test" />
        <LoadingState message="Loading..." fullScreen />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={Layout.container}>
      <ScreenHeader title="Preliminary Test" />

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
});
