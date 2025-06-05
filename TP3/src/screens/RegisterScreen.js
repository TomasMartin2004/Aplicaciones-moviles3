import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useWellness } from '../context/WellnessContext';
import { authStyles } from '../styles/authStyles';
import { handleRegister } from '../utils/auth';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { theme, toggleTheme } = useWellness();
  const router = useRouter();

  const onPressRegister = () => {
    if (!email || !password || !confirmPassword) {
      setErrors({
        email: !email ? 'El email es obligatorio' : null,
        password: !password ? 'La contraseña es obligatoria' : null,
        confirmPassword: !confirmPassword ? 'Debes confirmar la contraseña' : null,
      });
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }
    if (password !== confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: 'Las contraseñas no coinciden.' }));
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }
    handleRegister(email, password, confirmPassword, setErrors, setLoading, router);
  }

  const lightThemeColors = {
    background: authStyles.colors?.background || '#ECEFF4',
    text: authStyles.colors?.text?.primary || '#2E3440',
    secondaryText: authStyles.colors?.text?.secondary || '#4C566A',
    inputBackground: authStyles.colors?.input || '#FFFFFF',
    inputPlaceholder: authStyles.colors?.text?.secondary || '#4C566A',
    buttonText: authStyles.colors?.background || '#FFFFFF',
    accent: authStyles.colors?.accent || '#5E81AC',
    errorText: authStyles.colors?.error || '#BF616A',
    passwordRequirementsText: authStyles.colors?.text?.secondary || '#4C566A',
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
    passwordRequirementsText: '#D8DEE9',
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

      <Text style={[authStyles.title, { color: currentColorScheme.text }]}>Crear Cuenta</Text>
      <Text style={[authStyles.subtitle, { color: currentColorScheme.secondaryText }]}>Únete a nuestra comunidad</Text>

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
            if (errors.password) setErrors((prev) => ({ ...prev, password: null, confirmPassword: null }));
          }}
          secureTextEntry
          editable={!loading}
        />
        {errors.password && <Text style={[authStyles.errorText, {color: currentColorScheme.errorText}]}>{errors.password}</Text>}
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
            errors.confirmPassword && authStyles.inputError
          ]}
          placeholder="Confirmar Contraseña"
          placeholderTextColor={placeholderTextColor}
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: null }));
          }}
          secureTextEntry
          editable={!loading}
          onSubmitEditing={onPressRegister}
        />
        {errors.confirmPassword && <Text style={[authStyles.errorText, {color: currentColorScheme.errorText}]}>{errors.confirmPassword}</Text>}
      </View>
      
      {errors.password && authStyles.passwordRequirements && (
        <Text style={[authStyles.passwordRequirements, {color: currentColorScheme.passwordRequirementsText}]}>
          La contraseña debe contener:{'\n'}
          • Al menos 6 caracteres{'\n'}
          • Una letra mayúscula{'\n'}
          • Un número
        </Text>
      )}

      <TouchableOpacity 
        style={[
            authStyles.button, 
            { backgroundColor: currentColorScheme.accent },
            loading && authStyles.buttonDisabled
        ]} 
        onPress={onPressRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={isDark ? darkThemeColors.buttonText : lightThemeColors.buttonText} />
        ) : (
          <Text style={[authStyles.buttonText, { color: isDark ? darkThemeColors.buttonText : lightThemeColors.buttonText }]}>Registrarse</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        style={authStyles.linkButton} 
        onPress={() => router.push('/login')}
        disabled={loading}
      >
        <Text style={[authStyles.linkText, { color: currentColorScheme.accent }]}>
          ¿Ya tienes cuenta? Inicia sesión
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