import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

export default function CustomInput({ value, onChangeText, placeholder, multiline = false }) {
  return (
    <TextInput
      style={[styles.input, multiline && styles.multiline]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#888"
      multiline={multiline}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginVertical: 8,
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
});
