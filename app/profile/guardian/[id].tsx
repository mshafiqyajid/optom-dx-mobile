import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, IconSizes, Spacing, Typography } from '@/constants/design-system';
import { Layout, getThemedColors } from '@/constants/styles';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

// Mock guardian details - replace with real data
const GUARDIAN_DETAILS = {
  name: 'Puan Noraini binti Hassan',
  relationship: 'Mother',
  countryCode: '+60',
  phoneNumber: '12-345 6789',
  email: 'Not Provided',
};

const CONSENT_TEXT =
  '"I consent for my child\'s vision and eyes to be screened by qualified personnel. I understand that no eye drops will be used, and results will be shared with me."';

function InfoField({
  label,
  value,
  icon,
  colors,
}: {
  label: string;
  value: string;
  icon: string;
  colors: ReturnType<typeof getThemedColors>;
}) {
  return (
    <View style={styles.fieldContainer}>
      <ThemedText style={styles.fieldLabel}>{label}</ThemedText>
      <View style={[styles.fieldInput, { borderColor: colors.border }]}>
        <Feather name={icon as any} size={20} color={colors.textSecondary} />
        <ThemedText style={styles.fieldValue}>{value}</ThemedText>
      </View>
    </View>
  );
}

function PhoneField({ colors }: { colors: ReturnType<typeof getThemedColors> }) {
  return (
    <View style={styles.fieldContainer}>
      <ThemedText style={styles.fieldLabel}>Contact Number</ThemedText>
      <View style={[styles.phoneFieldContainer, { borderColor: colors.border }]}>
        <View style={[styles.countryCodeContainer, { borderRightColor: colors.border }]}>
          <Image
            source={{ uri: 'https://flagcdn.com/w40/my.png' }}
            style={styles.flagIcon}
            resizeMode="contain"
          />
          <ThemedText style={styles.countryCode}>{GUARDIAN_DETAILS.countryCode}</ThemedText>
          <Feather name="chevron-down" size={16} color={colors.textSecondary} />
        </View>
        <View style={styles.phoneNumberContainer}>
          <ThemedText style={styles.fieldValue}>{GUARDIAN_DETAILS.phoneNumber}</ThemedText>
        </View>
      </View>
    </View>
  );
}

export default function GuardianProfileScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getThemedColors(isDark);
  const [isConsented, setIsConsented] = useState(true);

  const handleSaveAndContinue = () => {
    router.push(`/checkpoint/${id}`);
  };

  return (
    <ThemedView style={Layout.container}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={IconSizes.lg} color={colors.text} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Profile</ThemedText>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={Layout.scrollView} showsVerticalScrollIndicator={false}>
        {/* Section Card */}
        <View style={styles.content}>
          <View style={styles.sectionCard}>
            <View style={[styles.sectionHeader, { backgroundColor: colors.surface }]}>
              <ThemedText style={styles.sectionTitle}>Parent/Guardian Information</ThemedText>
            </View>

            <View style={styles.sectionContent}>
              <InfoField label="Name" value={GUARDIAN_DETAILS.name} icon="user" colors={colors} />
              <InfoField label="Relationship to Child" value={GUARDIAN_DETAILS.relationship} icon="users" colors={colors} />
              <PhoneField colors={colors} />
              <InfoField label="Email Address" value={GUARDIAN_DETAILS.email} icon="mail" colors={colors} />
            </View>
          </View>

          {/* Consent Section */}
          <View style={styles.consentSection}>
            <ThemedText style={styles.consentTitle}>Consent Statement</ThemedText>
            <ThemedText style={[styles.consentText, { color: colors.textSecondary }]}>{CONSENT_TEXT}</ThemedText>

            <TouchableOpacity style={styles.checkboxRow} onPress={() => setIsConsented(!isConsented)}>
              <View
                style={[
                  styles.checkbox,
                  { borderColor: colors.border },
                  isConsented && { backgroundColor: '#4A6CF7', borderColor: '#4A6CF7' },
                ]}>
                {isConsented && <Feather name="check" size={14} color="#FFFFFF" />}
              </View>
              <ThemedText style={styles.checkboxLabel}>Yes, I consent</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom padding */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Save Button */}
      <View style={[styles.bottomContainer, { backgroundColor: colors.background }]}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveAndContinue}>
          <ThemedText style={styles.saveButtonText}>Save & Continue to Checkpoint</ThemedText>
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
  sectionContent: {
    padding: Spacing.lg,
  },
  fieldContainer: {
    marginBottom: Spacing.lg,
  },
  fieldLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: Spacing.sm,
  },
  fieldInput: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  fieldValue: {
    fontSize: Typography.fontSize.base,
    flex: 1,
  },
  phoneFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.xs,
    borderRightWidth: 1,
  },
  flagIcon: {
    width: 24,
    height: 16,
  },
  countryCode: {
    fontSize: Typography.fontSize.base,
  },
  phoneNumberContainer: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  consentSection: {
    marginTop: Spacing.xl,
  },
  consentTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    marginBottom: Spacing.sm,
  },
  consentText: {
    fontSize: Typography.fontSize.sm,
    lineHeight: Typography.fontSize.sm * 1.6,
    marginBottom: Spacing.lg,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxLabel: {
    fontSize: Typography.fontSize.base,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
    paddingBottom: 40,
  },
  saveButton: {
    backgroundColor: '#4A6CF7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
  },
});
