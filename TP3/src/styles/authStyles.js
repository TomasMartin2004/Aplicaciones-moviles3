import { Platform, StyleSheet } from 'react-native';

const colors = {
  background: '#ECEFF4',
  input: '#E5E9F0',
  text: {
    primary: '#2E3440',
    secondary: '#4C566A',
  },
  accent: '#5E81AC',
  accentLight: '#81A1C1',
  error: '#BF616A',
};

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 32,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    height: 55,
    borderWidth: 1,
    borderColor: colors.input,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: colors.input,
    color: colors.text.primary,
  },
  inputError: {
    borderColor: colors.error,
    borderWidth: 1,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  passwordRequirements: {
    color: colors.error,
    fontSize: 14,
    marginBottom: 16,
    marginTop: -8,
    lineHeight: 20,
  },
  button: {
    backgroundColor: colors.accent, 
    height: 55, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 24, 
    ...Platform.select({
      ios: {
        shadowColor: colors.accent, 
        shadowOffset: { 
          width: 0, 
          height: 4, 
        },
        shadowOpacity: 0.3, 
        shadowRadius: 4, 
      },
      android: {
        elevation: 4, 
      },
      web: {
        boxShadow: `0px 4px 4px rgba(94, 129, 172, 0.3)`,
      }
    }),
  },
  buttonDisabled: {
    backgroundColor: colors.accentLight, 
    ...Platform.select({
      ios: {
        shadowOpacity: 0.1, 
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: `0px 4px 4px rgba(129, 161, 193, 0.1)`, 
      }
    }),
  },
  buttonText: {
    color: colors.background, 
    fontSize: 18, 
    fontWeight: '600', 
  },
  linkButton: {
    marginTop: 24, 
    alignItems: 'center', 
  },
  linkText: {
    color: colors.accent, 
    fontSize: 16, 
  },
});