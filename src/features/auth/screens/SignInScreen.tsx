import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '../AuthContext';
import { validateEmail, validatePassword } from '@/utils/validation';
import { AuthError } from '@/repositories/authRepository';
import type { AuthStackParamList } from '@/navigation/types';
import { spacing } from '@/theme';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'SignIn'>;

type FormErrors = {
  email?: string;
  password?: string;
  form?: string;
};

export function SignInScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const emailResult = validateEmail(email);
    const passwordResult = validatePassword(password);

    if (!emailResult.isValid || !passwordResult.isValid) {
      setErrors({ email: emailResult.error, password: passwordResult.error });
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      await signIn(email, password);
    } catch (error) {
      setErrors({
        form:
          error instanceof AuthError
            ? error.message
            : 'Something went wrong. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen keyboardAvoiding scrollable>
      <View style={styles.container}>
        <Text variant="h1">Welcome back</Text>
        <Text variant="body" color="textSecondary" style={styles.subtitle}>
          Sign in to continue to your calendar
        </Text>

        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />

        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          error={errors.password}
          placeholder="••••••••"
          secureTextEntry
          autoCapitalize="none"
        />

        {errors.form !== undefined && (
          <Text variant="caption" color="error" style={styles.formError}>
            {errors.form}
          </Text>
        )}

        <Button label="Sign In" onPress={handleSubmit} loading={isSubmitting} />
        <Button
          label="Don't have an account? Sign Up"
          variant="ghost"
          onPress={() => navigation.navigate('SignUp')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xxl,
  },
  subtitle: {
    marginBottom: spacing.lg,
  },
  formError: {
    marginBottom: spacing.sm,
  },
});