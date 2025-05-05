import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import ConsumerLayout from '@/components/ConsumerLayout';
import { useAppSelector, useAppDispatch } from '@/store';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { setUser } from '@/store/slices/authSlice';
import api from '@/lib/api';

interface GooglePlaceData {
  description: string;
  place_id: string;
}

interface GooglePlaceDetails {
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ProfileScreen() {
  const user = useAppSelector((state) => state.auth.user);
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState(user?.deliveryAddress || '');
  const [isAddressFocused, setIsAddressFocused] = useState(false);
  const addressRef = useRef<any>(null);

  const handleLogout = async () => {
    try {
      Alert.alert('Logged out', 'You have been logged out successfully.');
      navigation.reset({
        index: 0,
        routes: [{ name: 'SignIn' }],
      });
    } catch (err) {
      Alert.alert('Logout Failed', 'Please try again.');
    }
  };

  const handleUpdateAddress = async () => {
    if (!deliveryAddress.trim()) {
      Alert.alert('Error', 'Please enter a delivery address');
      return;
    }

    try {
      const { data: updatedUser } = await api.patch(`/users/${user?.id}`, {
        deliveryAddress: deliveryAddress.trim()
      });

      dispatch(setUser(updatedUser));
      setIsEditingAddress(false);
      Alert.alert('Success', 'Delivery address updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update delivery address. Please try again.');
    }
  };

  return (
    <ConsumerLayout title="My Profile">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={{ flex: 1, overflow: 'visible' }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 120 : 0}
        >
          <View style={styles.container}>
            <Text style={styles.heading}>My Profile</Text>

            <View style={styles.infoBox}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>{user?.name || 'N/A'}</Text>

              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{user?.email || 'N/A'}</Text>

              <Text style={styles.label}>Delivery Address</Text>
              {isEditingAddress ? (
                <View style={styles.addressContainer}>
                  <GooglePlacesAutocomplete
                    ref={addressRef}
                    placeholder="Search for your delivery address"
                    textInputProps={{
                      onChangeText: setDeliveryAddress,
                      onFocus: () => setIsAddressFocused(true),
                      onBlur: () => setIsAddressFocused(false),
                      placeholderTextColor: '#999',
                      returnKeyType: 'done',
                    }}
                    onPress={(data: GooglePlaceData, details: GooglePlaceDetails | null = null) => {
                      if (details) {
                        const address = details.formatted_address;
                        setDeliveryAddress(address);
                        addressRef.current?.setAddressText(address);
                      }
                    }}
                    query={{
                      key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
                      language: 'en',
                      components: 'country:ae',
                    }}
                    styles={{
                      container: {
                        flex: 0,
                        zIndex: 9999,
                        elevation: 50,
                        position: 'relative',
                      },
                      textInput: {
                        ...styles.input,
                        marginBottom: 0,
                        color: deliveryAddress ? '#000' : '#999',
                      },
                      listView: {
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        backgroundColor: '#fff',
                        borderWidth: 1,
                        borderColor: '#ccc',
                        borderRadius: 8,
                        marginTop: 4,
                        zIndex: 9999,
                        elevation: 50,
                        maxHeight: 200,
                      },
                      row: {
                        padding: 13,
                        height: 44,
                      },
                      separator: {
                        height: 1,
                        backgroundColor: '#ccc',
                      },
                    }}
                    enablePoweredByContainer={false}
                    fetchDetails={true}
                    onFail={(error) => console.error('GooglePlaces Error:', error)}
                    keyboardShouldPersistTaps="handled"
                  />
                  <View style={styles.addressEditButtons}>
                    <TouchableOpacity
                      style={[styles.addressButton, styles.cancelButton]}
                      onPress={() => {
                        setDeliveryAddress(user?.deliveryAddress || '');
                        setIsEditingAddress(false);
                      }}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.addressButton, styles.saveButton]}
                      onPress={handleUpdateAddress}
                    >
                      <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.addressDisplayContainer}>
                  <View style={styles.addressTextContainer}>
                    <Text style={styles.value} numberOfLines={3}>{user?.deliveryAddress || 'No delivery address set'}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.editAddressButton}
                    onPress={() => setIsEditingAddress(true)}
                  >
                    <Text style={styles.editAddressButtonText}>Edit</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate('Consumer', { screen: 'ChangePassword' })}
            >
              <Text style={styles.editButtonText}>Change Password</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </ConsumerLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
    position: 'relative',
    overflow: 'visible',
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
  },
  infoBox: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    position: 'relative',
    overflow: 'visible',
    zIndex: 1,
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 12,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginTop: 4,
  },
  addressBox: {
    marginTop: 24,
  },
  addressContainer: {
    marginBottom: 16,
    zIndex: 9999,
    elevation: 50,
    position: 'relative',
    overflow: 'visible',
  },
  addressDisplayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 4,
  },
  addressTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
  },
  addressInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  addressEditButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 8,
    zIndex: 1,
  },
  addressButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  saveButton: {
    backgroundColor: '#22C55E',
  },
  cancelButtonText: {
    color: '#374151',
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  editAddressButton: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  editAddressButtonText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 14,
  },
  editButton: {
    backgroundColor: '#22C55E',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
