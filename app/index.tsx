/**
 * CameraScreen — expo-camera CameraView API ile arka kamera kaydı.
 * Dual mod: tek kayıt → FFmpeg ile 9:16 + 16:9 çıktı.
 * Single mod: tek kayıt → tek dosya.
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
  Platform,
} from 'react-native';
import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as Haptics from 'expo-haptics';
import { useRouter, useRootNavigationState } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { useCameraSettings } from '@/hooks/useCameraSettings';
import { useStorage } from '@/hooks/useStorage';
import type { RecordingInfo } from '@/types/camera';

import { SettingsSheet } from '@/components/SettingsSheet';
import { RecordButton } from '@/components/RecordButton';
import { ModeSelector } from '@/components/ModeSelector';

function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return [hrs, mins, secs].map((v) => v.toString().padStart(2, '0')).join(':');
}

export default function CameraScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const navigationState = useRootNavigationState();

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();

  const cameraRef = useRef<CameraView>(null);
  const { settings, setMode, formatLabel } = useCameraSettings();
  const { storageText, storageColor, recordingTimeMinutes } = useStorage(
    settings.resolution,
    settings.frameRate,
    settings.mode,
  );

  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [torchEnabled, setTorchEnabled] = useState(false);

  const recordingDurationRef = useRef(0);

  // Kayıt zamanlayıcı
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration((p) => {
          recordingDurationRef.current = p + 1;
          return p + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Animasyonlar
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const timerOpacity = useRef(new Animated.Value(0)).current;
  const dotOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(dotOpacity, { toValue: 0.2, duration: 500, useNativeDriver: true }),
          Animated.timing(dotOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        ]),
      ).start();
    } else {
      dotOpacity.setValue(1);
    }
  }, [isRecording, dotOpacity]);

  useEffect(() => {
    Animated.timing(timerOpacity, {
      toValue: isRecording ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isRecording, timerOpacity]);

  // İzin kontrolü
  useEffect(() => {
    if (!navigationState?.key) return;
    const check = async () => {
      if (!cameraPermission?.granted) await requestCameraPermission();
      if (!micPermission?.granted) await requestMicPermission();
      if (!mediaPermission?.granted) await requestMediaPermission();

      if (!cameraPermission?.granted || !micPermission?.granted || !mediaPermission?.granted) {
        router.replace('/permissions');
      }
    };
    void check();
  }, [
    cameraPermission,
    micPermission,
    mediaPermission,
    navigationState?.key,
    requestCameraPermission,
    requestMicPermission,
    requestMediaPermission,
    router,
  ]);

  const handleStopRecording = useCallback(async () => {
    try {
      setIsRecording(false);
      pulseAnim.setValue(1);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      cameraRef.current?.stopRecording();
    } catch (err) {
      console.warn('stopRecording error:', err);
      setIsRecording(false);
    }
  }, [pulseAnim]);

  const handleStartRecording = useCallback(async () => {
    if (recordingTimeMinutes < 1) {
      Alert.alert('Depolama Dolu', 'Video kaydetmek için yeterli alan yok.');
      return;
    }

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      setIsRecording(true);
      setRecordingDuration(0);
      recordingDurationRef.current = 0;

      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.06, duration: 900, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
        ]),
      ).start();

      const timestamp = Date.now();
      const ext = settings.format;

      cameraRef.current?.recordAsync({
        maxDuration: 3600,
      }).then((video) => {
        if (!video) return;

        const recordings: RecordingInfo[] = [
          {
            uri: video.uri,
            filename: `DualShot_${timestamp}_original.${ext}`,
            duration: recordingDurationRef.current,
            aspectRatio: '9:16',
          },
        ];

        router.push({
          pathname: '/post-recording',
          params: {
            recordings: JSON.stringify(recordings),
            duration: recordingDurationRef.current.toString(),
            mode: settings.mode,
            format: ext,
          },
        });
      }).catch((err) => {
        console.warn('recordAsync error:', err);
        setIsRecording(false);
      });
    } catch (err) {
      console.warn('startRecording error:', err);
      setIsRecording(false);
    }
  }, [recordingTimeMinutes, settings.mode, settings.format, pulseAnim, router]);

  const toggleRecord = useCallback(() => {
    if (isRecording) {
      void handleStopRecording();
    } else {
      void handleStartRecording();
    }
  }, [isRecording, handleStartRecording, handleStopRecording]);

  const toggleTorch = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTorchEnabled((p) => !p);
  }, []);

  const handleModeChange = useCallback(
    (mode: 'dual' | 'single') => {
      if (isRecording) return;
      setMode(mode);
      if (mode === 'dual') setTorchEnabled(false);
    },
    [setMode, isRecording],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />

      {/* Kamera Önizleme */}
      <View style={styles.cameraLayer}>
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing="back"
          mode="video"
          enableTorch={torchEnabled}
          videoQuality={settings.resolution === '4K' ? '2160p' : '1080p'}
        />

        {/* Dual mod crop rehberi */}
        {settings.mode === 'dual' && (
          <View style={styles.pipContainer}>
            <View style={styles.pipWrapper}>
              <View style={styles.pipOverlay}>
                <Text style={styles.pipLabel}>16:9 CROP AREA</Text>
              </View>
              <View style={styles.pipBadge}>
                <Text style={styles.pipBadgeText}>SMART CROP</Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Üst Bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={[styles.iconButton, torchEnabled && styles.iconButtonActive]}
          onPress={toggleTorch}
          activeOpacity={0.7}
        >
          <Text style={styles.iconText}>🔦</Text>
        </TouchableOpacity>

        <Animated.View style={[styles.timerContainer, { opacity: timerOpacity }]}>
          <Animated.View style={[styles.recDot, { opacity: dotOpacity }]} />
          <Text style={styles.timerText}>{formatDuration(recordingDuration)}</Text>
        </Animated.View>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setShowSettings(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.iconText}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Depolama Bilgisi */}
      <View style={styles.storageRow}>
        <Text style={[styles.storageText, { color: storageColor }]}>{storageText}</Text>
      </View>

      {/* Format Rozeti */}
      <TouchableOpacity
        style={styles.formatBadge}
        onPress={() => setShowSettings(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.formatText}>{formatLabel}</Text>
      </TouchableOpacity>

      {/* Mod Seçici */}
      <ModeSelector mode={settings.mode} onChange={handleModeChange} dualSupported={true} />

      {/* Alt Kontroller */}
      <View style={styles.bottomControls}>
        <View style={styles.sideButton} />
        <RecordButton isRecording={isRecording} onPress={toggleRecord} pulseAnim={pulseAnim} />
        <View style={styles.sideButton} />
      </View>

      <SettingsSheet visible={showSettings} onClose={() => setShowSettings(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  cameraLayer: { ...StyleSheet.absoluteFillObject, zIndex: 0 },
  pipContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 210 : 195,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 5,
  },
  pipWrapper: {
    width: 213,
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.85)',
  },
  pipOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pipLabel: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  pipBadge: {
    position: 'absolute',
    bottom: 5,
    right: 7,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  pipBadgeText: { color: '#fff', fontSize: 9, fontWeight: '700', letterSpacing: 0.8 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    zIndex: 10,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonActive: {
    backgroundColor: 'rgba(255,210,0,0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255,210,0,0.6)',
  },
  iconText: { fontSize: 20 },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 8,
  },
  recDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF3B30' },
  timerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  storageRow: {
    position: 'absolute',
    top: 115,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 5,
  },
  storageText: {
    fontSize: 13,
    fontWeight: '500',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  formatBadge: {
    position: 'absolute',
    top: 142,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 14,
    zIndex: 5,
  },
  formatText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  bottomControls: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 24,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 32,
    zIndex: 10,
  },
  sideButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
