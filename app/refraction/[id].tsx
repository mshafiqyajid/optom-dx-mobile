import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { RadioButton } from '@/components/ui/radio-button';
import { ScreenHeader, LoadingState, FixedBottomButton, SectionCard } from '@/components/ui';
import { BorderRadius, DesignColors, Spacing, Typography } from '@/constants/design-system';
import { Layout, getThemedColors } from '@/constants/styles';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useMultiStepForm, useFormDataLoader } from '@/hooks/use-multi-step-form';
import { useGetRefractionAssessment, useCreateOrUpdateRefractionAssessment } from '@/services';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  Pressable,
} from 'react-native';

// Dropdown options for Subjective Refraction
const SPHERE_OPTIONS = [
  '+0.75', '+1.00', '+1.25', '+1.50', '+1.75', '+2.00', '+2.25', '+2.50', '+2.75', '+3.00',
  '-0.75', '-1.00', '-1.25', '-1.50', '-1.75', '-2.00', '-2.25', '-2.50', '-2.75', '-3.00',
];

const CYLINDER_OPTIONS = [
  '+0.75', '+1.00', '+1.25', '+1.50', '+1.75', '+2.00', '+2.25', '+2.50', '+2.75', '+3.00',
  '-0.75', '-1.00', '-1.25', '-1.50', '-1.75', '-2.00', '-2.25', '-2.50', '-2.75', '-3.00',
];

const VA_OPTIONS = ['6/60', '6/36', '6/24', '6/18', '6/12', '6/9', '6/6'];

const READING_ADD_OPTIONS = ['+0.75', '+1.00', '+1.25', '+1.50', '+1.75', '+2.00', '+2.25', '+2.50', '+2.75', '+3.00'];

const READING_N_OPTIONS = ['14', '12', '10', '8', '6'];

const READING_DISTANCE_OPTIONS = ['40', '30'];

interface InlineDropdownProps {
  value: string;
  options: string[];
  onSelect: (value: string) => void;
  placeholder?: string;
}

function InlineDropdown({ value, options, onSelect, placeholder = 'Select' }: InlineDropdownProps) {
  const [visible, setVisible] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getThemedColors(isDark);

  return (
    <>
      <TouchableOpacity
        style={[styles.inlineDropdown, { borderColor: colors.border }]}
        onPress={() => setVisible(true)}>
        <ThemedText style={[styles.inlineDropdownText, !value && { color: colors.textSecondary }]}>
          {value || placeholder}
        </ThemedText>
        <IconSymbol name="chevron.down" size={12} color={colors.textSecondary} />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setVisible(false)}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.optionsList}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[styles.optionItem, value === option && styles.optionItemSelected]}
                  onPress={() => {
                    onSelect(option);
                    setVisible(false);
                  }}>
                  <ThemedText style={styles.optionText}>{option}</ThemedText>
                  {value === option && (
                    <IconSymbol name="checkmark.circle.fill" size={20} color={DesignColors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

// Backend API structure for Refraction Assessment
// Uses {a, b, c, d} for eye data instead of {sph, cyl, axis, va}
interface EyeRefraction {
  a: string; // Sphere
  b: string; // Cylinder
  c: string; // Axis
  d: string; // VA
}

interface ReadingSpectacles {
  a: string; // Add power
  b: string; // N value
  c: string; // Distance
}

interface OperatorNotes {
  operator_observation: string;
  test_result: string;
}

interface RefractionDescription {
  objective_refraction: {
    right_eye: EyeRefraction;
    left_eye: EyeRefraction;
  };
  subjective_refraction: {
    right_eye: EyeRefraction;
    left_eye: EyeRefraction;
    reading_spectacles_prescribe: ReadingSpectacles;
  };
  operator_notes: OperatorNotes;
}

const TOTAL_STEPS = 3;

export default function RefractionAssessmentScreen() {
  const { id } = useLocalSearchParams();
  const registrationId = typeof id === 'string' ? parseInt(id, 10) : 0;
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getThemedColors(isDark);

  // API hooks
  const { data, isLoading: isFetching } = useGetRefractionAssessment(registrationId);
  const { mutate: saveRefraction, isPending: isSaving } = useCreateOrUpdateRefractionAssessment();

  // Multi-step form management
  const { currentStep, isLastStep, nextStep } = useMultiStepForm({ totalSteps: TOTAL_STEPS });
  const { hasLoaded, markAsLoaded } = useFormDataLoader();

  // Step 1: Objective Refraction - Text inputs
  const [objRightSph, setObjRightSph] = useState('');
  const [objRightCyl, setObjRightCyl] = useState('');
  const [objRightAxis, setObjRightAxis] = useState('');
  const [objRightVa, setObjRightVa] = useState('');

  const [objLeftSph, setObjLeftSph] = useState('');
  const [objLeftCyl, setObjLeftCyl] = useState('');
  const [objLeftAxis, setObjLeftAxis] = useState('');
  const [objLeftVa, setObjLeftVa] = useState('');

  // Step 2: Subjective Refraction - Dropdowns
  const [subRightSph, setSubRightSph] = useState('');
  const [subRightCyl, setSubRightCyl] = useState('');
  const [subRightAxis, setSubRightAxis] = useState('');
  const [subRightVa, setSubRightVa] = useState('');

  const [subLeftSph, setSubLeftSph] = useState('');
  const [subLeftCyl, setSubLeftCyl] = useState('');
  const [subLeftAxis, setSubLeftAxis] = useState('');
  const [subLeftVa, setSubLeftVa] = useState('');

  // Reading spectacles
  const [readingAdd, setReadingAdd] = useState('');
  const [readingN, setReadingN] = useState('');
  const [readingDistance, setReadingDistance] = useState('');

  // Step 3: Operator Notes
  const [operatorObservation, setOperatorObservation] = useState('');
  const [testResult, setTestResult] = useState<'pass' | 'refer' | null>(null);

  // Pre-fill form from existing data (uses backend {a, b, c, d} structure)
  useEffect(() => {
    if (data?.data?.description && !hasLoaded) {
      const desc = data.data.description as unknown as RefractionDescription;

      if (desc.objective_refraction) {
        setObjRightSph(desc.objective_refraction.right_eye?.a ?? '');
        setObjRightCyl(desc.objective_refraction.right_eye?.b ?? '');
        setObjRightAxis(desc.objective_refraction.right_eye?.c ?? '');
        setObjRightVa(desc.objective_refraction.right_eye?.d ?? '');
        setObjLeftSph(desc.objective_refraction.left_eye?.a ?? '');
        setObjLeftCyl(desc.objective_refraction.left_eye?.b ?? '');
        setObjLeftAxis(desc.objective_refraction.left_eye?.c ?? '');
        setObjLeftVa(desc.objective_refraction.left_eye?.d ?? '');
      }

      if (desc.subjective_refraction) {
        setSubRightSph(desc.subjective_refraction.right_eye?.a ?? '');
        setSubRightCyl(desc.subjective_refraction.right_eye?.b ?? '');
        setSubRightAxis(desc.subjective_refraction.right_eye?.c ?? '');
        setSubRightVa(desc.subjective_refraction.right_eye?.d ?? '');
        setSubLeftSph(desc.subjective_refraction.left_eye?.a ?? '');
        setSubLeftCyl(desc.subjective_refraction.left_eye?.b ?? '');
        setSubLeftAxis(desc.subjective_refraction.left_eye?.c ?? '');
        setSubLeftVa(desc.subjective_refraction.left_eye?.d ?? '');
        setReadingAdd(desc.subjective_refraction.reading_spectacles_prescribe?.a ?? '');
        setReadingN(desc.subjective_refraction.reading_spectacles_prescribe?.b ?? '');
        setReadingDistance(desc.subjective_refraction.reading_spectacles_prescribe?.c ?? '');
      }

      if (desc.operator_notes) {
        setOperatorObservation(desc.operator_notes.operator_observation ?? '');
        setTestResult((desc.operator_notes.test_result as 'pass' | 'refer') ?? null);
      }
      markAsLoaded();
    }
  }, [data, hasLoaded, markAsLoaded]);

  // Build description data from form state matching backend structure
  const buildDescriptionData = (): RefractionDescription => ({
    objective_refraction: {
      right_eye: { a: objRightSph, b: objRightCyl, c: objRightAxis, d: objRightVa },
      left_eye: { a: objLeftSph, b: objLeftCyl, c: objLeftAxis, d: objLeftVa },
    },
    subjective_refraction: {
      right_eye: { a: subRightSph, b: subRightCyl, c: subRightAxis, d: subRightVa },
      left_eye: { a: subLeftSph, b: subLeftCyl, c: subLeftAxis, d: subLeftVa },
      reading_spectacles_prescribe: { a: readingAdd, b: readingN, c: readingDistance },
    },
    operator_notes: {
      operator_observation: operatorObservation,
      test_result: testResult ?? '',
    },
  });

  const handleNext = () => {
    if (isLastStep) {
      // Save and navigate back
      saveRefraction(
        {
          registration_id: registrationId,
          description: buildDescriptionData(),
        },
        {
          onSuccess: () => router.back(),
          onError: (error) => Alert.alert('Error', error.message || 'Failed to save refraction assessment data'),
        }
      );
    } else {
      nextStep();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        // Objective Refraction
        return (
          <SectionCard title="Objective Refraction">
            {/* Right Eye */}
            <View style={styles.eyeSection}>
              <ThemedText style={styles.eyeLabel}>Right Eye (R)</ThemedText>
              <View style={styles.refractionRow}>
                <TextInput
                  style={[styles.refractionInput, { color: colors.text, borderColor: colors.border }]}
                  value={objRightSph}
                  onChangeText={setObjRightSph}
                  keyboardType="numbers-and-punctuation"
                  placeholder="-1.00"
                  placeholderTextColor={colors.textSecondary}
                />
                <ThemedText style={styles.separator}>/</ThemedText>
                <TextInput
                  style={[styles.refractionInput, { color: colors.text, borderColor: colors.border }]}
                  value={objRightCyl}
                  onChangeText={setObjRightCyl}
                  keyboardType="numbers-and-punctuation"
                  placeholder="-0.50"
                  placeholderTextColor={colors.textSecondary}
                />
                <ThemedText style={styles.separator}>x</ThemedText>
                <TextInput
                  style={[styles.refractionInput, { color: colors.text, borderColor: colors.border }]}
                  value={objRightAxis}
                  onChangeText={setObjRightAxis}
                  keyboardType="number-pad"
                  placeholder="90"
                  placeholderTextColor={colors.textSecondary}
                />
                <TextInput
                  style={[styles.vaInput, { color: colors.text, borderColor: colors.border }]}
                  value={objRightVa}
                  onChangeText={setObjRightVa}
                  placeholder="6 / 6"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>

            {/* Left Eye */}
            <View style={styles.eyeSection}>
              <ThemedText style={styles.eyeLabel}>Left Eye (L)</ThemedText>
              <View style={styles.refractionRow}>
                <TextInput
                  style={[styles.refractionInput, { color: colors.text, borderColor: colors.border }]}
                  value={objLeftSph}
                  onChangeText={setObjLeftSph}
                  keyboardType="numbers-and-punctuation"
                  placeholder="-1.00"
                  placeholderTextColor={colors.textSecondary}
                />
                <ThemedText style={styles.separator}>/</ThemedText>
                <TextInput
                  style={[styles.refractionInput, { color: colors.text, borderColor: colors.border }]}
                  value={objLeftCyl}
                  onChangeText={setObjLeftCyl}
                  keyboardType="numbers-and-punctuation"
                  placeholder="-0.50"
                  placeholderTextColor={colors.textSecondary}
                />
                <ThemedText style={styles.separator}>x</ThemedText>
                <TextInput
                  style={[styles.refractionInput, { color: colors.text, borderColor: colors.border }]}
                  value={objLeftAxis}
                  onChangeText={setObjLeftAxis}
                  keyboardType="number-pad"
                  placeholder="90"
                  placeholderTextColor={colors.textSecondary}
                />
                <TextInput
                  style={[styles.vaInput, { color: colors.text, borderColor: colors.border }]}
                  value={objLeftVa}
                  onChangeText={setObjLeftVa}
                  placeholder="6 / 6"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>
          </SectionCard>
        );

      case 2:
        // Subjective Refraction
        return (
          <SectionCard title="Subjective Refraction">
            {/* Right Eye */}
            <View style={styles.eyeSection}>
              <ThemedText style={styles.eyeLabel}>Right Eye (R)</ThemedText>
              <View style={styles.refractionRow}>
                <InlineDropdown
                  value={subRightSph}
                  options={SPHERE_OPTIONS}
                  onSelect={setSubRightSph}
                />
                <ThemedText style={styles.separator}>/</ThemedText>
                <InlineDropdown
                  value={subRightCyl}
                  options={CYLINDER_OPTIONS}
                  onSelect={setSubRightCyl}
                />
                <ThemedText style={styles.separator}>X</ThemedText>
                <TextInput
                  style={[styles.refractionInput, { color: colors.text, borderColor: colors.border }]}
                  value={subRightAxis}
                  onChangeText={setSubRightAxis}
                  keyboardType="number-pad"
                  placeholder="90"
                  placeholderTextColor={colors.textSecondary}
                />
                <InlineDropdown
                  value={subRightVa}
                  options={VA_OPTIONS}
                  onSelect={setSubRightVa}
                />
              </View>
            </View>

            {/* Left Eye */}
            <View style={styles.eyeSection}>
              <ThemedText style={styles.eyeLabel}>Left Eye (L)</ThemedText>
              <View style={styles.refractionRow}>
                <InlineDropdown
                  value={subLeftSph}
                  options={SPHERE_OPTIONS}
                  onSelect={setSubLeftSph}
                />
                <ThemedText style={styles.separator}>/</ThemedText>
                <InlineDropdown
                  value={subLeftCyl}
                  options={CYLINDER_OPTIONS}
                  onSelect={setSubLeftCyl}
                />
                <ThemedText style={styles.separator}>X</ThemedText>
                <TextInput
                  style={[styles.refractionInput, { color: colors.text, borderColor: colors.border }]}
                  value={subLeftAxis}
                  onChangeText={setSubLeftAxis}
                  keyboardType="number-pad"
                  placeholder="90"
                  placeholderTextColor={colors.textSecondary}
                />
                <InlineDropdown
                  value={subLeftVa}
                  options={VA_OPTIONS}
                  onSelect={setSubLeftVa}
                />
              </View>
            </View>

            {/* Reading Spectacles */}
            <View style={styles.readingSection}>
              <ThemedText style={styles.readingLabel}>Reading spectacles prescribe:</ThemedText>
              <View style={styles.readingRow}>
                <InlineDropdown
                  value={readingAdd}
                  options={READING_ADD_OPTIONS}
                  onSelect={setReadingAdd}
                />
                <ThemedText style={styles.readingSeparator}>N</ThemedText>
                <InlineDropdown
                  value={readingN}
                  options={READING_N_OPTIONS}
                  onSelect={setReadingN}
                />
                <ThemedText style={styles.readingSeparator}>@</ThemedText>
                <InlineDropdown
                  value={readingDistance}
                  options={READING_DISTANCE_OPTIONS}
                  onSelect={setReadingDistance}
                />
                <ThemedText style={styles.readingSeparator}>cm</ThemedText>
              </View>
            </View>
          </SectionCard>
        );

      case 3:
        // Operator Notes
        return (
          <SectionCard title="Refraction Assessment : Operator Notes">
            <View style={styles.formField}>
              <ThemedText style={styles.fieldLabel}>Operator&apos;s Observation</ThemedText>
              <TextInput
                placeholder="Add remarks here"
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={6}
                value={operatorObservation}
                onChangeText={setOperatorObservation}
                style={[styles.textArea, { color: colors.text, borderColor: colors.border }]}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.formField}>
              <ThemedText style={styles.fieldLabel}>Refraction Test Result</ThemedText>
              <RadioButton
                label="Pass"
                selected={testResult === 'pass'}
                onPress={() => setTestResult('pass')}
              />
              <RadioButton
                label="Refer"
                selected={testResult === 'refer'}
                onPress={() => setTestResult('refer')}
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
        <ScreenHeader title="Refraction Assessment" />
        <LoadingState message="Loading..." fullScreen />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={Layout.container}>
      <ScreenHeader title="Refraction Assessment" />

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
  refractionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  refractionInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.md,
    fontSize: Typography.fontSize.base,
    textAlign: 'center',
    minWidth: 60,
  },
  vaInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.md,
    fontSize: Typography.fontSize.base,
    textAlign: 'center',
    minWidth: 70,
  },
  separator: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
  },
  inlineDropdown: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.md,
    gap: 4,
    minWidth: 70,
  },
  inlineDropdownText: {
    fontSize: Typography.fontSize.base,
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
    minWidth: 150,
    maxWidth: '60%',
    maxHeight: 350,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  optionsList: {
    paddingVertical: Spacing.sm,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  optionItemSelected: {
    backgroundColor: 'rgba(74, 108, 247, 0.1)',
  },
  optionText: {
    fontSize: Typography.fontSize.base,
  },
  readingSection: {
    marginTop: Spacing.md,
  },
  readingLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: Spacing.md,
  },
  readingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  readingSeparator: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
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
});
