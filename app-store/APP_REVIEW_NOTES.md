# App Store Connect — App Review Information (Notes)

> Paste the **English block** below into App Store Connect → Your App → App Review Information → **Notes**.

---

## Copy-paste into App Review Notes (English)

```
KURBAN AI — App Review Notes

1) PURPOSE AND TARGET AUDIENCE
Kurban AI helps users estimate sacrificial livestock (kurban) live weight, carcass value, and 1/7 share cost. Users can upload photos for AI analysis or enter weight/price manually. Market price references are shown for guidance.

Target audience: general public in Türkiye preparing for kurban (families, farm traders, butchers). Not limited to a single company. Available to the general public.

2) USAGE INSTRUCTIONS
No mandatory login for browsing. AI analysis and detailed yield tables require an account and credits.

Steps:
1. Launch the app → Home.
2. Analyze: pick Camera or Gallery (up to 4 photos), optionally set animal category, then run analysis (login + credit required).
3. Calculator: enter live weight and meat price → see carcass value and share price. Unlock detailed yield table with 1 credit when logged in.
4. Market: view livestock price references (network required).
5. More / Account: login or register, view remaining credits, open credit packs (Shopier redirect in system browser), logout.
6. Privacy / support: website https://kurbanlikkilohesaplama.com and support email in More.

Demo account (keep active during review — create one before submission if blank):
Email: store-review@akintechstudio.com
Password: KurbanReview26!

3) EXTERNAL SERVICES
- Backend API at https://kurbanlikkilohesaplama.com (auth, AI analysis, market, history, credits)
- Shopier payment redirect for credit packs (opened in system browser; no IAP SKUs in this binary)
- Device camera / photo library (user-initiated only)
- Expo SecureStore for session token

No ads networks. No third-party analytics SDKs required for core flows.

4) PURCHASES
Credit packs open Shopier checkout in the system browser. There are NO Apple In-App Purchases in this binary. Do not expect StoreKit products.

5) REGIONAL DIFFERENCES
Same features in all regions. UI language is Turkish. No region-locked content.

6) AUTHORIZATION DOCUMENTS
Not applicable. Consumer utility / lifestyle livestock estimation app. Not a regulated industry product.

7) DISCLAIMER
AI and calculator outputs are estimates only; the app states that professional weighing and veterinary checks are recommended.

ADDITIONAL NOTES
- Camera and Photos permissions are used only when the user starts analysis.
- Account deletion / data requests: contact support (mailto from More → Destek) until an in-app delete-account control ships.
- Please use the demo account for login testing; do not permanently delete it if possible.
```

---

## Türkçe referans (ekibe)

```
KURBAN AI — İnceleme notları

Amaç: Kurbanlık canlı kilo, karkas ve 1/7 hisse tahmini (fotoğraf AI + manuel hesap + piyasa).
Demo: store-review@akintechstudio.com / KurbanReview26!
Ödeme: Shopier tarayıcı yönlendirmesi — IAP yok.
Harici: kurbanlikkilohesaplama.com API.
Sonuçlar ön tahmindir.
```

---

## Checklist — göndermeden önce

- [ ] Notes alanına English metin yapıştırıldı
- [ ] Demo hesap production’da çalışıyor
- [ ] Privacy Policy URL canlı
- [ ] Camera / Photos usage strings doğru
- [ ] IAP yok → ASC’de IAP ürünü eklemeyin
- [ ] Shopier / kredi akışı review hesabında test edildi
