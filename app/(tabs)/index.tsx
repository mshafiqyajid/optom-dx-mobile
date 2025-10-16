import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { UpcomingEventsCarousel } from '@/components/ui/upcoming-events-carousel';
import { UserProfileHeader } from '@/components/ui/user-profile-header';

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

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header with Profile */}
        <View style={styles.header}>
          <UserProfileHeader name="Ahmad Zaki" role="Operator" online={true} size="medium" />
        </View>

        {/* Upcoming Events Carousel */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            UPCOMING EVENT
          </ThemedText>
          <UpcomingEventsCarousel events={upcomingEvents} />
        </View>

        {/* List of Events Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              LIST OF EVENT
            </ThemedText>
            <TouchableOpacity>
              <IconSymbol name="slider.horizontal.3" size={24} color={isDark ? '#9BA1A6' : '#687076'} />
            </TouchableOpacity>
          </View>

          {eventsList.map((event) => (
            <TouchableOpacity
              key={event.id}
              style={[
                styles.eventItem,
                { backgroundColor: isDark ? '#1E1E1E' : '#F5F5F5', borderColor: isDark ? '#2A2A2A' : '#E0E0E0' },
              ]}>
              <View style={[styles.eventIcon, { backgroundColor: '#B8A072' }]}>
                <IconSymbol name="calendar" size={24} color="#FFFFFF" />
              </View>
              <View style={styles.eventContent}>
                <ThemedText type="defaultSemiBold" style={styles.eventTitle}>
                  {event.title}
                </ThemedText>
                <ThemedText style={[styles.eventDate, { color: isDark ? '#9BA1A6' : '#687076' }]}>
                  {event.date}
                </ThemedText>
              </View>
              <TouchableOpacity style={styles.eventMenu}>
                <IconSymbol name="ellipsis" size={20} color={isDark ? '#9BA1A6' : '#687076'} />
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
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
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
    marginLeft: 12,
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
    padding: 8,
  },
});
