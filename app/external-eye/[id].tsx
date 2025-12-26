import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { RadioButton } from '@/components/ui/radio-button';
import { SectionCard } from '@/components/ui/section-card';
import { FixedBottomButton } from '@/components/ui/fixed-bottom-button';
import { Dropdown, DropdownOption } from '@/components/ui/dropdown';
import { BorderRadius, DesignColors, IconSizes, Spacing, Typography } from '@/constants/design-system';
import { Layout, getThemedColors } from '@/constants/styles';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  useGetExternalEyeExamination,
  useCreateOrUpdateExternalEyeExamination,
  useUploadExternalEyeAttachment,
} from '@/services';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

// Dropdown options
const EYELIDS_LASHES_OPTIONS: DropdownOption[] = [
  { value: 'normal', label: 'Normal' },
  { value: 'watery_sticky', label: 'Watery / Sticky' },
  { value: 'swollen', label: 'Swollen' },
  { value: 'redness', label: 'Redness' },
  { value: 'ptosis', label: 'Ptosis' },
  { value: 'stye', label: 'Stye' },
];

const CONJUNCTIVA_OPTIONS: DropdownOption[] = [
  { value: 'normal', label: 'Normal' },
  { value: 'inflamed', label: 'Inflamed' },
  { value: 'pterygium', label: 'Pterygium' },
  { value: 'pinguecula', label: 'Pinguecula' },
  { value: 'hemorrhage', label: 'Hemorrhage' },
];

const CORNEA_OPTIONS: DropdownOption[] = [
  { value: 'clear', label: 'Clear' },
  { value: 'ulcer', label: 'Ulcer' },
  { value: 'scar', label: 'Scar' },
  { value: 'opacity', label: 'Opacity' },
  { value: 'arcus', label: 'Arcus' },
];

const IRIS_PUPIL_OPTIONS: DropdownOption[] = [
  { value: 'normal', label: 'Normal' },
  { value: 'irregular_pupil', label: 'Irregular Pupil' },
  { value: 'coloboma', label: 'Coloboma' },
  { value: 'anisocoria', label: 'Anisocoria' },
];

const LENS_OPTIONS: DropdownOption[] = [
  { value: 'clear', label: 'Clear' },
  { value: 'cataract', label: 'Cataract' },
  { value: 'pseudophakia', label: 'Pseudophakia' },
  { value: 'aphakia', label: 'Aphakia' },
];

const ALIGNMENT_OPTIONS: DropdownOption[] = [
  { value: 'aligned', label: 'Aligned' },
  { value: 'not_aligned', label: 'Not Aligned' },
  { value: 'esotropia', label: 'Esotropia' },
  { value: 'exotropia', label: 'Exotropia' },
  { value: 'hypertropia', label: 'Hypertropia' },
];

// Backend API structure for External Eye Examination
interface EyeAnteriorData {
  eyelids_lashes: string;
  conjunctiva: string;
  cornea: string;
  iris_pupil: string;
  lens: string;
  alignment_eyes: string;
  operator_observation: string;
}

interface OperatorNotes {
  operator_observation: string;
  test_result: string;
}

interface AnteriorData {
  right_eye: EyeAnteriorData;
  left_eye: EyeAnteriorData;
  operator_notes: OperatorNotes;
}

export default function ExternalEyeExaminationScreen() {
  const { id } = useLocalSearchParams();
  const registrationId = typeof id === 'string' ? parseInt(id, 10) : 0;
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getThemedColors(isDark);

  // API hooks
  const { data, isLoading: isFetching } = useGetExternalEyeExamination(registrationId);
  const { mutate: saveExternalEye, isPending: isSaving } = useCreateOrUpdateExternalEyeExamination();
  const { mutate: uploadAttachment } = useUploadExternalEyeAttachment(registrationId);

  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  // Steps: 1-Camera Right, 2-Form Right Part 1, 3-Form Right Part 2,
  //        4-Camera Left, 5-Form Left Part 1, 6-Form Left Part 2, 7-Final Notes
  const [currentStep, setCurrentStep] = useState(1);
  const [hasLoadedData, setHasLoadedData] = useState(false);

  // Right Eye captured image
  const [rightEyeImage, setRightEyeImage] = useState<string | null>(null);
  // Left Eye captured image
  const [leftEyeImage, setLeftEyeImage] = useState<string | null>(null);

  // Right Eye Anterior Form Data
  const [rightEyelidsLashes, setRightEyelidsLashes] = useState('');
  const [rightConjunctiva, setRightConjunctiva] = useState('');
  const [rightCornea, setRightCornea] = useState('');
  const [rightIrisPupil, setRightIrisPupil] = useState('');
  const [rightLens, setRightLens] = useState('');
  const [rightAlignment, setRightAlignment] = useState('');
  const [rightObservation, setRightObservation] = useState('');

  // Left Eye Anterior Form Data
  const [leftEyelidsLashes, setLeftEyelidsLashes] = useState('');
  const [leftConjunctiva, setLeftConjunctiva] = useState('');
  const [leftCornea, setLeftCornea] = useState('');
  const [leftIrisPupil, setLeftIrisPupil] = useState('');
  const [leftLens, setLeftLens] = useState('');
  const [leftAlignment, setLeftAlignment] = useState('');
  const [leftObservation, setLeftObservation] = useState('');

  // Final Notes
  const [finalObservation, setFinalObservation] = useState('');
  const [testResult, setTestResult] = useState<'pass' | 'refer' | null>(null);

  // Pre-fill form from existing data
  useEffect(() => {
    if (data?.data && !hasLoadedData) {
      const { anterior } = data.data;

      if (anterior) {
        const ant = anterior as unknown as AnteriorData;
        // Right eye
        setRightEyelidsLashes(ant.right_eye?.eyelids_lashes ?? '');
        setRightConjunctiva(ant.right_eye?.conjunctiva ?? '');
        setRightCornea(ant.right_eye?.cornea ?? '');
        setRightIrisPupil(ant.right_eye?.iris_pupil ?? '');
        setRightLens(ant.right_eye?.lens ?? '');
        setRightAlignment(ant.right_eye?.alignment_eyes ?? '');
        setRightObservation(ant.right_eye?.operator_observation ?? '');
        // Left eye
        setLeftEyelidsLashes(ant.left_eye?.eyelids_lashes ?? '');
        setLeftConjunctiva(ant.left_eye?.conjunctiva ?? '');
        setLeftCornea(ant.left_eye?.cornea ?? '');
        setLeftIrisPupil(ant.left_eye?.iris_pupil ?? '');
        setLeftLens(ant.left_eye?.lens ?? '');
        setLeftAlignment(ant.left_eye?.alignment_eyes ?? '');
        setLeftObservation(ant.left_eye?.operator_observation ?? '');
        // Operator notes
        setFinalObservation(ant.operator_notes?.operator_observation ?? '');
        setTestResult((ant.operator_notes?.test_result as 'pass' | 'refer') ?? null);
      }

      setHasLoadedData(true);
    }
  }, [data, hasLoadedData]);

  // Build anterior data from form state matching backend structure
  const buildAnteriorData = (): AnteriorData => ({
    right_eye: {
      eyelids_lashes: rightEyelidsLashes,
      conjunctiva: rightConjunctiva,
      cornea: rightCornea,
      iris_pupil: rightIrisPupil,
      lens: rightLens,
      alignment_eyes: rightAlignment,
      operator_observation: rightObservation,
    },
    left_eye: {
      eyelids_lashes: leftEyelidsLashes,
      conjunctiva: leftConjunctiva,
      cornea: leftCornea,
      iris_pupil: leftIrisPupil,
      lens: leftLens,
      alignment_eyes: leftAlignment,
      operator_observation: leftObservation,
    },
    operator_notes: {
      operator_observation: finalObservation,
      test_result: testResult ?? '',
    },
  });

  const handleTakePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        if (photo) {
          if (currentStep === 1) {
            setRightEyeImage(photo.uri);
          } else if (currentStep === 4) {
            setLeftEyeImage(photo.uri);
          }
          setCurrentStep(currentStep + 1);
        }
      } catch {
        Alert.alert('Error', 'Failed to take picture. Please try again.');
      }
    }
  };

  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save form data - operator_notes is now part of anterior
      saveExternalEye(
        {
          registration_id: registrationId,
          anterior: buildAnteriorData() as unknown as Record<string, unknown>,
        },
        {
          onSuccess: () => {
            // Upload images if captured
            if (rightEyeImage) {
              uploadAttachment({
                file: {
                  uri: rightEyeImage,
                  name: `anterior_right_${registrationId}.jpg`,
                  type: 'image/jpeg',
                },
                type: 'anterior_right',
              });
            }
            if (leftEyeImage) {
              uploadAttachment({
                file: {
                  uri: leftEyeImage,
                  name: `anterior_left_${registrationId}.jpg`,
                  type: 'image/jpeg',
                },
                type: 'anterior_left',
              });
            }
            router.back();
          },
          onError: (error) => {
            Alert.alert('Error', error.message || 'Failed to save external eye examination data');
          },
        }
      );
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  // Camera permission handling - only block on camera steps
  const isCameraStep = currentStep === 1 || currentStep === 4;

  if (isCameraStep && !permission) {
    return (
      <ThemedView style={Layout.container}>
        <View style={styles.centerContent}>
          <ThemedText>Requesting camera permission...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (isCameraStep && !permission?.granted) {
    return (
      <ThemedView style={Layout.container}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol name="chevron.left" size={IconSizes.lg} color={colors.text} />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>External Eye Observation</ThemedText>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.centerContent}>
          <IconSymbol name="camera" size={64} color={colors.textSecondary} />
          <ThemedText style={styles.permissionTitle}>Camera Access Required</ThemedText>
          <ThemedText style={styles.permissionText}>
            This app needs camera access to capture eye images for the examination.
          </ThemedText>
          {permission?.canAskAgain ? (
            <TouchableOpacity
              style={[styles.permissionButton, { backgroundColor: DesignColors.primary }]}
              onPress={requestPermission}>
              <ThemedText style={styles.permissionButtonText}>Grant Permission</ThemedText>
            </TouchableOpacity>
          ) : (
            <ThemedText style={styles.permissionDeniedText}>
              Please enable camera access in your device settings.
            </ThemedText>
          )}
          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => setCurrentStep(currentStep + 1)}>
            <ThemedText style={[styles.skipButtonText, { color: colors.textSecondary }]}>
              Skip Camera (Continue without photo)
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  const renderCameraStep = (eyeSide: 'right' | 'left') => {
    const capturedImage = eyeSide === 'right' ? rightEyeImage : leftEyeImage;

    if (capturedImage) {
      return (
        <View style={styles.cameraContainer}>
          <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
          <View style={styles.cameraControls}>
            <TouchableOpacity
              style={styles.retakeButton}
              onPress={() => {
                if (eyeSide === 'right') {
                  setRightEyeImage(null);
                } else {
                  setLeftEyeImage(null);
                }
              }}>
              <ThemedText style={styles.retakeButtonText}>Retake</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.usePhotoButton, { backgroundColor: DesignColors.primary }]}
              onPress={handleNext}>
              <ThemedText style={styles.usePhotoButtonText}>Use Photo</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing="back"
          mode="picture">
          <View style={styles.cameraOverlay}>
            <ThemedText style={styles.cameraInstructions}>
              Position the {eyeSide} eye in the frame
            </ThemedText>
          </View>
        </CameraView>
        <View style={styles.captureButtonContainer}>
          <TouchableOpacity style={styles.captureButton} onPress={handleTakePicture}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderFormStep = () => {
    switch (currentStep) {
      case 2:
        // Anterior Right Eye - Part 1
        return (
          <SectionCard title="Anterior : Right Eye">
            <View style={styles.formField}>
              <ThemedText style={styles.fieldLabel}>Eyelids & Lashes</ThemedText>
              <Dropdown
                value={rightEyelidsLashes}
                options={EYELIDS_LASHES_OPTIONS}
                onSelect={setRightEyelidsLashes}
                placeholder="Select..."
              />
            </View>

            <View style={styles.formField}>
              <ThemedText style={styles.fieldLabel}>Conjunctiva</ThemedText>
              <Dropdown
                value={rightConjunctiva}
                options={CONJUNCTIVA_OPTIONS}
                onSelect={setRightConjunctiva}
                placeholder="Select..."
              />
            </View>

            <View style={styles.formField}>
              <ThemedText style={styles.fieldLabel}>Cornea</ThemedText>
              <Dropdown
                value={rightCornea}
                options={CORNEA_OPTIONS}
                onSelect={setRightCornea}
                placeholder="Select..."
              />
            </View>

            <View style={styles.formField}>
              <ThemedText style={styles.fieldLabel}>Iris & Pupil</ThemedText>
              <Dropdown
                value={rightIrisPupil}
                options={IRIS_PUPIL_OPTIONS}
                onSelect={setRightIrisPupil}
                placeholder="Select..."
              />
            </View>
          </SectionCard>
        );

      case 3:
        // Anterior Right Eye - Part 2
        return (
          <SectionCard title="Anterior : Right Eye">
            <View style={styles.formField}>
              <ThemedText style={styles.fieldLabel}>Lens</ThemedText>
              <Dropdown
                value={rightLens}
                options={LENS_OPTIONS}
                onSelect={setRightLens}
                placeholder="Select..."
              />
            </View>

            <View style={styles.formField}>
              <ThemedText style={styles.fieldLabel}>Alignment of eyes</ThemedText>
              <Dropdown
                value={rightAlignment}
                options={ALIGNMENT_OPTIONS}
                onSelect={setRightAlignment}
                placeholder="Select..."
              />
            </View>

            <View style={styles.formField}>
              <ThemedText style={styles.fieldLabel}>Operator&apos;s Observation</ThemedText>
              <TextInput
                placeholder="Add remarks here"
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={4}
                value={rightObservation}
                onChangeText={setRightObservation}
                style={[styles.textArea, { color: colors.text, borderColor: colors.border }]}
                textAlignVertical="top"
              />
            </View>
          </SectionCard>
        );

      case 5:
        // Anterior Left Eye - Part 1
        return (
          <SectionCard title="Anterior : Left Eye">
            <View style={styles.formField}>
              <ThemedText style={styles.fieldLabel}>Eyelids & Lashes</ThemedText>
              <Dropdown
                value={leftEyelidsLashes}
                options={EYELIDS_LASHES_OPTIONS}
                onSelect={setLeftEyelidsLashes}
                placeholder="Select..."
              />
            </View>

            <View style={styles.formField}>
              <ThemedText style={styles.fieldLabel}>Conjunctiva</ThemedText>
              <Dropdown
                value={leftConjunctiva}
                options={CONJUNCTIVA_OPTIONS}
                onSelect={setLeftConjunctiva}
                placeholder="Select..."
              />
            </View>

            <View style={styles.formField}>
              <ThemedText style={styles.fieldLabel}>Cornea</ThemedText>
              <Dropdown
                value={leftCornea}
                options={CORNEA_OPTIONS}
                onSelect={setLeftCornea}
                placeholder="Select..."
              />
            </View>

            <View style={styles.formField}>
              <ThemedText style={styles.fieldLabel}>Iris & Pupil</ThemedText>
              <Dropdown
                value={leftIrisPupil}
                options={IRIS_PUPIL_OPTIONS}
                onSelect={setLeftIrisPupil}
                placeholder="Select..."
              />
            </View>
          </SectionCard>
        );

      case 6:
        // Anterior Left Eye - Part 2
        return (
          <SectionCard title="Anterior : Left Eye">
            <View style={styles.formField}>
              <ThemedText style={styles.fieldLabel}>Lens</ThemedText>
              <Dropdown
                value={leftLens}
                options={LENS_OPTIONS}
                onSelect={setLeftLens}
                placeholder="Select..."
              />
            </View>

            <View style={styles.formField}>
              <ThemedText style={styles.fieldLabel}>Alignment of eyes</ThemedText>
              <Dropdown
                value={leftAlignment}
                options={ALIGNMENT_OPTIONS}
                onSelect={setLeftAlignment}
                placeholder="Select..."
              />
            </View>

            <View style={styles.formField}>
              <ThemedText style={styles.fieldLabel}>Operator&apos;s Observation</ThemedText>
              <TextInput
                placeholder="Add remarks here"
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={4}
                value={leftObservation}
                onChangeText={setLeftObservation}
                style={[styles.textArea, { color: colors.text, borderColor: colors.border }]}
                textAlignVertical="top"
              />
            </View>
          </SectionCard>
        );

      case 7:
        // Final Notes and Test Result
        return (
          <SectionCard title="External Eye Observation : Operator Notes">
            <View style={styles.formField}>
              <ThemedText style={styles.fieldLabel}>Operator&apos;s Observation</ThemedText>
              <TextInput
                placeholder="Add remarks here"
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={6}
                value={finalObservation}
                onChangeText={setFinalObservation}
                style={[styles.textAreaLarge, { color: colors.text, borderColor: colors.border }]}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.formField}>
              <ThemedText style={styles.fieldLabel}>External Eye Observation Test Result</ThemedText>
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

  const renderContent = () => {
    // Show loading when fetching initial data (only on form steps)
    if (isFetching && currentStep !== 1 && currentStep !== 4) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={DesignColors.primary} />
          <ThemedText style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading...
          </ThemedText>
        </View>
      );
    }

    if (currentStep === 1) {
      return renderCameraStep('right');
    } else if (currentStep === 4) {
      return renderCameraStep('left');
    } else {
      return (
        <>
          <ScrollView style={Layout.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.content}>{renderFormStep()}</View>
            <View style={{ height: 120 }} />
          </ScrollView>

          <FixedBottomButton
            label={currentStep === 7 ? 'Save' : 'Next'}
            onPress={handleNext}
            showChevron={currentStep < 7}
            loading={isSaving}
            disabled={isSaving}
          />
        </>
      );
    }
  };

  return (
    <ThemedView style={Layout.container}>
      {/* Header - only show for form steps */}
      {currentStep !== 1 && currentStep !== 4 && (
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <IconSymbol name="chevron.left" size={IconSizes.lg} color={colors.text} />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>External Eye Observation</ThemedText>
          <View style={{ width: 40 }} />
        </View>
      )}

      {/* Camera header */}
      {(currentStep === 1 || currentStep === 4) && (
        <View style={[styles.cameraHeader]}>
          <TouchableOpacity onPress={handleBack} style={styles.cameraBackButton}>
            <IconSymbol name="xmark" size={IconSizes.lg} color="#FFFFFF" />
          </TouchableOpacity>
          <ThemedText style={styles.cameraHeaderTitle}>
            Capture {currentStep === 1 ? 'Right' : 'Left'} Eye
          </ThemedText>
          <View style={{ width: 40 }} />
        </View>
      )}

      {renderContent()}
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
  cameraHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: 60,
    paddingBottom: Spacing.md,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'transparent',
  },
  cameraBackButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraHeaderTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: '#FFFFFF',
  },
  content: {
    padding: Spacing.lg,
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
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: 'transparent',
  },
  textAreaLarge: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    fontSize: Typography.fontSize.base,
    minHeight: 150,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: 'transparent',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  permissionTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  permissionText: {
    textAlign: 'center',
    marginBottom: Spacing.lg,
    fontSize: Typography.fontSize.base,
    paddingHorizontal: Spacing.lg,
  },
  permissionDeniedText: {
    textAlign: 'center',
    marginBottom: Spacing.lg,
    fontSize: Typography.fontSize.base,
    color: '#FF3B30',
  },
  permissionButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
  skipButton: {
    marginTop: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  skipButtonText: {
    fontSize: Typography.fontSize.sm,
    textDecorationLine: 'underline',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 150,
  },
  cameraInstructions: {
    color: '#FFFFFF',
    fontSize: Typography.fontSize.base,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  captureButtonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },
  capturedImage: {
    flex: 1,
    resizeMode: 'contain',
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    paddingBottom: 40,
    backgroundColor: '#000000',
  },
  retakeButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  retakeButtonText: {
    color: '#FFFFFF',
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
  },
  usePhotoButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  usePhotoButtonText: {
    color: '#FFFFFF',
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
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
