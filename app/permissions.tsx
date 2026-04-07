import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  Camera,
  useCameraPermission,
  useMicrophonePermission,
} from 'react-native-vision-camera';
import * as MediaLibrary from 'expo-media-library';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { Colors } from '@/constants/colors';

interface PermissionCardProps {
  icon: string;
  title: string;
  description: string;
  status: 'granted' | 'denied' | 'undetermined';
  onAllow: () => void;
  onOpenSettings?: () => void;
}

function PermissionCard({ icon, title, description, status, onAllow, onOpenSettings }: PermissionCardProps) {
  return (
    <Animated.View entering={FadeInUp.duration(400)} style={styles.card}>
      <View style={styles.cardIconContainer}>
        <Text style={styles.cardIcon}>{icon}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
      </View>
      <View style={styles.cardAction}>
        {status === 'granted' ? (
          <View style={styles.grantedBadge}>
            <Text style={styles.grantedText}>✓</Text>
          </View>
        ) : status === 'denied' ? (
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={onOpenSettings}
            activeOpacity={0.7}
          >
            <Text style={styles.settingsButtonText}>Settings</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.allowButton}
            onPress={onAllow}
            activeOpacity={0.7}
          >
            <Text style={styles.allowButtonText}>Allow</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}

export default function PermissionsScreen() {
  const router = useRouter();

  // Vision Camera izinleri
  const { hasPermission: hasCamPerm, requestPermission: requestCam } = useCameraPermission();
  const { hasPermission: hasMicPerm, requestPermission: requestMic } = useMicrophonePermission();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();

  const toStatus = (granted: boolean, canAsk: boolean): 'granted' | 'denied' | 'undetermined' => {
    if (granted) return 'granted';
    return canAsk ? 'undetermined' : 'denied';
  };

  const cameraStatus = toStatus(hasCamPerm, !hasCamPerm);
  const micStatus = toStatus(hasMicPerm, !hasMicPerm);
  const mediaStatus: 'granted' | 'denied' | 'undetermined' = mediaPermission
    ? mediaPermission.granted
      ? 'granted'
      : mediaPermission.canAskAgain
      ? 'undetermined'
      : 'denied'
    : 'undetermined';

  // Tümü verilince ana ekrana geç
  useEffect(() => {
    if (hasCamPerm && hasMicPerm && mediaPermission?.granted) {
      setTimeout(() => router.replace('/'), 500);
    }
  }, [hasCamPerm, hasMicPerm, mediaPermission, router]);

  const handleCameraAllow = async () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await requestCam();
  };

  const handleMicAllow = async () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await requestMic();
  };

  const handleMediaAllow = async () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await requestMediaPermission();
  };

  const openSettings = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    void Linking.openSettings();
  };

  const allGranted = hasCamPerm && hasMicPerm && mediaPermission?.granted;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.title}>DualShot Recorder</Text>
        <Text style={styles.subtitle}>Before we begin, we need a few permissions</Text>
      </View>

      <View style={styles.cardsContainer}>
        <PermissionCard
          icon="📷"
          title="Camera"
          description="To capture video from your camera"
          status={cameraStatus}
          onAllow={handleCameraAllow}
          onOpenSettings={openSettings}
        />
        <PermissionCard
          icon="🎤"
          title="Microphone"
          description="To record audio with your videos"
          status={micStatus}
          onAllow={handleMicAllow}
          onOpenSettings={openSettings}
        />
        <PermissionCard
          icon="🖼️"
          title="Photos"
          description="To save recordings to your library"
          status={mediaStatus}
          onAllow={handleMediaAllow}
          onOpenSettings={openSettings}
        />
      </View>

      {allGranted && (
        <Animated.View entering={FadeInUp.duration(300)} style={styles.successContainer}>
          <Text style={styles.successText}>All permissions granted!</Text>
          <Text style={styles.successSubtext}>Opening camera...</Text>
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
  header: {
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 16,
    lineHeight: 22,
  },
  cardsContainer: {
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 16,
    padding: 16,
    gap: 16,
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIcon: {
    fontSize: 24,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    color: Colors.textPrimary,
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardDescription: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 18,
  },
  cardAction: {
    minWidth: 80,
  },
  allowButton: {
    backgroundColor: Colors.recordRed,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  allowButtonText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  settingsButton: {
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  settingsButtonText: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  grantedBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.successGreen,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  grantedText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  successContainer: {
    marginTop: 32,
    alignItems: 'center',
  },
  successText: {
    color: Colors.successGreen,
    fontSize: 18,
    fontWeight: '600',
  },
  successSubtext: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
});
