import { useState, useEffect, useCallback } from 'react';
import * as FileSystem from 'expo-file-system/legacy';
import type { StorageInfo } from '@/types/camera';

// Approximate MB per minute for different settings
const MB_PER_MINUTE: Record<string, number> = {
  '1080p-24': 180,
  '1080p-30': 220,
  '1080p-60': 350,
  '4K-24': 320,
  '4K-30': 400,
  '4K-60': 650,
};

export function useStorage(resolution: '1080p' | '4K', frameRate: 24 | 30 | 60, mode: 'single' | 'dual' = 'single') {
  const [storageInfo, setStorageInfo] = useState<StorageInfo>({
    freeSpace: 0,
    totalSpace: 0,
    recordingTimeMinutes: 0,
  });

  const calculateRecordingTime = useCallback((freeSpaceMB: number): number => {
    const key = `${resolution}-${frameRate}`;
    const mbPerMinute = MB_PER_MINUTE[key] || 400;
    const modeMultiplier = mode === 'dual' ? 2 : 1;
    return Math.floor(freeSpaceMB / (mbPerMinute * modeMultiplier));
  }, [resolution, frameRate, mode]);

  const formatBytes = useCallback((bytes: number): string => {
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(1)} GB`;
  }, []);

  const getStorageColor = useCallback((minutes: number): string => {
    if (minutes < 1) return '#FF3B30';
    if (minutes < 5) return '#FF9500';
    return '#30D158';
  }, []);

  const refreshStorage = useCallback(async () => {
    try {
      const info = await FileSystem.getFreeDiskStorageAsync();
      const total = await FileSystem.getTotalDiskCapacityAsync();
      const freeSpaceMB = info / (1024 * 1024);
      
      setStorageInfo({
        freeSpace: info,
        totalSpace: total,
        recordingTimeMinutes: calculateRecordingTime(freeSpaceMB),
      });
    } catch (error) {
      console.log('Storage check failed:', error);
    }
  }, [calculateRecordingTime]);

  useEffect(() => {
    void refreshStorage();
    const interval = setInterval(() => {
      void refreshStorage();
    }, 5000);
    return () => clearInterval(interval);
  }, [refreshStorage]);

  const storageText = `~${storageInfo.recordingTimeMinutes} min remaining · ${formatBytes(storageInfo.freeSpace)} free`;
  const storageColor = getStorageColor(storageInfo.recordingTimeMinutes);

  return {
    ...storageInfo,
    storageText,
    storageColor,
    formatBytes,
    refreshStorage,
  };
}
