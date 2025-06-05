import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomInput from '../components/CustomInput';
import MoodSelector from '../components/MoodSelector';
import PhotoPicker from '../components/PhotoPicker';
import { useWellness } from '../context/WellnessContext';

export default function NewEntryScreen() {
  const [mood, setMood] = useState('');
  const [note, setNote] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addEntry, theme } = useWellness();
  const router = useRouter();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'Images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      if (result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
      }
    }
  };

  const handleSave = async () => {
    if (!mood) {
      Alert.alert('Selecciona tu estado de ánimo');
      return;
    }
    setLoading(true);
    const entry = { mood, note, image };
    try {
      await addEntry(entry);
      router.replace('/home'); 
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la entrada. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, theme === 'dark' && styles.darkBg]}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme === 'dark' ? '#fff' : '#5E81AC'} />
          <Text style={[styles.loadingText, theme === 'dark' && styles.darkLoadingText]}>Guardando entrada...</Text>
        </View>
      )}
      <View style={{alignItems: 'center', marginBottom: 10}}>
        <Ionicons name="happy-outline" size={32} color="#5E81AC" style={{marginBottom: 4}} />
        <Text style={[styles.title, theme === 'dark' && styles.darkText]}>¿Cómo te sientes hoy?</Text>
      </View>
      <MoodSelector selected={mood} onSelect={setMood} />
      <CustomInput
        value={note}
        onChangeText={setNote}
        placeholder="Agrega una nota (opcional)"
        multiline
      />
      <PhotoPicker image={image} onPick={pickImage} />
      <TouchableOpacity style={styles.button} onPress={handleSave} disabled={loading}>
        <Ionicons name="checkmark-circle-outline" size={20} color="#fff" style={{marginRight: 6}} />
        <Text style={styles.buttonText}>Guardar entrada</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonOutline} onPress={() => router.back()} disabled={loading}>
        <Ionicons name="arrow-back-outline" size={18} color="#5E81AC" style={{marginRight: 4}} />
        <Text style={styles.buttonOutlineText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
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
  button: {
    backgroundColor: '#5E81AC',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    marginBottom: 8,
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
  },
  buttonOutlineText: {
    color: '#5E81AC',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  loadingText: {
    marginTop: 10,
    color: '#fff', 
  },
  darkLoadingText: { 
    color: '#ECEFF4', 
  },
});