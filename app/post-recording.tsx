/**
 * PostRecordingScreen
 *
 * Kayıt bittikten sonra:
 * 1. @sheehanmunim/react-native-ffmpeg ile ham videoyu 9:16 ve 16:9 formatına crop eder
 * 2. Her iki dosyayı expo-media-library ile galeriye kaydeder
 * 3. Geçici cache dosyalarını temizler
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  FadeIn,
  FadeInUp,
  ZoomIn,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as MediaLibrary from 'expo-media-library';
import * as Haptics from 'expo-haptics';
import * as FileSystem from 'expo-file-system';
import { FFmpegKit, ReturnCode } from '@sheehanmunim/react-native-ffmpeg';

import { Colors } from '@/constants/colors';
import type { RecordingInfo, FileFormat } from '@/types/camera';
import { buildFilenames, cleanupFiles } from '@/utils/videoProcessor';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ProcessingStatus = 'idle' | 'processing' | 'saving' | 'cleaning' | 'done' | 'error';

// ---------------------------------------------------------------------------
// FFmpeg işleme
// ---------------------------------------------------------------------------

async function processVideo(
  inputUri: string,
  timestamp: number,
  format: FileFormat,
): Promise<{ portrait: RecordingInfo; landscape: RecordingInfo }> {
  const { portraitFilename, landscapeFilename } = buildFilenames(timestamp, format);
  const cacheDir = FileSystem.cacheDirectory!;
  const portraitPath = `${cacheDir}${portraitFilename}`;
  const landscapePath = `${cacheDir}${landscapeFilename}`;

  // Portrait (9:16): crop=ih*9/16:ih — yüksekliği korur, genişliği kırpar
  const portraitCmd = `-i "${inputUri}" -vf "crop=ih*9/16:ih:(iw-ih*9/16)/2:0" -c:v libx264 -crf 23 -preset ultrafast -c:a copy -y "${portraitPath}"`;

  // Landscape (16:9): crop=iw:iw*9/16 — genişliği korur, yüksekliği kırpar
  // 4K (3840x2160): iw=3840, iw*9/16=2160 → 3840x2160 = 16:9 ✓
  const landscapeCmd = `-i "${inputUri}" -vf "crop=iw:iw*9/16:0:(ih-iw*9/16)/2" -c:v libx264 -crf 23 -preset ultrafast -c:a copy -y "${landscapePath}"`;

  // Portrait işleme
  const portraitSession = await FFmpegKit.execute(portraitCmd);
  const portraitCode = await portraitSession.getReturnCode();
  if (!ReturnCode.isSuccess(portraitCode)) {
    const logs = await portraitSession.getAllLogsAsString();
    throw new Error(`Portrait video işleme başarısız oldu. ${logs ?? ''}`);
  }

  // Landscape işleme
  const landscapeSession = await FFmpegKit.execute(landscapeCmd);
  const landscapeCode = await landscapeSession.getReturnCode();
  if (!ReturnCode.isSuccess(landscapeCode)) {
    const logs = await landscapeSession.getAllLogsAsString();
    throw new Error(`Landscape video işleme başarısız oldu. ${logs ?? ''}`);
  }

  return {
    portrait: {
      uri: portraitPath,
      filename: portraitFilename,
      duration: 0,
      aspectRatio: '9:16',
    },
    landscape: {
      uri: landscapePath,
      filename: landscapeFilename,
      duration: 0,
      aspectRatio: '16:9',
    },
  };
}

// ---------------------------------------------------------------------------
// Cache temizliği
// ---------------------------------------------------------------------------

export async function cleanupCacheFiles(uris: string[]): Promise<void> {
  await cleanupFiles(uris, (uri, options) =>
    FileSystem.deleteAsync(uri, options),
  );
}

// ---------------------------------------------------------------------------
// Animated checkmark
// ---------------------------------------------------------------------------

const AnimatedCheckmark = () => {
  const scale = useSharedValue(0);
  useEffect(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 100 });
  }, [scale]);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View style={[styles.checkmarkContainer, animatedStyle]}>
      <View style={styles.checkmarkCircle}>
        <Text style={styles.checkmark}>✓</Text>
      </View>
    </Animated.View>
  );
};

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export default function PostRecordingScreen() {
  const router = useRouter();
  const {
    recordings: recordingsParam,
    duration: durationParam,
    mode,
    format: formatParam,
  } = useLocalSearchParams<{
    recordings: string;
    duration: string;
    mode: string;
    format: string;
  }>();

  const recordings: RecordingInfo[] = recordingsParam ? JSON.parse(recordingsParam) : [];
  const duration = parseInt(durationParam || '0', 10);
  const fileFormat: FileFormat = (formatParam === 'mov' ? 'mov' : 'mp4') as FileFormat;

  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>('idle');
  const [savedCount, setSavedCount] = useState(0);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [processedRecordings, setProcessedRecordings] = useState<RecordingInfo[]>([]);

  const saving = processingStatus !== 'done' && processingStatus !== 'error';
  const processing = processingStatus === 'processing';

  useEffect(() => {
    const processAndSave = async () => {
      const inputUri = recordings[0]?.uri ?? null;
      let portraitPath: string | null = null;
      let landscapePath: string | null = null;

      try {
        setProcessingStatus('processing');
        let finalRecordings: RecordingInfo[] = [];

        if (mode === 'dual' && inputUri) {
          const timestamp = Date.now();
          const result = await processVideo(inputUri, timestamp, fileFormat);

          result.portrait.duration = recordings[0]?.duration ?? duration;
          result.landscape.duration = recordings[0]?.duration ?? duration;

          portraitPath = result.portrait.uri;
          landscapePath = result.landscape.uri;
          finalRecordings = [result.portrait, result.landscape];
        } else {
          // Single mod — doğrudan kaydet
          finalRecordings = [...recordings];
        }

        setProcessedRecordings(finalRecordings);
        setProcessingStatus('saving');

        let count = 0;
        for (const rec of finalRecordings) {
          await MediaLibrary.saveToLibraryAsync(rec.uri);
          count++;
          setSavedCount(count);
        }

        setProcessingStatus('cleaning');
        const toClean: string[] = [];
        if (portraitPath) toClean.push(portraitPath);
        if (landscapePath) toClean.push(landscapePath);
        await cleanupCacheFiles(toClean);

        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setProcessingStatus('done');
      } catch (err) {
        console.warn('Process or Save error:', err);
        const message = err instanceof Error ? err.message : 'Kayıt işlemi başarısız oldu.';
        setSaveError(message);
        setProcessingStatus('error');
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } finally {
        // Ham video + kalan cache dosyalarını temizle
        const toClean: string[] = [];
        if (inputUri && mode === 'dual') toClean.push(inputUri);
        if (portraitPath) toClean.push(portraitPath);
        if (landscapePath) toClean.push(landscapePath);
        await cleanupCacheFiles(toClean);
      }
    };

    void processAndSave();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatDurationStr = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRecordAgain = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.replace('/');
  };

  const handleViewInPhotos = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (Platform.OS === 'ios') void Linking.openURL('photos-redirect://');
  };

  const statusLabel = (): string => {
    switch (processingStatus) {
      case 'processing': return 'Video İşleniyor…';
      case 'saving': return 'Galeriye Kaydediliyor…';
      case 'cleaning': return 'Temizleniyor…';
      default: return 'Kaydediliyor…';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <Animated.View entering={FadeIn.duration(400)} style={styles.successContainer}>
        {saving ? (
          <>
            <ActivityIndicator size="large" color={Colors.recordRed} style={{ marginBottom: 24 }} />
            <Text style={styles.savedText}>{statusLabel()}</Text>
            {processing ? (
              <Text style={styles.durationText}>9:16 ve 16:9 formatları oluşturuluyor…</Text>
            ) : (
              <Text style={styles.durationText}>{savedCount} / {mode === 'dual' ? 2 : 1} dosya</Text>
            )}
          </>
        ) : saveError ? (
          <>
            <View style={[styles.checkmarkCircle, { backgroundColor: Colors.recordRed, marginBottom: 24 }]}>
              <Text style={styles.checkmark}>✕</Text>
            </View>
            <Text style={styles.savedText}>Hata</Text>
            <Text style={[styles.durationText, { color: Colors.recordRed }]}>{saveError}</Text>
          </>
        ) : (
          <>
            <AnimatedCheckmark />
            <Animated.Text entering={FadeInUp.delay(200).duration(400)} style={styles.savedText}>
              Galeriye Kaydedildi ✓
            </Animated.Text>
            <Animated.Text entering={FadeInUp.delay(300).duration(400)} style={styles.durationText}>
              Süre: {formatDurationStr(duration)}
            </Animated.Text>
          </>
        )}
      </Animated.View>

      {!saving && processedRecordings.length > 0 && (
        <Animated.View entering={FadeInUp.delay(400).duration(400)} style={styles.thumbnailsContainer}>
          {processedRecordings.map((recording, index) => (
            <Animated.View
              key={recording.filename}
              entering={ZoomIn.delay(500 + index * 100).duration(300)}
              style={styles.thumbnailCard}
            >
              <View style={styles.thumbnail}>
                <View style={styles.thumbnailPlaceholder}>
                  <Text style={styles.thumbnailIcon}>🎬</Text>
                </View>
                <View style={styles.aspectRatioBadge}>
                  <Text style={styles.aspectRatioText}>{recording.aspectRatio}</Text>
                </View>
              </View>
              <View style={styles.thumbnailInfo}>
                <Text style={styles.aspectRatioLabel}>
                  {recording.aspectRatio === '9:16' ? 'Portrait' : 'Landscape'}
                </Text>
                <Text style={styles.filenameText} numberOfLines={1}>
                  {recording.filename}
                </Text>
              </View>
            </Animated.View>
          ))}
        </Animated.View>
      )}

      {!saving && (
        <Animated.View entering={FadeInUp.delay(600).duration(400)} style={styles.buttonsContainer}>
          {!saveError && (
            <TouchableOpacity style={styles.secondaryButton} onPress={handleViewInPhotos} activeOpacity={0.7}>
              <Text style={styles.secondaryButtonText}>Galeride Görüntüle</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.primaryButton} onPress={handleRecordAgain} activeOpacity={0.7}>
            <Text style={styles.primaryButtonText}>Tekrar Kaydet</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.pureBlack, paddingHorizontal: 24 },
  successContainer: { alignItems: 'center', marginTop: 60, marginBottom: 40 },
  checkmarkContainer: { marginBottom: 24 },
  checkmarkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.successGreen,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.successGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  checkmark: { color: Colors.textPrimary, fontSize: 40, fontWeight: '700' },
  savedText: { color: Colors.textPrimary, fontSize: 26, fontWeight: '700', marginBottom: 8 },
  durationText: { color: Colors.textSecondary, fontSize: 17 },
  thumbnailsContainer: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: 32 },
  thumbnailCard: { alignItems: 'center' },
  thumbnail: {
    width: 140,
    height: 200,
    borderRadius: 12,
    backgroundColor: Colors.surfaceElevated,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbnailPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
  thumbnailIcon: { fontSize: 40, opacity: 0.5 },
  aspectRatioBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  aspectRatioText: { color: Colors.textPrimary, fontSize: 11, fontWeight: '600' },
  thumbnailInfo: { marginTop: 12, alignItems: 'center', maxWidth: 140 },
  aspectRatioLabel: { color: Colors.textPrimary, fontSize: 14, fontWeight: '600', marginBottom: 4 },
  filenameText: { color: Colors.textMuted, fontSize: 11 },
  buttonsContainer: { gap: 12 },
  primaryButton: {
    backgroundColor: Colors.recordRed,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: { color: Colors.textPrimary, fontSize: 17, fontWeight: '600' },
  secondaryButton: {
    backgroundColor: Colors.surfaceElevated,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: { color: Colors.textPrimary, fontSize: 17, fontWeight: '600' },
});
