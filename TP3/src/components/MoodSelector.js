import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const moods = [
  { emoji: '😃', label: 'Feliz' },
  { emoji: '😐', label: 'Neutral' },
  { emoji: '😔', label: 'Triste' },
  { emoji: '😡', label: 'Enojado' },
  { emoji: '😱', label: 'Ansioso' },
];

export default function MoodSelector({ selected, onSelect }) {
  return (
    <View style={styles.container}>
      {moods.map((mood) => (
        <TouchableOpacity
          key={mood.label}
          style={[styles.mood, selected === mood.label && styles.selected]}
          onPress={() => onSelect(mood.label)}
        >
          <Text style={styles.emoji}>{mood.emoji}</Text>
          <Text style={styles.label}>{mood.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  mood: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: 'transparent',
    transitionProperty: 'background-color, border-color',
    transitionDuration: '0.2s',
  },
  selected: {
    backgroundColor: '#5E81AC',
    borderColor: '#5E81AC',
  },
  emoji: {
    fontSize: 28,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
  },
});
