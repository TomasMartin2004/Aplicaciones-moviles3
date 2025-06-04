import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useWellness } from '../context/WellnessContext';
import MoodSelector from '../components/Wellness/MoodSelector';
import CustomInput from '../components/Wellness/CustomInput';
import PhotoPicker from '../components/Wellness/PhotoPicker';
import * as ImagePicker from 'expo-image-picker';

export default function NewEntryScreen() {
  const [mood, setMood] = useState('');
  const [note, setNote] = useState('');
  const [image, setImage] = useState(null);
  const { addEntry, theme } = useWellness();
  const router = useRouter();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!mood) {
      Alert.alert('Selecciona tu estado de ánimo');
      return;
    }
    const entry = {
      mood,
      note,
      image,
      date: new Date().toLocaleString(),
    };
    await addEntry(entry);
    router.replace('/home');
  };

  return (
    <View style={[styles.container, theme === 'dark' && styles.darkBg]}>
      <Text style={[styles.title, theme === 'dark' && styles.darkText]}>¿Cómo te sientes hoy?</Text>
      <MoodSelector selected={mood} onSelect={setMood} />
      <CustomInput
        value={note}
        onChangeText={setNote}
        placeholder="Agrega una nota (opcional)"
        multiline
      />
      <PhotoPicker image={image} onPick={pickImage} />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Guardar entrada</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonOutline} onPress={() => router.back()}>
        <Text style={styles.buttonOutlineText}>Cancelar</Text>
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
  button: {
    backgroundColor: '#4a90e2',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    marginBottom: 8,
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
    alignItems: 'center',
  },
  buttonOutlineText: {
    color: '#4a90e2',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
