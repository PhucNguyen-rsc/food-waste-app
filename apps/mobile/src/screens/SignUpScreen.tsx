import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import { setUser, setToken } from '@/store/slices/authSlice';
import { createUserWithEmailAndPassword } from '@/lib/auth';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';

type SignUpScreenNavProp = NativeStackNavigationProp<RootStackParamList>;

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation<SignUpScreenNavProp>();

  const handleSignUp = async () => {
    if (!email || !password || !name) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const { user, accessToken } = await createUserWithEmailAndPassword(email, password, name);
      
      // Update user with name
      const updatedUser = {
        ...user,
        name
      };

      dispatch(setUser(updatedUser));
      dispatch(setToken(accessToken));
      
      // Navigate to appropriate screen based on role
      switch (user.role) {
        case 'CONSUMER':
          navigation.reset({
            index: 0,
            routes: [{ name: 'Consumer', params: { screen: 'Home' } }],
          });
          break;
        case 'BUSINESS':
          navigation.reset({
            index: 0,
            routes: [{ name: 'Business', params: { screen: 'Home' } }],
          });
          break;
        case 'COURIER':
          navigation.reset({
            index: 0,
            routes: [{ name: 'Courier', params: { screen: 'CourierHome' } }],
          });
          break;
        default:
          navigation.reset({
            index: 0,
            routes: [{ name: 'RoleSelection' }],
          });
      }
    } catch (error: any) {
      let errorMessage = 'An error occurred during sign up';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already registered';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password should be at least 6 characters';
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        editable={!loading}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        editable={!loading}
      />
      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleSignUp}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={() => navigation.navigate('SignIn')}
        disabled={loading}
      >
        <Text style={[styles.linkText, loading && styles.linkTextDisabled]}>
          Already have an account? Sign In
        </Text>
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
  buttonDisabled: {
    backgroundColor: '#999',
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
  linkTextDisabled: {
    color: '#999',
  },
});
