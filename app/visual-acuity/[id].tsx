import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, DesignColors, IconSizes, Spacing, Typography } from '@/constants/design-system';
import { Layout, getThemedColors } from '@/constants/styles';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function VisualAcuityScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getThemedColors(isDark);

  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Screening Details - Distance Visual Acuity Chart
  const [distanceChart, setDistanceChart] = useState<string>('snellen');

  // Step 2: Vision Screening Distance
  const [screeningDistance, setScreeningDistance] = useState<string>('1.5');

  // Step 3: Distance Vision - With Spectacle
  const [distanceRightDenominator, setDistanceRightDenominator] = useState('9');
  const [distanceRightMinus, setDistanceRightMinus] = useState('-6');
  const [distanceLeftDenominator, setDistanceLeftDenominator] = useState('9');
  const [distanceLeftMinus, setDistanceLeftMinus] = useState('-6');

  // Step 4: Distance Vision - Un-Aided
  const [unaidedRightDenominator, setUnaidedRightDenominator] = useState('6');
  const [unaidedLeftDenominator, setUnaidedLeftDenominator] = useState('6');

  // Step 5: Distance Vision - Pin Hole
  const [pinHoleRightDenominator, setPinHoleRightDenominator] = useState('6');
  const [pinHoleLeftDenominator, setPinHoleLeftDenominator] = useState('6');

  // Step 6: Operator Notes
  const [operatorObservation, setOperatorObservation] = useState('');
  const [nearVisionResult, setNearVisionResult] = useState<'pass' | 'refer' | null>('pass');

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
  const minusOptions = ['-1', '-2', '-3', '-4', '-5', '-6'];

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else {
      router.back();
    }
  };

  const RadioButton = ({
    label,
    selected,
    onPress,
  }: {
    label: string;
    selected: boolean;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      style={[
        styles.radioButton,
        {
          borderColor: selected ? DesignColors.primary : colors.border,
        },
      ]}
      onPress={onPress}>
      <ThemedText style={styles.radioLabel}>{label}</ThemedText>
      <View
        style={[
          styles.radioCircle,
          { borderColor: selected ? DesignColors.primary : '#CCCCCC' },
        ]}>
        {selected && <View style={[styles.radioCircleInner, { backgroundColor: DesignColors.primary }]} />}
      </View>
    </TouchableOpacity>
  );

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

                <View style={styles.visionRow}>
                  <ThemedText style={styles.largeNumber}>6</ThemedText>
                  <ThemedText style={styles.separator}>/</ThemedText>
                  <Dropdown
                    value={distanceRightDenominator}
                    options={denominatorOptions}
                    onSelect={setDistanceRightDenominator}
                    isLarge
                  />
                  <Dropdown
                    value={distanceRightMinus}
                    options={minusOptions}
                    onSelect={setDistanceRightMinus}
                    isLarge={false}
                  />
                </View>
              </View>

              {/* Left Eye */}
              <View style={styles.visionSection}>
                <ThemedText style={styles.eyeLabel}>Left Eye (L)</ThemedText>

                <View style={styles.visionRow}>
                  <ThemedText style={styles.largeNumber}>6</ThemedText>
                  <ThemedText style={styles.separator}>/</ThemedText>
                  <Dropdown
                    value={distanceLeftDenominator}
                    options={denominatorOptions}
                    onSelect={setDistanceLeftDenominator}
                    isLarge
                  />
                  <Dropdown
                    value={distanceLeftMinus}
                    options={minusOptions}
                    onSelect={setDistanceLeftMinus}
                    isLarge={false}
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
                  <TextInput
                    value={unaidedRightDenominator}
                    onChangeText={setUnaidedRightDenominator}
                    style={[styles.visionInputLarge, { color: colors.text, borderColor: colors.border }]}
                    textAlign="center"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              {/* Left Eye */}
              <View style={styles.visionSection}>
                <ThemedText style={styles.eyeLabel}>Left Eye (L)</ThemedText>

                <View style={styles.visionRowCentered}>
                  <ThemedText style={styles.largeNumber}>6</ThemedText>
                  <ThemedText style={styles.separator}>/</ThemedText>
                  <TextInput
                    value={unaidedLeftDenominator}
                    onChangeText={setUnaidedLeftDenominator}
                    style={[styles.visionInputLarge, { color: colors.text, borderColor: colors.border }]}
                    textAlign="center"
                    keyboardType="numeric"
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
                  <TextInput
                    value={pinHoleRightDenominator}
                    onChangeText={setPinHoleRightDenominator}
                    style={[styles.visionInputLarge, { color: colors.text, borderColor: colors.border }]}
                    textAlign="center"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              {/* Left Eye */}
              <View style={styles.visionSection}>
                <ThemedText style={styles.eyeLabel}>Left Eye (L)</ThemedText>

                <View style={styles.visionRowCentered}>
                  <ThemedText style={styles.largeNumber}>6</ThemedText>
                  <ThemedText style={styles.separator}>/</ThemedText>
                  <TextInput
                    value={pinHoleLeftDenominator}
                    onChangeText={setPinHoleLeftDenominator}
                    style={[styles.visionInputLarge, { color: colors.text, borderColor: colors.border }]}
                    textAlign="center"
                    keyboardType="numeric"
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
              <ThemedText style={styles.sectionTitle}>Near Vision : Operator Notes</ThemedText>
            </View>

            <View style={styles.questionContent}>
              <View style={styles.questionContainer}>
                <ThemedText style={styles.questionLabel}>Operator's Observation</ThemedText>

                <TextInput
                  placeholder="Add remarks here"
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  numberOfLines={6}
                  value={operatorObservation}
                  onChangeText={setOperatorObservation}
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
                <ThemedText style={styles.questionLabel}>Near Vision Test Result</ThemedText>

                <RadioButton
                  label="Pass"
                  selected={nearVisionResult === 'pass'}
                  onPress={() => setNearVisionResult('pass')}
                />
                <RadioButton
                  label="Refer"
                  selected={nearVisionResult === 'refer'}
                  onPress={() => setNearVisionResult('refer')}
                />
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

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
          style={[styles.nextButton, { backgroundColor: DesignColors.primary }]}
          onPress={handleNext}>
          <ThemedText style={styles.nextButtonText}>
            {currentStep === 6 ? 'Save' : 'Next'}
          </ThemedText>
          {currentStep < 6 && <IconSymbol name="chevron.right" size={20} color="#FFFFFF" />}
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
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    marginBottom: Spacing.sm,
  },
  radioLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
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
});
