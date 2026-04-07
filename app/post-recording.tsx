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
import * as FileSystem from 'expo-file-system/legacy';
import { FFmpegKit, ReturnCode } from 'ffmpeg-kit-react-native';

import { Colors } from '@/constants/colors';
import type { RecordingInfo } from '@/types/camera';

const AnimatedCheckmark = () => {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 100 });
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.checkmarkContainer, animatedStyle]}>
      <View style={styles.checkmarkCircle}>
        <Text style={styles.checkmark}>✓</Text>
      </View>
    </Animated.View>
  );
};

export default function PostRecordingScreen() {
  const router = useRouter();
  const { recordings: recordingsParam, duration: durationParam } = useLocalSearchParams<{
    recordings: string;
    duration: string;
  }>();

  const recordings: RecordingInfo[] = recordingsParam ? JSON.parse(recordingsParam) : [];
  const duration = parseInt(durationParam || '0', 10);

  const [saving, setSaving] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [processedRecordings, setProcessedRecordings] = useState<RecordingInfo[]>([]);

  const mode = useLocalSearchParams<{ mode: string }>().mode;

  // Kayıtları işle ve Photos'a kaydet
  useEffect(() => {
    const processAndSave = async () => {
      try {
        setSaving(true);
        let finalRecordings = [...recordings];

        if (mode === 'dual' && recordings.length > 0) {
          setProcessing(true);
          const original = recordings[0];
          const timestamp = new Date().getTime();
          const portraitPath = `${FileSystem.cacheDirectory}DualShot_${timestamp}_916.mp4`;
          const landscapePath = `${FileSystem.cacheDirectory}DualShot_${timestamp}_169.mp4`;

          // FFmpeg Komutları (9:16 ve 16:9 crop)
          // 9:16 için merkeze odaklanır
          const portraitCmd = `-i ${original.uri} -vf "crop=ih*9/16:ih" -c:v libx264 -crf 23 -preset ultrafast -y ${portraitPath}`;
          // 16:9 zaten orijinal olabilir ama garantiye alıyoruz
          const landscapeCmd = `-i ${original.uri} -vf "crop=iw:iw*9/16" -c:v libx264 -crf 23 -preset ultrafast -y ${landscapePath}`;

          console.log('Running FFmpeg for Portrait...');
          const session916 = await FFmpegKit.execute(portraitCmd);
          const returnCode916 = await session916.getReturnCode();

          console.log('Running FFmpeg for Landscape...');
          const session169 = await FFmpegKit.execute(landscapeCmd);
          const returnCode169 = await session169.getReturnCode();

          if (ReturnCode.isSuccess(returnCode916) && ReturnCode.isSuccess(returnCode169)) {
            finalRecordings = [
              {
                uri: portraitPath,
                filename: `DualShot_${timestamp}_portrait.mp4`,
                duration: original.duration,
                aspectRatio: '9:16',
              },
              {
                uri: landscapePath,
                filename: `DualShot_${timestamp}_landscape.mp4`,
                duration: original.duration,
                aspectRatio: '16:9',
              }
            ];
          } else {
            throw new Error('Video işleme başarısız oldu.');
          }
          setProcessing(false);
        }

        setProcessedRecordings(finalRecordings);

        let count = 0;
        for (const rec of finalRecordings) {
          await MediaLibrary.saveToLibraryAsync(rec.uri);
          count++;
          setSavedCount(count);
        }
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (err) {
        console.warn('Process or Save error:', err);
        setSaveError('Kayıt işlemi başarısız oldu.');
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } finally {
        setSaving(false);
        setProcessing(false);
      }
    };
    void processAndSave();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatDuration = (seconds: number): string => {
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
    if (Platform.OS === 'ios') {
      void Linking.openURL('photos-redirect://');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Kaydetme durumu */}
      <Animated.View entering={FadeIn.duration(400)} style={styles.successContainer}>
        {saving ? (
          <>
            <ActivityIndicator size="large" color={Colors.recordRed} style={{ marginBottom: 24 }} />
            <Text style={styles.savedText}>{processing ? 'Video İşleniyor…' : 'Kaydediliyor…'}</Text>
            {processing ? (
              <Text style={styles.durationText}>Akıllı kırpma (9:16 & 16:9) uygulanıyor</Text>
            ) : (
              <Text style={styles.durationText}>{savedCount} / {recordings.length} dosya</Text>
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
              Photos'a Kaydedildi ✓
            </Animated.Text>
            <Animated.Text entering={FadeInUp.delay(300).duration(400)} style={styles.durationText}>
              Süre: {formatDuration(duration)}
            </Animated.Text>
          </>
        )}
      </Animated.View>

      {/* Kayıt kartları */}
      {!saving && (
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

      {/* Butonlar */}
      {!saving && (
        <Animated.View entering={FadeInUp.delay(600).duration(400)} style={styles.buttonsContainer}>
          {!saveError && (
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleViewInPhotos}
              activeOpacity={0.7}
            >
              <Text style={styles.secondaryButtonText}>Photos'ta Görüntüle</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleRecordAgain}
            activeOpacity={0.7}
          >
            <Text style={styles.primaryButtonText}>Tekrar Kaydet</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.pureBlack,
    paddingHorizontal: 24,
  },
  successContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  checkmarkContainer: {
    marginBottom: 24,
  },
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
  checkmark: {
    color: Colors.textPrimary,
    fontSize: 40,
    fontWeight: '700',
  },
  savedText: {
    color: Colors.textPrimary,
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 8,
  },
  durationText: {
    color: Colors.textSecondary,
    fontSize: 17,
  },
  thumbnailsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 32,
  },
  thumbnailCard: {
    alignItems: 'center',
  },
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
  thumbnailIcon: {
    fontSize: 40,
    opacity: 0.5,
  },
  aspectRatioBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  aspectRatioText: {
    color: Colors.textPrimary,
    fontSize: 11,
    fontWeight: '600',
  },
  thumbnailInfo: {
    marginTop: 12,
    alignItems: 'center',
    maxWidth: 140,
  },
  aspectRatioLabel: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  filenameText: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  buttonsContainer: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: Colors.recordRed,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: Colors.textPrimary,
    fontSize: 17,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: Colors.surfaceElevated,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: Colors.textPrimary,
    fontSize: 17,
    fontWeight: '600',
  },
});
