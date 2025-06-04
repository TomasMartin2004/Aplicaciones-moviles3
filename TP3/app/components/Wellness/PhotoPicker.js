import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PhotoPicker({ image, onPick }) {
  return (
    <View style={styles.container}>
      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={onPick}>
          <Ionicons name="camera" size={32} color="#4a90e2" />
          <Text style={styles.text}>Agregar Foto</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 12,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#eaf6ff',
    padding: 16,
    borderRadius: 12,
  },
  text: {
    marginTop: 8,
    color: '#4a90e2',
    fontWeight: 'bold',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 16,
    resizeMode: 'cover',
  },
});
