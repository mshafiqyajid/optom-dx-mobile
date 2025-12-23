import { OptomLogo } from '@/components/ui/optom-logo';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLogin } from '@/services/auth/store.auth';
import { Feather } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const loginMutation = useLogin();

  const handleLogin = () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    loginMutation.mutate(
      { email: email.trim(), password },
      {
        onError: (error: Error & { response?: { data?: { message?: string } } }) => {
          const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
          Alert.alert('Login Failed', message);
        },
      }
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: isDark ? '#151718' : '#FFFFFF' }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <OptomLogo height={200} width={200} />
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: isDark ? '#ECEDEE' : '#1E3A5F' }]}>OPTOM DX</Text>

          {/* Description */}
          <Text style={[styles.description, { color: isDark ? '#ECEDEE' : '#11181C' }]}>
            AI-driven solution enables seamless remote eye check-ups, streamlining patient data
            management and supporting AI-driven eye health advancements.
          </Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: isDark ? '#ECEDEE' : '#11181C' }]}>Email</Text>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: isDark ? '#1E1E1E' : '#F5F5F5',
                  borderColor: isDark ? '#2A2A2A' : '#E0E0E0',
                },
              ]}>
              <Feather name="mail" size={20} color={isDark ? '#9BA1A6' : '#687076'} />
              <TextInput
                style={[styles.input, { color: isDark ? '#ECEDEE' : '#11181C' }]}
                placeholder="Please insert your email"
                placeholderTextColor={isDark ? '#666' : '#999'}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: isDark ? '#ECEDEE' : '#11181C' }]}>Password</Text>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: isDark ? '#1E1E1E' : '#F5F5F5',
                  borderColor: isDark ? '#2A2A2A' : '#E0E0E0',
                },
              ]}>
              <Feather name="lock" size={20} color={isDark ? '#9BA1A6' : '#687076'} />
              <TextInput
                style={[styles.input, { color: isDark ? '#ECEDEE' : '#11181C', flex: 1 }]}
                placeholder="••••••••••"
                placeholderTextColor={isDark ? '#666' : '#999'}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="password"
              />
              <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                <Feather
                  name={showPassword ? 'eye' : 'eye-off'}
                  size={20}
                  color={isDark ? '#9BA1A6' : '#687076'}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={[styles.forgotPasswordText, { color: isDark ? '#9BA1A6' : '#687076' }]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={[
              styles.loginButton,
              { backgroundColor: '#1E3A5F' },
              loginMutation.isPending && styles.loginButtonDisabled,
            ]}
            onPress={handleLogin}
            disabled={loginMutation.isPending}>
            {loginMutation.isPending ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 1,
  },
  description: {
    fontSize: 16,
    lineHeight: 26,
    textAlign: 'center',
    marginBottom: 48,
    paddingHorizontal: 8,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    gap: 12,
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 4,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 32,
  },
  forgotPasswordText: {
    fontSize: 14,
  },
  loginButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
});
