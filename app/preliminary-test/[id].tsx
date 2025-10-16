import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DesignColors, Spacing, BorderRadius, Typography, IconSizes } from '@/constants/design-system';
import { Layout, getThemedColors } from '@/constants/styles';

export default function PreliminaryTestScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getThemedColors(isDark);

  // Section A: Old Prescription (OLD RX)
  // Right Eye
  const [rightEyeSphere, setRightEyeSphere] = useState('-1.00');
  const [rightEyeCylinder, setRightEyeCylinder] = useState('-0.50');
  const [rightEyeAxis, setRightEyeAxis] = useState('90');
  const [rightEyeVA, setRightEyeVA] = useState('6 / 6');

  // Left Eye
  const [leftEyeSphere, setLeftEyeSphere] = useState('-1.00');
  const [leftEyeCylinder, setLeftEyeCylinder] = useState('-0.50');
  const [leftEyeAxis, setLeftEyeAxis] = useState('90');
  const [leftEyeVA, setLeftEyeVA] = useState('6 / 6');

  // Section B: Pupillary Distance
  const [rightEyePD, setRightEyePD] = useState('0');
  const [leftEyePD, setLeftEyePD] = useState('0');
  const [pdDistance, setPdDistance] = useState('0');

  const handleDone = () => {
    router.back();
  };

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
        <View style={styles.content}>
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
        </View>

        {/* Bottom padding for button */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={[styles.bottomContainer, { backgroundColor: colors.background }]}>
        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: DesignColors.primary }]}
          onPress={handleDone}>
          <ThemedText style={styles.nextButtonText}>Done</ThemedText>
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
