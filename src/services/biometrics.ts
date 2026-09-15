import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';

const biometrics = new ReactNativeBiometrics({ allowDeviceCredentials: true });

export type BiometricAvailability = {
  isAvailable: boolean;
  label: string;
};

export async function checkBiometricAvailability(): Promise<BiometricAvailability> {
  try {
    const { available, biometryType } = await biometrics.isSensorAvailable();

    if (!available) {
      return { isAvailable: false, label: 'Biometrics' };
    }

    const label =
      biometryType === BiometryTypes.FaceID
        ? 'Face ID'
        : biometryType === BiometryTypes.TouchID
          ? 'Touch ID'
          : 'Fingerprint';

    return { isAvailable: true, label };
  } catch {
    return { isAvailable: false, label: 'Biometrics' };
  }
}

export async function promptBiometrics(reason: string): Promise<boolean> {
  try {
    const { success } = await biometrics.simplePrompt({ promptMessage: reason });
    return success;
  } catch {
    return false;
  }
}