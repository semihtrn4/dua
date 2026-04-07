# Uygulama Planı: Dual Orientation Video Recorder

## Genel Bakış

Bu plan, mevcut kamera uygulamasındaki hataları gidererek tek kayıt işlemiyle hem 9:16 portrait hem de 16:9 landscape video üreten özelliği hayata geçirir. Değişiklikler dört ana alanda yoğunlaşır: tip sadeleştirme, ayar kalıcılığı, kamera ekranı temizliği ve FFmpeg işleme düzeltmesi.

## Görevler

- [x] 1. `types/camera.ts` — LensType sadeleştirme
  - `LensType` tipini `'ultrawide' | 'wide' | 'telephoto'` yerine yalnızca `'wide'` olarak güncelle
  - `CameraSettings` arayüzündeki `lens` alanı artık sadece `'wide'` kabul edecek
  - _Gereksinimler: 2.3_

  - [ ]* 1.1 LensType round-trip özellik testi yaz
    - **Özellik 6: Ayarlar Kalıcılığı Round-Trip**
    - `lens: fc.constant('wide')` ile `CameraSettings` nesnesi oluştur, `JSON.stringify → JSON.parse` sonrası eşdeğerlik doğrula
    - **Doğrular: Gereksinim 7.5**

- [x] 2. `hooks/useCameraSettings.ts` — AsyncStorage kalıcılığı
  - `@react-native-async-storage/async-storage` import et
  - `SETTINGS_KEY = '@dualshot/camera-settings'` sabitini tanımla
  - `useEffect` ile uygulama başlangıcında `AsyncStorage.getItem` çağır; başarısız olursa `DEFAULT_SETTINGS` kullan ve `console.warn` ile logla
  - Her `setMode`, `setResolution`, `setFrameRate`, `setFormat` çağrısında `AsyncStorage.setItem` ile yeni ayarı kaydet
  - `setLens` fonksiyonunu kaldır (artık lens sabit `'wide'`)
  - _Gereksinimler: 7.1, 7.2, 7.3, 7.4_

  - [ ]* 2.1 AsyncStorage kalıcılığı birim testleri yaz
    - `AsyncStorage.setItem` çağrısının her ayar değişikliğinde tetiklendiğini doğrula
    - `AsyncStorage` hata fırlatırsa varsayılan ayarların kullanıldığını doğrula
    - Anahtar değerinin `@dualshot/camera-settings` olduğunu doğrula
    - _Gereksinimler: 7.1, 7.2, 7.3, 7.4_

  - [ ]* 2.2 Ayarlar round-trip özellik testi yaz
    - **Özellik 6: Ayarlar Kalıcılığı Round-Trip**
    - `fc.record({ mode, resolution, frameRate, format, lens: fc.constant('wide') })` ile rastgele `CameraSettings` üret
    - `JSON.stringify → JSON.parse` sonrası alan-alan eşdeğerlik doğrula
    - **Doğrular: Gereksinim 7.5**

- [x] 3. `app/index.tsx` — Kamera ekranı temizliği
  - `LensSelector` import ve render'ını tamamen kaldır
  - `useFrontCamera` state ve `flipCamera` fonksiyonunu kaldır; flip butonu UI'dan kaldır
  - `setLens` kullanımını kaldır (artık `useCameraSettings` hook'undan gelmiyor)
  - `settings.lens === 'ultrawide'` dallanmalarını kaldır
  - `mainDevice` seçimini yalnızca `position === 'back'` wide lens olarak sabitle
  - `zoom` prop'unu her zaman `1` olarak sabitle
  - `isDualAvailable` kontrolünü kaldır; dual mod artık fiziksel ikinci kamera gerektirmiyor (smart crop)
  - `handleModeChange` içindeki `isDualAvailable` uyarısını kaldır
  - Single modda da flip butonu gösterme (alt kontroller her iki modda simetrik olacak)
  - _Gereksinimler: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2_

- [x] 4. Kontrol noktası — Tip ve kamera ekranı tutarlılığı
  - Tüm TypeScript hatalarının giderildiğini doğrula (`getDiagnostics` ile kontrol et)
  - `LensSelector` bileşeninin hiçbir yerde import edilmediğini doğrula
  - `zoom={1}` sabitinin `Camera` bileşenine iletildiğini doğrula
  - Kullanıcıya soru varsa sor.

- [x] 5. `app/post-recording.tsx` — FFmpeg landscape crop düzeltmesi ve temizlik mantığı
  - `processVideo` adında ayrı bir async fonksiyon çıkar; imzası: `(inputUri: string, timestamp: number, format: FileFormat) => Promise<{ portrait: RecordingInfo; landscape: RecordingInfo }>`
  - Portrait FFmpeg komutunu doğrula: `-vf "crop=ih*9/16:ih"` (mevcut doğru, değişmeyecek)
  - Landscape FFmpeg komutunu düzelt: `-vf "crop=iw:iw*9/16"` — 4K girişte `iw=3840`, `iw*9/16=2160` → 3840×2160 = 16:9 ✓
  - `ProcessingStatus` tip tanımını ekle: `'idle' | 'processing' | 'saving' | 'cleaning' | 'done' | 'error'`
  - `processAndSave` fonksiyonunu `try-finally` bloğuyla yeniden yaz; `finally` içinde `cleanupCacheFiles` çağır
  - `cleanupCacheFiles(uris: string[]): Promise<void>` fonksiyonunu ekle; `FileSystem.deleteAsync` ile her URI'yi sil, hata olursa `console.warn` ile logla
  - Ham video URI'sini (`recordings[0].uri`) da temizlik listesine ekle
  - Galeri kayıt sonrası portrait ve landscape cache dosyalarını da temizle
  - Hata durumunda Türkçe mesaj göster ve `Haptics.NotificationFeedbackType.Error` çağır
  - _Gereksinimler: 3.1, 3.4, 4.1, 5.1, 6.1, 6.2, 6.3, 6.5, 8.1_

  - [x]* 5.1 Dosya adı format özellik testi yaz
    - **Özellik 3: Portrait Çıktı Doğruluğu** ve **Özellik 4: Landscape Çıktı Doğruluğu**
    - `fc.integer({ min: 0 })` ve `fc.constantFrom('mov', 'mp4')` ile rastgele timestamp/format üret
    - Portrait dosya adının `DualShot_{timestamp}_portrait.{format}` formatına uyduğunu doğrula
    - Landscape dosya adının `DualShot_{timestamp}_landscape.{format}` formatına uyduğunu doğrula
    - **Doğrular: Gereksinim 4.3, 5.3**

  - [x]* 5.2 Cache dizini özellik testi yaz
    - **Özellik 2: Çıktı Dosyaları Cache Dizininde**
    - Üretilen portrait ve landscape URI'lerinin `FileSystem.cacheDirectory` ile başladığını doğrula
    - **Doğrular: Gereksinim 3.3**

  - [x]* 5.3 Mod-dosya sayısı özellik testi yaz
    - **Özellik 1: Mod-Dosya Sayısı Tutarlılığı**
    - Dual modda `buildRecordingsList` fonksiyonunun tam 2 `RecordingInfo` döndürdüğünü doğrula
    - Single modda tam 1 `RecordingInfo` döndürdüğünü doğrula
    - **Doğrular: Gereksinim 3.1, 3.2**

  - [x]* 5.4 VideoProcessor birim testleri yaz
    - Portrait FFmpeg komutunun `crop=ih*9/16:ih` içerdiğini doğrula
    - Landscape FFmpeg komutunun `crop=iw:iw*9/16` içerdiğini doğrula
    - FFmpeg başarısız olduğunda Türkçe hata mesajı döndürdüğünü doğrula
    - İşlem tamamlandığında ham video dosyasının silindiğini doğrula
    - _Gereksinimler: 4.1, 5.1, 8.1, 3.4_

- [x] 6. `hooks/useStorage.ts` — Doğrulama ve renk eşiği kontrolü
  - Mevcut `modeMultiplier = mode === 'dual' ? 2 : 1` mantığının doğru çalıştığını doğrula (değişiklik gerekmiyorsa dokunma)
  - `getStorageColor` fonksiyonunun `minutes < 1 → '#FF3B30'`, `minutes < 5 → '#FF9500'`, `minutes ≥ 5 → '#30D158'` döndürdüğünü doğrula
  - _Gereksinimler: 9.1, 9.2, 9.3, 9.4_

  - [ ]* 6.1 Depolama renk eşiği özellik testi yaz
    - **Özellik 8: Depolama Renk Eşiği Mantığı**
    - `fc.integer({ min: 0, max: 1000 })` ile rastgele dakika değeri üret
    - `minutes < 1` → `#FF3B30`, `1 ≤ minutes < 5` → `#FF9500`, `minutes ≥ 5` → `#30D158` olduğunu doğrula
    - **Doğrular: Gereksinim 9.3, 9.4**

  - [ ]* 6.2 Dual mod depolama çarpanı özellik testi yaz
    - **Özellik 7: Dual Mod Depolama Çarpanı**
    - Aynı çözünürlük/fps kombinasyonu için dual mod süresinin single mod süresinin tam yarısı olduğunu doğrula
    - **Doğrular: Gereksinim 9.1, 9.2**

- [x] 7. Son kontrol noktası — Tüm testler geçmeli
  - Tüm TypeScript hatalarının giderildiğini doğrula
  - Tüm birim ve özellik testlerinin geçtiğini doğrula
  - Kullanıcıya soru varsa sor.

## Notlar

- `*` ile işaretli görevler isteğe bağlıdır; MVP için atlanabilir
- Her görev belirli gereksinimlere referans verir (izlenebilirlik için)
- Özellik testleri `fast-check` kütüphanesi ile yazılacak (`bun add -D fast-check`)
- Test dosyaları `__tests__/unit/`, `__tests__/property/` dizinlerine yerleştirilecek
- Kontrol noktaları artımlı doğrulama sağlar
