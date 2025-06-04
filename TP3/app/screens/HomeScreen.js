import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { useWellness } from '../context/WellnessContext';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const { quote, fetchQuote, theme, toggleTheme, loadingQuote } = useWellness();
  const router = useRouter();
  const colorScheme = useColorScheme();

  return (
    <View style={[styles.container, theme === 'dark' && styles.darkBg]}>
      <TouchableOpacity style={styles.themeBtn} onPress={toggleTheme}>
        <Ionicons name={theme === 'dark' ? 'sunny' : 'moon'} size={24} color="#4a90e2" />
      </TouchableOpacity>
      <Text style={[styles.title, theme === 'dark' && styles.darkText]}>¡Bienvenido a tu Diario de Bienestar!</Text>
      <Text style={[styles.quote, theme === 'dark' && styles.darkText]}>{quote}</Text>
      <TouchableOpacity style={styles.refreshBtn} onPress={fetchQuote} disabled={loadingQuote}>
        <Ionicons name="refresh" size={20} color="#4a90e2" />
        {loadingQuote ? (
          <ActivityIndicator size="small" color="#4a90e2" style={{ marginLeft: 8 }} />
        ) : (
          <Text style={styles.refreshText}>Otra frase</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/new-entry')}>
        <Text style={styles.buttonText}>Registrar nuevo estado</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonOutline} onPress={() => router.push('/history')}>
        <Text style={styles.buttonOutlineText}>Ver historial</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f6fafd',
  },
  darkBg: {
    backgroundColor: '#1a2233',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 18,
    color: '#222',
    textAlign: 'center',
  },
  darkText: {
    color: '#fff',
  },
  quote: {
    fontStyle: 'italic',
    fontSize: 16,
    marginBottom: 24,
    color: '#4a90e2',
    textAlign: 'center',
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  refreshText: {
    marginLeft: 6,
    color: '#4a90e2',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#4a90e2',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonOutline: {
    borderColor: '#4a90e2',
    borderWidth: 2,
    padding: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  buttonOutlineText: {
    color: '#4a90e2',
    fontWeight: 'bold',
    fontSize: 16,
  },
  themeBtn: {
    position: 'absolute',
    top: 32,
    right: 24,
    zIndex: 10,
  },
});
