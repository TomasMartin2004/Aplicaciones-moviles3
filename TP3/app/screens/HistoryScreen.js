import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import EntryCard from '../components/Wellness/EntryCard';
import { useWellness } from '../context/WellnessContext';

export default function HistoryScreen() {
  const { entries, theme, loadingEntries, editEntry, deleteEntry } = useWellness();
  const router = useRouter();

  return (
    <View style={[styles.container, theme === 'dark' && styles.darkBg]}>
      <View style={{alignItems: 'center', marginBottom: 10}}>
        <Ionicons name="time-outline" size={32} color="#5E81AC" style={{marginBottom: 4}} />
        <Text style={[styles.title, theme === 'dark' && styles.darkText]}>Historial de Bienestar</Text>
      </View>
      {loadingEntries ? (
        <ActivityIndicator size="large" color={theme === 'dark' ? '#fff' : '#5E81AC'} style={styles.loadingIndicator} />
      ) : entries.length === 0 ? (
        <Text style={[styles.empty, theme === 'dark' && styles.darkText]}>No hay registros aún.</Text>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={item => item.id || item.date}
          renderItem={({ item }) => (
            <EntryCard {...item} onEdit={editEntry} onDelete={deleteEntry} />
          )}
          contentContainerStyle={{ paddingBottom: 32 }}
        />
      )}
      <TouchableOpacity style={styles.button} onPress={() => router.back()}>
        <Ionicons name="arrow-back-outline" size={18} color="#fff" style={{marginRight: 4}} />
        <Text style={styles.buttonText}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ECEFF4',
  },
  darkBg: {
    backgroundColor: '#232936',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2E3440',
    textAlign: 'center',
  },
  darkText: {
    color: '#fff',
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    marginTop: 32,
  },
  loadingIndicator: {
    marginTop: 32,
  },
  button: {
    backgroundColor: '#5E81AC',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginTop: 18,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

