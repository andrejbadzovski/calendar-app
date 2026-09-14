import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useAuth } from '../AuthContext';
import type { AuthStackParamList } from '@/navigation/types';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'SignIn'>;

export function SignInScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { signIn } = useAuth();

  return (
    <Screen>
      <Text variant="h1">Sign In</Text>
      <Button label="Sign In (temp)" onPress={() => signIn('test@test.com', 'password')} />
      <Button label="Go to Sign Up" variant="ghost" onPress={() => navigation.navigate('SignUp')} />
    </Screen>
  );
}