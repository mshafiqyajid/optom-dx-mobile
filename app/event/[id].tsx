import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DesignColors, Spacing, BorderRadius, Typography, IconSizes } from '@/constants/design-system';
import { Layout, getThemedColors } from '@/constants/styles';

// Mock data for patients - replace with real data
const mockPatients = [
  {
    id: '002',
    name: 'Nur Aisyah binti Rahman',
    refNo: 'SKTP-20250803-002',
    completed: true,
  },
  {
    id: '003',
    name: 'Lim Wei Xuan',
    refNo: 'SKTP-20250803-003',
    completed: false,
  },
  {
    id: '004',
    name: 'Faris Hakim bin Azman',
    refNo: 'SKTP-20250803-004',
    completed: true,
  },
  {
    id: '005',
    name: 'Arvind Raj a/l Kumar',
    refNo: 'SKTP-20250803-005',
    completed: true,
  },
  {
    id: '006',
    name: 'Siti Nur Syafiqah bt Zulkifli',
    refNo: 'SKTP-20250803-006',
    completed: false,
  },
];

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getThemedColors(isDark);

  return (
    <ThemedView style={Layout.container}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={IconSizes.lg} color={colors.text} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Event</ThemedText>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={Layout.scrollView} showsVerticalScrollIndicator={false}>
        {/* Event Info */}
        <View style={styles.eventInfo}>
          <ThemedText style={styles.eventTitle}>
            SCHOOL EYE SCREENING -{'\n'}SK TAMAN PUTRA
          </ThemedText>

          <View style={styles.infoRow}>
            <IconSymbol name="calendar" size={IconSizes.sm} color={colors.textSecondary} />
            <ThemedText style={[styles.infoText, { color: colors.textSecondary }]}>
              03 August 2025
            </ThemedText>
          </View>

          <View style={styles.infoRow}>
            <IconSymbol name="clock" size={IconSizes.sm} color={colors.textSecondary} />
            <ThemedText style={[styles.infoText, { color: colors.textSecondary }]}>
              9.00AM to 5.00PM
            </ThemedText>
          </View>

          <View style={styles.infoRow}>
            <IconSymbol name="mappin" size={IconSizes.sm} color={colors.textSecondary} />
            <ThemedText style={[styles.infoText, { color: colors.textSecondary }]}>
              Dewan Seri Putra, SK Taman Putra, Putrajaya
            </ThemedText>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <IconSymbol name="magnifyingglass" size={IconSizes.sm} color={colors.textSecondary} />
            <TextInput
              placeholder="Search Patient's Name or Ref No."
              placeholderTextColor={colors.textSecondary}
              style={[styles.searchInput, { color: colors.text }]}
            />
          </View>
        </View>

        {/* Sort and Count */}
        <View style={styles.controlsRow}>
          <View style={styles.sortButtons}>
            <ThemedText style={[styles.sortLabel, { color: colors.text }]}>Sort By</ThemedText>
            <TouchableOpacity style={[styles.sortButton, styles.sortButtonActive]}>
              <ThemedText style={styles.sortButtonTextActive}>A→Z</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sortButton, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <ThemedText style={[styles.sortButtonText, { color: colors.textSecondary }]}>Latest</ThemedText>
            </TouchableOpacity>
          </View>
          <ThemedText style={[styles.registeredCount, { color: colors.textSecondary }]}>
            Registered : {mockPatients.length}
          </ThemedText>
        </View>

        {/* Patient List */}
        <View style={styles.patientList}>
          {mockPatients.map((patient) => (
            <TouchableOpacity
              key={patient.id}
              style={[styles.patientCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.patientAvatar, { backgroundColor: colors.border }]}>
                <IconSymbol name="person" size={IconSizes.md} color={colors.icon} />
              </View>
              <View style={styles.patientInfo}>
                <ThemedText style={styles.patientName}>{patient.name}</ThemedText>
                <ThemedText style={[styles.patientRef, { color: colors.textSecondary }]}>
                  {patient.refNo}
                </ThemedText>
              </View>
              {patient.completed && (
                <View style={[styles.completedBadge, { backgroundColor: DesignColors.success }]}>
                  <IconSymbol name="checkmark" size={16} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom padding */}
        <View style={{ height: 100 }} />
      </ScrollView>
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
  eventInfo: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
  },
  eventTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.lg,
    lineHeight: Typography.fontSize.lg * 1.4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  infoText: {
    fontSize: Typography.fontSize.base,
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    paddingVertical: Spacing.sm,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sortButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  sortLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  sortButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  sortButtonActive: {
    backgroundColor: DesignColors.accent,
    borderColor: DesignColors.accent,
  },
  sortButtonText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  sortButtonTextActive: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: '#FFFFFF',
  },
  registeredCount: {
    fontSize: Typography.fontSize.sm,
  },
  patientList: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  patientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.md,
  },
  patientAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    marginBottom: 4,
  },
  patientRef: {
    fontSize: Typography.fontSize.sm,
  },
  completedBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
