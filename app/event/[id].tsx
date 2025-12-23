import { useCallback, useMemo } from 'react';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, DesignColors, IconSizes, Spacing, Typography } from '@/constants/design-system';
import { MOCK_PATIENTS, type Patient } from '@/constants/mock-data';
import { Layout, getThemedColors } from '@/constants/styles';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useGetEventById } from '@/services/events/store.events';
import { formatDate, formatTimeRange, formatLocation } from '@/utils/date';

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams();
  const eventId = Number(id);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getThemedColors(isDark);

  const { data: eventData, isLoading, error } = useGetEventById(eventId);
  const event = eventData?.data;

  // Memoize the patient press handler to avoid recreating on each render
  const handlePatientPress = useCallback(
    (patientId: string) => {
      router.push(`/profile/${patientId}`);
    },
    [router]
  );

  // Render patient item for FlatList
  const renderPatientItem = useCallback(
    ({ item: patient }: { item: Patient }) => (
      <TouchableOpacity
        style={[styles.patientCard, { borderColor: colors.border }]}
        onPress={() => handlePatientPress(patient.id)}
        accessibilityLabel={`Patient ${patient.name}, reference ${patient.refNo}${patient.completed ? ', completed' : ''}`}
        accessibilityRole="button">
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
    ),
    [colors, handlePatientPress]
  );

  // Key extractor for FlatList
  const keyExtractor = useCallback((item: Patient) => item.id.toString(), []);

  // Memoize patients list
  const patients = useMemo(() => MOCK_PATIENTS, []);

  // Show loading state
  if (isLoading) {
    return (
      <ThemedView style={Layout.container}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol name="chevron.left" size={IconSizes.lg} color={colors.text} />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Event</ThemedText>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={DesignColors.primary} />
        </View>
      </ThemedView>
    );
  }

  // Show error state
  if (error || !event) {
    return (
      <ThemedView style={Layout.container}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol name="chevron.left" size={IconSizes.lg} color={colors.text} />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Event</ThemedText>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ThemedText style={{ color: colors.textSecondary }}>Failed to load event</ThemedText>
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
        <ThemedText style={styles.headerTitle}>Event</ThemedText>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={patients}
        renderItem={renderPatientItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {/* Event Info */}
            <View style={styles.eventInfo}>
              <ThemedText style={styles.eventTitle}>
                {event.category.toUpperCase()} -{'\n'}{event.title.toUpperCase()}
              </ThemedText>

              {/* Date and Time Row */}
              <View style={styles.dateTimeRow}>
                <View style={styles.infoItem}>
                  <IconSymbol name="calendar" size={IconSizes.sm} color={colors.textSecondary} />
                  <ThemedText style={[styles.infoText, { color: colors.textSecondary }]}>
                    {formatDate(event.start_date)}
                  </ThemedText>
                </View>
                <View style={styles.infoItem}>
                  <IconSymbol name="clock" size={IconSizes.sm} color={colors.textSecondary} />
                  <ThemedText style={[styles.infoText, { color: colors.textSecondary }]}>
                    {formatTimeRange(event.start_date, event.end_date)}
                  </ThemedText>
                </View>
              </View>

              {/* Location Row */}
              <View style={styles.infoItem}>
                <IconSymbol name="mappin" size={IconSizes.sm} color={colors.textSecondary} />
                <ThemedText style={[styles.infoText, { color: colors.textSecondary }]}>
                  {formatLocation(event)}
                </ThemedText>
              </View>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <View style={[styles.searchBar, { borderColor: colors.border }]}>
                <IconSymbol name="magnifyingglass" size={IconSizes.sm} color={colors.textSecondary} />
                <TextInput
                  placeholder="Search Patient's Name or Ref No."
                  placeholderTextColor={colors.textSecondary}
                  style={[styles.searchInput, { color: colors.text }]}
                  accessibilityLabel="Search patients"
                />
              </View>
            </View>

            {/* Sort and Count */}
            <View style={styles.controlsRow}>
              <View style={styles.sortButtons}>
                <ThemedText style={[styles.sortLabel, { color: colors.text }]}>Sort By</ThemedText>
                <TouchableOpacity
                  style={[styles.sortButton, styles.sortButtonActive]}
                  accessibilityLabel="Sort alphabetically"
                  accessibilityRole="button">
                  <ThemedText style={styles.sortButtonTextActive}>A→Z</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.sortButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                  accessibilityLabel="Sort by latest"
                  accessibilityRole="button">
                  <ThemedText style={[styles.sortButtonText, { color: colors.textSecondary }]}>Latest</ThemedText>
                </TouchableOpacity>
              </View>
              <ThemedText style={[styles.registeredCount, { color: colors.textSecondary }]}>
                Registered : {patients.length}
              </ThemedText>
            </View>
          </>
        }
        ListFooterComponent={<View style={{ height: 100 }} />}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
      />
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
  eventInfo: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
  },
  eventTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.lg,
    lineHeight: Typography.fontSize.lg * 1.4,
    textAlign: 'center',
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.xl,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  infoText: {
    fontSize: Typography.fontSize.base,
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
  listContent: {
    paddingHorizontal: Spacing.lg,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
