# Gereksinimler Dokümanı

## Giriş

Bu doküman, React Native (Expo) tabanlı kamera uygulamasına eklenecek **Dual Orientation Video Recorder** özelliğinin gereksinimlerini tanımlar.

Özelliğin amacı: Kullanıcı tek bir kayıt işlemi başlatıp durdurduğunda, arka kameradan alınan ham video FFmpeg ile işlenerek hem **9:16 dikey (portrait)** hem de **16:9 yatay (landscape)** olmak üzere iki ayrı video dosyası üretmek ve her ikisini cihazın galerisine kaydetmektir.

Mevcut kodda tespit edilen sorunlar bu gereksinimler kapsamında giderilecektir:
- FFmpeg landscape crop komutu yanlış (portrait üretiyor)
- Lens seçici (ultrawide/telephoto) dual modda gereksiz yere gösteriliyor
- Kamera ayarları uygulama yeniden başlatıldığında sıfırlanıyor (AsyncStorage eksik)

---

## Sözlük

- **Recorder**: Kamera kaydını başlatan, sürdüren ve durduran ana bileşen (`app/index.tsx`).
- **VideoProcessor**: FFmpeg komutlarını çalıştırarak ham videodan portrait ve landscape çıktılar üreten işlem katmanı (`app/post-recording.tsx` içindeki FFmpeg mantığı).
- **GallerySaver**: `expo-media-library` aracılığıyla video dosyalarını cihaz galerisine kaydeden katman.
- **SettingsStore**: Kamera ayarlarını (`AsyncStorage` ile) kalıcı olarak saklayan ve okuyan katman (`hooks/useCameraSettings.ts`).
- **StorageCalculator**: Mevcut disk alanına göre tahmini kayıt süresini hesaplayan katman (`hooks/useStorage.ts`).
- **Portrait Video**: 9:16 en-boy oranına sahip dikey video dosyası.
- **Landscape Video**: 16:9 en-boy oranına sahip yatay video dosyası.
- **Ham Video**: Kameradan doğrudan kaydedilen, henüz işlenmemiş orijinal video dosyası.
- **Dual Mod**: Tek kayıt işlemiyle hem portrait hem landscape video üreten çalışma modu.
- **Single Mod**: Tek kayıt işlemiyle yalnızca bir video dosyası üreten çalışma modu.

---

## Gereksinimler

### Gereksinim 1: Arka Kamera ile Kayıt

**Kullanıcı Hikayesi:** Bir içerik üreticisi olarak, yalnızca arka kamerayla çekim yapmak istiyorum; böylece ön kamera seçeneğiyle zaman kaybetmeden hızlıca kayda başlayabileyim.

#### Kabul Kriterleri

1. THE Recorder SHALL yalnızca arka kamera (`position === 'back'`) cihazını kullanarak video kaydı başlatır.
2. THE Recorder SHALL ön kamera geçiş düğmesini kullanıcı arayüzünden kaldırır.
3. WHEN Dual Mod aktifken, THE Recorder SHALL kamera cihazını arka wide lens olarak sabitler ve kullanıcının kamera değiştirmesine izin vermez.
4. WHEN Single Mod aktifken, THE Recorder SHALL kamera cihazını arka wide lens (1x) olarak sabitler.

---

### Gereksinim 2: Lens Seçici Kaldırma

**Kullanıcı Hikayesi:** Bir içerik üreticisi olarak, yalnızca standart wide (1x) lens kullanmak istiyorum; böylece arayüz sade kalır ve yanlışlıkla lens değiştirme riski ortadan kalkar.

#### Kabul Kriterleri

1. THE Recorder SHALL `LensSelector` bileşenini kullanıcı arayüzünden kaldırır ve hiçbir modda göstermez.
2. THE Recorder SHALL kamera zoom değerini her zaman `1` (wide lens) olarak ayarlar.
3. THE SettingsStore SHALL `LensType` tipinden `ultrawide` ve `telephoto` seçeneklerini kaldırır; yalnızca `wide` değerini destekler.

---

### Gereksinim 3: Tek Kayıt ile İki Video Üretimi

**Kullanıcı Hikayesi:** Bir içerik üreticisi olarak, tek bir kayıt işlemiyle hem dikey hem yatay video elde etmek istiyorum; böylece aynı içeriği farklı platformlar için ayrı ayrı çekmek zorunda kalmam.

#### Kabul Kriterleri

1. WHEN Dual Mod aktifken ve kayıt durdurulduğunda, THE VideoProcessor SHALL ham videodan tam olarak 2 ayrı video dosyası üretir: biri Portrait Video, diğeri Landscape Video.
2. WHEN Single Mod aktifken ve kayıt durdurulduğunda, THE VideoProcessor SHALL tam olarak 1 video dosyası üretir.
3. THE VideoProcessor SHALL her iki video dosyasını da `FileSystem.cacheDirectory` altında geçici olarak saklar.
4. WHEN video işleme tamamlandığında, THE VideoProcessor SHALL geçici ham video dosyasını diskten siler.

---

### Gereksinim 4: Portrait Video Üretimi (9:16)

**Kullanıcı Hikayesi:** Bir içerik üreticisi olarak, 9:16 en-boy oranında dikey video almak istiyorum; böylece TikTok, Instagram Reels ve YouTube Shorts gibi platformlara doğrudan yükleyebileyim.

#### Kabul Kriterleri

1. WHEN ham video işlendiğinde, THE VideoProcessor SHALL portrait video için FFmpeg crop filtresini `crop=ih*9/16:ih` parametresiyle uygular.
2. THE VideoProcessor SHALL portrait video çıktısının genişliğinin yüksekliğe oranının 9/16 olduğunu doğrular.
3. THE VideoProcessor SHALL portrait video dosyasını `DualShot_{timestamp}_portrait.{format}` adıyla kaydeder.
4. WHEN giriş videosunun genişliği `ih*9/16` değerinden küçükse, THE VideoProcessor SHALL hata döndürür ve işlemi iptal eder.

---

### Gereksinim 5: Landscape Video Üretimi (16:9)

**Kullanıcı Hikayesi:** Bir içerik üreticisi olarak, 16:9 en-boy oranında yatay video almak istiyorum; böylece YouTube, Twitter ve LinkedIn gibi platformlara doğrudan yükleyebileyim.

#### Kabul Kriterleri

1. WHEN ham video işlendiğinde, THE VideoProcessor SHALL landscape video için FFmpeg crop filtresini `crop=iw:iw*9/16` parametresiyle uygular.
2. THE VideoProcessor SHALL landscape video çıktısının genişliğinin yüksekliğe oranının 16/9 olduğunu doğrular.
3. THE VideoProcessor SHALL landscape video dosyasını `DualShot_{timestamp}_landscape.{format}` adıyla kaydeder.
4. WHEN giriş videosunun yüksekliği `iw*9/16` değerinden küçükse, THE VideoProcessor SHALL hata döndürür ve işlemi iptal eder.

> **Not:** Mevcut kodda landscape komutu `crop=iw:iw*9/16` olarak yazılmış ancak bu komut portrait çıktı üretmektedir. Doğru landscape crop için giriş videosunun en az 4K (3840×2160) çözünürlükte olması ve komutun `crop=iw:iw*9/16` şeklinde uygulanması gerekir. 4K kayıt zorunlu kılınarak bu sorun giderilecektir.

---

### Gereksinim 6: Galeri Kayıt İşlemi

**Kullanıcı Hikayesi:** Bir içerik üreticisi olarak, üretilen videoların otomatik olarak cihazımın galerisine kaydedilmesini istiyorum; böylece manuel aktarım yapmak zorunda kalmam.

#### Kabul Kriterleri

1. WHEN video işleme başarıyla tamamlandığında, THE GallerySaver SHALL Portrait Video'yu `expo-media-library` aracılığıyla cihaz galerisine kaydeder.
2. WHEN video işleme başarıyla tamamlandığında, THE GallerySaver SHALL Landscape Video'yu `expo-media-library` aracılığıyla cihaz galerisine kaydeder.
3. THE GallerySaver SHALL her iki dosyayı da sırayla kaydeder ve kaydedilen dosya sayısını kullanıcıya gösterir.
4. WHEN galeri izni verilmemişse, THE GallerySaver SHALL kullanıcıyı izin ekranına yönlendirir.
5. WHEN galeri kayıt işlemi başarıyla tamamlandığında, THE GallerySaver SHALL geçici cache dosyalarını diskten siler.

---

### Gereksinim 7: Ayarların Kalıcılığı

**Kullanıcı Hikayesi:** Bir içerik üreticisi olarak, seçtiğim kamera ayarlarının (çözünürlük, fps, format) uygulama yeniden başlatıldığında korunmasını istiyorum; böylece her seferinde yeniden yapılandırmak zorunda kalmam.

#### Kabul Kriterleri

1. WHEN kullanıcı bir ayarı değiştirdiğinde, THE SettingsStore SHALL yeni değeri `@react-native-async-storage/async-storage` ile kalıcı olarak saklar.
2. WHEN uygulama başlatıldığında, THE SettingsStore SHALL `AsyncStorage`'dan kaydedilmiş ayarları okur ve varsayılan değerlerin yerine kullanır.
3. IF `AsyncStorage` okuma işlemi başarısız olursa, THEN THE SettingsStore SHALL varsayılan ayarları (`4K`, `30fps`, `mov`) kullanır ve hatayı loglar.
4. THE SettingsStore SHALL ayar anahtarı olarak `@dualshot/camera-settings` değerini kullanır.
5. FOR ALL geçerli `CameraSettings` nesneleri, JSON serileştirme ardından JSON ayrıştırma işlemi orijinal nesneyle eşdeğer bir nesne üretir (round-trip özelliği).

---

### Gereksinim 8: Hata Yönetimi

**Kullanıcı Hikayesi:** Bir içerik üreticisi olarak, video işleme veya kayıt sırasında bir hata oluştuğunda anlaşılır bir hata mesajı görmek istiyorum; böylece ne yapacağımı bilebileyim.

#### Kabul Kriterleri

1. IF FFmpeg işlemi başarısız olursa, THEN THE VideoProcessor SHALL kullanıcıya Türkçe hata mesajı gösterir ve post-recording ekranında hata durumunu görüntüler.
2. IF galeri kayıt işlemi başarısız olursa, THEN THE GallerySaver SHALL kullanıcıya hata mesajı gösterir ve "Tekrar Dene" seçeneği sunar.
3. IF kamera cihazı bulunamazsa, THEN THE Recorder SHALL kullanıcıya "Kamera başlatılamadı" mesajı gösterir.
4. WHEN herhangi bir hata oluştuğunda, THE Recorder SHALL haptic feedback ile kullanıcıyı bilgilendirir (`Haptics.NotificationFeedbackType.Error`).
5. IF video işleme sırasında geçici dosya oluşturulamazsa, THEN THE VideoProcessor SHALL işlemi iptal eder ve disk alanı yetersizliği hatasını kullanıcıya bildirir.

---

### Gereksinim 9: Depolama Alanı Hesabı

**Kullanıcı Hikayesi:** Bir içerik üreticisi olarak, kalan kayıt süresini doğru görmek istiyorum; böylece kayıt sırasında disk dolmaz.

#### Kabul Kriterleri

1. WHILE Dual Mod aktifken, THE StorageCalculator SHALL tahmini kayıt süresini hesaplarken MB/dakika değerini `2` ile çarpar (iki dosya üretildiği için).
2. THE StorageCalculator SHALL Dual Mod için depolama tahmini hesaplamasında `mode === 'dual' ? 2 : 1` çarpanını kullanır.
3. WHEN kalan kayıt süresi 1 dakikanın altına düştüğünde, THE StorageCalculator SHALL depolama göstergesini kırmızı renkte (`#FF3B30`) gösterir.
4. WHEN kalan kayıt süresi 5 dakikanın altına düştüğünde, THE StorageCalculator SHALL depolama göstergesini turuncu renkte (`#FF9500`) gösterir.
