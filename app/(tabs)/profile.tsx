import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleLogout = () => {
    // @ts-ignore - auth route exists but not in typed routes yet
    router.replace('/(auth)/login');
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <View style={[styles.avatar, { backgroundColor: isDark ? '#444' : '#E0E0E0' }]}>
          <IconSymbol name="person.fill" size={48} color={isDark ? '#9BA1A6' : '#687076'} />
        </View>

        <ThemedText type="title" style={styles.title}>
          Ahmad Zaki
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Operator
        </ThemedText>

        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <ThemedText type="defaultSemiBold" style={styles.logoutText}>
            Logout
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 48,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  logoutText: {
    color: '#FFFFFF',
  },
});
