import { Platform } from 'react-native';

const getDevUrl = () => {
  if (Platform.OS === 'android') return 'http://10.0.2.2:5000';
  if (Platform.OS === 'web') return 'http://localhost:5000';
  return 'http://192.168.1.12:5000';
};

const rawApiUrl = process.env.EXPO_PUBLIC_API_URL || getDevUrl();
const API_URL = rawApiUrl.endsWith('/') ? rawApiUrl.slice(0, -1) : rawApiUrl;

export default API_URL;
