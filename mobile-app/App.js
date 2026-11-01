import API_URL from './src/config';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Platform,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import {
  Outfit_400Regular,
  Outfit_600SemiBold,
  Outfit_700Bold,
  Outfit_800ExtraBold,
} from '@expo-google-fonts/outfit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Authentic Screens
import Login from './src/screens/Login';
import Signup from './src/screens/Signup';
import ForgotPassword from './src/screens/ForgotPassword';
import Dashboard from './src/screens/Dashboard';
import Profile from './src/screens/Profile';
import AccountSettings from './src/screens/AccountSettings';
import MyPets from './src/screens/MyPets';
import PetForm from './src/screens/PetForm';
import PetDetails from './src/screens/PetDetails';
import AdminDashboard from './src/screens/AdminDashboard';
import Store from './src/screens/Store';
import ShelterProviderDashboard from './src/screens/ShelterProviderDashboard';
import FindShelters from './src/screens/FindShelters';
import ShelterDetails from './src/screens/ShelterDetails';
import ServicesChooser from './src/screens/ServicesChooser';
import FindClinics from './src/screens/FindClinics';
import ClinicDetails from './src/screens/ClinicDetails';
import { COLORS } from './src/constants/theme';

export default function App() {
  const [screen, setScreen] = useState('login');
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [petSubView, setPetSubView] = useState('list');
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [selectedShelterId, setSelectedShelterId] = useState(null);
  const [selectedClinicId, setSelectedClinicId] = useState(null);
  const [storeInitialMode, setStoreInitialMode] = useState('products');

  const [fontsLoaded] = useFonts({
    'Outfit-Regular': Outfit_400Regular,
    'Outfit-SemiBold': Outfit_600SemiBold,
    'Outfit-Bold': Outfit_700Bold,
    'Outfit-ExtraBold': Outfit_800ExtraBold,
  });

  // Auto-restore session from storage directly on start (No landing page delay)
  useEffect(() => {
    const restoreSession = async () => {
      try {
        let saved = null;
        if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
          saved = localStorage.getItem('user');
        }
        if (!saved) {
          saved = await AsyncStorage.getItem('user');
        }

        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && (parsed._id || parsed.id || parsed.email)) {
            setUser(parsed);
            setScreen('dashboard');
            setInitializing(false);
            return;
          }
        }
      } catch (e) {
        console.warn('Session restore error:', e);
      }
      setScreen('login');
      setInitializing(false);
    };

    restoreSession();
  }, []);

  const handleLoginSuccess = async (userData) => {
    const formattedUser = {
      ...userData,
      username: userData.username || (userData.email ? userData.email.split('@')[0] : 'user'),
      recoveryEmail: userData.recoveryEmail || 'recovery@petlink.com',
      gender: userData.gender || 'Male',
      dob: userData.dob || '1998-05-12',
      city: userData.city || 'Lahore',
      province: userData.province || 'Punjab',
      country: userData.country || 'Pakistan',
      bio: userData.bio || 'Pet lover and active supporter of shelters.',
      createdAt: userData.createdAt || new Date().toISOString(),
    };
    setUser(formattedUser);
    try {
      if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(formattedUser));
      }
      await AsyncStorage.setItem('user', JSON.stringify(formattedUser));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
    setScreen('dashboard');
  };

  const handleLogout = async () => {
    try {
      if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
        localStorage.removeItem('user');
      }
      await AsyncStorage.removeItem('user');
    } catch (e) {
      console.warn('Storage remove error:', e);
    }
    setUser(null);
    setScreen('login');
  };

  const handleUpdateUser = async (updatedUser) => {
    try {
      const targetId = updatedUser._id || updatedUser.id || user?._id || user?.id;
      const response = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: targetId,
          name: updatedUser.name,
          username: updatedUser.username,
          recoveryEmail: updatedUser.recoveryEmail,
          phone: updatedUser.phone,
          gender: updatedUser.gender,
          dob: updatedUser.dob,
          address: updatedUser.address,
          city: updatedUser.city,
          province: updatedUser.province,
          country: updatedUser.country,
          bio: updatedUser.bio,
          profilePic: updatedUser.profilePic,
          coverPhoto: updatedUser.coverPhoto,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setUser(data);
        if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(data));
        }
        await AsyncStorage.setItem('user', JSON.stringify(data));
      } else {
        alert(data.message || 'Failed to update profile details on server');
      }
    } catch (err) {
      console.log('Mobile profile update error:', err);
      setUser(updatedUser);
    }
  };

  const handleSaveProfile = async (updatedUser) => {
    await handleUpdateUser(updatedUser);
    setScreen('profile');
  };

  // Sync profile data on dashboard / profile transitions
  useEffect(() => {
    const targetId = user?._id || user?.id;
    if (targetId && ['dashboard', 'profile'].includes(screen)) {
      fetch(`${API_URL}/api/auth/profile/${targetId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && (data._id || data.id)) {
            setUser(data);
          }
        })
        .catch((err) => console.log('Error syncing profile:', err));
    }
  }, [screen]);

  if (!fontsLoaded || initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const showNav =
    [
      'dashboard',
      'profile',
      'settings',
      'mypets',
      'store',
      'findShelters',
      'shelterDetails',
      'services',
      'findClinics',
      'clinicDetails',
    ].includes(screen) &&
    !(user && (user.role === 'admin' || user.role === 'shelter_provider'));

  const handleTabPress = (tabName) => {
    if (tabName === 'home') {
      setScreen('dashboard');
    } else if (tabName === 'profile') {
      setScreen('profile');
    } else if (tabName === 'pets') {
      setPetSubView('list');
      setScreen('mypets');
    } else if (tabName === 'store') {
      setStoreInitialMode('products');
      setScreen('store');
    } else if (tabName === 'services') {
      setScreen('services');
    }
  };

  const getActiveTab = () => {
    if (screen === 'dashboard') return 'home';
    if (screen === 'profile' || screen === 'settings') return 'profile';
    if (screen === 'mypets') return 'pets';
    if (screen === 'store') return 'store';
    if (
      [
        'findShelters',
        'shelterDetails',
        'services',
        'findClinics',
        'clinicDetails',
      ].includes(screen)
    )
      return 'services';
    return '';
  };

  const activeTab = getActiveTab();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        {/* Header Bar */}
        {showNav && user && (
          <View style={styles.headerBar}>
            <TouchableOpacity
              style={styles.headerBrandRow}
              onPress={() => setScreen('dashboard')}
              activeOpacity={0.8}
            >
              <Image
                source={require('./assets/logo/logo.jpeg')}
                style={styles.headerLogo}
                resizeMode="contain"
              />
              <Text style={styles.headerTitle}>PetLink</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerNotification}
              onPress={() => alert('No new notifications')}
              activeOpacity={0.7}
            >
              <Feather name="bell" size={18} color={COLORS.dark} />
            </TouchableOpacity>
          </View>
        )}

        {/* Screen Router */}
        <View style={styles.screenWrapper}>
          {screen === 'login' && (
            <Login
              onNavigateToSignup={() => setScreen('signup')}
              onNavigateToForgot={() => setScreen('forgot')}
              onLoginSuccess={handleLoginSuccess}
            />
          )}

          {screen === 'signup' && (
            <Signup
              onNavigateToLogin={() => setScreen('login')}
              onSignupSuccess={handleLoginSuccess}
            />
          )}

          {screen === 'forgot' && (
            <ForgotPassword onNavigateToLogin={() => setScreen('login')} />
          )}

          {screen === 'dashboard' && user && user.role === 'shelter_provider' ? (
            <ShelterProviderDashboard user={user} onLogout={handleLogout} />
          ) : screen === 'dashboard' && user && user.role === 'admin' ? (
            <AdminDashboard user={user} onLogout={handleLogout} />
          ) : screen === 'dashboard' && (
            <Dashboard
              user={user}
              onLogout={handleLogout}
              onNavigate={(scr, subView = 'list') => {
                setScreen(scr);
                if (scr === 'mypets') {
                  setPetSubView(subView);
                } else if (scr === 'store') {
                  setStoreInitialMode(subView);
                }
              }}
            />
          )}

          {screen === 'profile' && (
            <Profile
              user={user}
              onNavigateToSettings={() => setScreen('settings')}
              onLogout={handleLogout}
              onUpdateUser={handleUpdateUser}
            />
          )}

          {screen === 'mypets' && (
            <>
              {petSubView === 'list' && (
                <MyPets
                  user={user}
                  onViewDetails={(id) => {
                    setSelectedPetId(id);
                    setPetSubView('details');
                  }}
                  onAddPet={() => {
                    setSelectedPetId(null);
                    setPetSubView('form');
                  }}
                  onEditPet={(id) => {
                    setSelectedPetId(id);
                    setPetSubView('form');
                  }}
                />
              )}

              {petSubView === 'form' && (
                <PetForm
                  user={user}
                  petId={selectedPetId}
                  onCancel={() => setPetSubView('list')}
                  onSaveSuccess={() => {
                    setPetSubView('list');
                  }}
                />
              )}

              {petSubView === 'details' && (
                <PetDetails
                  user={user}
                  petId={selectedPetId}
                  onBack={() => setPetSubView('list')}
                  onEdit={(id) => {
                    setSelectedPetId(id);
                    setPetSubView('form');
                  }}
                  onDeleteSuccess={() => setPetSubView('list')}
                />
              )}
            </>
          )}

          {screen === 'settings' && (
            <AccountSettings
              user={user}
              onSave={handleSaveProfile}
              onCancel={() => setScreen('profile')}
            />
          )}

          {screen === 'store' && (
            <Store
              user={user}
              onBack={() => setScreen('dashboard')}
              initialMode={storeInitialMode}
            />
          )}

          {screen === 'findShelters' && (
            <FindShelters
              user={user}
              onNavigate={(scr, id) => {
                setSelectedShelterId(id);
                setScreen(scr);
              }}
            />
          )}

          {screen === 'shelterDetails' && (
            <ShelterDetails
              user={user}
              shelterId={selectedShelterId}
              onBack={() => setScreen('findShelters')}
            />
          )}

          {screen === 'services' && (
            <ServicesChooser onNavigate={(scr) => setScreen(scr)} />
          )}

          {screen === 'findClinics' && (
            <FindClinics
              user={user}
              onNavigate={(scr, id) => {
                setSelectedClinicId(id);
                setScreen(scr);
              }}
            />
          )}

          {screen === 'clinicDetails' && (
            <ClinicDetails
              user={user}
              clinicId={selectedClinicId}
              onBack={() => setScreen('findClinics')}
            />
          )}
        </View>

        {/* Bottom Navigation Tab Bar */}
        {showNav && user && (
          <View style={styles.bottomTabBar}>
            {/* Tab 1: Home */}
            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'home' && styles.tabItemActive]}
              onPress={() => handleTabPress('home')}
            >
              <Feather
                name="home"
                size={20}
                color={activeTab === 'home' ? COLORS.white : '#5C6B73'}
              />
              <Text
                style={[styles.tabText, activeTab === 'home' && styles.tabTextActive]}
              >
                Home
              </Text>
            </TouchableOpacity>

            {/* Tab 2: Store */}
            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'store' && styles.tabItemActive]}
              onPress={() => handleTabPress('store')}
            >
              <Feather
                name="shopping-bag"
                size={20}
                color={activeTab === 'store' ? COLORS.white : '#5C6B73'}
              />
              <Text
                style={[styles.tabText, activeTab === 'store' && styles.tabTextActive]}
              >
                Store
              </Text>
            </TouchableOpacity>

            {/* Tab 3: My Pets */}
            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'pets' && styles.tabItemActive]}
              onPress={() => handleTabPress('pets')}
            >
              <FontAwesome
                name="paw"
                size={22}
                color={activeTab === 'pets' ? COLORS.white : '#5C6B73'}
              />
              <Text
                style={[styles.tabText, activeTab === 'pets' && styles.tabTextActive]}
              >
                My Pets
              </Text>
            </TouchableOpacity>

            {/* Tab 4: Services */}
            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'services' && styles.tabItemActive]}
              onPress={() => handleTabPress('services')}
            >
              <FontAwesome
                name="medkit"
                size={20}
                color={activeTab === 'services' ? COLORS.white : '#5C6B73'}
              />
              <Text
                style={[styles.tabText, activeTab === 'services' && styles.tabTextActive]}
              >
                Services
              </Text>
            </TouchableOpacity>

            {/* Tab 5: Profile */}
            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'profile' && styles.tabItemActive]}
              onPress={() => handleTabPress('profile')}
            >
              <Feather
                name="user"
                size={20}
                color={activeTab === 'profile' ? COLORS.white : '#5C6B73'}
              />
              <Text
                style={[styles.tabText, activeTab === 'profile' && styles.tabTextActive]}
              >
                Profile
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.bgLight,
  },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bgLight,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.bgLight,
  },
  headerBar: {
    height: 54,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 99,
  },
  headerBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerLogo: {
    width: 28,
    height: 28,
    borderRadius: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.dark,
    letterSpacing: -0.5,
  },
  headerNotification: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenWrapper: {
    flex: 1,
  },
  bottomTabBar: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    paddingBottom: 4,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    minWidth: 60,
  },
  tabItemActive: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  tabText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#5C6B73',
    marginTop: 2,
  },
  tabTextActive: {
    color: COLORS.white,
  },
});
