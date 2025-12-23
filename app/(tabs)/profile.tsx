import { StyleSheet, View, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthStore } from '@/store/auth-store';
import { useLogout } from '@/services/auth/store.auth';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const { user } = useAuthStore();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => logoutMutation.mutate(),
        },
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <View style={[styles.avatar, { backgroundColor: isDark ? '#444' : '#E0E0E0' }]}>
          <IconSymbol name="person.fill" size={48} color={isDark ? '#9BA1A6' : '#687076'} />
        </View>

        <ThemedText type="title" style={styles.title}>
          {user?.name || 'User'}
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          {user?.email || 'No email'}
        </ThemedText>

        <TouchableOpacity
          onPress={handleLogout}
          style={[styles.logoutButton, logoutMutation.isPending && styles.logoutButtonDisabled]}
          disabled={logoutMutation.isPending}>
          {logoutMutation.isPending ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <ThemedText type="defaultSemiBold" style={styles.logoutText}>
              Logout
            </ThemedText>
          )}
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
  logoutButtonDisabled: {
    opacity: 0.7,
  },
});
