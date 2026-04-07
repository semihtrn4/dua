import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';
import type { LensType } from '@/types/camera';

interface LensSelectorProps {
  lens: LensType;
  onChange: (lens: LensType) => void;
}

const LENS_OPTIONS: { type: LensType; label: string; multiplier: string }[] = [
  { type: 'ultrawide', label: 'Ultra Wide', multiplier: '0.5x' },
  { type: 'wide', label: 'Wide', multiplier: '1x' },
  { type: 'telephoto', label: 'Tele', multiplier: '2x' },
];

export function LensSelector({ lens, onChange }: LensSelectorProps) {
  const handlePress = (newLens: LensType) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onChange(newLens);
  };

  return (
    <View style={styles.container}>
      {LENS_OPTIONS.map((option) => (
        <TouchableOpacity
          key={option.type}
          style={[
            styles.lensButton,
            lens === option.type && styles.activeLens,
          ]}
          onPress={() => handlePress(option.type)}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.multiplierText,
            lens === option.type && styles.activeText,
          ]}>
            {option.multiplier}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 200,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 12,
    zIndex: 10,
  },
  lensButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeLens: {
    backgroundColor: Colors.surfaceElevated,
    borderColor: Colors.textPrimary,
  },
  multiplierText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  activeText: {
    color: Colors.textPrimary,
  },
});
