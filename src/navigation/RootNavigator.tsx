import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AppStackParamList } from './types';
import { AuthNavigator } from './AuthNavigator';
import { TabNavigator } from './TabNavigator';
import { useAuth } from '@/features/auth/AuthContext';
import { colors } from '@/theme';
import { EventFormScreen } from '@/features/events/screens/EventFormScreen';

const Stack = createNativeStackNavigator<AppStackParamList>();

export function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <Stack.Navigator>
          <Stack.Screen
            name="Tabs"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="EventForm"
            component={EventFormScreen}
            options={({ route }) => ({
              title: route.params?.event ? 'Edit event' : 'New event',
              presentation: 'modal',
              animation: 'slide_from_bottom',
              headerStyle: { backgroundColor: colors.background },
              headerTitleStyle: { color: colors.textPrimary },
              headerTintColor: colors.primary,
            })}
          />
        </Stack.Navigator>
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});