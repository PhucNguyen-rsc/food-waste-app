// src/config/firebaseConfig.ts

import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyBBBNbediV1T_poE7gigOPtLsHo88rqU7U',
  authDomain: 'food-waste-app-ec4ce.firebaseapp.com',
  projectId: 'food-waste-app-ec4ce',
  storageBucket: 'food-waste-app-ec4ce.appspot.com', // typically ends with "appspot.com"
  messagingSenderId: '942470974605',
  appId: '1:942470974605:web:68aa85c76be1f248bbe6c4',
  measurementId: 'G-XN8SSN28YZ',
};

// Initialize Firebase if it hasn't been initialized yet
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { auth };
