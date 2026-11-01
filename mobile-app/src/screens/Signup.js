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

export default function Signup({ onNavigateToLogin, onSignupSuccess }) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 850;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('user');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const validateForm = () => {
    if (!name || !email || !phone || !address || !role || !password) {
      return 'All fields are required for registration.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address.';
    }

    if (password.length < 6) {
      return 'Password must be at least 6 characters.';
    }

    const pkPhoneRegex = /^((\+92)|(0092))?\s?3\d{2}\s?\d{7}$|^03\d{9}$/;
    if (!pkPhoneRegex.test(phone.replace(/[\s-]/g, ''))) {
      return 'Please enter a valid Pakistani mobile number (e.g. 03001234567).';
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
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, address, role, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setSuccess('Account created successfully! Auto-authenticating...');
      if (onSignupSuccess) {
        setTimeout(() => {
          onSignupSuccess(data);
        }, 1500);
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Network error or server inactive.');
    } finally {
      setSubmitting(false);
    }
  };

  const roles = [
    { label: 'User', value: 'user' },
    { label: 'Shelter Provider', value: 'shelter_provider' },
    { label: 'Administrator', value: 'admin' },
  ];

  const renderFormCard = () => (
    <View style={styles.card}>
      {!isDesktop && (
        <View style={styles.header}>
          <Image
            source={require('../../assets/logo/logo.jpeg')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Register</Text>
          <Text style={styles.subtitle}>Create your centralized PetLink account</Text>
        </View>
      )}

      {isDesktop && (
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.titleDesktop}>Register</Text>
          <Text style={styles.subtitleDesktop}>Create your centralized PetLink account</Text>
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

      {/* Full Name */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Full Name</Text>
        <View style={styles.inputWrapper}>
          <Feather name="user" size={16} color={COLORS.muted} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter full name"
            placeholderTextColor={COLORS.muted}
            value={name}
            onChangeText={setName}
            editable={!submitting}
          />
        </View>
      </View>

      {/* Email Address */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Email Address</Text>
        <View style={styles.inputWrapper}>
          <Feather name="mail" size={16} color={COLORS.muted} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="name@example.com"
            placeholderTextColor={COLORS.muted}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            editable={!submitting}
          />
        </View>
      </View>

      {/* Phone Number */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Phone Number</Text>
        <View style={styles.inputWrapper}>
          <Feather name="phone" size={16} color={COLORS.muted} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="03xxxxxxxxx"
            placeholderTextColor={COLORS.muted}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            editable={!submitting}
          />
        </View>
      </View>

      {/* City / Address */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>City / Address</Text>
        <View style={styles.inputWrapper}>
          <Feather name="map-pin" size={16} color={COLORS.muted} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="e.g. Lahore, Pakistan"
            placeholderTextColor={COLORS.muted}
            value={address}
            onChangeText={setAddress}
            editable={!submitting}
          />
        </View>
      </View>

      {/* Role Selector */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Select Your Role</Text>
        <View style={styles.roleContainer}>
          {roles.map((item) => (
            <TouchableOpacity
              key={item.value}
              style={[styles.roleBtn, role === item.value && styles.roleBtnActive]}
              onPress={() => setRole(item.value)}
              disabled={submitting}
            >
              <Text
                style={[styles.roleBtnText, role === item.value && styles.roleBtnTextActive]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Password */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <Feather name="lock" size={16} color={COLORS.muted} style={styles.inputIcon} />
          <TextInput
            style={styles.passwordInput}
            placeholder="At least 6 characters"
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

      {/* Create Account Button */}
      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={submitting}>
        {submitting ? (
          <ActivityIndicator size="small" color={COLORS.white} />
        ) : (
          <Text style={styles.submitBtnText}>Create Account</Text>
        )}
      </TouchableOpacity>

      {/* Sign In Link */}
      <View style={styles.footerLinkRow}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={onNavigateToLogin} disabled={submitting}>
          <Text style={styles.signInLink}>Sign In Here</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isDesktop) {
    return (
      <View style={styles.splitDesktopContainer}>
        {/* Left Branding Panel matching Web Signup.css */}
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
        <ScrollView contentContainerStyle={styles.desktopFormPanel} showsVerticalScrollIndicator={false}>
          {renderFormCard()}
        </ScrollView>
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
    flexGrow: 1,
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
    maxWidth: 460,
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
    marginBottom: 20,
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
  },
  subtitleDesktop: {
    fontSize: 14,
    color: COLORS.muted,
    marginTop: 4,
    fontWeight: '500',
  },
  errorAlert: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
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
    marginBottom: 16,
  },
  successText: {
    color: '#16A34A',
    fontSize: 13,
    fontWeight: '500',
  },
  formGroup: {
    marginBottom: 14,
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
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 14,
    color: COLORS.dark,
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  roleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  roleBtnActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#EFF6FF',
  },
  roleBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.muted,
  },
  roleBtnTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
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
  submitBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 24,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  submitBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
  footerLinkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 13,
    color: COLORS.muted,
    fontWeight: '500',
  },
  signInLink: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '700',
  },
});
