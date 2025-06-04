import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { useWellness } from '../context/WellnessContext';

export default function HomeScreen() {
  const { quote, fetchQuote, theme, toggleTheme, loadingQuote } = useWellness();
  const router = useRouter();
  const colorScheme = useColorScheme();

  return (
    <View style={[styles.container, theme === 'dark' && styles.darkBg]}>
      <TouchableOpacity style={styles.themeBtn} onPress={toggleTheme}>
        <Ionicons name={theme === 'dark' ? 'sunny' : 'moon'} size={24} color="#5E81AC" />
      </TouchableOpacity>
      <View style={{alignItems: 'center', marginBottom: 10}}>
        <Ionicons name="book-outline" size={32} color="#5E81AC" style={{marginBottom: 4}} />
        <Text style={[styles.title, theme === 'dark' && styles.darkText]}>¡Bienvenido a tu Diario de Bienestar!</Text>
      </View>
      <Text style={[styles.quote, theme === 'dark' && styles.darkText]}>{quote}</Text>
      <TouchableOpacity style={styles.refreshBtn} onPress={fetchQuote} disabled={loadingQuote}>
        <Ionicons name="refresh" size={20} color="#5E81AC" />
        {loadingQuote ? (
          <ActivityIndicator size="small" color="#5E81AC" style={{ marginLeft: 8 }} />
        ) : (
          <Text style={styles.refreshText}>Otra frase</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/new-entry')}>
        <Ionicons name="add-circle-outline" size={20} color="#fff" style={{marginRight: 6}} />
        <Text style={styles.buttonText}>Registrar nuevo estado</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonOutline} onPress={() => router.push('/history')}>
        <Ionicons name="time-outline" size={18} color="#5E81AC" style={{marginRight: 4}} />
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
    backgroundColor: '#ECEFF4',
  },
  darkBg: {
    backgroundColor: '#232936',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2E3440',
    textAlign: 'center',
  },
  darkText: {
    color: '#fff',
  },
  quote: {
    fontStyle: 'italic',
    fontSize: 16,
    marginBottom: 24,
    color: '#5E81AC',
    textAlign: 'center',
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  refreshText: {
    marginLeft: 6,
    color: '#5E81AC',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#5E81AC',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonOutline: {
    borderColor: '#5E81AC',
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    width: '100%',
  },
  buttonOutlineText: {
    color: '#5E81AC',
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
