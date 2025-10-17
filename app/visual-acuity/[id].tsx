import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DesignColors, Spacing, BorderRadius, Typography, IconSizes } from '@/constants/design-system';
import { Layout, getThemedColors } from '@/constants/styles';

export default function VisualAcuityScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getThemedColors(isDark);

  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Screening Details - Distance Visual Acuity Chart
  const [distanceChart, setDistanceChart] = useState<string>('snellen');

  // Step 2: Distance Vision - Aided
  const [distanceRightNumerator, setDistanceRightNumerator] = useState('6');
  const [distanceRightDenominator, setDistanceRightDenominator] = useState('6');
  const [distanceRightMinus, setDistanceRightMinus] = useState('-6');
  const [distanceLeftNumerator, setDistanceLeftNumerator] = useState('6');
  const [distanceLeftDenominator, setDistanceLeftDenominator] = useState('6');
  const [distanceLeftDropdown, setDistanceLeftDropdown] = useState('');

  // Step 3: Near Vision - Aided
  const [nearRightValue, setNearRightValue] = useState('N 6');
  const [nearLeftValue, setNearLeftValue] = useState('N 6');

  // Step 4: Near Vision - Operator Notes
  const [operatorObservation, setOperatorObservation] = useState('');
  const [nearVisionResult, setNearVisionResult] = useState<'pass' | 'refer' | null>('pass');

  const chartOptions = [
    'HOTV',
    'LEA Symbols',
    'Tumbling E',
    'LogMAR',
    'Snellen',
  ];

  const handleNext = () => {
    if (currentStep < 4) {
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
        // Distance Vision: Aided
        return (
          <View style={styles.sectionCard}>
            <View style={[styles.sectionHeader, { backgroundColor: colors.surface }]}>
              <ThemedText style={styles.sectionTitle}>Distance Vision : Aided</ThemedText>
            </View>

            <View style={styles.questionContent}>
              {/* Right Eye */}
              <View style={styles.visionSection}>
                <ThemedText style={styles.eyeLabel}>Right Eye (R)</ThemedText>

                <View style={styles.visionRow}>
                  <ThemedText style={styles.largeNumber}>6</ThemedText>
                  <ThemedText style={styles.separator}>/</ThemedText>
                  <TextInput
                    value={distanceRightDenominator}
                    onChangeText={setDistanceRightDenominator}
                    style={[
                      styles.visionInput,
                      styles.largeInput,
                      { color: colors.text, borderColor: colors.border },
                    ]}
                    textAlign="center"
                  />
                  <TextInput
                    value={distanceRightMinus}
                    onChangeText={setDistanceRightMinus}
                    style={[
                      styles.visionInput,
                      styles.smallInput,
                      { color: colors.text, borderColor: colors.border },
                    ]}
                    textAlign="center"
                  />
                </View>
              </View>

              {/* Left Eye */}
              <View style={styles.visionSection}>
                <ThemedText style={styles.eyeLabel}>Left Eye (L)</ThemedText>

                <View style={styles.visionRow}>
                  <ThemedText style={styles.largeNumber}>6</ThemedText>
                  <ThemedText style={styles.separator}>/</ThemedText>
                  <TextInput
                    value={distanceLeftDenominator}
                    onChangeText={setDistanceLeftDenominator}
                    style={[
                      styles.visionInput,
                      styles.largeInput,
                      { color: colors.text, borderColor: colors.border },
                    ]}
                    textAlign="center"
                  />
                  <TextInput
                    value={distanceLeftDropdown}
                    onChangeText={setDistanceLeftDropdown}
                    placeholder="˅"
                    placeholderTextColor={colors.textSecondary}
                    style={[
                      styles.visionInput,
                      styles.smallInput,
                      { color: colors.text, borderColor: colors.border },
                    ]}
                    textAlign="center"
                  />
                </View>
              </View>
            </View>
          </View>
        );

      case 3:
        // Near Vision: Aided
        return (
          <View style={styles.sectionCard}>
            <View style={[styles.sectionHeader, { backgroundColor: colors.surface }]}>
              <ThemedText style={styles.sectionTitle}>Near Vision : Aided</ThemedText>
            </View>

            <View style={styles.questionContent}>
              {/* Right Eye */}
              <View style={styles.visionSection}>
                <ThemedText style={styles.eyeLabel}>Right Eye (R)</ThemedText>

                <View style={styles.nearVisionRow}>
                  <ThemedText style={styles.largeNumber}>N</ThemedText>
                  <TextInput
                    value={nearRightValue.replace('N ', '')}
                    onChangeText={(text) => setNearRightValue(`N ${text}`)}
                    style={[
                      styles.visionInput,
                      styles.largeInput,
                      { color: colors.text, borderColor: colors.border },
                    ]}
                    textAlign="center"
                  />
                </View>
              </View>

              {/* Left Eye */}
              <View style={styles.visionSection}>
                <ThemedText style={styles.eyeLabel}>Left Eye (L)</ThemedText>

                <View style={styles.nearVisionRow}>
                  <ThemedText style={styles.largeNumber}>N</ThemedText>
                  <TextInput
                    value={nearLeftValue.replace('N ', '')}
                    onChangeText={(text) => setNearLeftValue(`N ${text}`)}
                    style={[
                      styles.visionInput,
                      styles.largeInput,
                      { color: colors.text, borderColor: colors.border },
                    ]}
                    textAlign="center"
                  />
                </View>
              </View>
            </View>
          </View>
        );

      case 4:
        // Near Vision: Operator Notes
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
            {currentStep === 4 ? 'Save' : 'Next'}
          </ThemedText>
          {currentStep < 4 && <IconSymbol name="chevron.right" size={20} color="#FFFFFF" />}
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
    fontSize: Typography.fontSize.xl,
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
    gap: Spacing.sm,
  },
  nearVisionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  largeNumber: {
    fontSize: 72,
    fontWeight: Typography.fontWeight.bold,
  },
  separator: {
    fontSize: 72,
    fontWeight: Typography.fontWeight.bold,
    marginHorizontal: Spacing.sm,
  },
  visionInput: {
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: 'transparent',
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
});
