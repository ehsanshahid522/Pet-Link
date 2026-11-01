import API_URL from '../config';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

export default function Login({ onNavigateToSignup, onNavigateToForgot, onLoginSuccess }) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 850;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const validateForm = () => {
    if (!email || !password) {
      return 'Please enter both email and password.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address.';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters.';
    }
    return null;
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      setSuccess(`Welcome back, ${data.name}!`);
      if (onLoginSuccess) {
        setTimeout(() => {
          onLoginSuccess(data);
        }, 1200);
      }
    } catch (err) {
      setError(err.message || 'Network error. Make sure backend is running.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderFormCard = () => (
    <View style={styles.card}>
      {!isDesktop && (
        <View style={styles.header}>
          <Image
            source={require('../../assets/logo/logo.jpeg')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>
            Log in to manage your pet's health and wellness journey.
          </Text>
        </View>
      )}

      {isDesktop && (
        <View style={{ marginBottom: 24 }}>
          <Text style={styles.titleDesktop}>Welcome back</Text>
          <Text style={styles.subtitleDesktop}>
            Log in to manage your pet's health and wellness journey.
          </Text>
        </View>
      )}

      {error ? (
        <View style={styles.errorAlert}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
      ) : null}

      {success ? (
        <View style={styles.successAlert}>
          <Text style={styles.successText}>✨ {success}</Text>
        </View>
      ) : null}

      {/* Email Field */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Email Address</Text>
        <View style={styles.inputWrapper}>
          <Feather name="mail" size={16} color={COLORS.muted} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor={COLORS.muted}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            editable={!submitting}
          />
        </View>
      </View>

      {/* Password Field */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <Feather name="lock" size={16} color={COLORS.muted} style={styles.inputIcon} />
          <TextInput
            style={styles.passwordInput}
            placeholder="Enter your password"
            placeholderTextColor={COLORS.muted}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            value={password}
            onChangeText={setPassword}
            editable={!submitting}
          />
          <TouchableOpacity
            style={styles.eyeBtn}
            onPress={() => setShowPassword(!showPassword)}
            disabled={submitting}
          >
            <Feather name={showPassword ? 'eye-off' : 'eye'} size={16} color={COLORS.muted} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Forgot Password */}
      <TouchableOpacity style={styles.forgotBtn} onPress={onNavigateToForgot} disabled={submitting}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={submitting}>
        {submitting ? (
          <ActivityIndicator size="small" color={COLORS.white} />
        ) : (
          <Text style={styles.submitBtnText}>Login</Text>
        )}
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Signup Outline Button */}
      <TouchableOpacity
        style={styles.signupOutlineBtn}
        onPress={onNavigateToSignup}
        disabled={submitting}
      >
        <Text style={styles.signupOutlineBtnText}>Sign Up for PetLink</Text>
      </TouchableOpacity>
    </View>
  );

  if (isDesktop) {
    return (
      <View style={styles.splitDesktopContainer}>
        {/* Left Branding Panel matching Web Login.css */}
        <View style={styles.desktopBrandingPanel}>
          <View style={styles.brandingContent}>
            <Image
              source={require('../../assets/logo/logo.jpeg')}
              style={styles.brandingLogo}
              resizeMode="contain"
            />
            <Text style={styles.brandingTitle}>PetLink</Text>
            <Text style={styles.brandingTagline}>
              Bringing paws and people together, one click at a time.
            </Text>
          </View>
        </View>

        {/* Right Form Panel */}
        <View style={styles.desktopFormPanel}>
          {renderFormCard()}
        </View>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.mobileContainer} showsVerticalScrollIndicator={false}>
      {renderFormCard()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Desktop Split Layout
  splitDesktopContainer: {
    flex: 1,
    flexDirection: 'row',
    minHeight: '100%',
    backgroundColor: COLORS.bgLight,
  },
  desktopBrandingPanel: {
    flex: 1.2,
    backgroundColor: '#0066CC',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  brandingContent: {
    alignItems: 'center',
    maxWidth: 420,
  },
  brandingLogo: {
    width: 170,
    height: 170,
    borderRadius: 32,
    marginBottom: 24,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  brandingTitle: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: '800',
    letterSpacing: -1,
    marginBottom: 10,
  },
  brandingTagline: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    textAlign: 'center',
  },
  desktopFormPanel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: COLORS.bgLight,
  },

  // Mobile Single-Column Layout
  mobileContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.bgLight,
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  card: {
    maxWidth: 440,
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 28,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  header: {
    alignItems: 'center',
    marginBottom: 22,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 14,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.dark,
    textAlign: 'center',
  },
  titleDesktop: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.dark,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 4,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 18,
  },
  subtitleDesktop: {
    fontSize: 14,
    color: COLORS.muted,
    marginTop: 4,
    fontWeight: '500',
    lineHeight: 20,
  },
  errorAlert: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
    marginBottom: 18,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '500',
  },
  successAlert: {
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC',
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
    marginBottom: 18,
  },
  successText: {
    color: '#16A34A',
    fontSize: 13,
    fontWeight: '500',
  },
  formGroup: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.darkLight,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: COLORS.white,
  },
  inputIcon: {
    paddingLeft: 14,
    color: COLORS.muted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 14,
    color: COLORS.dark,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: COLORS.white,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 14,
    color: COLORS.dark,
  },
  eyeBtn: {
    paddingHorizontal: 14,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 24,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    paddingHorizontal: 12,
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  signupOutlineBtn: {
    backgroundColor: 'transparent',
    borderColor: COLORS.primary,
    borderWidth: 1,
    paddingVertical: 14,
    borderRadius: 24,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupOutlineBtnText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '700',
  },
});
