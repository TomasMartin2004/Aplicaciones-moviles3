import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { authStyles } from '../src/styles/authStyles';
import { handleLogin } from '../src/utils/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  return (
    <View style={authStyles.container}>
      <View style={authStyles.formContainer}>
        <Text style={authStyles.title}>¡Bienvenido de nuevo!</Text>
        <Text style={authStyles.subtitle}>Inicia sesión para continuar</Text>
        
        <View style={authStyles.inputContainer}>
          <TextInput
            style={[authStyles.input, errors.email && authStyles.inputError]}
            placeholder="Correo electrónico"
            placeholderTextColor="#4C566A"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setErrors((prev) => ({ ...prev, email: null }));
            }}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
          />
          {errors.email && <Text style={authStyles.errorText}>{errors.email}</Text>}
        </View>

        <View style={authStyles.inputContainer}>
          <TextInput
            style={[authStyles.input, errors.password && authStyles.inputError]}
            placeholder="Contraseña"
            placeholderTextColor="#4C566A"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setErrors((prev) => ({ ...prev, password: null }));
            }}
            secureTextEntry
            editable={!loading}
          />
          {errors.password && <Text style={authStyles.errorText}>{errors.password}</Text>}
        </View>

        <TouchableOpacity 
          style={[authStyles.button, loading && authStyles.buttonDisabled]} 
          onPress={() => handleLogin(email, password, setErrors, setLoading, router)}
          disabled={loading}
        >
          <Text style={authStyles.buttonText}>
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={authStyles.linkButton} 
          onPress={() => router.push('/register')}
          disabled={loading}
        >
          <Text style={authStyles.linkText}>¿No tienes una cuenta? Regístrate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}