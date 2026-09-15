import AsyncStorage from '@react-native-async-storage/async-storage';

const BIOMETRICS_ENABLED_KEY = '@calendar/biometrics-enabled';

export async function isBiometricsEnabled(): Promise<boolean> {
  const value = await AsyncStorage.getItem(BIOMETRICS_ENABLED_KEY);
  return value === 'true';
}

export async function setBiometricsEnabled(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(BIOMETRICS_ENABLED_KEY, enabled ? 'true' : 'false');
}