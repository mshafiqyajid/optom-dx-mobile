import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  const handleLogout = () => {
    // @ts-ignore - auth route exists but not in typed routes yet
    router.replace('/(auth)/login');
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Welcome to Optom DX
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Your AI-driven eye health solution
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
  title: {
    marginBottom: 16,
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
