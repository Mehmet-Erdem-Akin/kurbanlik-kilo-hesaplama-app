# Kurban AI — Mobil (Expo)

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

## Store / EAS (Word Rush ile aynı düzen)

| Dosya / klasör | Amaç |
|----------------|------|
| `eas.json` | preview / production build + iOS submit |
| `app.json` | bundle id, Apple Team, permissions, splash |
| `app-store/LISTING.md` | App Store + Play metinleri (TR/EN) |
| `app-store/APP_REVIEW_NOTES.md` | App Review Notes |
| `app-store/apple-connect/` | Icon + screenshot setleri |
| `app-store/assets/` | Play icon / feature graphic |

**Identifiers**

- iOS: `com.akintechstudio.kurbanlikkilo`
- Android: `com.akintechstudio.kurbanlikkilo`
- Apple Team ID: `L9XFYWS8GJ`
- Expo owner: `mehmetea57`

### İlk EAS kurulumu

```bash
npm i -g eas-cli
npm run eas:init          # projectId → app.json extra.eas.projectId
npm run eas:build:preview # internal APK / TestFlight-ready
npm run eas:build:production
```

ASC’de uygulama oluşturulunca `eas.json` → `submit.production.ios.ascAppId` alanını doldurun, ardından:

```bash
npm run eas:submit:ios
```

Listing metinleri ve checklist: [`app-store/LISTING.md`](./app-store/LISTING.md).

**Store dilleri:** Türkiye → Türkçe (primary), yurtdışı → English (U.S.). Detay ve ASC/Play adımları `LISTING.md` içinde.

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
  utils/
app-store/       # Store listing + Connect asset’leri
```

## Auth notu

Web oturumu `kurban_ai_session` cookie’si ile çalışır. Mobil istemci mümkünse cookie’yi SecureStore’a yazar ve `Authorization` + `Cookie` gönderir.

Önerilen web iyileştirmesi (mobil uyumluluk):

1. `/api/auth/login` ve `/register` yanıtına `token` eklemek
2. `getCurrentUser` içinde `Authorization: Bearer` kabul etmek

## Komutlar

```bash
npm start
npm run typecheck
npm run android
npm run ios
npm run eas:build:preview
```

## Web referansı

- Repo: https://github.com/Mehmet-Erdem-Akin/kurban-ai
- Canlı: https://kurbanlikkilohesaplama.com
- Benzer store setup: https://github.com/Mehmet-Erdem-Akin/word-rush
