import { useEffect, useMemo, useState } from 'react';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, DesignColors, IconSizes, Spacing, Typography } from '@/constants/design-system';
import { Layout, getThemedColors } from '@/constants/styles';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import type { Registration } from '@/services/registrations/type.registrations';

// Helper to extract country code and phone number
function parsePhoneNumber(phone: string | null): { countryCode: string; phoneNumber: string } {
  if (!phone) return { countryCode: '+60', phoneNumber: 'Not Provided' };
  // Check if phone starts with + (international format)
  if (phone.startsWith('+60')) {
    return { countryCode: '+60', phoneNumber: phone.slice(3) };
  }
  if (phone.startsWith('+')) {
    // Find where the country code ends (assume 2-3 digits after +)
    const match = phone.match(/^(\+\d{1,3})(.*)$/);
    if (match) {
      return { countryCode: match[1], phoneNumber: match[2] };
    }
  }
  return { countryCode: '+60', phoneNumber: phone };
}

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

function PhoneField({ colors, countryCode, phoneNumber }: { colors: ReturnType<typeof getThemedColors>; countryCode: string; phoneNumber: string }) {
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
          <ThemedText style={styles.countryCode}>{countryCode}</ThemedText>
          <Feather name="chevron-down" size={16} color={colors.textSecondary} />
        </View>
        <View style={styles.phoneNumberContainer}>
          <ThemedText style={styles.fieldValue}>{phoneNumber}</ThemedText>
        </View>
      </View>
    </View>
  );
}

export default function GuardianProfileScreen() {
  const { id, registrationData } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getThemedColors(isDark);
  const [isConsented, setIsConsented] = useState(true);

  // Parse registration data from params
  const registration = useMemo<Registration | null>(() => {
    if (typeof registrationData === 'string') {
      try {
        return JSON.parse(registrationData) as Registration;
      } catch {
        return null;
      }
    }
    return null;
  }, [registrationData]);

  const patient = registration?.patient;

  // Parse phone number for display
  const { countryCode, phoneNumber } = useMemo(() => {
    return parsePhoneNumber(patient?.parent_contact_number ?? null);
  }, [patient?.parent_contact_number]);

  const handleSaveAndContinue = () => {
    router.push(`/checkpoint/${id}`);
  };

  // Show loading if no registration data
  if (!registration || !patient) {
    return (
      <ThemedView style={Layout.container}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol name="chevron.left" size={IconSizes.lg} color={colors.text} />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Profile</ThemedText>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={DesignColors.primary} />
        </View>
      </ThemedView>
    );
  }

  // Check if this is an adult (type 1) - skip guardian for adults
  const isChild = Number(patient.type) === 2;

  // For adults, redirect directly to checkpoint
  useEffect(() => {
    if (!isChild) {
      router.replace(`/checkpoint/${id}`);
    }
  }, [isChild, id, router]);

  // Show loading while redirecting adults
  if (!isChild) {
    return (
      <ThemedView style={Layout.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={DesignColors.primary} />
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
              <InfoField label="Name" value={patient.parent_full_name ?? 'Not Provided'} icon="user" colors={colors} />
              <InfoField label="Relationship to Child" value={patient.parent_relationship ?? 'Not Provided'} icon="users" colors={colors} />
              <PhoneField colors={colors} countryCode={countryCode} phoneNumber={phoneNumber} />
              <InfoField label="Email Address" value={patient.parent_email ?? 'Not Provided'} icon="mail" colors={colors} />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
