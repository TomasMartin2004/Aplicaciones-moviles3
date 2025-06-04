import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import uuid from 'react-native-uuid'; // Make sure you have installed react-native-uuid: npm install react-native-uuid or yarn add react-native-uuid
import { storage } from '../../firebaseConfig'; // Assuming storage is exported from firebaseConfig
import CustomInput from '../components/Wellness/CustomInput';
import MoodSelector from '../components/Wellness/MoodSelector';
import PhotoPicker from '../components/Wellness/PhotoPicker';
import { useWellness } from '../context/WellnessContext';

export default function NewEntryScreen() {
  const [mood, setMood] = useState('');
  const [note, setNote] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addEntry, theme, currentUser } = useWellness();
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

  const uploadImage = async (uri) => {
    if (!uri || !currentUser) return null; // Don't upload if no image or no user

    setLoading(true);
    const response = await fetch(uri);
    const blob = await response.blob();

    const filename = `wellness_images/${currentUser.uid}/${uuid.v4()}`; // Unique filename per user
    const storageRef = ref(storage, filename);

    try {
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      setLoading(false);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      setLoading(false);
      Alert.alert('Error', 'No se pudo subir la imagen.');
      return null;
    }
  };

  const handleSave = async () => {
    if (!mood) {
      Alert.alert('Selecciona tu estado de ánimo');
      return;
    }

    setLoading(true); // Indicate loading during save
    let imageUrl = null;
    if (image) {
       imageUrl = await uploadImage(image);
       if (imageUrl === null) { // If image upload failed, stop the process
         setLoading(false);
         return;
       }
    }

    const entry = {
      mood,
      note,
      image: imageUrl, // Save the download URL or null
      // The timestamp will be added in the addEntry function in context
    };

    await addEntry(entry);
    setLoading(false);
    router.replace('/home');
  };

  return (
    <View style={[styles.container, theme === 'dark' && styles.darkBg]}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme === 'dark' ? '#fff' : '#5E81AC'} />
          <Text style={[styles.loadingText, theme === 'dark' && styles.darkText]}>Guardando entrada...</Text>
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
  empty: {
    textAlign: 'center',
    color: '#888',
    marginTop: 32,
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
});
