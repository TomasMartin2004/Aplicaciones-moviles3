import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function EntryCard({ mood, note, date, image }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.mood}>{mood}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      {note ? <Text style={styles.note}>{note}</Text> : null}
      {image ? <Image source={{ uri: image }} style={styles.image} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mood: {
    fontSize: 24,
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
  note: {
    fontSize: 16,
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginTop: 8,
  },
});
