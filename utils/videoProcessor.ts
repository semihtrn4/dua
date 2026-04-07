/**
 * Pure utility functions for video processing.
 * These are extracted from app/post-recording.tsx so they can be tested
 * without React Native / Expo runtime dependencies.
 */

import type { FileFormat, RecordingInfo } from '@/types/camera';

// ---------------------------------------------------------------------------
// File naming helpers
// ---------------------------------------------------------------------------

export function buildFilenames(timestamp: number, format: FileFormat) {
  return {
    portraitFilename: `DualShot_${timestamp}_portrait.${format}`,
    landscapeFilename: `DualShot_${timestamp}_landscape.${format}`,
  };
}

export function buildOutputPaths(
  timestamp: number,
  format: FileFormat,
  cacheDirectory: string,
) {
  const { portraitFilename, landscapeFilename } = buildFilenames(timestamp, format);
  return {
    portraitPath: `${cacheDirectory}${portraitFilename}`,
    landscapePath: `${cacheDirectory}${landscapeFilename}`,
  };
}

export function buildFFmpegCommands(
  inputUri: string,
  timestamp: number,
  format: FileFormat,
  cacheDirectory: string,
) {
  const { portraitPath, landscapePath } = buildOutputPaths(timestamp, format, cacheDirectory);
  return {
    // Portrait (9:16): yüksekliği korur, genişliği ortadan kırpar
    portraitCmd: `-i "${inputUri}" -vf "crop=ih*9/16:ih:(iw-ih*9/16)/2:0" -c:v libx264 -crf 23 -preset ultrafast -c:a copy -y "${portraitPath}"`,
    // Landscape (16:9): genişliği korur, yüksekliği ortadan kırpar
    // 4K (3840x2160): iw=3840, iw*9/16=2160 → 3840x2160 = 16:9 ✓
    landscapeCmd: `-i "${inputUri}" -vf "crop=iw:iw*9/16:0:(ih-iw*9/16)/2" -c:v libx264 -crf 23 -preset ultrafast -c:a copy -y "${landscapePath}"`,
  };
}

export function buildRecordingsList(
  uri: string,
  mode: string,
  timestamp: number,
  format: FileFormat,
  cacheDirectory: string,
  duration = 0,
): RecordingInfo[] {
  if (mode !== 'dual') {
    return [
      {
        uri,
        filename: `DualShot_${timestamp}_single.${format}`,
        duration,
        aspectRatio: '9:16',
      },
    ];
  }
  const { portraitFilename, landscapeFilename } = buildFilenames(timestamp, format);
  const { portraitPath, landscapePath } = buildOutputPaths(timestamp, format, cacheDirectory);
  return [
    { uri: portraitPath, filename: portraitFilename, duration, aspectRatio: '9:16' },
    { uri: landscapePath, filename: landscapeFilename, duration, aspectRatio: '16:9' },
  ];
}

// ---------------------------------------------------------------------------
// Cleanup helper — accepts a deleteAsync function so it can be tested without
// importing expo-file-system directly.
// ---------------------------------------------------------------------------

export async function cleanupFiles(
  uris: string[],
  deleteAsync: (uri: string, options: { idempotent: boolean }) => Promise<void>,
): Promise<void> {
  for (const uri of uris) {
    try {
      await deleteAsync(uri, { idempotent: true });
    } catch (err) {
      console.warn(`Cache dosyası silinemedi: ${uri}`, err);
    }
  }
}
