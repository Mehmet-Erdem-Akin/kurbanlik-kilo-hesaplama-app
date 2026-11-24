# Kurbanlık Kilo — Mobil (Expo)

[kurban-ai](https://github.com/Mehmet-Erdem-Akin/kurban-ai) web projesinin **React Native + Expo** mobil istemcisi. Backend ortak: `https://kurbanlikkilohesaplama.com`.

## Özellikler

- AI fotoğraf analizi (kamera / galeri, çoklu fotoğraf)
- Manuel canlı kilo & 1/7 hisse hesabı
- Piyasa fiyatları
- Giriş / kayıt, kredi bakiyesi, analiz geçmişi
- Shopier paket satın alma (sistem tarayıcısı)

## Kurulum

```bash
npm install
cp .env.example .env
npm start
```

Ardından Expo Go ile QR kodu okutun veya `a` / `i` ile emülatör açın.

### Ortam

```env
EXPO_PUBLIC_API_URL=https://kurbanlikkilohesaplama.com
```

Yerel web backend için: `EXPO_PUBLIC_API_URL=http://localhost:3000` (cihazda makine IP’si gerekir).

## Yapı

```
src/
  app/           # Expo Router ekranları
  api/           # Ortak backend istemcisi
  components/    # UI
  config/        # env + kredi paketleri
  context/       # Auth
  theme/
  types/
  utils/         # yieldCalculator (web ile aynı mantık)
```

## Auth notu

Web oturumu `kurban_ai_session` cookie’si ile çalışır. Mobil istemci mümkünse cookie’yi SecureStore’a yazar ve `Authorization` + `Cookie` gönderir. Yerel cookie jar da `credentials: "include"` ile kullanılır.

Önerilen web iyileştirmesi (mobil uyumluluk):

1. `/api/auth/login` ve `/register` yanıtına `token` eklemek
2. `getCurrentUser` içinde `Authorization: Bearer` kabul etmek

## Komutlar

```bash
npm start
npm run typecheck
npm run android
npm run ios
```

## Web referansı

- Repo: https://github.com/Mehmet-Erdem-Akin/kurban-ai
- Canlı: https://kurbanlikkilohesaplama.com
