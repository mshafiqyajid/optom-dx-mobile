import { SeverityChart } from '@/components/severity-chart';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, DesignColors, IconSizes, Spacing, Typography } from '@/constants/design-system';
import { Layout, getThemedColors } from '@/constants/styles';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function HistoryTakingScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getThemedColors(isDark);

  const [currentStep, setCurrentStep] = useState(1);

  // Question 1
  const [blurredVision, setBlurredVision] = useState<'yes' | 'no' | null>('yes');
  const [blurredVisionNotes, setBlurredVisionNotes] = useState('');

  // Question 2
  const [eyePain, setEyePain] = useState<'yes' | 'no' | null>('yes');
  const [eyePainNotes, setEyePainNotes] = useState('');

  // Question 3 & 4
  const [painLocation, setPainLocation] = useState<'localise' | 'radiate' | null>('localise');
  const [onSet, setOnSet] = useState<'gradual' | 'sudden' | null>('gradual');

  // Question 5 & 6
  const [frequency, setFrequency] = useState<'frequent' | 'occasional' | null>('frequent');
  const [timing, setTiming] = useState<'daytime' | 'nighttime' | null>('daytime');

  // Question 7
  const [severityValue, setSeverityValue] = useState(9);

  // Question 8
  const [reliefFactor, setReliefFactor] = useState('');

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      // Navigate back or to next section
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
        // Question 1: Blurred Vision
        return (
          <View style={styles.questionContainer}>
            <ThemedText style={styles.questionNumber}>
              1. Blurred Vision (with spectacles if worn)
            </ThemedText>

            <RadioButton
              label="Yes"
              selected={blurredVision === 'yes'}
              onPress={() => setBlurredVision('yes')}
            />
            <RadioButton
              label="No"
              selected={blurredVision === 'no'}
              onPress={() => setBlurredVision('no')}
            />

            <ThemedText style={styles.notesLabel}>Notes :</ThemedText>
            <TextInput
              placeholder="Add remarks here"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={4}
              value={blurredVisionNotes}
              onChangeText={setBlurredVisionNotes}
              style={[
                styles.textArea,
                {
                  color: colors.text,
                },
              ]}
              textAlignVertical="top"
            />
          </View>
        );

      case 2:
        // Question 2: Eye Pain
        return (
          <View style={styles.questionContainer}>
            <ThemedText style={styles.questionNumber}>
              2. Eye Pain, Discomfort, or Severe Itchiness
            </ThemedText>

            <RadioButton
              label="Yes"
              selected={eyePain === 'yes'}
              onPress={() => setEyePain('yes')}
            />
            <RadioButton
              label="No"
              selected={eyePain === 'no'}
              onPress={() => setEyePain('no')}
            />

            <ThemedText style={styles.notesLabel}>Notes :</ThemedText>
            <TextInput
              placeholder="Add remarks here"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={4}
              value={eyePainNotes}
              onChangeText={setEyePainNotes}
              style={[
                styles.textArea,
                {
                  color: colors.text,
                },
              ]}
              textAlignVertical="top"
            />
          </View>
        );

      case 3:
        // Question 3 & 4: Pain Location and On Set
        return (
          <>
            <View style={styles.questionContainer}>
              <ThemedText style={styles.questionNumber}>3. Pain/Discomfort Location</ThemedText>

              <RadioButton
                label="Localise"
                selected={painLocation === 'localise'}
                onPress={() => setPainLocation('localise')}
              />
              <RadioButton
                label="Radiate"
                selected={painLocation === 'radiate'}
                onPress={() => setPainLocation('radiate')}
              />
            </View>

            <View style={styles.questionContainer}>
              <ThemedText style={styles.questionNumber}>4. On Set</ThemedText>

              <RadioButton
                label="Gradual"
                selected={onSet === 'gradual'}
                onPress={() => setOnSet('gradual')}
              />
              <RadioButton
                label="Sudden"
                selected={onSet === 'sudden'}
                onPress={() => setOnSet('sudden')}
              />
            </View>
          </>
        );

      case 4:
        // Question 5 & 6: Frequency and Timing
        return (
          <>
            <View style={styles.questionContainer}>
              <ThemedText style={styles.questionNumber}>5. Frequency</ThemedText>

              <RadioButton
                label="Frequent"
                selected={frequency === 'frequent'}
                onPress={() => setFrequency('frequent')}
              />
              <RadioButton
                label="Occasional"
                selected={frequency === 'occasional'}
                onPress={() => setFrequency('occasional')}
              />
            </View>

            <View style={styles.questionContainer}>
              <ThemedText style={styles.questionNumber}>6. Timing</ThemedText>

              <RadioButton
                label="Daytime"
                selected={timing === 'daytime'}
                onPress={() => setTiming('daytime')}
              />
              <RadioButton
                label="Nighttime"
                selected={timing === 'nighttime'}
                onPress={() => setTiming('nighttime')}
              />
            </View>
          </>
        );

      case 5:
        // Question 7 & 8: Severity and Relief Factor
        return (
          <>
            <View style={styles.questionContainer}>
              <ThemedText style={styles.questionNumber}>7. Severity</ThemedText>

              <SeverityChart
                value={severityValue}
                maxValue={10}
                onValueChange={setSeverityValue}
              />
            </View>

            <View style={styles.questionContainer}>
              <ThemedText style={styles.questionNumber}>8. Relief Factor</ThemedText>

              <TextInput
                placeholder="Enter what relief the symptoms"
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={6}
                value={reliefFactor}
                onChangeText={setReliefFactor}
                style={[
                  styles.textArea,
                  {
                    color: colors.text,
                  },
                ]}
                textAlignVertical="top"
              />
            </View>
          </>
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
        <ThemedText style={styles.headerTitle}>History Taking</ThemedText>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={Layout.scrollView} showsVerticalScrollIndicator={false}>
        {/* Section Card */}
        <View style={styles.content}>
          <View style={styles.sectionCard}>
            <View style={[styles.sectionHeader, { backgroundColor: colors.surface }]}>
              <ThemedText style={styles.sectionTitle}>Section A : General Question</ThemedText>
            </View>

            <View style={styles.questionContent}>
              {renderStep()}
            </View>
          </View>
        </View>

        {/* Bottom padding for button */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={[styles.bottomContainer, { backgroundColor: colors.background }]}>
        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: DesignColors.primary }]}
          onPress={handleNext}>
          <ThemedText style={styles.nextButtonText}>{currentStep === 5 ? 'Done' : 'Next'}</ThemedText>
          {currentStep < 5 && <IconSymbol name="chevron.right" size={20} color="#FFFFFF" />}
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
  questionNumber: {
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
  notesLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  textArea: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    fontSize: Typography.fontSize.base,
    minHeight: 100,
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
