import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CameraSettings, CameraMode, Resolution, FrameRate, FileFormat } from '@/types/camera';

const SETTINGS_KEY = '@dualshot/camera-settings';

const DEFAULT_SETTINGS: CameraSettings = {
  mode: 'single',
  resolution: '4K',
  frameRate: 30,
  format: 'mov',
  lens: 'wide',
};

export function useCameraSettings() {
  const [settings, setSettings] = useState<CameraSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(SETTINGS_KEY);
        if (stored !== null) {
          setSettings(JSON.parse(stored) as CameraSettings);
        }
      } catch (e) {
        console.warn('[useCameraSettings] AsyncStorage okuma hatası, varsayılan ayarlar kullanılıyor:', e);
      }
    })();
  }, []);

  const setMode = useCallback((mode: CameraMode) => {
    setSettings(prev => {
      const next = { ...prev, mode };
      AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next)).catch(e =>
        console.warn('[useCameraSettings] AsyncStorage yazma hatası:', e)
      );
      return next;
    });
  }, []);

  const setResolution = useCallback((resolution: Resolution) => {
    setSettings(prev => {
      const next = { ...prev, resolution };
      AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next)).catch(e =>
        console.warn('[useCameraSettings] AsyncStorage yazma hatası:', e)
      );
      return next;
    });
  }, []);

  const setFrameRate = useCallback((frameRate: FrameRate) => {
    setSettings(prev => {
      const next = { ...prev, frameRate };
      AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next)).catch(e =>
        console.warn('[useCameraSettings] AsyncStorage yazma hatası:', e)
      );
      return next;
    });
  }, []);

  const setFormat = useCallback((format: FileFormat) => {
    setSettings(prev => {
      const next = { ...prev, format };
      AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next)).catch(e =>
        console.warn('[useCameraSettings] AsyncStorage yazma hatası:', e)
      );
      return next;
    });
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS)).catch(e =>
      console.warn('[useCameraSettings] AsyncStorage yazma hatası:', e)
    );
  }, []);

  const formatLabel = `${settings.resolution} · ${settings.frameRate}fps · ${settings.format.toUpperCase()}`;

  return {
    settings,
    setMode,
    setResolution,
    setFrameRate,
    setFormat,
    resetSettings,
    formatLabel,
  };
}
