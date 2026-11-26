# Kurbanlık Kilo — Mobil (Expo) PRD

## Proje Genel Bakış

Bu depo, [kurban-ai](https://github.com/Mehmet-Erdem-Akin/kurban-ai) web uygulamasının **React Native + Expo** mobil istemcisidir. Backend API’ler web ile ortaktır (`https://kurbanlikkilohesaplama.com`).

## Hedefler

- iOS ve Android’de Expo Go / development build ile çalışabilmek
- Web ile aynı auth, kredi, analiz, piyasa ve Shopier ödeme uçlarını kullanmak
- Kamera / galeri ile fotoğraf analizi ve manuel kilo-hisse hesabı sunmak

## Ekranlar

- Ana sayfa
- AI Analiz (çoklu fotoğraf)
- Manuel kilo & hisse hesabı
- Piyasa fiyatları
- Giriş / Kayıt
- Hesabım + geçmiş
- Paketler (Shopier)

## Teknik Stack

- Expo SDK 58, Expo Router, TypeScript
- `expo-image-picker`, `expo-secure-store`, `expo-web-browser`, `expo-linear-gradient`
- API tabanı: `EXPO_PUBLIC_API_URL`

## Yapılacaklar

- [ ] Push bildirimleri
- [ ] Offline manuel hesap önbelleği
- [ ] Analiz PDF paylaşımı (mobil)

## Yapıldı

- Expo Router tabanlı mobil iskelet (iOS/Android)
- Ortak backend API istemcisi (auth, analyze, market, history, credits, Shopier)
- Ana ekranlar: Analiz, Hesapla, Piyasa, Hesap, Paketler
- `prd-accept` Cursor kuralı eklendi
- Backend imzalı oturum + Bearer `getCurrentUser` ile mobil uyumu (login/register `token`)
- Analyze `RATE_LIMITED` hata mesajı desteği
- Store lokalizasyon politikası: TR `Kurban AI` (Türkiye) + EN `Qurban AI` (yurtdışı)
- Bundle / package ID: `com.akintechstudio.kurbanai`
- ASC App ID (`ascAppId`): `6839741409`
- Privacy EN URL: `/privacy/en` (App Review için)
- Store icon (brand logo) + iPhone 6.7" screenshots 1290×2796
