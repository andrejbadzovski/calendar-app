import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useAuth } from '../AuthContext';
import type { AuthStackParamList } from '@/navigation/types';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'SignUp'>;

export function SignUpScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { signUp } = useAuth();

  return (
    <Screen>
      <Text variant="h1">Sign Up</Text>
      <Button label="Sign Up (temp)" onPress={() => signUp('test@test.com', 'password')} />
      <Button label="Back to Sign In" variant="ghost" onPress={() => navigation.goBack()} />
    </Screen>
  );
}