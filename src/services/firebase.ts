import { initializeApp } from 'firebase/app';
import * as firebaseAuth from '@firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Persistence } from '@firebase/auth';
import { firebaseConfig } from '@/config/firebase.config';

type ReactNativeAuthModule = {
  getReactNativePersistence: (storage: typeof AsyncStorage) => Persistence;
};

const { getReactNativePersistence } =
  firebaseAuth as unknown as ReactNativeAuthModule;

const app = initializeApp(firebaseConfig);

/**
 * `initializeAuth` (not `getAuth`) is required on React Native so we can
 * supply AsyncStorage persistence — otherwise the session is lost on restart.
 */
export const auth = firebaseAuth.initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);