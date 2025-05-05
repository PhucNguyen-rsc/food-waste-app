import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signOut } from '@/lib/auth';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';

import ConsumerLayout from '@/components/ConsumerLayout';

type SettingsScreenNavProp = NativeStackNavigationProp<RootStackParamList>;

export default function SettingsScreen() {
  const navigation = useNavigation<SettingsScreenNavProp>();

  const handleLogout = async () => {
    try {
      await signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: 'GetStarted' }],
      });
    } catch (error) {
      Alert.alert('Logout Failed', 'Please try again later.');
    }
  };

  return (
    <ConsumerLayout>
      <View style={styles.container}>
        <Text style={styles.title}>Settings</Text>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => navigation.navigate('Consumer', { screen: 'Profile' })}
        >
          <Text style={styles.settingText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => navigation.navigate('Consumer', { screen: 'ChangePassword' })}
        >
          <Text style={styles.settingText}>Change Password</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ConsumerLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
  },
  settingItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingText: {
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    marginTop: 40,
    paddingVertical: 14,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
