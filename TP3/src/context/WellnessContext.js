import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { createEntry, deleteEntry, getEntries, updateEntry } from '../utils/api';
import { useAuth } from './AuthContext';

const WellnessContext = createContext(null);
const YOUR_BACKEND_API_URL = Constants.expoConfig?.extra?.API_URL || 'http://localhost:4000';

export function WellnessProvider({ children }) {
  const [entries, setEntries] = useState([]);
  const [theme, setTheme] = useState('light');
  const [quote, setQuote] = useState('');
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [loadingEntries, setLoadingEntries] = useState(true);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    loadTheme();
    fetchQuote();
    if (currentUser) {
      fetchEntries();
    } else {
      setEntries([]);
      setLoadingEntries(false);
    }
  }, [currentUser]);

  const fetchEntries = async () => {
    if (!currentUser || !currentUser.uid) {
      setEntries([]);
      setLoadingEntries(false);
      return;
    }
    setLoadingEntries(true);
    try {
      const data = await getEntries(currentUser.uid);
      setEntries(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      setEntries([]);
    } finally {
      setLoadingEntries(false);
    }
  };

  const addEntry = async (entry) => {
    if (!currentUser || !currentUser.uid) {
      Alert.alert('Error', 'Debes iniciar sesión para crear una entrada.');
      return;
    }
    const entryWithUser = { ...entry, userId: currentUser.uid };
    setLoadingEntries(true);
    try {
      const newEntry = await createEntry(entryWithUser);
      setEntries(prev => [newEntry, ...prev].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la entrada.');
    } finally {
      setLoadingEntries(false);
    }
  };

  const editEntry = async (id, newNoteValue) => {
    if (!currentUser || !currentUser.uid) {
      Alert.alert('Error', 'Debes iniciar sesión para editar una entrada.');
      return;
    }
    setLoadingEntries(true);
    try {
      const originalEntry = entries.find(e => e.id === id);
      if (!originalEntry) {
        Alert.alert('Error', 'No se pudo encontrar la entrada para actualizar.');
        setLoadingEntries(false);
        return;
      }
      if (originalEntry.userId !== currentUser.uid) {
          Alert.alert('Error', 'No tienes permiso para editar esta entrada.');
          setLoadingEntries(false);
          return;
      }
      const entryToUpdate = { ...originalEntry, note: newNoteValue, userId: currentUser.uid, updatedAt: new Date().toISOString() };
      const updatedEntryFromServer = await updateEntry(id, entryToUpdate);
      if (!updatedEntryFromServer || typeof updatedEntryFromServer.id === 'undefined') {
        Alert.alert('Error', 'La respuesta del servidor tras la actualización fue inesperada.');
        setLoadingEntries(false);
        return;
      }
      setEntries(prevEntries => prevEntries.map(e => (e.id === id ? updatedEntryFromServer : e)).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la entrada.');
    } finally {
      setLoadingEntries(false);
    }
  };

  const removeEntry = async (id) => {
    if (!currentUser || !currentUser.uid) {
      Alert.alert('Error', 'Debes iniciar sesión para eliminar una entrada.');
      return;
    }
     setLoadingEntries(true);
    try {
      const entryToDelete = entries.find(e => e.id === id);
      if (entryToDelete && entryToDelete.userId !== currentUser.uid) {
          Alert.alert('Error', 'No tienes permiso para eliminar esta entrada.');
          setLoadingEntries(false);
          return;
      }
      await deleteEntry(id, currentUser.uid);
      setEntries(prev => prev.filter(e => e.id !== id));
    } catch (error) {
      Alert.alert('Error', `No se pudo eliminar la entrada. ${error.message ? error.message : ''}`);
    } finally {
      setLoadingEntries(false);
    }
  };

  const loadTheme = async () => {
    try {
      const t = await AsyncStorage.getItem('wellness_theme');
      if (t) setTheme(t);
    } catch {}
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    await AsyncStorage.setItem('wellness_theme', newTheme);
  };

  const frasesLocales = [
    'Cree en ti y todo será posible. - Anónimo',
    'Hoy es un buen día para empezar de nuevo. - Anónimo',
  ];

  const fetchQuote = async () => {
    setLoadingQuote(true);
    const url = `${YOUR_BACKEND_API_URL}/quote`; 
    try {
      const fetchWithTimeout = (resource, options = {}) => {
        const { timeout = 7000 } = options;
        return Promise.race([
          fetch(resource),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeout))
        ]);
      };
      const res = await fetchWithTimeout(url);
      if (!res.ok) {
        let errorBody = `Respuesta no OK del backend (status: ${res.status})`;
        try { errorBody = await res.text(); } catch (e) {}
        throw new Error(`No se pudo obtener la frase de tu backend (status: ${res.status})`);
      }
      const data = await res.json(); 
      if (data && data.quote && data.author) {
        setQuote(`${data.quote} - ${data.author}`);
      } else {
        throw new Error('Respuesta de API (via backend/dummyjson) con formato incorrecto');
      }
    } catch (error) {
      const randomLocalQuote = frasesLocales[Math.floor(Math.random() * frasesLocales.length)];
      setQuote(randomLocalQuote); 
    } finally {
      setLoadingQuote(false);
    }
  };

  return (
    <WellnessContext.Provider value={{ entries, addEntry, editEntry, removeEntry, theme, toggleTheme, quote, fetchQuote, loadingQuote, loadingEntries, fetchEntries }}>
      {children}
    </WellnessContext.Provider>
  );
}

export function useWellness() {
  return useContext(WellnessContext);
}