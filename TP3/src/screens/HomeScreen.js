import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useWellness } from '../context/WellnessContext';

export default function HomeScreen() {
  const { quote, fetchQuote, theme, toggleTheme, loadingQuote } = useWellness();
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
  };

  const lightThemeColors = {
    accent: '#5E81AC',
    logoutIcon: '#BF616A',
  };

  const darkThemeColors = {
    accent: '#88C0D0',
    logoutIcon: '#FF8C8C',
  };

  const isDark = theme === 'dark';
  const currentColorScheme = isDark ? darkThemeColors : lightThemeColors;

  return (
    <View style={[styles.baseContainer, isDark ? styles.darkBg : styles.lightBg]}>
      <View style={styles.headerButtonContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={28} color={currentColorScheme.logoutIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.themeToggleButton} onPress={toggleTheme}>
          <Ionicons 
            name={isDark ? 'sunny' : 'moon'} 
            size={28} 
            color={currentColorScheme.accent} 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Ionicons name="book-outline" size={32} color={isDark ? '#D8DEE9' : "#5E81AC"} style={styles.titleIcon} />
          <Text style={[styles.titleText, isDark && styles.darkText]}>¡Bienvenido a tu Diario de Bienestar!</Text>
        </View>
        
        {loadingQuote ? (
          <ActivityIndicator size="small" color={isDark ? '#D8DEE9' : "#5E81AC"} style={styles.quoteLoading}/>
        ) : (
          <Text style={[styles.quoteText, isDark && styles.darkTextQuote]}>{quote || "Cargando frase..."}</Text>
        )}
        
        <TouchableOpacity style={styles.refreshButton} onPress={fetchQuote} disabled={loadingQuote}>
          <Ionicons name="refresh" size={20} color={isDark ? darkThemeColors.accent : lightThemeColors.accent} />
          <Text style={[styles.refreshButtonText, isDark && {color: darkThemeColors.accent}]}>Otra frase</Text>
        </TouchableOpacity>

        <TouchableOpacity 
            style={[styles.mainButton, {backgroundColor: currentColorScheme.accent}]} 
            onPress={() => router.push('/(tabs)/new-entry')}
        >
          <Ionicons name="add-circle-outline" size={20} color={isDark ? darkThemeColors.buttonText : '#FFFFFF'} style={styles.mainButtonIcon} />
          <Text style={[styles.mainButtonText, {color: isDark ? darkThemeColors.buttonText : '#FFFFFF'}]}>Registrar nuevo estado</Text>
        </TouchableOpacity>
        <TouchableOpacity 
            style={[styles.outlineButton, {borderColor: currentColorScheme.accent}]} 
            onPress={() => router.push('/(tabs)/history')}
        >
          <Ionicons name="time-outline" size={18} color={currentColorScheme.accent} style={styles.outlineButtonIcon} />
          <Text style={[styles.outlineButtonText, {color: currentColorScheme.accent}]}>Ver historial</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  baseContainer: {
    flex: 1,
    paddingTop: 50, 
  },
  lightBg: {
    backgroundColor: '#ECEFF4',
  },
  darkBg: {
    backgroundColor: '#232936',
  },
  headerButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    width: '100%',
    position: 'absolute',
    top: 50, 
    right: 0, 
    left: 0,
    zIndex: 1,
  },
  themeToggleButton: {
    padding: 10,
  },
  logoutButton: {
    padding: 10,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 60, 
  },
  titleContainer: {
    alignItems: 'center', 
    marginBottom: 10,
  },
  titleIcon: {
    marginBottom: 4,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2E3440',
    textAlign: 'center',
  },
  darkText: {
    color: '#ECEFF4',
  },
  quoteText: {
    fontStyle: 'italic',
    fontSize: 16,
    marginBottom: 24,
    color: '#4C566A',
    textAlign: 'center',
    minHeight: 50, 
  },
  darkTextQuote: {
    color: '#D8DEE9',
  },
  quoteLoading: {
    marginVertical: 15, 
    minHeight: 50,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    padding: 8,
  },
  refreshButtonText: {
    marginLeft: 6,
    color: '#5E81AC',
    fontWeight: 'bold',
  },
  mainButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
    width: '100%',
  },
  mainButtonIcon: {
    marginRight: 6,
  },
  mainButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  outlineButton: {
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    width: '100%',
  },
  outlineButtonIcon: {
    marginRight: 4,
  },
  outlineButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  }
});