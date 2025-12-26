import { SeverityChart } from '@/components/severity-chart';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { RadioButton } from '@/components/ui/radio-button';
import { ScreenHeader, LoadingState, FixedBottomButton, SectionCard } from '@/components/ui';
import { BorderRadius, Spacing, Typography } from '@/constants/design-system';
import { Layout, getThemedColors } from '@/constants/styles';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useMultiStepForm, useFormDataLoader } from '@/hooks/use-multi-step-form';
import { useGetHistoryTaking, useCreateOrUpdateHistoryTaking } from '@/services';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

// Backend API structure for Section A (question_1 to question_14)
interface QuestionWithNotes {
  answer: string;
  notes?: string;
}

interface QuestionAnswer {
  answer: string;
}

interface SectionAData {
  question_1: QuestionWithNotes; // Blurred vision (yes/no + notes)
  question_2: QuestionWithNotes; // Eye pain (yes/no + notes)
  question_3: QuestionAnswer;    // Pain location (localise/radiate)
  question_4: QuestionAnswer;    // Onset (gradial/sudden) - note: backend uses "gradial"
  question_5: QuestionAnswer;    // Frequency (frequent/occasional)
  question_6: QuestionAnswer;    // Timing (daytime/nighttime)
  question_7: QuestionAnswer;    // Severity (1-10)
  question_8: QuestionAnswer;    // Relief factor (notes)
  question_9?: QuestionAnswer;   // Additional question
  question_10?: QuestionAnswer;  // Additional question
  question_11?: QuestionAnswer;  // Additional question
  question_12?: QuestionAnswer;  // Additional question
  question_13?: QuestionAnswer;  // Additional question
  question_14?: QuestionAnswer;  // Additional question
}

interface SectionBData {
  operator_observation: QuestionAnswer;
  initial_assessment: QuestionAnswer; // pass/refer
}

const TOTAL_STEPS = 6;

export default function HistoryTakingScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getThemedColors(isDark);

  const registrationId = typeof id === 'string' ? parseInt(id, 10) : 0;

  // API hooks
  const { data, isLoading: isFetching } = useGetHistoryTaking(registrationId);
  const { mutate: saveHistoryTaking, isPending: isSaving } = useCreateOrUpdateHistoryTaking();

  // Multi-step form management
  const { currentStep, isLastStep, nextStep } = useMultiStepForm({ totalSteps: TOTAL_STEPS });
  const { hasLoaded, markAsLoaded } = useFormDataLoader();

  // Question 1: Blurred Vision
  const [blurredVision, setBlurredVision] = useState<'yes' | 'no' | null>(null);
  const [blurredVisionNotes, setBlurredVisionNotes] = useState('');

  // Question 2: Eye Pain
  const [eyePain, setEyePain] = useState<'yes' | 'no' | null>(null);
  const [eyePainNotes, setEyePainNotes] = useState('');

  // Question 3: Pain Location & Question 4: Onset
  const [painLocation, setPainLocation] = useState<'localise' | 'radiate' | null>(null);
  const [onSet, setOnSet] = useState<'gradial' | 'sudden' | null>(null); // Note: backend uses "gradial"

  // Question 5: Frequency & Question 6: Timing
  const [frequency, setFrequency] = useState<'frequent' | 'occasional' | null>(null);
  const [timing, setTiming] = useState<'daytime' | 'nighttime' | null>(null);

  // Question 7: Severity
  const [severityValue, setSeverityValue] = useState(5);

  // Question 8: Relief Factor
  const [reliefFactor, setReliefFactor] = useState('');

  // Section B: Operator Notes
  const [operatorObservation, setOperatorObservation] = useState('');
  const [initialAssessment, setInitialAssessment] = useState<'pass' | 'refer' | null>(null);

  // Pre-fill form from existing data (backend uses question_1, question_2, etc.)
  useEffect(() => {
    if (data?.data && !hasLoaded) {
      const sectionA = data.data.section_a as SectionAData | undefined;
      const sectionB = data.data.section_b as SectionBData | undefined;

      if (sectionA) {
        // Question 1: Blurred Vision
        setBlurredVision((sectionA.question_1?.answer as 'yes' | 'no') ?? null);
        setBlurredVisionNotes(sectionA.question_1?.notes ?? '');

        // Question 2: Eye Pain
        setEyePain((sectionA.question_2?.answer as 'yes' | 'no') ?? null);
        setEyePainNotes(sectionA.question_2?.notes ?? '');

        // Question 3: Pain Location
        setPainLocation((sectionA.question_3?.answer as 'localise' | 'radiate') ?? null);

        // Question 4: Onset (backend uses "gradial")
        setOnSet((sectionA.question_4?.answer as 'gradial' | 'sudden') ?? null);

        // Question 5: Frequency
        setFrequency((sectionA.question_5?.answer as 'frequent' | 'occasional') ?? null);

        // Question 6: Timing
        setTiming((sectionA.question_6?.answer as 'daytime' | 'nighttime') ?? null);

        // Question 7: Severity
        const severity = parseInt(sectionA.question_7?.answer ?? '5', 10);
        setSeverityValue(isNaN(severity) ? 5 : severity);

        // Question 8: Relief Factor
        setReliefFactor(sectionA.question_8?.answer ?? '');
      }

      if (sectionB) {
        setOperatorObservation(sectionB.operator_observation?.answer ?? '');
        setInitialAssessment((sectionB.initial_assessment?.answer as 'pass' | 'refer') ?? null);
      }

      markAsLoaded();
    }
  }, [data, hasLoaded, markAsLoaded]);

  // Build section_a data matching backend structure
  const buildSectionAData = (): SectionAData => ({
    question_1: { answer: blurredVision ?? '', notes: blurredVisionNotes },
    question_2: { answer: eyePain ?? '', notes: eyePainNotes },
    question_3: { answer: painLocation ?? '' },
    question_4: { answer: onSet ?? '' }, // Note: backend uses "gradial"
    question_5: { answer: frequency ?? '' },
    question_6: { answer: timing ?? '' },
    question_7: { answer: String(severityValue) },
    question_8: { answer: reliefFactor },
  });

  // Build section_b data matching backend structure
  const buildSectionBData = (): SectionBData => ({
    operator_observation: { answer: operatorObservation },
    initial_assessment: { answer: initialAssessment ?? '' },
  });

  const handleNext = () => {
    if (isLastStep) {
      // Save and navigate back
      saveHistoryTaking(
        {
          registration_id: registrationId,
          section_a: buildSectionAData(),
          section_b: buildSectionBData(),
        },
        {
          onSuccess: () => router.back(),
          onError: (error) => Alert.alert('Error', error.message || 'Failed to save history taking data'),
        }
      );
    } else {
      nextStep();
    }
  };

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
                selected={onSet === 'gradial'}
                onPress={() => setOnSet('gradial')}
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

      case 6:
        // Section B: Operator Notes & Initial Assessment
        return (
          <>
            <View style={styles.questionContainer}>
              <ThemedText style={styles.questionNumber}>Operator Observation</ThemedText>

              <TextInput
                placeholder="Enter operator observations"
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={6}
                value={operatorObservation}
                onChangeText={setOperatorObservation}
                style={[
                  styles.textArea,
                  {
                    color: colors.text,
                  },
                ]}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.questionContainer}>
              <ThemedText style={styles.questionNumber}>Initial Assessment</ThemedText>

              <RadioButton
                label="Pass"
                selected={initialAssessment === 'pass'}
                onPress={() => setInitialAssessment('pass')}
              />
              <RadioButton
                label="Refer"
                selected={initialAssessment === 'refer'}
                onPress={() => setInitialAssessment('refer')}
              />
            </View>
          </>
        );

      default:
        return null;
    }
  };

  // Loading state using shared component
  if (isFetching) {
    return (
      <ThemedView style={Layout.container}>
        <ScreenHeader title="History Taking" />
        <LoadingState message="Loading..." fullScreen />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={Layout.container}>
      <ScreenHeader title="History Taking" />

      <ScrollView style={Layout.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <SectionCard title={currentStep <= 5 ? 'Section A : General Question' : 'Section B : Operator Notes'}>
            {renderStep()}
          </SectionCard>
        </View>
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
  questionNumber: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: Spacing.md,
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
});
