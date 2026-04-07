/**
 * CameraScreen.tsx
 *
 * Gerçek çift kamera kaydı için react-native-vision-camera kullanır.
 * Smart Crop yaklaşımı: Tek arka kamera (wide, 4K) ile kayıt yapılır,
 * post-processing aşamasında FFmpeg ile portrait ve landscape çıktılar üretilir.
 */

import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
  Platform,
} from 'react-native';
import {
  Camera,
  useCameraDevices,
  useCameraPermission,
  useMicrophonePermission,
  useCameraFormat,
  VideoFile,
} from 'react-native-vision-camera';
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

// ─────────────────────────────────────────────
//  Yardımcı: saniyeyi HH:MM:SS'e çevir
// ─────────────────────────────────────────────
function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return [hrs, mins, secs]
    .map((v) => v.toString().padStart(2, '0'))
    .join(':');
}

// ─────────────────────────────────────────────
//  Ana Ekran
// ─────────────────────────────────────────────
export default function CameraScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const navigationState = useRootNavigationState();

  // Vision Camera izinleri
  const { hasPermission: hasCamPerm, requestPermission: requestCam } =
    useCameraPermission();
  const { hasPermission: hasMicPerm, requestPermission: requestMic } =
    useMicrophonePermission();
  const [mediaPermission, requestMedia] = MediaLibrary.usePermissions();

  // Cihaz listesi – Vision Camera tüm fiziksel lensleri ayırır
  const devices = useCameraDevices();

  // Yalnızca arka wide lens kullanılır (Gereksinim 1.1, 1.3, 1.4)
  const wideDevice = devices.find(
    (d) => d.position === 'back' && !d.physicalDevices?.includes('ultra-wide-angle-camera')
  ) ?? devices.find((d) => d.position === 'back') ?? null;

  // Kamera referansı
  const mainCameraRef = useRef<Camera>(null);

  // Ayarlar & depolama
  const { settings, setMode, formatLabel } = useCameraSettings();
  const { storageText, storageColor, recordingTimeMinutes } = useStorage(
    settings.resolution,
    settings.frameRate,
    settings.mode
  );

  // UI state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [torchEnabled, setTorchEnabled] = useState(false);

  // Aktif cihaz: her zaman arka wide lens (Gereksinim 1.1, 1.3, 1.4)
  const mainDevice = wideDevice;

  // Format seçimi: Dual modda 4K tercih et (kırpma kalitesi için)
  const format = useCameraFormat(mainDevice || undefined, [
    { videoResolution: settings.mode === 'dual' ? { width: 3840, height: 2160 } :
                       settings.resolution === '4K' ? { width: 3840, height: 2160 } :
                       { width: 1920, height: 1080 } },
    { fps: settings.frameRate }
  ]);

  // Kayıt sonuçlarını ref ile tut – closure sorununu önler
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

  // ── Animasyonlar ──────────────────────────
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const timerOpacity = useRef(new Animated.Value(0)).current;
  const dotOpacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(dotOpacity, {
            toValue: 0.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(dotOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      dotOpacity.setValue(1);
    }
  }, [isRecording, dotOpacity]);

  // Timer göster / gizle
  useEffect(() => {
    Animated.timing(timerOpacity, {
      toValue: isRecording ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isRecording, timerOpacity]);

  // ── İzin kontrolü ─────────────────────────
  useEffect(() => {
    if (!navigationState?.key) return;

    const check = async () => {
      if (hasCamPerm === undefined || hasMicPerm === undefined) return;

      if (!hasCamPerm) await requestCam();
      if (!hasMicPerm) await requestMic();
      if (!mediaPermission?.granted) await requestMedia();

      if (!hasCamPerm || !hasMicPerm || !mediaPermission?.granted) {
        router.replace('/permissions');
      }
    };
    void check();
  }, [
    hasCamPerm,
    hasMicPerm,
    mediaPermission,
    navigationState?.key,
    requestCam,
    requestMic,
    requestMedia,
    router,
  ]);

  // ── Kayıt durdur ──────────────────────────
  const handleStopRecording = useCallback(async () => {
    try {
      setIsRecording(false);
      pulseAnim.setValue(1);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await mainCameraRef.current?.stopRecording();
    } catch (err) {
      console.warn('stopRecording error:', err);
      setIsRecording(false);
    }
  }, [pulseAnim]);

  // ── Kayıt başlat ──────────────────────────
  const handleStartRecording = useCallback(async () => {
    if (recordingTimeMinutes < 1) {
      Alert.alert('Depolama Dolu', 'Video kaydetmek için yeterli alan yok.');
      return;
    }
    if (!mainDevice) {
      Alert.alert('Kamera Hatası', 'Kamera cihazı bulunamadı.');
      return;
    }

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      setIsRecording(true);
      setRecordingDuration(0);

      // Nabız animasyonu
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.06,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }),
        ])
      ).start();

      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, '')
        .slice(0, 15);
      const ext = settings.format;

      mainCameraRef.current?.startRecording({
        fileType: ext as 'mov' | 'mp4',
        onRecordingFinished: (video: VideoFile) => {
          const recordings: RecordingInfo[] = [];

          if (settings.mode === 'dual') {
            // Dual modda: Tek dosyadan iki kopya üretileceğini işaretle
            recordings.push({
              uri: video.path,
              filename: `DualShot_${timestamp}_original.${ext}`,
              duration: recordingDurationRef.current,
              aspectRatio: '9:16',
            });
          } else {
            // Single modda: wide lens
            recordings.push({
              uri: video.path,
              filename: `DualShot_${timestamp}_wide.${ext}`,
              duration: recordingDurationRef.current,
              aspectRatio: '9:16',
            });
          }

          router.push({
            pathname: '/post-recording',
            params: {
              recordings: JSON.stringify(recordings),
              duration: recordingDurationRef.current.toString(),
              mode: settings.mode,
            },
          });
        },
        onRecordingError: (err) => {
          console.warn('Camera recording error:', err);
          setIsRecording(false);
        },
      });
    } catch (err) {
      console.warn('startRecording error:', err);
      setIsRecording(false);
    }
  }, [
    recordingTimeMinutes,
    mainDevice,
    settings.mode,
    settings.format,
    pulseAnim,
    router,
  ]);

  // ── Toggle ────────────────────────────────
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

  // Dual mod artık her cihazda destekleniyor (smart crop yaklaşımı)
  const handleModeChange = useCallback(
    (mode: 'dual' | 'single') => {
      if (isRecording) return;
      setMode(mode);
      if (mode === 'dual') {
        setTorchEnabled(false);
      }
    },
    [setMode, isRecording]
  );

  // ── Render ────────────────────────────────
  if (!mainDevice) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Kamera başlatılıyor…</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />

      {/* ── Kamera Önizleme Katmanı ── */}
      <View style={styles.cameraLayer}>
        {/* Ana kamera – her zaman tam ekran, PORTRAIT, zoom=1 (Gereksinim 2.2) */}
        <Camera
          ref={mainCameraRef}
          style={StyleSheet.absoluteFill}
          device={mainDevice}
          format={format}
          isActive={true}
          video={true}
          audio={true}
          torch={torchEnabled ? 'on' : 'off'}
          videoStabilizationMode="auto"
          zoom={1}
        />

        {/* PiP Rehberi – sadece dual modda, görsel bir kutu olarak kalır */}
        {settings.mode === 'dual' && (
          <View style={styles.pipContainer}>
            <View style={styles.pipWrapper}>
              <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>16:9 CROP AREA</Text>
              </View>
              <View style={styles.pipBadge}>
                <Text style={styles.pipBadgeText}>SMART CROP</Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* ── Üst Bar ── */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        {/* Torch butonu */}
        <TouchableOpacity
          style={[
            styles.iconButton,
            torchEnabled && styles.iconButtonActive,
          ]}
          onPress={toggleTorch}
          activeOpacity={0.7}
        >
          <Text style={styles.iconText}>🔦</Text>
        </TouchableOpacity>

        {/* Timer */}
        <Animated.View
          style={[styles.timerContainer, { opacity: timerOpacity }]}
        >
          <Animated.View
            style={[styles.recDot, { opacity: dotOpacity }]}
          />
          <Text style={styles.timerText}>
            {formatDuration(recordingDuration)}
          </Text>
        </Animated.View>

        {/* Ayarlar */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setShowSettings(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.iconText}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* ── Depolama Bilgisi ── */}
      <View style={styles.storageRow}>
        <Text style={[styles.storageText, { color: storageColor }]}>
          {storageText}
        </Text>
      </View>

      {/* ── Format Rozeti ── */}
      <TouchableOpacity
        style={styles.formatBadge}
        onPress={() => setShowSettings(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.formatText}>{formatLabel}</Text>
      </TouchableOpacity>

      {/* ── Mod Seçici ── */}
      {/* dualSupported=true: smart crop yaklaşımıyla her cihazda destekleniyor (Gereksinim 1.3) */}
      <ModeSelector
        mode={settings.mode}
        onChange={handleModeChange}
        dualSupported={true}
      />

      {/* ── Alt Kontroller ── */}
      <View style={styles.bottomControls}>
        {/* Sol taraf: flip butonu kaldırıldı, simetrik layout için boş View (Gereksinim 1.2) */}
        <View style={styles.sideButton} />

        {/* Kayıt Butonu */}
        <RecordButton
          isRecording={isRecording}
          onPress={toggleRecord}
          pulseAnim={pulseAnim}
        />

        {/* Sağ taraf hizalama boşluğu */}
        <View style={styles.sideButton} />
      </View>

      {/* ── Ayarlar Sayfası ── */}
      <SettingsSheet
        visible={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────
//  Stiller
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },

  // Kamera katmanı
  cameraLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },

  // PiP (Picture-in-Picture) – yatay 16:9 küçük pencere
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 10,
  },
  pipBadge: {
    position: 'absolute',
    bottom: 5,
    right: 7,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  pipBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
  },

  // Üst bar
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
  iconText: {
    fontSize: 20,
  },

  // Timer
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 8,
  },
  recDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
  },
  timerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },

  // Depolama
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

  // Format rozeti
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
  formatText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },

  // Alt kontroller
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
