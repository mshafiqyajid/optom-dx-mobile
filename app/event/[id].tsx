import { useCallback, useMemo, useState } from 'react';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, DesignColors, IconSizes, Spacing, Typography } from '@/constants/design-system';
import { Layout, getThemedColors } from '@/constants/styles';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useGetEventById } from '@/services/events/store.events';
import { useGetRegistrations } from '@/services/registrations/store.registrations';
import type { Registration } from '@/services/registrations/type.registrations';
import { formatDate, formatTimeRange, formatLocation } from '@/utils/date';

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams();
  const eventId = Number(id);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getThemedColors(isDark);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'az' | 'latest'>('az');

  const { data: eventData, isLoading: isLoadingEvent, error: eventError } = useGetEventById(eventId);
  const event = eventData?.data;

  // Fetch registrations for this event
  const { data: registrationsData, isLoading: isLoadingRegistrations } = useGetRegistrations({ event_id: eventId });
  const registrations = useMemo(() => registrationsData?.data?.data ?? [], [registrationsData]);

  // Filter and sort registrations
  const filteredRegistrations = useMemo(() => {
    let filtered = registrations;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (reg) =>
          reg.patient?.full_name?.toLowerCase().includes(query) ||
          reg.reference_number?.toLowerCase().includes(query)
      );
    }

    // Sort
    if (sortBy === 'az') {
      filtered = [...filtered].sort((a, b) =>
        (a.patient?.full_name ?? '').localeCompare(b.patient?.full_name ?? '')
      );
    } else {
      filtered = [...filtered].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }

    return filtered;
  }, [registrations, searchQuery, sortBy]);

  // Check if screening is completed (all checkpoints done)
  const isCompleted = useCallback((registration: Registration) => {
    return registration.attendance_status === 'pass' ||
           registration.attendance_status === 'referred_optometrist' ||
           registration.attendance_status === 'referred_specialist';
  }, []);

  // Navigate to profile with registration data
  const handlePatientPress = useCallback(
    (registration: Registration) => {
      router.push({
        pathname: '/profile/[id]',
        params: {
          id: registration.id.toString(),
          registrationData: JSON.stringify(registration)
        }
      });
    },
    [router]
  );

  // Render registration item for FlatList
  const renderRegistrationItem = useCallback(
    ({ item: registration }: { item: Registration }) => {
      const completed = isCompleted(registration);
      return (
        <TouchableOpacity
          style={[styles.patientCard, { borderColor: colors.border }]}
          onPress={() => handlePatientPress(registration)}
          accessibilityLabel={`Patient ${registration.patient?.full_name}, reference ${registration.reference_number}${completed ? ', completed' : ''}`}
          accessibilityRole="button">
          <View style={[styles.patientAvatar, { backgroundColor: colors.border }]}>
            <IconSymbol name="person" size={IconSizes.md} color={colors.icon} />
          </View>
          <View style={styles.patientInfo}>
            <ThemedText style={styles.patientName}>{registration.patient?.full_name ?? 'Unknown'}</ThemedText>
            <ThemedText style={[styles.patientRef, { color: colors.textSecondary }]}>
              {registration.reference_number}
            </ThemedText>
          </View>
          {completed && (
            <View style={[styles.completedBadge, { backgroundColor: DesignColors.success }]}>
              <IconSymbol name="checkmark" size={16} color="#FFFFFF" />
            </View>
          )}
        </TouchableOpacity>
      );
    },
    [colors, handlePatientPress, isCompleted]
  );

  // Key extractor for FlatList
  const keyExtractor = useCallback((item: Registration) => item.id.toString(), []);

  const isLoading = isLoadingEvent || isLoadingRegistrations;

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
  if (eventError || !event) {
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
        data={filteredRegistrations}
        renderItem={renderRegistrationItem}
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
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  accessibilityLabel="Search patients"
                />
              </View>
            </View>

            {/* Sort and Count */}
            <View style={styles.controlsRow}>
              <View style={styles.sortButtons}>
                <ThemedText style={[styles.sortLabel, { color: colors.text }]}>Sort By</ThemedText>
                <TouchableOpacity
                  style={[styles.sortButton, sortBy === 'az' ? styles.sortButtonActive : { backgroundColor: colors.surface, borderColor: colors.border }]}
                  onPress={() => setSortBy('az')}
                  accessibilityLabel="Sort alphabetically"
                  accessibilityRole="button">
                  <ThemedText style={sortBy === 'az' ? styles.sortButtonTextActive : [styles.sortButtonText, { color: colors.textSecondary }]}>A→Z</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.sortButton, sortBy === 'latest' ? styles.sortButtonActive : { backgroundColor: colors.surface, borderColor: colors.border }]}
                  onPress={() => setSortBy('latest')}
                  accessibilityLabel="Sort by latest"
                  accessibilityRole="button">
                  <ThemedText style={sortBy === 'latest' ? styles.sortButtonTextActive : [styles.sortButtonText, { color: colors.textSecondary }]}>Latest</ThemedText>
                </TouchableOpacity>
              </View>
              <ThemedText style={[styles.registeredCount, { color: colors.textSecondary }]}>
                Registered : {registrations.length}
              </ThemedText>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>
              {searchQuery ? 'No patients found' : 'No registrations yet'}
            </ThemedText>
          </View>
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
  emptyContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: Typography.fontSize.base,
  },
});
