import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { setUser, setToken } from '@/store/slices/authSlice';
import { signInWithEmailAndPassword } from '@/lib/auth';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';

type SignInScreenNavProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigation = useNavigation<SignInScreenNavProp>();

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const { user, accessToken } = await signInWithEmailAndPassword(email, password);
      
      dispatch(setUser(user));
      dispatch(setToken(accessToken));
      
      // Navigate to appropriate screen based on role
      switch (user.role) {
        case 'CONSUMER':
          navigation.replace('ConsumerHome');
          break;
        case 'BUSINESS':
          navigation.replace('BusinessHome');
          break;
        case 'COURIER':
          navigation.replace('CourierHome');
          break;
        default:
          navigation.replace('SignUp');
      }
    } catch (error: any) {
      let errorMessage = 'An error occurred during sign in';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address';
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
      
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#007AFF',
    textAlign: 'center',
    marginTop: 20,
  },
}); 