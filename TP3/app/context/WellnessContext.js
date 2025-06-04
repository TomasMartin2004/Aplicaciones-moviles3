import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { db, auth } from '../../firebaseConfig'; // Assuming db and auth are exported from firebaseConfig
import { collection, addDoc, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const WellnessContext = createContext();

export function WellnessProvider({ children }) {
  const [entries, setEntries] = useState([]);
  const [theme, setTheme] = useState('light');
  const [quote, setQuote] = useState('');
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingEntries, setLoadingEntries] = useState(true);


  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        setLoadingEntries(true);
        // Start listening to Firestore changes for the logged-in user
        const unsubscribeFirestore = listenForEntries(user.uid);
        // Cleanup function for the Firestore listener
        return () => unsubscribeFirestore();

      } else {
        setEntries([]); // Clear entries if user logs out
        setLoadingEntries(false);
         // If there was a previous Firestore listener, it will be unsubscribed by the return above
      }
    });

    loadTheme();
    fetchQuote();

    // Cleanup function for the auth listener
    return () => unsubscribeAuth();
  }, []);

  // New function to set up the Firestore snapshot listener
  const listenForEntries = (userId) => {
    if (!userId) {
      setEntries([]);
      setLoadingEntries(false);
      return () => {}; // Return a no-op unsubscribe function
    }

    const q = query(collection(db, 'wellnessEntries'), where('userId', '==', userId), orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const firestoreEntries = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore Timestamp to a more readable format if needed in UI
        timestamp: doc.data().timestamp?.toDate()?.toLocaleString() || new Date().toLocaleString(),
      }));
      setEntries(firestoreEntries);
      setLoadingEntries(false);
      // Optionally, update AsyncStorage here as well for offline caching, but be mindful of performance
      // AsyncStorage.setItem(`wellness_entries_${userId}`, JSON.stringify(firestoreEntries));

    }, (error) => {
      console.error('Error listening to entries:', error);
      setLoadingEntries(false);
      // Consider showing an error message to the user
    });

    // Return the unsubscribe function to stop listening
    return unsubscribe;
  };

  // loadEntriesFromStorage is now primarily for initial load/offline fallback
  const loadEntriesFromStorage = async (userId) => {
    if (!userId) return;
    try {
      const localData = await AsyncStorage.getItem(`wellness_entries_${userId}`);
      if (localData) {
        setEntries(JSON.parse(localData));
      }
    } catch (error) {
      console.error('Error loading entries from AsyncStorage:', error);
    }
  };


  // loadEntriesFromFirestore is replaced by listenForEntries for real-time updates


  const addEntry = async (entry) => {
    if (!currentUser) {
      console.log('No user logged in. Cannot add entry.');
      Alert.alert('Error', 'Debes iniciar sesión para guardar entradas.');
      return;
    }
    // setLoadingEntries(true); // Loading will be handled by the snapshot listener
    try {
      const newEntry = {
        ...entry,
        userId: currentUser.uid,
        timestamp: new Date(), // Add a timestamp for ordering
      };
      await addDoc(collection(db, 'wellnessEntries'), newEntry);
      console.log('Entry added successfully.');

      // The snapshot listener will automatically update the entries state

    } catch (error) {
      console.error('Error adding entry:', error);
       // setLoadingEntries(false); // Loading will be handled by the snapshot listener
       Alert.alert('Error', 'No se pudo guardar la entrada.');
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
    'La felicidad no es un destino, es una forma de viajar. - Margaret Lee Runbeck',
    'Haz de cada día tu obra maestra. - John Wooden',
    'El éxito es la suma de pequeños esfuerzos repetidos día tras día. - Robert Collier',
    'No cuentes los días, haz que los días cuenten. - Muhammad Ali',
    'La actitud es una pequeña cosa que hace una gran diferencia. - Winston Churchill',
    'La vida es 10% lo que te ocurre y 90% cómo reaccionas. - Charles Swindoll',
    'Nunca es tarde para ser quien podrías haber sido. - George Eliot',
    'Hazlo con pasión o no lo hagas. - Rosa Nouchette Carey',
  ];

  const fetchQuote = async () => {
    setLoadingQuote(true);
    try {
      // Reverting to the original quotable.io API
      let url = 'https://api.quotable.io/random';
      const res = await fetch(url);
      if (!res.ok) throw new Error('No se pudo obtener la frase');
      const data = await res.json();
      // The API returns an object with content and author fields
      if (data && data.content && data.author) {
        setQuote(data.content + ' - ' + data.author);
      } else {
        throw new Error('Respuesta de API inesperada');
      }
    } catch (error) {
      console.error('Error fetching quote:', error);
      // Si falla, elige una frase local aleatoria
      const random = frasesLocales[Math.floor(Math.random() * frasesLocales.length)];
      setQuote(random);
    } finally {
      setLoadingQuote(false);
    }
  };

  return (
    <WellnessContext.Provider value={{ entries, addEntry, theme, toggleTheme, quote, fetchQuote, loadingQuote, currentUser, loadingEntries }}>
      {children}
    </WellnessContext.Provider>
  );
}

export function useWellness() {
  return useContext(WellnessContext);
}
