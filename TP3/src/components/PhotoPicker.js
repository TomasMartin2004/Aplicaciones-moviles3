import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PhotoPicker({ image, onPick }) {
  return (
    <View style={styles.container}>
      {image ? (
        <Image 
          source={{ uri: image }} 
          style={styles.image} 
          resizeMode="cover" 
        />
      ) : (
        <TouchableOpacity style={styles.button} onPress={onPick}>
          <Ionicons name="camera" size={32} color="#5E81AC" />
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
    backgroundColor: '#E5E9F0',
    padding: 16,
    borderRadius: 12,
  },
  text: {
    marginTop: 8,
    color: '#5E81AC',
    fontWeight: 'bold',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 16,
  },
});