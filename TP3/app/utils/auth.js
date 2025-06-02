import { Alert } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

export const validateLoginForm = (email, password, setErrors) => {
  const newErrors = {};

  if (!email) {
    newErrors.email = 'El email es obligatorio';
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    newErrors.email = 'Por favor, ingresa un email válido';
  }

  if (!password) {
    newErrors.password = 'La contraseña es obligatoria';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

export const validateRegisterForm = (email, password, confirmPassword, setErrors) => {
  const newErrors = {};

  if (!email) {
    newErrors.email = 'El email es obligatorio';
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    newErrors.email = 'Por favor, ingresa un email válido';
  }

  if (!password) {
    newErrors.password = 'La contraseña es obligatoria';
  } else if (password.length < 6) {
    newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
  } else if (!/[A-Z]/.test(password)) {
    newErrors.password = 'La contraseña debe contener al menos una letra mayúscula';
  } else if (!/[0-9]/.test(password)) {
    newErrors.password = 'La contraseña debe contener al menos un número';
  }

  if (!confirmPassword) {
    newErrors.confirmPassword = 'Por favor, confirma tu contraseña';
  } else if (password !== confirmPassword) {
    newErrors.confirmPassword = 'Las contraseñas no coinciden';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

export const handleLogin = async (email, password, setErrors, setLoading, router) => {
  if (!validateLoginForm(email, password, setErrors)) {
    const errorMessage = Object.values(setErrors).join('\n');
    Alert.alert('Error de Validación', errorMessage);
    return;
  }

  try {
    setLoading(true);
    await signInWithEmailAndPassword(auth, email.trim(), password);
    setErrors({});
    router.push('/home');
  } catch (error) {
    let errorMessage = 'Ocurrió un error durante el inicio de sesión';
    switch (error.code) {
      case 'auth/invalid-email':
        errorMessage = 'El email no es válido';
        setErrors({ email: errorMessage });
        break;
      case 'auth/user-disabled':
        errorMessage = 'Esta cuenta ha sido deshabilitada';
        break;
      case 'auth/user-not-found':
        errorMessage = 'No existe una cuenta con este email';
        setErrors({ email: errorMessage });
        break;
      case 'auth/wrong-password':
        errorMessage = 'Contraseña incorrecta';
        setErrors({ password: errorMessage });
        break;
      case 'auth/invalid-credential':
        errorMessage = 'Email o contraseña incorrectos';
        setErrors({ 
          email: errorMessage,
          password: errorMessage 
        });
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Demasiados intentos fallidos. Por favor, intenta más tarde';
        break;
      default:
        console.error('Error de Firebase:', error);
        errorMessage = 'Error al iniciar sesión. Por favor, intenta de nuevo';
    }
    Alert.alert('Error', errorMessage);
  } finally {
    setLoading(false);
  }
};

export const handleRegister = async (email, password, confirmPassword, setErrors, setLoading, router) => {
  if (!validateRegisterForm(email, password, confirmPassword, setErrors)) {
    const errorMessage = Object.values(setErrors).join('\n');
    Alert.alert('Error de Validación', errorMessage);
    return;
  }

  try {
    setLoading(true);
    await createUserWithEmailAndPassword(auth, email.trim(), password);
    router.push('/login');
  } catch (error) {
    let errorMessage = 'Ocurrió un error durante el registro';
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'Este email ya está registrado';
        setErrors({ email: errorMessage });
        break;
      case 'auth/invalid-email':
        errorMessage = 'El email no es válido';
        setErrors({ email: errorMessage });
        break;
      case 'auth/operation-not-allowed':
        errorMessage = 'El registro con email y contraseña no está habilitado';
        break;
      case 'auth/weak-password':
        errorMessage = 'La contraseña es muy débil. Debe tener al menos 6 caracteres';
        setErrors({ password: errorMessage });
        break;
      default:
        console.error('Error de Firebase:', error);
    }
    Alert.alert('Error', errorMessage);
  } finally {
    setLoading(false);
  }
}; 