import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import Input from './Input';
import Button from './Button';
import { getApiUrl, setApiUrl, resetApiUrl } from '../config';

export default function ServerConfigModal({ visible, onClose }) {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState(null); // 'checking' | 'connected' | 'error'
  const [statusMsg, setStatusMsg] = useState('');
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    if (visible) {
      loadCurrentUrl();
    }
  }, [visible]);

  const loadCurrentUrl = async () => {
    const current = await getApiUrl();
    setUrl(current);
    setStatus(null);
    setStatusMsg('');
  };

  const handleTestConnection = async (targetUrl = url) => {
    if (!targetUrl) return;
    setTesting(true);
    setStatus('checking');
    setStatusMsg('Testing connection to backend...');

    const clean = targetUrl.trim().replace(/\/$/, '');
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(`${clean}/`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const text = await res.text();
      setStatus('connected');
      setStatusMsg(`Connected! Response: "${text.slice(0, 40)}..."`);
    } catch (err) {
      setStatus('error');
      setStatusMsg(
        'Failed to connect. Check if server is running on ' +
          clean +
          ' and both devices share Wi-Fi.'
      );
    } finally {
      setTesting(false);
    }
  };

  const handleSave = async () => {
    if (!url.trim()) {
      Alert.alert('Error', 'Please enter a valid URL');
      return;
    }
    try {
      await setApiUrl(url);
      Alert.alert('Saved', 'Backend server URL updated successfully!', [
        { text: 'OK', onPress: onClose },
      ]);
    } catch (e) {
      Alert.alert('Error', 'Could not save URL');
    }
  };

  const handleReset = async () => {
    const def = await resetApiUrl();
    setUrl(def);
    setStatus(null);
    setStatusMsg('Reset to default IP.');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Ionicons name="server" size={22} color={colors.primary} />
              <Text style={styles.title}>Backend Server Settings</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={colors.muted} />
            </TouchableOpacity>
          </View>

          <Text style={styles.desc}>
            Mobile devices connect to your PC's IP on port 5000. Your PC's Wi-Fi IP is currently detected as 192.168.1.12.
          </Text>

          <Input
            label="Backend Base URL"
            value={url}
            onChangeText={setUrl}
            placeholder="http://192.168.1.12:5000"
            autoCapitalize="none"
          />

          {status && (
            <View
              style={[
                styles.statusBox,
                status === 'connected' && styles.statusBoxSuccess,
                status === 'error' && styles.statusBoxError,
              ]}
            >
              <Ionicons
                name={
                  status === 'connected'
                    ? 'checkmark-circle'
                    : status === 'error'
                    ? 'alert-circle'
                    : 'refresh-circle'
                }
                size={18}
                color={
                  status === 'connected'
                    ? colors.success
                    : status === 'error'
                    ? colors.error
                    : colors.muted
                }
              />
              <Text
                style={[
                  styles.statusText,
                  status === 'connected' && styles.statusTextSuccess,
                  status === 'error' && styles.statusTextError,
                ]}
              >
                {statusMsg}
              </Text>
            </View>
          )}

          <View style={styles.quickOptions}>
            <Text style={styles.quickTitle}>Quick Presets:</Text>
            <View style={styles.presetButtons}>
              <TouchableOpacity
                style={styles.presetChip}
                onPress={() => {
                  setUrl('http://192.168.1.12:5000');
                  handleTestConnection('http://192.168.1.12:5000');
                }}
              >
                <Text style={styles.presetText}>Wi-Fi IP (192.168.1.12:5000)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.presetChip}
                onPress={() => {
                  setUrl('http://10.0.2.2:5000');
                  handleTestConnection('http://10.0.2.2:5000');
                }}
              >
                <Text style={styles.presetText}>Android Emulator (10.0.2.2:5000)</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <Button
              title="Test Connection"
              variant="outline"
              loading={testing}
              onPress={() => handleTestConnection()}
              style={{ flex: 1, marginRight: 8 }}
            />
            <Button
              title="Save & Apply"
              variant="primary"
              onPress={handleSave}
              style={{ flex: 1 }}
            />
          </View>

          <TouchableOpacity onPress={handleReset} style={styles.resetBtn}>
            <Text style={styles.resetText}>Reset to Default</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    elevation: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
  },
  closeBtn: {
    padding: 4,
  },
  desc: {
    fontSize: 13,
    color: colors.muted,
    lineHeight: 18,
    marginBottom: 16,
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 8,
    backgroundColor: colors.bgLight,
    marginBottom: 14,
  },
  statusBoxSuccess: {
    backgroundColor: colors.successLight,
    borderWidth: 1,
    borderColor: colors.successBorder,
  },
  statusBoxError: {
    backgroundColor: colors.errorLight,
    borderWidth: 1,
    borderColor: colors.errorBorder,
  },
  statusText: {
    fontSize: 12,
    color: colors.dark,
    flex: 1,
  },
  statusTextSuccess: {
    color: colors.success,
    fontWeight: '600',
  },
  statusTextError: {
    color: colors.error,
    fontWeight: '600',
  },
  quickOptions: {
    marginBottom: 16,
  },
  quickTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.muted,
    marginBottom: 6,
  },
  presetButtons: {
    flexDirection: 'column',
    gap: 6,
  },
  presetChip: {
    backgroundColor: colors.bgLight,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  presetText: {
    fontSize: 12,
    color: colors.dark,
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resetBtn: {
    alignItems: 'center',
    marginTop: 12,
    padding: 6,
  },
  resetText: {
    fontSize: 13,
    color: colors.muted,
    textDecorationLine: 'underline',
  },
});
