import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useWellness } from '../context/WellnessContext';
import EntryCard from '../components/Wellness/EntryCard';

export default function HistoryScreen() {
  const { entries, theme } = useWellness();
  const router = useRouter();

  return (
    <View style={[styles.container, theme === 'dark' && styles.darkBg]}>
      <Text style={[styles.title, theme === 'dark' && styles.darkText]}>Historial de Bienestar</Text>
      {entries.length === 0 ? (
        <Text style={[styles.empty, theme === 'dark' && styles.darkText]}>No hay registros aún.</Text>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => <EntryCard {...item} />}
          contentContainerStyle={{ paddingBottom: 32 }}
        />
      )}
      <TouchableOpacity style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f6fafd',
  },
  darkBg: {
    backgroundColor: '#1a2233',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 18,
    color: '#222',
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
  button: {
    backgroundColor: '#4a90e2',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
