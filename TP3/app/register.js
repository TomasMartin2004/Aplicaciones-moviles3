import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { authStyles } from './styles/authStyles';
import { handleRegister } from './utils/auth';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  return (
    <View style={authStyles.container}>
      <View style={authStyles.formContainer}>
        <Text style={authStyles.title}>Crear Cuenta</Text>
        <Text style={authStyles.subtitle}>Regístrate para comenzar</Text>

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

        <View style={authStyles.inputContainer}>
          <TextInput
            style={[authStyles.input, errors.confirmPassword && authStyles.inputError]}
            placeholder="Confirmar Contraseña"
            placeholderTextColor="#4C566A"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              setErrors((prev) => ({ ...prev, confirmPassword: null }));
            }}
            secureTextEntry
            editable={!loading}
          />
          {errors.confirmPassword && (
            <Text style={authStyles.errorText}>{errors.confirmPassword}</Text>
          )}
        </View>

        {errors.password && (
          <Text style={authStyles.passwordRequirements}>
            La contraseña debe contener:{'\n'}
            • Al menos 6 caracteres{'\n'}
            • Una letra mayúscula{'\n'}
            • Un número
          </Text>
        )}

        <TouchableOpacity 
          style={[authStyles.button, loading && authStyles.buttonDisabled]} 
          onPress={() => handleRegister(email, password, confirmPassword, setErrors, setLoading, router)}
          disabled={loading}
        >
          <Text style={authStyles.buttonText}>
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={authStyles.linkButton} 
          onPress={() => router.push('/login')}
          disabled={loading}
        >
          <Text style={authStyles.linkText}>¿Ya tienes una cuenta? Inicia sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}