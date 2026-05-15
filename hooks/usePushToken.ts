import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { useState, useCallback } from 'react';
import { registerExpoPushToken } from '../services/api';

export type PushStatus = 'idle' | 'registering' | 'registered' | 'denied' | 'error';

if (Platform.OS === 'android') {
  Notifications.setNotificationChannelAsync('default', {
    name: 'default',
    importance: Notifications.AndroidImportance.MAX,
  });
}

export function usePushToken() {
  const [status, setStatus] = useState<PushStatus>('idle');

  const register = useCallback(async () => {
    if (!Device.isDevice) {
      setStatus('denied');
      return;
    }

    const { status: permStatus } = await Notifications.requestPermissionsAsync();
    if (permStatus !== 'granted') {
      setStatus('denied');
      return;
    }

    setStatus('registering');

    try {
      const projectId = Constants.expoConfig?.extra?.eas?.projectId as string | undefined;
      if (!projectId) {
        console.warn('[usePushToken] EAS projectId not configured');
        setStatus('error');
        return;
      }
      const expoPushToken = await Notifications.getExpoPushTokenAsync({ projectId });
      await registerExpoPushToken(expoPushToken.data);
      setStatus('registered');
    } catch (err) {
      console.error('[usePushToken] registration failed:', err);
      setStatus('error');
    }
  }, []);

  return { status, register };
}
