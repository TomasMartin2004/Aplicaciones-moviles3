import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import EntryCard from '../components/EntryCard';
import { useWellness } from '../context/WellnessContext';

export default function HistoryScreen() {
  const { entries, theme, loadingEntries, editEntry, removeEntry, fetchEntries } = useWellness();
  const router = useRouter();

  const isDark = theme === 'dark';

  const colors = {
    background: isDark ? '#232936' : '#ECEFF4',
    text: isDark ? '#ECEFF4' : '#2E3440',
    accent: isDark ? '#88C0D0' : '#5E81AC',
    card: isDark ? '#3B4252' : '#fff',
    secondaryText: isDark ? '#D8DEE9' : '#7B8794',
    icon: isDark ? '#D8DEE9' : '#5E81AC',
    buttonText: isDark ? undefined : '#FFFFFF', // Adjusted to match HomeScreen main button text logic
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const renderEntryCard = ({ item }) => {
    if (!item || typeof item.id === 'undefined') return null;
    return (
      <EntryCard
        id={item.id}
        mood={item.mood}
        note={item.note}
        createdAt={item.createdAt}
        image={item.image}
        onEdit={editEntry}
        onDelete={removeEntry}
      />
    );
  };

  const getKeyExtractor = (item) => {
    if (!item || typeof item.id === 'undefined') return Math.random().toString();
    return item.id.toString();
  };

  if (loadingEntries && entries.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }, styles.centered]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (!loadingEntries && entries.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }, styles.centered]}>
        <Text style={[styles.empty, { color: colors.secondaryText }]}>No hay registros aún.</Text>
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.accent }]} onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={18} color={colors.buttonText} style={{ marginRight: 4 }} />
          <Text style={[styles.buttonText, { color: colors.buttonText }]}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerContainer}>
        <Ionicons name="time-outline" size={32} color={colors.icon} style={{ marginBottom: 4 }} />
        <Text style={[styles.title, { color: colors.text }]}>Historial de Bienestar</Text>
      </View>
      <FlatList
        data={entries}
        renderItem={renderEntryCard}
        keyExtractor={getKeyExtractor}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={loadingEntries ? <ActivityIndicator size="small" color={colors.accent} /> : null}
      />
      <TouchableOpacity style={[styles.button, { backgroundColor: colors.accent }]} onPress={() => router.back()}>
        <Ionicons name="arrow-back-outline" size={18} color={colors.buttonText} style={{ marginRight: 4 }} />
        <Text style={[styles.buttonText, { color: colors.buttonText }]}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  empty: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginTop: 18,
    marginBottom: 18,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});