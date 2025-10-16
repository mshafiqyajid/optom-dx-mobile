import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';

// Mock data - replace with real data later
const upcomingEvent = {
  title: 'School Eye Screening –',
  subtitle: 'SK Taman Putra',
  date: 'Monday, 04 August 2025',
  time: '09:00am - 12:30pm',
};

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
          <View style={styles.profileSection}>
            <View>
              <ThemedText type="title" style={styles.userName}>
                Ahmad Zaki
              </ThemedText>
              <View style={styles.statusContainer}>
                <View style={[styles.statusDot, { backgroundColor: '#4CAF50' }]} />
                <ThemedText style={[styles.statusText, { color: isDark ? '#9BA1A6' : '#687076' }]}>
                  Operator
                </ThemedText>
              </View>
            </View>
            <TouchableOpacity style={styles.avatarContainer}>
              <View style={[styles.avatar, { backgroundColor: isDark ? '#444' : '#E0E0E0' }]}>
                <IconSymbol name="person.fill" size={32} color={isDark ? '#9BA1A6' : '#687076'} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Upcoming Event Section */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            UPCOMING EVENT
          </ThemedText>
          <TouchableOpacity
            style={[styles.upcomingCard, { backgroundColor: isDark ? '#2C3E50' : '#34495E' }]}>
            <View style={styles.eventIconContainer}>
              <View style={[styles.eventIcon, { backgroundColor: '#B8A072' }]}>
                <IconSymbol name="calendar" size={28} color="#FFFFFF" />
              </View>
            </View>
            <View style={styles.upcomingEventContent}>
              <ThemedText style={[styles.upcomingEventTitle, { color: '#FFFFFF' }]}>
                {upcomingEvent.title}
              </ThemedText>
              <ThemedText style={[styles.upcomingEventSubtitle, { color: '#FFFFFF' }]}>
                {upcomingEvent.subtitle}
              </ThemedText>
              <View style={styles.upcomingEventDetails}>
                <ThemedText style={[styles.upcomingEventDate, { color: '#FFFFFF' }]}>
                  {upcomingEvent.date}
                </ThemedText>
                <ThemedText style={[styles.upcomingEventTime, { color: '#FFFFFF', opacity: 0.8 }]}>
                  {upcomingEvent.time}
                </ThemedText>
              </View>
            </View>
          </TouchableOpacity>
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
  profileSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userName: {
    fontSize: 28,
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
  },
  avatarContainer: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
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
  upcomingCard: {
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
  },
  eventIconContainer: {
    marginBottom: 16,
  },
  eventIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  upcomingEventContent: {
    gap: 8,
  },
  upcomingEventTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  upcomingEventSubtitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  upcomingEventDetails: {
    marginTop: 8,
  },
  upcomingEventDate: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  upcomingEventTime: {
    fontSize: 14,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
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
