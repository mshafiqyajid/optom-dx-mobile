import { StyleSheet, View, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { UpcomingEventsCarousel } from '@/components/ui/upcoming-events-carousel';
import { UserProfileHeader } from '@/components/ui/user-profile-header';
import { DesignColors, Spacing, IconSizes } from '@/constants/design-system';
import { Layout, Cards, getThemedColors } from '@/constants/styles';
import { useGetEvents, EventStatus } from '@/services';
import { useAuthStore } from '@/store/auth-store';
import { formatEventDateTime, getCarouselDateInfo } from '@/utils/date';
import type { EventListItem } from '@/services/events/type.events';

// Transform API event to carousel format
const transformToCarouselEvent = (event: EventListItem) => {
  const startInfo = getCarouselDateInfo(event.start_date);
  const endInfo = getCarouselDateInfo(event.end_date);

  return {
    id: event.id,
    title: `${event.category} –`,
    subtitle: event.title,
    date: `${startInfo.day}, ${startInfo.date}`,
    time: `${startInfo.time} - ${endInfo.time}`,
  };
};

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getThemedColors(isDark);

  const { user } = useAuthStore();

  // Fetch upcoming events (status = Upcoming)
  const {
    data: upcomingEventsData,
    isLoading: isLoadingUpcoming,
    refetch: refetchUpcoming,
  } = useGetEvents({ status: EventStatus.UPCOMING, per_page: 5 });

  // Fetch all events for the list
  const {
    data: allEventsData,
    isLoading: isLoadingAll,
    refetch: refetchAll,
  } = useGetEvents({ per_page: 10 });

  const isLoading = isLoadingUpcoming || isLoadingAll;
  const upcomingEvents = upcomingEventsData?.data?.data || [];
  const eventsList = allEventsData?.data?.data || [];

  const onRefresh = () => {
    refetchUpcoming();
    refetchAll();
  };

  const handleEventPress = (eventId: number) => {
    router.push(`/event/${eventId}`);
  };

  return (
    <ThemedView style={Layout.container}>
      <ScrollView
        style={Layout.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} tintColor={colors.text} />
        }>
        {/* Header with Profile */}
        <View style={styles.header}>
          <UserProfileHeader
            name={user?.name || 'User'}
            role="Operator"
            online={true}
            size="medium"
          />
        </View>

        {/* Upcoming Events Carousel */}
        <View style={Layout.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            UPCOMING EVENT
          </ThemedText>
          {isLoadingUpcoming ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={DesignColors.primary} />
            </View>
          ) : upcomingEvents.length > 0 ? (
            <UpcomingEventsCarousel
              events={upcomingEvents.map((event) => ({
                ...transformToCarouselEvent(event),
                onPress: () => handleEventPress(event.id),
              }))}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <ThemedText style={{ color: colors.textSecondary }}>No upcoming events</ThemedText>
            </View>
          )}
        </View>

        {/* List of Events Section */}
        <View style={Layout.section}>
          <View style={Layout.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              LIST OF EVENT
            </ThemedText>
            <TouchableOpacity>
              <IconSymbol name="slider.horizontal.3" size={IconSizes.md} color={colors.icon} />
            </TouchableOpacity>
          </View>

          {isLoadingAll ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={DesignColors.primary} />
            </View>
          ) : eventsList.length > 0 ? (
            eventsList.map((event) => (
              <TouchableOpacity
                key={event.id}
                style={[styles.eventItem, Cards.base(isDark)]}
                onPress={() => handleEventPress(event.id)}>
                <View style={[styles.eventIcon, { backgroundColor: DesignColors.accent }]}>
                  <IconSymbol name="calendar" size={IconSizes.md} color="#FFFFFF" />
                </View>
                <View style={styles.eventContent}>
                  <ThemedText type="defaultSemiBold" style={styles.eventTitle}>
                    {`${event.category.toUpperCase()} – ${event.title.toUpperCase()}`}
                  </ThemedText>
                  <ThemedText style={[styles.eventDate, { color: colors.textSecondary }]}>
                    {formatEventDateTime(event.start_date, event.end_date)}
                  </ThemedText>
                </View>
                <TouchableOpacity
                  style={styles.eventMenu}
                  onPress={(e) => {
                    e.stopPropagation();
                    // Handle menu press
                  }}>
                  <IconSymbol name="ellipsis" size={IconSizes.sm} color={colors.icon} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <ThemedText style={{ color: colors.textSecondary }}>No events found</ThemedText>
            </View>
          )}
        </View>

        {/* Add some bottom padding */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 60,
    paddingBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  eventIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  eventTitle: {
    fontSize: 13,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  eventDate: {
    fontSize: 12,
  },
  eventMenu: {
    padding: Spacing.sm,
  },
  loadingContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
