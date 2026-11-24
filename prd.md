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

- [ ] Web auth yanıtına `token` alanı (mobil Bearer oturumu için)
- [ ] Web `getCurrentUser` içinde `Authorization: Bearer` desteği
- [ ] Push bildirimleri
- [ ] Offline manuel hesap önbelleği
- [ ] Analiz PDF paylaşımı (mobil)

## Yapıldı

- Expo Router tabanlı mobil iskelet (iOS/Android)
- Ortak backend API istemcisi (auth, analyze, market, history, credits, Shopier)
- Ana ekranlar: Analiz, Hesapla, Piyasa, Hesap, Paketler
- `prd-accept` Cursor kuralı eklendi
