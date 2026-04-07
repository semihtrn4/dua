import React, { useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';
import { useCameraSettings } from '@/hooks/useCameraSettings';
import { useStorage } from '@/hooks/useStorage';
import type { Resolution, FrameRate, FileFormat } from '@/types/camera';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SettingsSheetProps {
  visible: boolean;
  onClose: () => void;
}

export function SettingsSheet({ visible, onClose }: SettingsSheetProps) {
  const { settings, setResolution, setFrameRate, setFormat } = useCameraSettings();
  const { freeSpace, totalSpace, formatBytes } = useStorage(settings.resolution, settings.frameRate, settings.mode);
  
  const slideAnim = React.useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = React.useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, backdropOpacity]);
  
  const handleClose = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  }, [onClose]);
  
  const handleResolutionChange = useCallback((res: Resolution) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (res === '4K' && settings.frameRate === 60) {
      Alert.alert(
        'Performance Warning',
        '4K at 60fps may not be supported on all devices. The app will fall back to 30fps if needed.',
        [{ text: 'OK' }]
      );
    }
    setResolution(res);
  }, [setResolution, settings.frameRate]);
  
  const handleFrameRateChange = useCallback((fps: FrameRate) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (fps === 60 && settings.resolution === '4K') {
      Alert.alert(
        'Performance Warning',
        '4K at 60fps may not be supported on all devices. The app will fall back to 30fps if needed.',
        [{ text: 'OK' }]
      );
    }
    setFrameRate(fps);
  }, [setFrameRate, settings.resolution]);
  
  const handleFormatChange = useCallback((fmt: FileFormat) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFormat(fmt);
  }, [setFormat]);
  
  const storageUsedPercent = totalSpace > 0 ? ((totalSpace - freeSpace) / totalSpace) * 100 : 0;
  const storageColor = storageUsedPercent > 90 ? Colors.recordRed : 
                       storageUsedPercent > 75 ? Colors.warningOrange : 
                       Colors.successGreen;
  
  const getBitrateEstimate = () => {
    const baseBitrate = settings.resolution === '4K' ? 400 : 220;
    const fpsMultiplier = settings.frameRate === 60 ? 1.6 : settings.frameRate === 24 ? 0.9 : 1;
    return Math.round(baseBitrate * fpsMultiplier);
  };
  
  if (!visible) return null;
  
  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={handleClose}
    >
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
        <TouchableOpacity style={styles.backdropTouch} onPress={handleClose} activeOpacity={1} />
      </Animated.View>
      
      <Animated.View 
        style={[
          styles.sheet,
          { transform: [{ translateY: slideAnim }] }
        ]}
      >
        <View style={styles.handle} />
        
        <Text style={styles.title}>Camera Settings</Text>
        
        {/* Resolution */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Resolution</Text>
          <View style={styles.segmentedControl}>
            {(['1080p', '4K'] as Resolution[]).map((res) => (
              <TouchableOpacity
                key={res}
                style={[
                  styles.segmentButton,
                  settings.resolution === res && styles.segmentButtonActive,
                ]}
                onPress={() => handleResolutionChange(res)}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.segmentText,
                  settings.resolution === res && styles.segmentTextActive,
                ]}>
                  {res}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Frame Rate */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Frame Rate</Text>
          <View style={styles.segmentedControl}>
            {([24, 30, 60] as FrameRate[]).map((fps) => (
              <TouchableOpacity
                key={fps}
                style={[
                  styles.segmentButton,
                  settings.frameRate === fps && styles.segmentButtonActive,
                ]}
                onPress={() => handleFrameRateChange(fps)}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.segmentText,
                  settings.frameRate === fps && styles.segmentTextActive,
                ]}>
                  {fps}fps
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* File Format */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>File Format</Text>
          <View style={styles.formatRow}>
            {(['mov', 'mp4'] as FileFormat[]).map((fmt) => (
              <TouchableOpacity
                key={fmt}
                style={[
                  styles.formatButton,
                  settings.format === fmt && styles.formatButtonActive,
                ]}
                onPress={() => handleFormatChange(fmt)}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.formatButtonText,
                  settings.format === fmt && styles.formatButtonTextActive,
                ]}>
                  {fmt.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Recording Info</Text>
          <Text style={styles.infoText}>
            Dual mode saves 2 files per recording — portrait (9:16) + landscape (16:9)
          </Text>
          <Text style={styles.infoText}>
            Single mode saves 1 file
          </Text>
        </View>
        
        {/* Storage Estimate */}
        <View style={styles.storageSection}>
          <View style={styles.storageHeader}>
            <Text style={styles.storageLabel}>Storage</Text>
            <Text style={styles.storageEstimate}>
              At {settings.resolution}·{settings.frameRate}fps ≈ {getBitrateEstimate()} MB/min
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${storageUsedPercent}%`, backgroundColor: storageColor }]} />
          </View>
          <View style={styles.storageDetails}>
            <Text style={styles.storageDetailText}>
              {formatBytes(freeSpace)} free of {formatBytes(totalSpace)}
            </Text>
          </View>
        </View>
        
        {/* Done Button */}
        <TouchableOpacity
          style={styles.doneButton}
          onPress={handleClose}
          activeOpacity={0.8}
        >
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backdropTouch: {
    flex: 1,
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surfaceElevated,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    maxHeight: SCREEN_HEIGHT * 0.85,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: 4,
    gap: 4,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  segmentButtonActive: {
    backgroundColor: Colors.surfaceLight,
  },
  segmentText: {
    color: Colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
  segmentTextActive: {
    color: Colors.textPrimary,
  },
  formatRow: {
    flexDirection: 'row',
    gap: 12,
  },
  formatButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  formatButtonActive: {
    borderColor: Colors.recordRed,
    backgroundColor: `${Colors.recordRed}15`,
  },
  formatButtonText: {
    color: Colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
  formatButtonTextActive: {
    color: Colors.recordRed,
  },
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  infoTitle: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 4,
  },
  storageSection: {
    marginBottom: 20,
  },
  storageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  storageLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  storageEstimate: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: Colors.surface,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  storageDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  storageDetailText: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  doneButton: {
    backgroundColor: Colors.recordRed,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneButtonText: {
    color: Colors.textPrimary,
    fontSize: 17,
    fontWeight: '600',
  },
});
