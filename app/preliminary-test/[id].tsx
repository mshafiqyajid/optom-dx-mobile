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

// Section data interfaces
interface SectionAData {
  right_eye: {
    sphere: string;
    cylinder: string;
    axis: string;
    va: string;
  };
  left_eye: {
    sphere: string;
    cylinder: string;
    axis: string;
    va: string;
  };
}

interface SectionBData {
  right_eye_pd: string;
  left_eye_pd: string;
  pd_distance: string;
}

interface SectionCData {
  deviation_size: 'small' | 'big' | null;
  deviation_type: 'exophoria' | 'esophoria' | null;
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

  // Pre-fill form from existing data
  useEffect(() => {
    if (data?.data && !hasLoadedData) {
      const { section_a, section_b, section_c } = data.data;

      if (section_a) {
        const sectionA = section_a as SectionAData;
        setRightEyeSphere(sectionA.right_eye?.sphere ?? '');
        setRightEyeCylinder(sectionA.right_eye?.cylinder ?? '');
        setRightEyeAxis(sectionA.right_eye?.axis ?? '');
        setRightEyeVA(sectionA.right_eye?.va ?? '');
        setLeftEyeSphere(sectionA.left_eye?.sphere ?? '');
        setLeftEyeCylinder(sectionA.left_eye?.cylinder ?? '');
        setLeftEyeAxis(sectionA.left_eye?.axis ?? '');
        setLeftEyeVA(sectionA.left_eye?.va ?? '');
      }

      if (section_b) {
        const sectionB = section_b as SectionBData;
        setRightEyePD(sectionB.right_eye_pd ?? '');
        setLeftEyePD(sectionB.left_eye_pd ?? '');
        setPdDistance(sectionB.pd_distance ?? '');
      }

      if (section_c) {
        const sectionC = section_c as SectionCData;
        setDeviationSize(sectionC.deviation_size ?? null);
        setDeviationType(sectionC.deviation_type ?? null);
      }

      setHasLoadedData(true);
    }
  }, [data, hasLoadedData]);

  // Build section data from form state
  const buildSectionAData = (): SectionAData => ({
    right_eye: {
      sphere: rightEyeSphere,
      cylinder: rightEyeCylinder,
      axis: rightEyeAxis,
      va: rightEyeVA,
    },
    left_eye: {
      sphere: leftEyeSphere,
      cylinder: leftEyeCylinder,
      axis: leftEyeAxis,
      va: leftEyeVA,
    },
  });

  const buildSectionBData = (): SectionBData => ({
    right_eye_pd: rightEyePD,
    left_eye_pd: leftEyePD,
    pd_distance: pdDistance,
  });

  const buildSectionCData = (): SectionCData => ({
    deviation_size: deviationSize,
    deviation_type: deviationType,
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
