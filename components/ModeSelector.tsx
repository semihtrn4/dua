import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';

type CameraMode = 'dual' | 'single';

interface ModeSelectorProps {
  mode: CameraMode;
  onChange: (mode: CameraMode) => void;
  dualSupported: boolean;
}

export function ModeSelector({ mode, onChange, dualSupported }: ModeSelectorProps) {
  const handlePress = (newMode: CameraMode) => {
    if (newMode === 'dual' && !dualSupported) {
      return;
    }
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onChange(newMode);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          mode === 'dual' && styles.activeButton,
          !dualSupported && styles.disabledButton,
        ]}
        onPress={() => handlePress('dual')}
        activeOpacity={dualSupported ? 0.7 : 1}
        disabled={!dualSupported}
      >
        <Text style={[
          styles.buttonText,
          mode === 'dual' && styles.activeText,
          !dualSupported && styles.disabledText,
        ]}>
          Dual Cam
        </Text>
        {!dualSupported && (
          <Text style={styles.lockIcon}>🔒</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.button,
          mode === 'single' && styles.activeButton,
        ]}
        onPress={() => handlePress('single')}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.buttonText,
          mode === 'single' && styles.activeText,
        ]}>
          Single Cam
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 140,
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 24,
    padding: 4,
    zIndex: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  activeButton: {
    backgroundColor: Colors.surfaceLight,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  activeText: {
    color: Colors.textPrimary,
  },
  disabledText: {
    color: Colors.textMuted,
  },
  lockIcon: {
    fontSize: 10,
    marginLeft: 4,
  },
});
