/**
 * Unit Tests for VideoProcessor helpers
 * Feature: dual-orientation-video-recorder
 *
 * Validates: Requirements 4.1, 5.1, 8.1, 3.4
 */

import {
  buildFFmpegCommands,
  buildFilenames,
  buildOutputPaths,
} from '../../utils/videoProcessor';

const MOCK_CACHE_DIR = 'file:///mock/cache/';

describe('VideoProcessor — FFmpeg komut doğruluğu', () => {
  const INPUT = 'file:///input/video.mp4';
  const TIMESTAMP = 1700000000000;

  it('portrait FFmpeg komutu crop=ih*9/16:ih içermeli (Gereksinim 4.1)', () => {
    const { portraitCmd } = buildFFmpegCommands(INPUT, TIMESTAMP, 'mp4', MOCK_CACHE_DIR);
    expect(portraitCmd).toContain('crop=ih*9/16:ih');
  });

  it('landscape FFmpeg komutu crop=iw:iw*9/16 içermeli (Gereksinim 5.1)', () => {
    const { landscapeCmd } = buildFFmpegCommands(INPUT, TIMESTAMP, 'mp4', MOCK_CACHE_DIR);
    expect(landscapeCmd).toContain('crop=iw:iw*9/16');
  });

  it('portrait komutu -c:v libx264 -crf 23 -preset ultrafast içermeli', () => {
    const { portraitCmd } = buildFFmpegCommands(INPUT, TIMESTAMP, 'mp4', MOCK_CACHE_DIR);
    expect(portraitCmd).toContain('-c:v libx264 -crf 23 -preset ultrafast');
  });

  it('landscape komutu -c:v libx264 -crf 23 -preset ultrafast içermeli', () => {
    const { landscapeCmd } = buildFFmpegCommands(INPUT, TIMESTAMP, 'mp4', MOCK_CACHE_DIR);
    expect(landscapeCmd).toContain('-c:v libx264 -crf 23 -preset ultrafast');
  });

  it('portrait komutu doğru çıktı yolunu içermeli', () => {
    const { portraitCmd } = buildFFmpegCommands(INPUT, TIMESTAMP, 'mp4', MOCK_CACHE_DIR);
    const { portraitPath } = buildOutputPaths(TIMESTAMP, 'mp4', MOCK_CACHE_DIR);
    expect(portraitCmd).toContain(portraitPath);
  });

  it('landscape komutu doğru çıktı yolunu içermeli', () => {
    const { landscapeCmd } = buildFFmpegCommands(INPUT, TIMESTAMP, 'mp4', MOCK_CACHE_DIR);
    const { landscapePath } = buildOutputPaths(TIMESTAMP, 'mp4', MOCK_CACHE_DIR);
    expect(landscapeCmd).toContain(landscapePath);
  });
});

describe('VideoProcessor — Dosya adlandırma', () => {
  it('portrait dosya adı DualShot_{timestamp}_portrait.mp4 formatında olmalı', () => {
    const { portraitFilename } = buildFilenames(1700000000000, 'mp4');
    expect(portraitFilename).toBe('DualShot_1700000000000_portrait.mp4');
  });

  it('landscape dosya adı DualShot_{timestamp}_landscape.mov formatında olmalı', () => {
    const { landscapeFilename } = buildFilenames(1700000000000, 'mov');
    expect(landscapeFilename).toBe('DualShot_1700000000000_landscape.mov');
  });

  it('portrait ve landscape yolları cacheDirectory ile başlamalı (Gereksinim 3.3)', () => {
    const { portraitPath, landscapePath } = buildOutputPaths(1700000000000, 'mp4', MOCK_CACHE_DIR);
    expect(portraitPath.startsWith(MOCK_CACHE_DIR)).toBe(true);
    expect(landscapePath.startsWith(MOCK_CACHE_DIR)).toBe(true);
  });
});

describe('VideoProcessor — cleanupCacheFiles (Gereksinim 3.4, 6.5)', () => {
  it('her URI için deleteAsync çağrılmalı', async () => {
    const { cleanupFiles } = await import('../../utils/videoProcessor');
    const mockDelete = jest.fn().mockResolvedValue(undefined);
    const uris = ['file:///cache/a.mp4', 'file:///cache/b.mp4'];
    await cleanupFiles(uris, mockDelete);
    expect(mockDelete).toHaveBeenCalledTimes(2);
    expect(mockDelete).toHaveBeenCalledWith('file:///cache/a.mp4', { idempotent: true });
    expect(mockDelete).toHaveBeenCalledWith('file:///cache/b.mp4', { idempotent: true });
  });

  it('deleteAsync hata fırlatırsa console.warn çağrılmalı, hata yayılmamalı', async () => {
    const { cleanupFiles } = await import('../../utils/videoProcessor');
    const mockDelete = jest.fn().mockRejectedValueOnce(new Error('disk error'));
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    await expect(cleanupFiles(['file:///cache/fail.mp4'], mockDelete)).resolves.toBeUndefined();
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('boş liste ile çağrıldığında deleteAsync çağrılmamalı', async () => {
    const { cleanupFiles } = await import('../../utils/videoProcessor');
    const mockDelete = jest.fn();
    await cleanupFiles([], mockDelete);
    expect(mockDelete).not.toHaveBeenCalled();
  });
});
