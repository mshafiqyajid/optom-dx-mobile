import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { UpcomingEventsCarousel } from '@/components/ui/upcoming-events-carousel';
import { UserProfileHeader } from '@/components/ui/user-profile-header';
import { DesignColors, Spacing, IconSizes } from '@/constants/design-system';
import { Layout, Cards, getThemedColors } from '@/constants/styles';

// Mock data - replace with real data later
const upcomingEvents = [
  {
    title: 'School Eye Screening –',
    subtitle: 'SK Taman Putra',
    date: 'Monday, 04 August 2025',
    time: '09:00am - 12:30pm',
  },
  {
    title: 'Community Eye Screening –',
    subtitle: 'Putrajaya Precinct 11',
    date: 'Thursday, 05 August 2025',
    time: '08:00am - 4:00pm',
  },
  {
    title: 'Corporate Screening –',
    subtitle: 'Tenaga Nasional HQ',
    date: 'Friday, 10 August 2025',
    time: '10:00am - 4:00pm',
  },
];

const eventsList = [
  {
    id: 1,
    title: 'COMMUNITY EYE SCREENING – PUTRAJAYA PRECINCT 11',
    date: '05 AUG 2025, 10:00 AM – 4:00 PM',
  },
  {
    id: 2,
    title: 'SCHOOL EYE SCREENING – SK TAMAN PUTRA',
    date: '03 AUG 2025, 09:00 AM – 12:30 PM',
  },
  {
    id: 3,
    title: 'SCHOOL EYE SCREENING – SMK BUKIT INDAH',
    date: '10 AUG 2025, 9:00 AM – 4:00 PM',
  },
  {
    id: 4,
    title: 'CORPORATE SCREENING – TENAGA NASIONAL HQ',
    date: '05 AUG 2025, 10:00 AM – 4:00 PM',
  },
];

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getThemedColors(isDark);

  return (
    <ThemedView style={Layout.container}>
      <ScrollView style={Layout.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header with Profile */}
        <View style={styles.header}>
          <UserProfileHeader name="Ahmad Zaki" role="Operator" online={true} size="medium" />
        </View>

        {/* Upcoming Events Carousel */}
        <View style={Layout.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            UPCOMING EVENT
          </ThemedText>
          <UpcomingEventsCarousel events={upcomingEvents} />
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

          {eventsList.map((event) => (
            <TouchableOpacity key={event.id} style={[styles.eventItem, Cards.base(isDark)]}>
              <View style={[styles.eventIcon, { backgroundColor: DesignColors.accent }]}>
                <IconSymbol name="calendar" size={IconSizes.md} color="#FFFFFF" />
              </View>
              <View style={styles.eventContent}>
                <ThemedText type="defaultSemiBold" style={styles.eventTitle}>
                  {event.title}
                </ThemedText>
                <ThemedText style={[styles.eventDate, { color: colors.textSecondary }]}>
                  {event.date}
                </ThemedText>
              </View>
              <TouchableOpacity style={styles.eventMenu}>
                <IconSymbol name="ellipsis" size={IconSizes.sm} color={colors.icon} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
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
});
