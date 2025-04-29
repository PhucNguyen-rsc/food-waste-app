import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import CourierLayout from '@/components/CourierLayout';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAppSelector, useAppDispatch } from '@/store';
import { signOut } from '@/lib/auth';
import { logout } from '@/store/slices/authSlice';
import { User } from '@/types';
import { courierDB } from '@/lib/db';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type VehicleInfo = {
  type: string;
  model: string;
  plate_number: string;
  year: string;
};

type CourierProfile = {
  id: string;
  name: string | null;
  email: string | null;
  isAvailable: boolean;
  currentLocation: string | null;
  vehicleType: string | null;
};

export default function CourierProfileScreen() {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user as User);
  const [profile, setProfile] = useState<CourierProfile | null>(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo>({
    type: 'Motorcycle',
    model: 'Honda CBR',
    plate_number: 'DXB 12345',
    year: '2023',
  });
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const courierProfile = await courierDB.getCourierProfile(user.id);
      setProfile(courierProfile);
      setIsAvailable(courierProfile?.isAvailable || false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Failed to load your profile information');
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async () => {
    if (!user?.id) return;
    try {
      const updatedProfile = await courierDB.updateCourierProfile(user.id, {
        isAvailable: !isAvailable,
      });
      setProfile(updatedProfile);
      setIsAvailable(updatedProfile.isAvailable);
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user?.id]);

  const handleLogout = async () => {
    try {
      await signOut();
      dispatch(logout());
      navigation.reset({
        index: 0,
        routes: [{ name: 'GetStarted' }],
      });
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  const menuItems = [
    {
      icon: 'user-alt',
      title: 'Personal Information',
      subtitle: 'Name, email, phone number',
      onPress: () => navigation.navigate('EditProfile'),
    },
    {
      icon: 'motorcycle',
      title: 'Vehicle Information',
      subtitle: `${vehicleInfo.type} - ${vehicleInfo.plate_number}`,
      onPress: () => navigation.navigate('VehicleInfo'),
    },
    {
      icon: 'history',
      title: 'Delivery History',
      subtitle: 'View your past deliveries',
      onPress: () => navigation.navigate('DeliveriesHistory'),
    },
    {
      icon: 'wallet',
      title: 'Payment Information',
      subtitle: 'Manage your payment methods',
      onPress: () => navigation.navigate('PaymentMethods'),
    },
    {
      icon: 'bell',
      title: 'Notifications',
      subtitle: 'Manage your notifications',
      onPress: () => navigation.navigate('NotificationSettings'),
    },
    {
      icon: 'shield-alt',
      title: 'Privacy & Security',
      subtitle: 'Password, security settings',
      onPress: () => navigation.navigate('PrivacySettings'),
    },
    {
      icon: 'question-circle',
      title: 'Help & Support',
      subtitle: 'FAQs, contact support',
      onPress: () => navigation.navigate('Support'),
    },
  ];

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>Failed to load profile</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <CourierLayout title="Profile">
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{profile.name || 'Courier Name'}</Text>
              <Text style={styles.email}>{profile.email}</Text>
              <Text style={styles.phone}>{user?.phone || '+971 50 123 4567'}</Text>
            </View>
          </View>
          <View style={styles.availabilitySection}>
            <Text style={styles.availabilityText}>Available for Deliveries</Text>
            <Switch
              value={isAvailable}
              onValueChange={toggleAvailability}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={isAvailable ? '#2e7d32' : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.iconContainer}>
                  <FontAwesome5 name={item.icon} size={16} color="#2e7d32" />
                </View>
                <View style={styles.menuItemText}>
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                  <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              <FontAwesome5 name="chevron-right" size={16} color="#666" />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <FontAwesome5 name="sign-out-alt" size={20} color="#c62828" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </CourierLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileSection: {
    marginBottom: 20,
  },
  profileInfo: {
    gap: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  phone: {
    fontSize: 16,
    color: '#666',
  },
  availabilitySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  availabilityText: {
    fontSize: 16,
    color: '#333',
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 16,
    marginTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e8f5e9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#c62828',
  },
  version: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    color: '#f44336',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 6,
    minWidth: 120,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
}); 