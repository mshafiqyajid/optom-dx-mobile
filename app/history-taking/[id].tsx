import { SeverityChart } from '@/components/severity-chart';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { RadioButton } from '@/components/ui/radio-button';
import { BorderRadius, DesignColors, IconSizes, Spacing, Typography } from '@/constants/design-system';
import { Layout, getThemedColors } from '@/constants/styles';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useGetHistoryTaking, useCreateOrUpdateHistoryTaking } from '@/services';
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

// Section A form data structure
interface SectionAData {
  blurred_vision: 'yes' | 'no' | null;
  blurred_vision_notes: string;
  eye_pain: 'yes' | 'no' | null;
  eye_pain_notes: string;
  pain_location: 'localise' | 'radiate' | null;
  onset: 'gradual' | 'sudden' | null;
  frequency: 'frequent' | 'occasional' | null;
  timing: 'daytime' | 'nighttime' | null;
  severity: number;
  relief_factor: string;
}

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

  const [currentStep, setCurrentStep] = useState(1);
  const [hasLoadedData, setHasLoadedData] = useState(false);

  // Question 1
  const [blurredVision, setBlurredVision] = useState<'yes' | 'no' | null>(null);
  const [blurredVisionNotes, setBlurredVisionNotes] = useState('');

  // Question 2
  const [eyePain, setEyePain] = useState<'yes' | 'no' | null>(null);
  const [eyePainNotes, setEyePainNotes] = useState('');

  // Question 3 & 4
  const [painLocation, setPainLocation] = useState<'localise' | 'radiate' | null>(null);
  const [onSet, setOnSet] = useState<'gradual' | 'sudden' | null>(null);

  // Question 5 & 6
  const [frequency, setFrequency] = useState<'frequent' | 'occasional' | null>(null);
  const [timing, setTiming] = useState<'daytime' | 'nighttime' | null>(null);

  // Question 7
  const [severityValue, setSeverityValue] = useState(5);

  // Question 8
  const [reliefFactor, setReliefFactor] = useState('');

  // Pre-fill form from existing data
  useEffect(() => {
    if (data?.data?.section_a && !hasLoadedData) {
      const sectionA = data.data.section_a as SectionAData;
      setBlurredVision(sectionA.blurred_vision ?? null);
      setBlurredVisionNotes(sectionA.blurred_vision_notes ?? '');
      setEyePain(sectionA.eye_pain ?? null);
      setEyePainNotes(sectionA.eye_pain_notes ?? '');
      setPainLocation(sectionA.pain_location ?? null);
      setOnSet(sectionA.onset ?? null);
      setFrequency(sectionA.frequency ?? null);
      setTiming(sectionA.timing ?? null);
      setSeverityValue(sectionA.severity ?? 5);
      setReliefFactor(sectionA.relief_factor ?? '');
      setHasLoadedData(true);
    }
  }, [data, hasLoadedData]);

  // Build section_a data from form state
  const buildSectionAData = (): SectionAData => ({
    blurred_vision: blurredVision,
    blurred_vision_notes: blurredVisionNotes,
    eye_pain: eyePain,
    eye_pain_notes: eyePainNotes,
    pain_location: painLocation,
    onset: onSet,
    frequency: frequency,
    timing: timing,
    severity: severityValue,
    relief_factor: reliefFactor,
  });

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save and navigate back
      saveHistoryTaking(
        {
          registration_id: registrationId,
          section_a: buildSectionAData(),
          section_b: data?.data?.section_b ?? {}, // Preserve existing section_b if any
        },
        {
          onSuccess: () => {
            router.back();
          },
          onError: (error) => {
            Alert.alert('Error', error.message || 'Failed to save history taking data');
          },
        }
      );
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

  // Loading state
  if (isFetching) {
    return (
      <ThemedView style={Layout.container}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol name="chevron.left" size={IconSizes.lg} color={colors.text} />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>History Taking</ThemedText>
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
                {currentStep === 5 ? 'Save' : 'Next'}
              </ThemedText>
              {currentStep < 5 && <IconSymbol name="chevron.right" size={20} color="#FFFFFF" />}
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
