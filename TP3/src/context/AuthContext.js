import { useRouter, useSegments } from 'expo-router';
import { signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import { auth as firebaseAuthInstance } from '../../firebaseConfig';

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); 
  const [loadingAuthSession, setLoadingAuthSession] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuthInstance, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
        });
      } else {
        setUser(null);
      }
      setLoadingAuthSession(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loadingAuthSession) {
      return; 
    }

    const currentRoute = segments.join('/') || '';
    const isAuthScreen = segments.includes('login') || segments.includes('register');
    const isAppScreen = segments[0] === '(tabs)' || currentRoute === 'home'; 

    if (user) {
      if (isAuthScreen) {
        router.replace('/(tabs)'); 
      } else if (!isAppScreen && currentRoute !== '' && currentRoute !== '(tabs)') {
        router.replace('/(tabs)');
      }
    } else {
      if (!isAuthScreen) {
        router.replace('/login');
      }
    }
  }, [user, segments, loadingAuthSession, router]);

  const logout = async () => {
    try {
      await firebaseSignOut(firebaseAuthInstance);
      setUser(null);
    } catch (error) {
      Alert.alert("Error", "No se pudo cerrar la sesión.");
    }
  };

  if (loadingAuthSession) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ user, logout, loadingAuth: loadingAuthSession }}>
      {children}
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ECEFF4', 
  }
});