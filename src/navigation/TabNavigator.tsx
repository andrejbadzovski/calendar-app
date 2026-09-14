import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { TabParamList } from './types';
import { CalendarScreen } from '@/features/calendar/screens/CalendarScreen';
import { ProfileScreen } from '@/features/profile/screens/ProfileScreen';
import { colors } from '@/theme';

const Tab = createBottomTabNavigator<TabParamList>();

export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: { backgroundColor: colors.background, borderTopColor: colors.border },
      }}
    >
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}