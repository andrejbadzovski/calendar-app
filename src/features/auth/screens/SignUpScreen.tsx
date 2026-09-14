import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '../AuthContext';
import {
  validateEmail,
  validatePassword,
  validatePasswordConfirmation,
} from '@/utils/validation';
import { AuthError } from '@/repositories/authRepository';
import type { AuthStackParamList } from '@/navigation/types';
import { spacing } from '@/theme';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'SignUp'>;

type FormErrors = {
  email?: string;
  password?: string;
  confirmation?: string;
  form?: string;
};

export function SignUpScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { signUp } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const emailResult = validateEmail(email);
    const passwordResult = validatePassword(password);
    const confirmationResult = validatePasswordConfirmation(password, confirmation);

    if (!emailResult.isValid || !passwordResult.isValid || !confirmationResult.isValid) {
      setErrors({
        email: emailResult.error,
        password: passwordResult.error,
        confirmation: confirmationResult.error,
      });
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      await signUp(email, password);
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
        <Text variant="h1">Create account</Text>
        <Text variant="body" color="textSecondary" style={styles.subtitle}>
          Sign up to start planning your meetings
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
          placeholder="At least 6 characters"
          secureTextEntry
          autoCapitalize="none"
        />

        <Input
          label="Confirm password"
          value={confirmation}
          onChangeText={setConfirmation}
          error={errors.confirmation}
          placeholder="Repeat your password"
          secureTextEntry
          autoCapitalize="none"
        />

        {errors.form !== undefined && (
          <Text variant="caption" color="error" style={styles.formError}>
            {errors.form}
          </Text>
        )}

        <Button label="Sign Up" onPress={handleSubmit} loading={isSubmitting} />
        <Button
          label="Already have an account? Sign In"
          variant="ghost"
          onPress={() => navigation.goBack()}
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