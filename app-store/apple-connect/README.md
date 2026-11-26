# Apple App Store Connect — Hazır Asset’ler

App Store Connect’e **doğrudan yüklenebilir** boyutlar.

## Boyutlar

| Asset | Boyut | Klasör |
|-------|-------|--------|
| App Icon | **1024 × 1024** PNG (alpha yok) | `icon/AppIcon-1024.png` |
| iPhone 6.1" screenshots | **1179 × 2556** | `screenshots/ui-iphone-6.1/` |
| iPhone 6.3" screenshots | **1206 × 2622** | `screenshots/ui-iphone-6.3/` |
| iPhone 6.7" screenshots | **1290 × 2796** (hazır set bu boyutta) | `screenshots/ui-iphone-6.7/` |
| iPhone 6.9" screenshots | **1320 × 2868** | `screenshots/ui-iphone-6.9/` |

> Tablet desteklenmiyor (`supportsTablet: false`) → iPad screenshot gerekmez.

## Kaynak UI ekranları

Geliştirme önizlemeleri: `../../docs/screenshots/`

| Dosya | Ekran |
|-------|--------|
| `home.png` | Ana Sayfa |
| `analyze.png` | Fotoğrafla AI Analiz |
| `calculator.png` | Manuel Hesapla |
| `market.png` | Piyasa |
| `more.png` | Daha Fazla |
| `login.png` | Giriş |
| `register.png` | Kayıt |
| `pricing.png` | Kredi Paketleri |

ASC’ye yüklemeden önce Simulator’dan native çözünürlükte yeniden çekin veya kaynak PNG’leri hedef boyuta (letterbox/mockup) yerleştirin.

## Connect adımları

1. App Store Connect → uygulama → **App Store** sekmesi  
2. Primary Language: **Turkish** (Türkiye)  
3. **Localizations** → **English (U.S.)** ekle (yurtdışı)  
4. **App Icon** → `icon/AppIcon-1024.png`  
5. iPhone screenshot slotuna **6.9"** veya **6.7"** setini yükle (TR + EN lokalizasyonlarına)  
6. Metinler için `../LISTING.md` (TR / EN blokları)  
7. Review notları için `../APP_REVIEW_NOTES.md`

## App Review

| Dosya | Kullanım |
|-------|----------|
| [`../APP_REVIEW_NOTES.md`](../APP_REVIEW_NOTES.md) | ASC → App Review Information → **Notes** |
| Demo hesap | `store-review@akintechstudio.com` / `KurbanReview26!` |

## Notlar

- Max 10 screenshot / device size  
- App Preview video opsiyonel  
- Listing screenshot’ları gerçek UI kullanımı göstermeli (yalnızca splash/login seti kullanmayın)
