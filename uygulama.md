React Native, Expo ve TypeScript kullanarak arka kamera ile video kaydeden,
kayıt tamamlandıktan sonra video işleme ile aynı videoyu hem 16:9 (yatay)
hem 9:16 (dikey) formatına dönüştürüp, her ikisini expo-media-library
aracılığıyla galeriye ayrı ayrı kaydeden bir uygulama geliştir.

⚙️ Kullanılacak Kütüphaneler:
- expo-camera (CameraView API): Kamera önizleme ve video kaydı
- @sheehanmunim/react-native-ffmpeg: Video crop/resize işlemi
  (ffmpeg-kit-react-native'in aktif community fork'u)
- expo-media-library: Galeriye kaydetme
- expo-file-system: Geçici dosya yönetimi

⚠️ Önemli Gereksinimler:
- Expo Go ÇALIŞMAZ, EAS ile development build zorunlu
- expo-camera/legacy kullanma, sadece yeni CameraView API kullan
- New Architecture (newArchEnabled: true) aktif olmalı

🔄 Uygulama Akışı:
1. CameraView ile arka kameradan video kaydı başlat (ham format)
2. Kayıt durduğunda ham video dosyasını expo-file-system ile geçici
   dizine al
3. @sheehanmunim/react-native-ffmpeg ile 16:9 formatına crop et
   → geçici dosya 1
4. @sheehanmunim/react-native-ffmpeg ile 9:16 formatına crop et
   → geçici dosya 2
5. Her iki dosyayı expo-media-library ile galeriye kaydet
6. Geçici dosyaları expo-file-system ile temizle

📐 FFmpeg Komutları:
- 16:9 için: -i input.mp4 -vf "crop=ih*16/9:ih:(iw-ih*16/9)/2:0" output_169.mp4
- 9:16 için: -i input.mp4 -vf "crop=iw:iw*16/9:(ih-iw*16/9)/2:0" output_916.mp4

🛠️ app.json config:
{
  "plugins": [
    ["expo-camera", {
      "cameraPermission": "Kamera erişimi gerekiyor",
      "microphonePermission": "Mikrofon erişimi gerekiyor",
      "recordAudioAndroid": true
    }],
    ["expo-media-library", {
      "photosPermission": "Galeri erişimi gerekiyor",
      "savePhotosPermission": "Galeriye kaydetme izni gerekiyor"
    }]
  ],
  "newArchEnabled": true
}