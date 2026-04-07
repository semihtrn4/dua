import { useState, useCallback } from 'react';
import type { CameraSettings, CameraMode, Resolution, FrameRate, FileFormat, LensType } from '@/types/camera';

const DEFAULT_SETTINGS: CameraSettings = {
  mode: 'single',
  resolution: '4K',
  frameRate: 30,
  format: 'mov',
  lens: 'wide',
};

export function useCameraSettings() {
  const [settings, setSettings] = useState<CameraSettings>(DEFAULT_SETTINGS);

  const setMode = useCallback((mode: CameraMode) => {
    setSettings(prev => ({ ...prev, mode }));
  }, []);

  const setResolution = useCallback((resolution: Resolution) => {
    setSettings(prev => ({ ...prev, resolution }));
  }, []);

  const setFrameRate = useCallback((frameRate: FrameRate) => {
    setSettings(prev => ({ ...prev, frameRate }));
  }, []);

  const setFormat = useCallback((format: FileFormat) => {
    setSettings(prev => ({ ...prev, format }));
  }, []);

  const setLens = useCallback((lens: LensType) => {
    setSettings(prev => ({ ...prev, lens }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const formatLabel = `${settings.resolution} · ${settings.frameRate}fps · ${settings.format.toUpperCase()}`;

  return {
    settings,
    setMode,
    setResolution,
    setFrameRate,
    setFormat,
    setLens,
    resetSettings,
    formatLabel,
  };
}
