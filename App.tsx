import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { spacing } from '@/theme';

function App() {
  return (
    <SafeAreaProvider>
      <Screen keyboardAvoiding scrollable>
        <View style={styles.container}>
          <Text variant="h1">Design System</Text>
          <Text variant="body" color="textSecondary">
            Preview of base components
          </Text>

          <Input label="Email" placeholder="you@example.com" keyboardType="email-address" />
          <Input label="Password" placeholder="••••••••" secureTextEntry error="Password is too short" />

          <Button label="Primary" onPress={() => {}} />
          <Button label="Secondary" variant="secondary" onPress={() => {}} />
          <Button label="Loading" loading onPress={() => {}} />
          <Button label="Disabled" disabled onPress={() => {}} />
        </View>
      </Screen>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    paddingVertical: spacing.xl,
  },
});

export default App;