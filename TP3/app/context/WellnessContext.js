import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const WellnessContext = createContext();

export function WellnessProvider({ children }) {
  const [entries, setEntries] = useState([]);
  const [theme, setTheme] = useState('light');
  const [quote, setQuote] = useState('');
  const [loadingQuote, setLoadingQuote] = useState(false);

  useEffect(() => {
    loadEntries();
    loadTheme();
    fetchQuote();
  }, []);

  const loadEntries = async () => {
    try {
      const data = await AsyncStorage.getItem('wellness_entries');
      if (data) setEntries(JSON.parse(data));
    } catch {}
  };

  const saveEntries = async (newEntries) => {
    setEntries(newEntries);
    await AsyncStorage.setItem('wellness_entries', JSON.stringify(newEntries));
  };

  const addEntry = async (entry) => {
    const newEntries = [entry, ...entries];
    await saveEntries(newEntries);
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
      let url = 'https://api.quotable.io/random';
      const res = await fetch(url);
      if (!res.ok) throw new Error('No se pudo obtener la frase');
      const data = await res.json();
      setQuote(data.content + ' - ' + data.author);
    } catch {
      // Si falla, elige una frase local aleatoria
      const random = frasesLocales[Math.floor(Math.random() * frasesLocales.length)];
      setQuote(random);
    } finally {
      setLoadingQuote(false);
    }
  };

  return (
    <WellnessContext.Provider value={{ entries, addEntry, theme, toggleTheme, quote, fetchQuote, loadingQuote }}>
      {children}
    </WellnessContext.Provider>
  );
}

export function useWellness() {
  return useContext(WellnessContext);
}
