# Kurban AI Mobil — Ekran & Kullanıcı Akış Analizi

**Tür:** Tasarım brief (≈4–5 sayfa)  
**Kaynak:** `kurbanlik-kilo-hesaplama-app` (Expo) · ortak backend: [kurban-ai](https://github.com/Mehmet-Erdem-Akin/kurban-ai)  
**API:** `https://kurbanlikkilohesaplama.com`

---

## 1. Ürün çerçevesi & bilgi mimarisi

Kullanıcı kurbanlık alırken **kilo, randıman ve hisse maliyetini** hızlı öğrenmek ister.

Mobilde iki yol:

| Yol | Ne yapar | Kredi |
|-----|----------|--------|
| **AI Analiz** | Fotoğraf → tür, kilo, karkas, hisse, öneri | 1 kredi / analiz |
| **Manuel Hesap** | Canlı kilo + et fiyatı → karkas & 1/7 hisse | Önizleme ücretsiz; detay tablo = 1 kredi |

### Navigasyon

**Bottom tabs (5):**

| Tab | Rol | Tasarım notu |
|-----|-----|--------------|
| Ana Sayfa | Marka + CTA giriş | Hero tek iş: marka + 1 başlık + 2 CTA |
| Analiz | Asıl ürün (foto → rapor) | Kamera öncelikli; form ikincil |
| Hesapla | Hızlı karar (manuel) | Canlı sonuç paneli her zaman görünür |
| Piyasa | Referans fiyat | Okuma odaklı; yenileme net |
| Daha Fazla | Hesap / paket / destek | Girişli ve girişsiz iki durum |

**Stack ekranlar (tab dışı):** Giriş, Kayıt, Hesabım, Paketler.  
Auth → modal/stack; Hesap ve Paketler → full-screen.

---

## 2. Ekran envanteri

### 2.1 Ana Sayfa
- **İçerik:** Pill · marka · başlık · kısa açıklama · “Analiz Başlat” · “Manuel Hesapla” · giriş/kayıt veya kredi satırı · özellik kartları  
- **Durumlar:** Misafir / Girişli (kredi görünür)

### 2.2 Analiz
- **İçerik:** Kamera · Galeri · foto thumbnail (max 4) · kategori chip (büyükbaş/küçükbaş) · tür / kilo / bölge / not · “Analizi Başlat” · sonuç kartı  
- **Kritik durumlar:** Auth yok · Kredi yok · Hayvan yok · Başarı sonucu

### 2.3 Hesapla
- **İçerik:** Canlı kilo · kg et fiyatı · erkek/dişi profil · ölçü tahmini · anlık karkas değeri · 1/7 hisse · kilitli randıman tablosu  
- **Kredi:** Önizleme ücretsiz; tablo açma = 1 kredi

### 2.4 Piyasa
- **İçerik:** Dana / Koç-Koyun / Keçi kartları (ortalama, ₺/kg, trend) · piyasa notları · pull-to-refresh  
- **Durumlar:** Yükleniyor · Hata · Dolu liste

### 2.5 Daha Fazla + Auth + Hesap
- **Misafir:** Giriş / Kayıt / Paketler  
- **Üye:** İsim, kredi, Hesabım, Paketler, Çıkış  
- **Giriş:** e-posta + şifre  
- **Kayıt:** ad, soyad, e-posta, şifre (+ ops. telefon/adres)  
- **Hesap:** kredi, profil, geçmiş listesi

### 2.6 Paketler
- Hoş geldin: **3 ücretsiz kredi**  
- Standart: **5 kredi / 99 ₺**  
- Pro: **15 kredi / 219 ₺** (öne çıkan)  
- Geniş: **25 kredi / 299 ₺**  
- Ödeme: Shopier  
- CTA: misafir → “Giriş Yap ve Satın Al” · üye → “Satın Al”

---

## 3. Ana kullanıcı akışları

### Akış A — Fotoğraf ile AI analiz (Primary)

| Adım | Ekran | Kullanıcı aksiyonu | Sistem |
|------|-------|--------------------|--------|
| 1 | Ana / Analiz | Analiz Başlat veya tab | — |
| 2 | Analiz | Kamera veya galeri (1–4 foto) | Thumbnail listesi |
| 3 | Analiz | Opsiyonel ek bilgi | Form state |
| 4a | Auth gate | Giriş yoksa login/kayıt | Kayıtta 3 kredi |
| 4b | Paketler | Kredi 0 ise paket al | Shopier |
| 5 | Analiz | Analizi Başlat | `POST /api/analyze` · 1 kredi düş |
| 6 | Analiz sonuç | Raporu oku | Tür, kilo, karkas, hisse, öneri |

### Akış B — Manuel kilo & hisse (Secondary)

| Adım | Ekran | Aksiyon | Not |
|------|-------|---------|-----|
| 1 | Hesapla | Kilo + et fiyatı gir | Anlık önizleme |
| 2 | Hesapla | Erkek / Dişi seç | Randıman ~%60 / ~%53 |
| 3 | Hesapla | Ops. ölçü → kilo uygula | göğüs² × uzunluk / 10840 |
| 4 | Hesapla | Tabloyu aç (1 kredi) | Auth + kredi gerekir |
| 5 | Hesapla | Randıman senaryolarını gör | Unlock sonrası tablo |

### Akış C — Kayıt → kredi → satın alma (Monetization)

```
Kayıt → 3 ücretsiz kredi
  → Analiz veya tablo ile tüketim
  → Kredi bitince Paketler
  → Shopier (sistem tarayıcısı)
  → Dönüşte Hesap’ta bakiye güncellenir
```

Hesap ekranı geçmiş analizleri listeler.

---

## 4. Tasarım yönü (UI kararları)

### Görsel dil
- **Zemin:** sıcak krem / stone  
- **Birincil:** koyu emerald  
- **Kart:** beyaz, yumuşak radius (~20–24)  
- **CTA:** dolu yeşil · secondary: outline  
- Web’deki pastel/parallax’ı mobilde **sadeleştir**: daha az dekorasyon, daha okunabilir form ve sonuç

### Öncelik hiyerarşisi
1. Analiz sonucu / hisse fiyatı (**en büyük sayı**)  
2. Birincil CTA (Analiz / Satın Al / Giriş)  
3. Form alanları  
4. Yardımcı metin / özellikler

### Kritik ekran durumları (mutlaka tasarlanmalı)

| Ekran | Empty | Error | Success / Locked |
|-------|-------|-------|------------------|
| Analiz | Foto yok placeholder | Hayvan yok / kredi yok / API | Sonuç kartı (kilo, değer, hisse) |
| Hesapla | — | Auth / kredi hatası | Kilitli tablo → açık tablo |
| Piyasa | Veri yok | API hatası + yenile | 3 hayvan kartı + notlar |
| Hesap | Geçmiş boş + CTA | Geçmiş yüklenemedi | Liste satırları |
| Paketler | — | Ödeme başlatılamadı | Shopier’e gitti bilgisi |

**Auth gate önerisi:** Full-screen engel yerine **inline uyarı** + “Giriş yap” / “Paket al” ikili CTA.

---

## 5. Tasarım çıktı sırası (Figma)

İlk turda sadece bu **6 frame**; auth/hata varyasyonları ikinci tur.

| Sıra | Frame | Neden |
|------|-------|-------|
| 1 | Ana Sayfa (misafir) | Marka + ilk CTA |
| 2 | Analiz — foto yok + form | Ana ürün girişi |
| 3 | Analiz — başarı sonucu | Değer önerisi görünürlüğü |
| 4 | Hesapla — canlı sonuç + kilitli tablo | İkinci ürün yolu |
| 5 | Paketler (3 kart + welcome) | Monetization |
| 6 | Hesabım (kredi + geçmiş) | Retention / güven |

### Kapsam dışı (bu brief’te yok)
Blog, KVKK sayfaları, PDF export UI detayı, dark mode, onboarding carousel.

---

## Tasarım referansları

Mockup görselleri: `docs/design-refs/`

- `01-home.jpg` — Ana sayfa
- `02-account.jpg` — Hesabım
- `03-pricing.jpg` — Paketler
- `04-market.jpg` — Piyasa
- `05-calculator.jpg` — Manuel hesap
- `06-analyze-result.jpg` — Analiz sonucu
- `07-analyze-form.jpg` — Analiz formu

Görsel dil: koyu forest green + krem zemin, kartlı layout, Kurban AI marka başlığı, alt tab ikonları (home/camera/calculator/chart/more).

*Son güncelleme: mockup referanslarına göre UI yenilendi.*
