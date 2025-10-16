import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { OptomLogo } from '@/components/ui/optom-logo';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleLogin = () => {
    // TODO: Implement login logic
    console.log('Login with:', email, password);

    // Navigate to the main app (tabs)
    router.replace('/(tabs)');
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
            <OptomLogo width={80} height={80} color="#B8A072" />
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: isDark ? '#ECEDEE' : '#1E3A5F' }]}>OPTOM DX</Text>

          {/* Description */}
          <Text style={[styles.description, { color: isDark ? '#9BA1A6' : '#687076' }]}>
            AI-driven solution enables seamless remote eye check-ups, streamlining patient data
            management and supporting AI-driven eye health advancements.
          </Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: isDark ? '#ECEDEE' : '#11181C' }]}>Email</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? '#1E1E1E' : '#F5F5F5',
                  color: isDark ? '#ECEDEE' : '#11181C',
                  borderColor: isDark ? '#2A2A2A' : '#E0E0E0',
                },
              ]}
              placeholder="Please insert your email"
              placeholderTextColor={isDark ? '#666' : '#999'}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: isDark ? '#ECEDEE' : '#11181C' }]}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.input,
                  styles.passwordInput,
                  {
                    backgroundColor: isDark ? '#1E1E1E' : '#F5F5F5',
                    color: isDark ? '#ECEDEE' : '#11181C',
                    borderColor: isDark ? '#2A2A2A' : '#E0E0E0',
                  },
                ]}
                placeholder="••••••••••"
                placeholderTextColor={isDark ? '#666' : '#999'}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="password"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}>
                <Text style={{ color: isDark ? '#9BA1A6' : '#687076', fontSize: 20 }}>
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </Text>
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
            style={[styles.loginButton, { backgroundColor: '#1E3A5F' }]}
            onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
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
    fontSize: 15,
    lineHeight: 24,
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
  input: {
    height: 56,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
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
});
