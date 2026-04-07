/**
 * Property-Based Tests for VideoProcessor helpers
 * Feature: dual-orientation-video-recorder
 *
 * Validates: Requirements 3.1, 3.2, 3.3, 4.3, 5.3
 */

import * as fc from 'fast-check';
import {
  buildFilenames,
  buildOutputPaths,
  buildRecordingsList,
} from '../../utils/videoProcessor';

const MOCK_CACHE_DIR = 'file:///mock/cache/';

// ---------------------------------------------------------------------------
// Property 3 & 4: Dosya adı format doğruluğu
// Validates: Requirements 4.3, 5.3
// ---------------------------------------------------------------------------
describe('Özellik 3 & 4: Portrait ve Landscape Dosya Adı Formatı', () => {
  /**
   * Validates: Requirements 4.3, 5.3
   */
  it('portrait dosya adı DualShot_{timestamp}_portrait.{format} formatına uymalı', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: Number.MAX_SAFE_INTEGER }),
        fc.constantFrom('mov' as const, 'mp4' as const),
        (timestamp, format) => {
          const { portraitFilename } = buildFilenames(timestamp, format);
          return portraitFilename === `DualShot_${timestamp}_portrait.${format}`;
        },
      ),
      { numRuns: 100 },
    );
  });

  /**
   * Validates: Requirements 4.3, 5.3
   */
  it('landscape dosya adı DualShot_{timestamp}_landscape.{format} formatına uymalı', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: Number.MAX_SAFE_INTEGER }),
        fc.constantFrom('mov' as const, 'mp4' as const),
        (timestamp, format) => {
          const { landscapeFilename } = buildFilenames(timestamp, format);
          return landscapeFilename === `DualShot_${timestamp}_landscape.${format}`;
        },
      ),
      { numRuns: 100 },
    );
  });
});

// ---------------------------------------------------------------------------
// Property 2: Çıktı dosyaları cache dizininde
// Validates: Requirement 3.3
// ---------------------------------------------------------------------------
describe('Özellik 2: Çıktı Dosyaları Cache Dizininde', () => {
  /**
   * Validates: Requirement 3.3
   */
  it("portrait ve landscape URI'leri cacheDirectory ile başlamalı", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1_000_000_000_000, max: 9_999_999_999_999 }),
        fc.constantFrom('mov' as const, 'mp4' as const),
        (timestamp, format) => {
          const { portraitPath, landscapePath } = buildOutputPaths(timestamp, format, MOCK_CACHE_DIR);
          return (
            portraitPath.startsWith(MOCK_CACHE_DIR) &&
            landscapePath.startsWith(MOCK_CACHE_DIR)
          );
        },
      ),
      { numRuns: 100 },
    );
  });
});

// ---------------------------------------------------------------------------
// Property 1: Mod-Dosya Sayısı Tutarlılığı
// Validates: Requirements 3.1, 3.2
// ---------------------------------------------------------------------------
describe('Özellik 1: Mod-Dosya Sayısı Tutarlılığı', () => {
  /**
   * Validates: Requirements 3.1, 3.2
   */
  it('dual modda 2, single modda 1 RecordingInfo döndürülmeli', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('dual', 'single'),
        fc.integer({ min: 1_000_000_000_000, max: 9_999_999_999_999 }),
        fc.constantFrom('mov' as const, 'mp4' as const),
        (mode, timestamp, format) => {
          const result = buildRecordingsList('file:///input.mp4', mode, timestamp, format, MOCK_CACHE_DIR);
          const expected = mode === 'dual' ? 2 : 1;
          return result.length === expected;
        },
      ),
      { numRuns: 100 },
    );
  });

  it("dual modda ilk kayıt 9:16, ikinci kayıt 16:9 aspect ratio'ya sahip olmalı", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1_000_000_000_000, max: 9_999_999_999_999 }),
        fc.constantFrom('mov' as const, 'mp4' as const),
        (timestamp, format) => {
          const result = buildRecordingsList('file:///input.mp4', 'dual', timestamp, format, MOCK_CACHE_DIR);
          return result[0].aspectRatio === '9:16' && result[1].aspectRatio === '16:9';
        },
      ),
      { numRuns: 100 },
    );
  });
});
