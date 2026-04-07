export type CameraMode = 'dual' | 'single';
export type CameraFacing = 'front' | 'back';
export type Resolution = '1080p' | '4K';
export type FrameRate = 24 | 30 | 60;
export type FileFormat = 'mov' | 'mp4';
export type LensType = 'wide';

export interface CameraSettings {
  mode: CameraMode;
  resolution: Resolution;
  frameRate: FrameRate;
  format: FileFormat;
  lens: LensType;
}

export interface RecordingInfo {
  uri: string;
  filename: string;
  duration: number;
  aspectRatio: '9:16' | '16:9';
  thumbnail?: string;
}

export interface StorageInfo {
  freeSpace: number;
  totalSpace: number;
  recordingTimeMinutes: number;
}

export interface PermissionStatus {
  camera: 'granted' | 'denied' | 'undetermined';
  microphone: 'granted' | 'denied' | 'undetermined';
  mediaLibrary: 'granted' | 'denied' | 'undetermined';
}
