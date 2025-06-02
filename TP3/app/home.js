import React from 'react';
import { View, Text } from 'react-native';
import { Stack } from 'expo-router';
import { authStyles } from './styles/authStyles';

export default function Home() {
  return (
    <View style={authStyles.container}>
      <Stack.Screen 
        options={{
          title: 'Home',
          headerShown: true,
        }}
      />
      <View style={[authStyles.formContainer, { justifyContent: 'flex-start', paddingTop: 50 }]}>
        <Text style={authStyles.title}>Bienvenido al Home</Text>
      </View>
    </View>
  );
} 