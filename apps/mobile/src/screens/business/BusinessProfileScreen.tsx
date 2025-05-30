import 'react-native-get-random-values';
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import api from '@/lib/api';
import BusinessLayout from '@/components/BusinessLayout';
import { useAppDispatch, useAppSelector } from '@/store/index';
import { setUser } from '@/store/slices/authSlice';

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

export default function BusinessProfileScreen() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAddressFocused, setIsAddressFocused] = useState(false);

  const addressRef = useRef<any>(null); // Ref for GooglePlacesAutocomplete

  useEffect(() => {
    if (user) {
      setBusinessName(user.businessName || '');
      setBusinessAddress(user.businessAddress || '');
      setBusinessPhone(user.businessPhone || '');

      // Set the address in the GooglePlacesAutocomplete field
      if (user.businessAddress && addressRef.current) {
        addressRef.current.setAddressText(user.businessAddress);
      }

      // Prevent going back if profile is incomplete
      if (!user.businessName || !user.businessAddress || !user.businessPhone) {
        navigation.setOptions({
          headerLeft: () => null // Disable back button
        });
      }
    }
  }, [user, navigation]);

  const handleAddressFocus = () => {
    setIsAddressFocused(true);
  };

  const handleAddressBlur = () => {
    setIsAddressFocused(false);
  };

  const handleUpdateProfile = async () => {
    if (!businessName.trim()) {
      Alert.alert('Validation', 'Please enter your business name.');
      return;
    }

    if (!businessAddress.trim()) {
      Alert.alert('Validation', 'Please enter your business address.');
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await api.patch('/business/profile', {
        businessName: businessName.trim(),
        businessAddress: businessAddress.trim(),
        businessPhone: businessPhone.trim(),
      });

      dispatch(setUser(response.data));
      
      Alert.alert(
        'Success', 
        'Business profile updated successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.replace('Business', { screen: 'Home' })
          }
        ]
      );
    } catch (err: any) {
      console.error('Network or backend error:', err?.message || err);
      if (err?.response) {
        console.error('Backend responded with:', err.response.data);
      }
      Alert.alert('Error', 'Failed to update business profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <BusinessLayout 
      showBackButton
      onBackPress={() => navigation.goBack()}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 120 : 0}
        >
          <View style={styles.container}>
            <TextInput
              style={styles.input}
              placeholder="Business Name"
              value={businessName}
              onChangeText={setBusinessName}
            />

            <View style={styles.addressContainer}>
              <GooglePlacesAutocomplete
                ref={addressRef}
                placeholder="Search for your business address"
                textInputProps={{
                  onChangeText: setBusinessAddress,
                  onFocus: handleAddressFocus,
                  onBlur: handleAddressBlur,
                  placeholderTextColor: '#999',
                  returnKeyType: 'done',
                }}
                onPress={(data: GooglePlaceData, details: GooglePlaceDetails | null = null) => {
                  if (details) {
                    const address = details.formatted_address;
                    setBusinessAddress(address);
                    addressRef.current?.setAddressText(address); // Make sure input shows it
                  }
                }}
                query={{
                  key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
                  language: 'en',
                  components: 'country:ae', // Restrict to UAE
                }}
                styles={{
                  container: {
                    flex: 0,
                  },
                  textInput: {
                    ...styles.input,
                    marginBottom: 0,
                    color: businessAddress ? '#000' : '#999',
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
                    zIndex: 1000,
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
                listViewDisplayed={false}
              />
            </View>

            <TextInput
              style={styles.input}
              placeholder="Business Phone"
              keyboardType="phone-pad"
              value={businessPhone}
              onChangeText={setBusinessPhone}
            />

            <TouchableOpacity 
              style={[styles.button, isLoading && styles.buttonDisabled]} 
              onPress={handleUpdateProfile}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Updating...' : 'Update Profile'}
              </Text>
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
    </BusinessLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 120,
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
  addressContainer: {
    marginBottom: 16,
    zIndex: 1,
  },
  button: {
    backgroundColor: '#22C55E',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});
