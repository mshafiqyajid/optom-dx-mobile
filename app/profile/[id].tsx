import { useMemo } from 'react';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, DesignColors, IconSizes, Spacing, Typography } from '@/constants/design-system';
import { Layout, getThemedColors } from '@/constants/styles';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import type { Registration } from '@/services/registrations/type.registrations';

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

// Helper function to format date
function formatDOB(dob: string | null): string {
  if (!dob) return 'Not Provided';
  try {
    const date = new Date(dob);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return dob;
  }
}

// Helper function to format age
function formatAge(age: number | string | null): string {
  if (!age) return 'Not Provided';
  const ageNum = typeof age === 'string' ? parseInt(age, 10) : age;
  return `${ageNum} years old`;
}

// Helper function to capitalize gender
function formatGender(gender: string | null): string {
  if (!gender) return 'Not Provided';
  return gender.charAt(0).toUpperCase() + gender.slice(1);
}

export default function PatientProfileScreen() {
  const { id, registrationData } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getThemedColors(isDark);

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

  const handleNext = () => {
    router.push({
      pathname: '/profile/guardian/[id]',
      params: {
        id: id as string,
        registrationData: registrationData as string
      }
    });
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

  // Check if this is an adult (type 1) or child (type 2)
  const isChild = Number(patient.type) === 2;

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
              <ThemedText style={styles.sectionTitle}>Patient Information</ThemedText>
            </View>

            <View style={styles.sectionContent}>
              <InfoField label="Patient Name" value={patient.full_name ?? 'Not Provided'} icon="user" colors={colors} />
              {isChild ? (
                <>
                  <InfoField label="Date of Birth" value={formatDOB(patient.dob)} icon="calendar" colors={colors} />
                  <InfoField label="Age" value={formatAge(patient.age)} icon="user" colors={colors} />
                  <InfoField label="Gender" value={formatGender(patient.gender)} icon="user" colors={colors} />
                  <InfoField label="Class/Grade" value={patient.class ?? 'Not Provided'} icon="home" colors={colors} />
                  <InfoField label="School Name" value={patient.school_name ?? 'Not Provided'} icon="home" colors={colors} />
                </>
              ) : (
                <>
                  <InfoField label="NRIC" value={patient.nric ?? 'Not Provided'} icon="credit-card" colors={colors} />
                  <InfoField label="Contact Number" value={patient.contact_number ?? 'Not Provided'} icon="phone" colors={colors} />
                  <InfoField label="Email" value={patient.email ?? 'Not Provided'} icon="mail" colors={colors} />
                  <InfoField label="Address" value={patient.address ?? 'Not Provided'} icon="map-pin" colors={colors} />
                </>
              )}
            </View>
          </View>
        </View>

        {/* Bottom padding */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Next Button */}
      <View style={[styles.bottomContainer, { backgroundColor: colors.background }]}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <ThemedText style={styles.nextButtonText}>{isChild ? 'Next' : 'Continue to Checkpoint'}</ThemedText>
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
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
    paddingBottom: 40,
  },
  nextButton: {
    backgroundColor: '#4A6CF7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
  },
  nextButtonText: {
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
