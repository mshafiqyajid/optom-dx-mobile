import { SectionCard } from '@/components/ui/section-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { RadioButton } from '@/components/ui/radio-button';
import { BorderRadius, DesignColors, IconSizes, Spacing, Typography } from '@/constants/design-system';
import { Layout, getThemedColors } from '@/constants/styles';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View, Modal, Pressable } from 'react-native';

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

export default function RefractionAssessmentScreen() {
  const { id } = useLocalSearchParams();
  const registrationId = typeof id === 'string' ? parseInt(id, 10) : 0;
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getThemedColors(isDark);

  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Objective Refraction - Text inputs
  const [objRightSph, setObjRightSph] = useState('-1.00');
  const [objRightCyl, setObjRightCyl] = useState('-0.50');
  const [objRightAxis, setObjRightAxis] = useState('90');
  const [objRightVa, setObjRightVa] = useState('6 / 6');

  const [objLeftSph, setObjLeftSph] = useState('-1.00');
  const [objLeftCyl, setObjLeftCyl] = useState('-0.50');
  const [objLeftAxis, setObjLeftAxis] = useState('90');
  const [objLeftVa, setObjLeftVa] = useState('6 / 6');

  // Step 2: Subjective Refraction - Dropdowns
  const [subRightSph, setSubRightSph] = useState('+0.75');
  const [subRightCyl, setSubRightCyl] = useState('+0.75');
  const [subRightAxis, setSubRightAxis] = useState('90');
  const [subRightVa, setSubRightVa] = useState('6/6');

  const [subLeftSph, setSubLeftSph] = useState('+0.75');
  const [subLeftCyl, setSubLeftCyl] = useState('+0.75');
  const [subLeftAxis, setSubLeftAxis] = useState('90');
  const [subLeftVa, setSubLeftVa] = useState('6/6');

  // Reading spectacles
  const [readingAdd, setReadingAdd] = useState('+0.75');
  const [readingN, setReadingN] = useState('14');
  const [readingDistance, setReadingDistance] = useState('40');

  // Step 3: Operator Notes
  const [operatorObservation, setOperatorObservation] = useState('');
  const [testResult, setTestResult] = useState<'pass' | 'refer'>('pass');

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save and navigate back
      console.log('Saving refraction assessment:', {
        registrationId,
        objective: {
          rightEye: { sph: objRightSph, cyl: objRightCyl, axis: objRightAxis, va: objRightVa },
          leftEye: { sph: objLeftSph, cyl: objLeftCyl, axis: objLeftAxis, va: objLeftVa },
        },
        subjective: {
          rightEye: { sph: subRightSph, cyl: subRightCyl, axis: subRightAxis, va: subRightVa },
          leftEye: { sph: subLeftSph, cyl: subLeftCyl, axis: subLeftAxis, va: subLeftVa },
          reading: { add: readingAdd, n: readingN, distance: readingDistance },
        },
        operatorObservation,
        testResult,
      });
      router.back();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
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

  return (
    <ThemedView style={Layout.container}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={IconSizes.lg} color={colors.text} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Refraction Assessment</ThemedText>
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
          style={[styles.nextButton, { backgroundColor: DesignColors.primary }]}
          onPress={handleNext}>
          <ThemedText style={styles.nextButtonText}>
            {currentStep === 3 ? 'Save' : 'Next'}
          </ThemedText>
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
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
  },
  content: {
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
