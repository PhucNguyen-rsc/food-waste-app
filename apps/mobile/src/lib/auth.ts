import { getAuth, signInWithEmailAndPassword as firebaseSignIn, createUserWithEmailAndPassword as firebaseSignUp, signOut as firebaseSignOut } from 'firebase/auth';
import api from '@/lib/api';
import { app } from '@/config/firebaseConfig';

// Initialize auth with the app instance
const auth = getAuth(app);

export const signInWithEmailAndPassword = async (email: string, password: string) => {
  try {
    // 1. Sign in with Firebase
    const firebaseUserCred = await firebaseSignIn(auth, email, password);
    const firebaseToken = await firebaseUserCred.user.getIdToken();

    // 2. Exchange Firebase token for backend JWT
    const response = await api.post('/auth/firebase', { token: firebaseToken });
    const { accessToken, user } = response.data;

    return {
      firebaseUser: firebaseUserCred.user,
      accessToken,
      user
    };
  } catch (error) {
    throw error;
  }
};

export const createUserWithEmailAndPassword = async (email: string, password: string, name: string) => {
  try {
    // 1. Create user with Firebase
    const firebaseUserCred = await firebaseSignUp(auth, email, password);
    const firebaseToken = await firebaseUserCred.user.getIdToken();

    // 2. Exchange Firebase token for backend JWT
    const response = await api.post('/auth/firebase', { 
      token: firebaseToken,
      name 
    });
    const { accessToken, user } = response.data;

    return {
      firebaseUser: firebaseUserCred.user,
      accessToken,
      user
    };
  } catch (error) {
    throw error;
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    // You might want to clear any stored backend tokens here
  } catch (error) {
    throw error;
  }
}; 