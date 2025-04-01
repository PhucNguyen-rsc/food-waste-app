// src/screens/GetStartedScreen.tsx

import React from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useAppDispatch } from '@/store';
import { setInitialized } from '@/store/slices/appSlice';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';


type GetStartedScreenNavProp = NativeStackNavigationProp<RootStackParamList, 'GetStarted'>;

export default function GetStartedScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<GetStartedScreenNavProp>();

  const handleGetStarted = () => {
    dispatch(setInitialized(true));
    console.log('Get Started pressed');
    // Navigate to the "Login" screen (or 'SignUp' if you prefer)
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.logo}>feedr</Text>
          <Text style={styles.logoSubtitle}>FoodService</Text>
        </View>

        <View style={styles.welcomeSection}>
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>
            It's a pleasure to meet you. We are excited that you're here so let's get started!
          </Text>
        </View>

        <Button onPress={handleGetStarted} style={styles.button}>
          GET STARTED
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 60,
  },
  logo: {
    fontSize: 42,
    fontWeight: 'bold',
  },
  logoSubtitle: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  welcomeSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
    lineHeight: 24,
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#22C55E',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
});
