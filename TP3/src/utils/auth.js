import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { Alert } from 'react-native';
import { auth } from '../../firebaseConfig';

export const validateLoginForm = (email, password, setErrors) => {
  const newErrors = {};
  if (!email) newErrors.email = 'El email es obligatorio';
  else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Por favor, ingresa un email válido';
  if (!password) newErrors.password = 'La contraseña es obligatoria';
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

export const validateRegisterForm = (email, password, confirmPassword, setErrors) => {
  const newErrors = {};
  if (!email) newErrors.email = 'El email es obligatorio';
  else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Por favor, ingresa un email válido';
  if (!password) newErrors.password = 'La contraseña es obligatoria';
  else if (password.length < 6) newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
  if (!confirmPassword) newErrors.confirmPassword = 'Por favor, confirma tu contraseña';
  else if (password !== confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

export const handleLogin = async (email, password, setErrors, setLoading, router) => {
  if (!validateLoginForm(email, password, setErrors)) {
    const currentErrors = {};
    if (!email) currentErrors.email = 'El email es obligatorio';
    else if (!/\S+@\S+\.\S+/.test(email)) currentErrors.email = 'Por favor, ingresa un email válido';
    if (!password) currentErrors.password = 'La contraseña es obligatoria';
    setErrors(currentErrors);
    if (Object.values(currentErrors).length > 0) {
        Alert.alert('Error de Validación', Object.values(currentErrors).filter(Boolean).join('\n'));
    }
    return;
  }
  setLoading(true);
  try {
    await signInWithEmailAndPassword(auth, email.trim(), password);
    setErrors({});
  } catch (error) {
    const newErrors = {};
    let alertMessage = 'Ocurrió un error durante el inicio de sesión. Intenta de nuevo.';
    switch (error.code) {
      case 'auth/invalid-email':
      case 'auth/user-not-found':
        newErrors.email = 'El email ingresado no es válido o no está registrado.';
        alertMessage = newErrors.email;
        break;
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        newErrors.password = 'La contraseña es incorrecta.';
        alertMessage = newErrors.password;
        break;
      case 'auth/user-disabled':
        alertMessage = 'Esta cuenta ha sido deshabilitada.';
        break;
      case 'auth/too-many-requests':
        alertMessage = 'Demasiados intentos fallidos. Por favor, intenta más tarde o restablece tu contraseña.';
        break;
      default:
        newErrors.general = alertMessage;
    }
    setErrors(newErrors);
    Alert.alert('Error de Inicio de Sesión', alertMessage);
  } finally {
    setLoading(false);
  }
};

export const handleRegister = async (email, password, confirmPassword, setErrors, setLoading, router) => {
  if (!validateRegisterForm(email, password, confirmPassword, setErrors)) {
    const currentErrors = {};
    if (!email) currentErrors.email = 'El email es obligatorio';
    else if (!/\S+@\S+\.\S+/.test(email)) currentErrors.email = 'Por favor, ingresa un email válido';
    if (!password) currentErrors.password = 'La contraseña es obligatoria';
    else if (password.length < 6) currentErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    if (!confirmPassword) currentErrors.confirmPassword = 'Por favor, confirma tu contraseña';
    else if (password !== confirmPassword) currentErrors.confirmPassword = 'Las contraseñas no coinciden';
    setErrors(currentErrors);
    if (Object.values(currentErrors).length > 0) {
        Alert.alert('Error de Validación', Object.values(currentErrors).filter(Boolean).join('\n'));
    }
    return;
  }
  setLoading(true);
  try {
    await createUserWithEmailAndPassword(auth, email.trim(), password);
    setErrors({});
    Alert.alert('Registro Exitoso', 'Tu cuenta ha sido creada.', [
      { text: 'OK', onPress: () => router.replace('/login') }
    ]);
  } catch (error) {
    const newErrors = {};
    let alertMessage = 'Ocurrió un error durante el registro. Intenta de nuevo.';
    switch (error.code) {
      case 'auth/email-already-in-use':
        newErrors.email = 'Este email ya está registrado.';
        alertMessage = newErrors.email;
        break;
      case 'auth/invalid-email':
        newErrors.email = 'El email no es válido.';
        alertMessage = newErrors.email;
        break;
      case 'auth/operation-not-allowed':
        alertMessage = 'El registro con email y contraseña no está habilitado.';
        break;
      case 'auth/weak-password':
        newErrors.password = 'La contraseña es muy débil.';
        alertMessage = newErrors.password;
        break;
      default:
        newErrors.general = alertMessage;
    }
    setErrors(newErrors);
    Alert.alert('Error de Registro', alertMessage);
  } finally {
    setLoading(false);
  }
};

export const handleLogout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    Alert.alert('Error', 'No se pudo cerrar sesión.');
  }
};