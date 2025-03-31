// src/config/firebaseConfig.ts

import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBBBNbediV1T_poE7gigOPtLsHo88rqU7U',
  authDomain: 'food-waste-app-ec4ce.firebaseapp.com',
  projectId: 'food-waste-app-ec4ce',
  storageBucket: 'food-waste-app-ec4ce.appspot.com', // typically ends with "appspot.com"
  messagingSenderId: '942470974605',
  appId: '1:942470974605:web:68aa85c76be1f248bbe6c4',
  measurementId: 'G-XN8SSN28YZ',
};

// Initialize the Firebase app only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Auth with persistence using AsyncStorage
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
