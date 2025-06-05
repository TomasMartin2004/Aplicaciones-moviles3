import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useWellness } from '../context/WellnessContext';
import { authStyles } from '../styles/authStyles';
import { handleLogin } from '../utils/auth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { theme, toggleTheme } = useWellness();
  const router = useRouter();

  const onPressLogin = () => {
    if (!email || !password) {
      setErrors({
        email: !email ? 'El email es obligatorio' : null,
        password: !password ? 'La contraseña es obligatoria' : null,
      });
      Alert.alert('Error', 'Por favor, ingresa tu email y contraseña.');
      return;
    }
    handleLogin(email, password, setErrors, setLoading, router);
  };
  
  const lightThemeColors = {
    background: authStyles.colors?.background || '#ECEFF4',
    text: authStyles.colors?.text?.primary || '#2E3440',
    secondaryText: authStyles.colors?.text?.secondary || '#4C566A',
    inputBackground: authStyles.colors?.input || '#FFFFFF',
    inputPlaceholder: authStyles.colors?.text?.secondary || '#4C566A',
    buttonText: authStyles.colors?.background || '#FFFFFF',
    accent: authStyles.colors?.accent || '#5E81AC',
    errorText: authStyles.colors?.error || '#BF616A',
  };

  const darkThemeColors = {
    background: '#232936',
    text: '#ECEFF4',
    secondaryText: '#D8DEE9',
    inputBackground: '#3B4252',
    inputPlaceholder: '#A0A0A0',
    buttonText: '#ECEFF4', 
    accent: '#88C0D0',
    errorText: '#EBCB8B', 
  };

  const isDark = theme === 'dark';
  const currentColorScheme = isDark ? darkThemeColors : lightThemeColors;
  const placeholderTextColor = isDark ? darkThemeColors.inputPlaceholder : lightThemeColors.inputPlaceholder;

  return (
    <View style={[authStyles.formContainer, { backgroundColor: currentColorScheme.background }]}>
      <TouchableOpacity style={styles.themeToggleButton} onPress={toggleTheme}>
        <Ionicons 
          name={isDark ? 'sunny' : 'moon'} 
          size={28} 
          color={currentColorScheme.accent} 
        />
      </TouchableOpacity>
      
      <Text style={[authStyles.title, { color: currentColorScheme.text }]}>Bienvenido</Text>
      <Text style={[authStyles.subtitle, { color: currentColorScheme.secondaryText }]}>Inicia sesión para continuar</Text>

      <View style={authStyles.inputContainer}>
        <TextInput
          style={[
            authStyles.input, 
            { 
              backgroundColor: currentColorScheme.inputBackground, 
              color: currentColorScheme.text, 
              borderColor: isDark ? '#4C566A' : '#E0E0E0'
            },
            errors.email && authStyles.inputError
          ]}
          placeholder="Email"
          placeholderTextColor={placeholderTextColor}
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
          }}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!loading}
          onSubmitEditing={onPressLogin}
        />
        {errors.email && <Text style={[authStyles.errorText, {color: currentColorScheme.errorText}]}>{errors.email}</Text>}
      </View>
      <View style={authStyles.inputContainer}>
        <TextInput
          style={[
            authStyles.input, 
            { 
              backgroundColor: currentColorScheme.inputBackground, 
              color: currentColorScheme.text, 
              borderColor: isDark ? '#4C566A' : '#E0E0E0'
            },
            errors.password && authStyles.inputError
          ]}
          placeholder="Contraseña"
          placeholderTextColor={placeholderTextColor}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
          }}
          secureTextEntry
          editable={!loading}
          onSubmitEditing={onPressLogin}
        />
        {errors.password && <Text style={[authStyles.errorText, {color: currentColorScheme.errorText}]}>{errors.password}</Text>}
      </View>

      <TouchableOpacity 
        style={[
          authStyles.button, 
          { backgroundColor: currentColorScheme.accent },
          loading && authStyles.buttonDisabled
        ]} 
        onPress={onPressLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={isDark ? darkThemeColors.buttonText : lightThemeColors.buttonText} />
        ) : (
          <Text style={[authStyles.buttonText, { color: isDark ? darkThemeColors.buttonText : lightThemeColors.buttonText }]}>Iniciar Sesión</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        style={authStyles.linkButton} 
        onPress={() => router.push('/register')}
        disabled={loading}
      >
        <Text style={[authStyles.linkText, { color: currentColorScheme.accent }]}>
          ¿No tienes cuenta? Regístrate
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  themeToggleButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
    padding: 10,
  },
});