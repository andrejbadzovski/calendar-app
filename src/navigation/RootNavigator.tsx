import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AppStackParamList } from './types';
import { AuthNavigator } from './AuthNavigator';
import { TabNavigator } from './TabNavigator';
import { useAuth } from '@/features/auth/AuthContext';

const Stack = createNativeStackNavigator<AppStackParamList>();

export function RootNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <Stack.Navigator>
          <Stack.Screen
            name="Tabs"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}