import React from 'react';
import {
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';

interface RecordButtonProps {
  isRecording: boolean;
  onPress: () => void;
  pulseAnim: Animated.Value;
}

export function RecordButton({ isRecording, onPress, pulseAnim }: RecordButtonProps) {
  const handlePress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      style={styles.container}
      testID="record-button"
    >
      <Animated.View
        style={[
          styles.outerRing,
          isRecording && styles.recordingRing,
          { transform: [{ scale: pulseAnim }] },
        ]}
      >
        <Animated.View
          style={[
            styles.innerCircle,
            isRecording && styles.recordingInner,
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: Colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingRing: {
    borderColor: Colors.recordRed,
  },
  innerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.recordRed,
  },
  recordingInner: {
    width: 30,
    height: 30,
    borderRadius: 6,
    backgroundColor: Colors.recordRedDark,
  },
});
