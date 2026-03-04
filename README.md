# Stratejik Kar Pusulasi

**E-Ticaret Maliyet Hesaplayici**

Turkiye pazaryerlerinde satis yapan e-ticaret saticilarinin urun ve operasyon karliligini detayli sekilde analiz etmelerini, fiyatlandirma stratejileri gelistirmelerini ve karlilarini optimize etmelerini saglayan kapsamli bir hesaplama ve analiz aracidir.

---

## Icindekiler

- [Proje Amaci](#proje-amaci)
- [Temel Ozellikler](#temel-ozellikler)
- [Kurulum ve Calistirma](#kurulum-ve-calistirma)
- [Proje Yapisi](#proje-yapisi)
- [Teknik Altyapi](#teknik-altyapi)
- [Hesaplama Modlari](#hesaplama-modlari)
- [Desteklenen Pazar Yerleri](#desteklenen-pazar-yerleri)
- [Kargo Sirketleri](#kargo-sirketleri)
- [Urun Kategorileri](#urun-kategorileri)
- [Vergi ve Kesinti Bilgileri](#vergi-ve-kesinti-bilgileri)
- [Uyari Sistemi](#uyari-sistemi)
- [Veri Yonetimi](#veri-yonetimi)
- [Tarayici Destegi](#tarayici-destegi)
- [Lisans](#lisans)

---

## Proje Amaci

Turkiye'deki basica e-ticaret pazaryerlerinde (Trendyol, Hepsiburada, N11, Amazon TR) urun satan veya kendi web sitesi uzerinden satis yapan girisimciler ve isletmeler icin tasarlanmistir. Uygulama su sorulara yanit verir:

- Bu urunu bu fiyata satarsam ne kadar kar ederim?
- Hedefledigim kari elde etmem icin satis fiyatim ne olmali?
- Hangi pazar yerinde en cok kar ediyorum?
- Fiyatlama parametreleri degisirse karim nasil etkilenir?
- Basabas noktam nedir, minimum kac liraya satmaliyim?
- Urunumun malzeme maliyeti (BOM) ne kadar?

Uygulama tamamen istemci tarafinda calisir; sunucu gerektirmez, veriler tarayicida saklanir ve cevrimdisi kullanilabilir (PWA).

---

## Temel Ozellikler

### Cok Modlu Hesaplayici

Dort farkli hesaplama modu ile kullaniciya esneklik sunar. Satis fiyatindan kara, hedef kar miktarindan fiyata veya hedef marjdan fiyata ulasmak mumkundur.

### BOM / Recete Yonetimi

Urun bazinda hammadde, ambalaj, iscilik, enerji, depolama ve diger masraflari kayit altina alir. Onceden hazirlanmis sablonlar (t-shirt, kupa, el yapimi sabun, mum, taki, telefon kilifi vb.) ile hizli baslangic imkani sunar. Receteler versiyonlanir ve JSON formatinda iceride/disarida aktarilabilir.

### Hassasiyet Analizi

Satis fiyati, alis fiyati, komisyon, kargo, KDV ve iade orani gibi alti temel parametrede yuzde on'luk degisimin net kara etkisini tornado grafigi ile gosterir.

### Basabas Analizi

Satis fiyatinin degisen araliklarinda toplam gelir, toplam maliyet ve net karin nasil degistigini gorsellestirir. Basabas noktasini ve mevcut konumu grafik uzerinde isaretler.

### Pazar Yeri Karsilastirmasi

Ayni urunu bes farkli kanalda (Trendyol, Hepsiburada, N11, Amazon TR, Kendi Sitem) satmanin net kar ve marj farklarini yan yana grafik olarak sunar.

### Uyari ve Oneri Sistemi

Sekizden fazla is kurali ile zarar, dusuk marj, yuksek iade orani, yuksek komisyon gibi durumlar otomatik tespit edilir ve kullaniciya somut oneriler sunulur.

### Desi Hesaplayici

Urun boyutlarindan (en x boy x yukseklik / 3000) hacimsel agirlik hesaplar, fiziksel agirlik ile karsilastirir ve kargo ucretini otomatik belirler.

### Raporlama ve Grafikler

ECharts kutuphanesi ile maliyet kirilimi (yatay cubuk), maliyet dagilimi (pasta), pazar karsilastirmasi (sutun), hassasiyet tornado ve basabas analizi grafikleri olusturulur. Raporlar Excel (.xlsx), CSV ve JSON formatlarinda disari aktarilabilir.

### PWA ve Cevrimdisi Destek

Service Worker ile tum statik ve CDN kaynaklari onbellege alinir. Uygulama internet baglantisi olmadan calisir ve mobil/masaustu cihazlara yuklenebilir.

### Karanlik Mod

Sistem tercihini otomatik algilayarak veya manuel gecis ile acik/koyu tema arasinda gecis saglar. Tum grafik ve tablo renkleri temaya uygun sekilde guncellenir.

### Responsive Tasarim

Masaustunde yuzde altmis/kirk oraninda iki sutunlu duzende, tablette ve mobilde tek sutuna donen uyarlanabilir arayuz. Mobilde sabit alt cubuk ile temel gostergelere hizli erisim.

---

## Kurulum ve Calistirma

### Gereksinimler

- Modern bir web tarayicisi (Chrome, Firefox, Safari, Edge)
- Yerel sunucu (ES modulleri `file://` protokolunde calismaz)

### Hizli Baslangic

Proje tamamen statik dosyalardan olusur. Herhangi bir build adimi veya bagimlilk kurulumu gerektirmez. Sadece statik dosya sunucusu gereklidir.

**Node.js ile (onerilen):**

```bash
# Repoyu klonla
git clone https://github.com/karacaismail/Stratejik-Kar-Pusulasi.git
cd Stratejik-Kar-Pusulasi

# Statik dosya sunucusunu baslat
npx serve -l 3000
```

Tarayicida `http://localhost:3000` adresine git.

**Python ile:**

```bash
cd Stratejik-Kar-Pusulasi

# Python 3
python3 -m http.server 3000

# Python 2
python -m SimpleHTTPServer 3000
```

**VS Code ile:**

1. VS Code'da projeyi ac.
2. "Live Server" eklentisini kur.
3. `index.html` dosyasina sag tikla ve "Open with Live Server" sec.

### Onemli Not

Uygulama ES6 modulleri (`type="module"`) kullandiginden dolayi dosya sisteminden (`file://`) dogrudan acildiginda calismaz. Mutlaka bir HTTP sunucusu uzerinden (`http://` veya `https://`) erisim saglanmalidir.

---

## Proje Yapisi

```
Stratejik-Kar-Pusulasi/
|
|-- index.html                     Ana hesaplayici sayfasi
|-- recete.html                    BOM / Recete yonetimi sayfasi
|-- rapor.html                     Detayli rapor sayfasi
|-- parametreler.html              Ayarlar ve yapilandirma sayfasi
|-- manifest.json                  PWA manifest dosyasi
|-- sw.js                          Service Worker (cevrimdisi destek)
|
|-- css/
|   |-- tokens.css                 Tasarim tokenlari (renk, bosluk, radius)
|   |-- base.css                   Temel stiller
|   |-- components.css             Bilesen stilleri
|   |-- pages.css                  Sayfaya ozel stiller
|
|-- js/
|   |-- main.js                    Hesaplayici giris noktasi
|   |-- recete-main.js             Recete sayfasi giris noktasi
|   |-- rapor-main.js              Rapor sayfasi giris noktasi
|   |-- parametreler-main.js       Parametreler sayfasi giris noktasi
|   |
|   |-- config/
|   |   |-- constants.js           Uygulama sabitleri (vergi, modlar)
|   |   |-- categories.js          24 urun kategorisi ve varsayilan degerleri
|   |   |-- commissions.js         Komisyon matrisi (5 pazar x 24 kategori)
|   |   |-- cargo-companies.js     7 kargo sirketi yapilandirmasi
|   |   |-- recipe-templates.js    Hazir recete sablonlari
|   |   |-- config-manager.js      Yapilandirma yonetimi
|   |
|   |-- models/
|   |   |-- calculation-engine.js  Cekirdek hesaplama motoru (4 mod)
|   |   |-- warning-engine.js      Uyari ureteci (8+ kural)
|   |   |-- sensitivity.js         Hassasiyet analizi
|   |   |-- bom-model.js           Recete veri modeli ve islemleri
|   |   |-- desi-calculator.js     Hacimsel agirlik hesaplayici
|   |   |-- material-library.js    Malzeme kutuphanesi
|   |   |-- smart-defaults.js      Kategori bazli otomatik doldurma
|   |   |-- state.js               Global durum yonetimi
|   |
|   |-- services/
|   |   |-- import-export.js       JSON/CSV/XLSX iceri-disari aktarma
|   |   |-- dark-mode.js           Tema yonetimi
|   |   |-- storage.js             localStorage sarmalayicisi
|   |   |-- formatter.js           Para birimi ve sayi bicimlendirme
|   |   |-- share.js               URL paylasimi
|   |
|   |-- views/
|   |   |-- step-wizard.js         Uc adimli form sihirbazi
|   |   |-- category-picker.js     Kategori secim arayuzu
|   |   |-- marketplace-picker.js  Pazar yeri secim arayuzu
|   |   |-- cost-items-view.js     Maliyet kalemleri formu
|   |   |-- campaign-view.js       Kampanya ve indirim arayuzu
|   |   |-- desi-view.js           Desi hesaplayici arayuzu
|   |   |-- cargo-picker-view.js   Kargo sirketi secici
|   |   |-- hero-card-view.js      Ana KPI gosterge karti
|   |   |-- alerts-view.js         Uyari gosterim paneli
|   |   |-- detail-table-view.js   Maliyet detay tablosu
|   |   |-- metrics-view.js        Performans metrikleri
|   |   |-- report-view.js         Rapor gorunumu
|   |   |-- bom-costs-view.js      BOM maliyetleri gorunumu
|   |
|   |-- components/
|   |   |-- spin-box.js            Sayisal giris bileseni
|   |   |-- custom-select.js       Acilir menu bileseni
|   |   |-- tab-bar.js             Sekme navigasyon bileseni
|   |   |-- progress-steps.js      Adim ilerleme gostergesi
|   |   |-- dynamic-list.js        Dinamik satir listesi
|   |   |-- accordion.js           Acilir/kapanir bolumleri
|   |   |-- badge.js               Rozet bileseni
|   |   |-- toast.js               Bildirim bileseni
|   |
|   |-- charts/
|   |   |-- chart-manager.js       Grafik yoneticisi
|   |   |-- cost-pie.js            Maliyet dagilimi pasta grafigi
|   |   |-- cost-breakdown.js      Maliyet kirilimi cubuk grafigi
|   |   |-- comparison-chart.js    Pazar karsilastirma grafigi
|   |   |-- sensitivity-chart.js   Hassasiyet tornado grafigi
|   |
|   |-- utils/
|       |-- decimal-helpers.js     Decimal.js yardimci fonksiyonlari
|       |-- debounce.js            Gecikme (debounce) islevi
|       |-- dom.js                 DOM manipulasyon yardimcilari
|       |-- event-bus.js           Olay yonetim sistemi
```

---

## Teknik Altyapi

### Kullanilan Teknolojiler

| Teknoloji | Surum | Amac |
|-----------|-------|------|
| Vanilla JavaScript | ES6+ | Uygulama mantigi, modul sistemi |
| Decimal.js | 10.4.3 | Yuksek hassasiyetli ondalik matematik |
| ECharts | 5.x | Grafik ve gorsellestirme |
| Simple Statistics | 7.8.3 | Istatistiksel hesaplamalar |
| Tailwind CSS | CDN | Yardimci sinif tabanli stillendirme |
| Tabler Icons | Son surum | Ikon seti (web font) |
| Inter | Google Fonts | Tipografi |
| SheetJS (XLSX) | 0.20.3 | Excel dosyasi olusturma |

### Mimari Yaklasim

- **Cerceve bagimsiz:** Hicbir JavaScript cercevesi (React, Vue, Angular) kullanilmaz. Saf ES6+ modulleri ile gelistirilmistir.
- **Modul deseni:** Her dosya bagimsiz bir ES modulu olarak calisir. Bagimlilklar `import/export` ile yonetilir.
- **Istemci tarafli:** Tum hesaplamalar tarayicida gerceklesir. Sunucu tarafli islem yoktur.
- **Durum yonetimi:** localStorage uzerinden kalici saklama, olay yolu (event bus) ile bilesenler arasi iletisim.
- **CDN bagimlilklari:** Tum ucuncu parti kutuphaneler CDN uzerinden yuklenir. Build veya paket yoneticisi gerektirmez.

### Veri Akisi

```
Kullanici Girisi (fiyat, miktar, maliyet)
    |
    v
Akilli Varsayilanlar (kategori + pazar yerine gore otomatik doldurma)
    |
    v
Hesaplama Motoru (Decimal.js hassas matematik)
    |
    v
Uyari Motoru (is kurallari ile otomatik uyari uretimi)
    |
    v
Hassasiyet Analizi (parametre etki hesaplama)
    |
    v
Arayuz Gorunumleri (KPI karti, tablolar, grafikler, uyarilar)
    |
    v
localStorage (kalici veri saklama)
```

---

## Hesaplama Modlari

Uygulama dort farkli hesaplama modu sunar:

### Mod 1: Satis Tutarina Gore (Varsayilan)

Kullanici satis fiyatini girer, sistem tum maliyet kalemlerini hesaplayarak net kari ve marji goruntular.

### Mod 2: Kar Miktarina Gore

Kullanici hedef kar miktarini (TL) girer, sistem binary search algoritmasi ile gereken satis fiyatini bulur. Elli iterasyonluk sinir ve yuzde bir kuruslik hassasiyetle calisir.

### Mod 3: Kar Marjina Gore

Kullanici hedef net kar marjini (yuzde) girer, sistem o marji saglayacak satis fiyatini hesaplar.

### Mod 4: Kar Oranina Gore

Kullanici hedef kar/maliyet oranini (yuzde) girer, sistem o orani saglayacak satis fiyatini hesaplar.

---

## Desteklenen Pazar Yerleri

Bes satis kanali desteklenir. Her kanal icin 24 urun kategorisine ozel komisyon oranlari tanimlidir (toplam 120 benzersiz komisyon orani).

| Pazar Yeri | Komisyon Araligi | Ozellik |
|------------|------------------|---------|
| Trendyol | %5,5 - %21,5 | En genis kategori yelpazesi |
| Hepsiburada | %4 - %18 | Orta seviye komisyonlar |
| N11 | %5 - %16 | Rekabetci oranlar |
| Amazon TR | %7 - %17 | Uluslararasi platform |
| Kendi Sitem | %0 | Yalnizca odeme komisyonu (%3,49) |

Komisyon oranlari "Parametreler" sayfasindan kullanici tarafindan ozellestirilebilir.

---

## Kargo Sirketleri

Yedi kargo sirketi icin taban ucret ve desi basi ek ucret bilgileri tanimlidir:

| Kargo Sirketi | Taban Ucret | Desi Basi Ucret |
|---------------|-------------|-----------------|
| Yurtici Kargo | 30 TL | 7,50 TL |
| Aras Kargo | 28 TL | 7,00 TL |
| MNG Kargo | 27 TL | 6,50 TL |
| Surat Kargo | 29 TL | 7,00 TL |
| PTT Kargo | 25 TL | 6,00 TL |
| DHL | 45 TL | 12,00 TL |
| UPS | 40 TL | 10,00 TL |

Kargo ucretleri "Parametreler" sayfasindan guncellenebilir. Desi hesabi: `en x boy x yukseklik / 3000` formuluyle yapilir, minimum 1 desi uygulanir.

---

## Urun Kategorileri

24 urun kategorisi desteklenir. Her kategori icin varsayilan KDV orani, iade orani, ambalaj maliyeti ve kargo maliyeti tanimlidir:

| Kategori | Varsayilan KDV | Varsayilan Iade Orani |
|----------|----------------|----------------------|
| Giyim ve Aksesuar | %10 | %25 |
| Elektronik | %20 | %8 |
| Kozmetik | %10 | %12 |
| Ev ve Yasam | %20 | %10 |
| Gida | %1 | %5 |
| Kitap ve Kirtasiye | %10 | %8 |
| Spor ve Outdoor | %20 | %15 |
| Oyuncak ve Hobi | %20 | %12 |
| Otomotiv | %20 | %5 |
| Aksesuar | %20 | %15 |
| Anne ve Bebek | %10 | %18 |
| Ayakkabi | %10 | %30 |
| Bilgisayar ve Tablet | %20 | %5 |
| Beyaz Esya | %20 | %3 |
| Canta | %10 | %20 |
| Cep Telefonu | %20 | %3 |
| Ev Tekstili | %10 | %15 |
| Hobi ve El Isi | %20 | %8 |
| Kisisel Bakim | %10 | %10 |
| Mobilya | %20 | %8 |
| Mucevher ve Taki | %20 | %10 |
| Pet Urunleri | %10 | %8 |
| Saat | %20 | %8 |
| Diger | %20 | %10 |

---

## Vergi ve Kesinti Bilgileri

### KDV Oranlari

Uc KDV dilimi desteklenir: yuzde 1, yuzde 10 ve yuzde 20. KDV hesaplamasinda fiyatin vergi dahil oldugu kabul edilir (ic yuzde yontemi).

### Gelir Vergisi Dilimleri (2025)

| Yillik Gelir Dilimi | Vergi Orani |
|----------------------|-------------|
| 0 - 110.000 TL | %15 |
| 110.000 - 230.000 TL | %20 |
| 230.000 - 580.000 TL | %27 |
| 580.000 - 3.000.000 TL | %35 |
| 3.000.000 TL ustu | %40 |

### E-Ticaret Stopaji

Ocak 2025 itibariyle e-ticaret satis bedellerinin yuzde biri oraninda stopaj kesintisi uygulanir. Bu oran "Parametreler" sayfasindan guncellenebilir.

### Odeme Komisyonu

Kendi sitesi uzerinden satis yapanlar icin varsayilan odeme komisyonu yuzde 3,49'dur (sanal pos / odeme kurulusu kesintisi). Pazar yeri satislarinda bu tutar komisyon icinde kabul edilir.

---

## Uyari Sistemi

Hesaplama sonuclarina gore otomatik olarak uyarilar ve oneriler uretilir. Dort ciddiyet seviyesi vardir:

### Tehlike (Kirmizi)

- **Birim zarar tespiti:** Urun basina zarar varsa basabas fiyat onerisi ile birlikte kullaniciyi uyarir.
- **Iade dahil zarar:** Iadeler hesaba katildiginda zarara donusen durumlar tespit edilir.

### Uyari (Turuncu)

- **Dusuk marj:** Net marj yuzde sifir ile yuzde on arasindaysa, yuzde on bes marj icin hedef fiyat onerisi yapilir.
- **Yuksek iade orani:** Yuzde yirmi bestin uzerindeki iade oranlarinda iyilestirme onerileri sunulur.

### Bilgi (Mavi)

- **Yuksek komisyon:** Yuzde yirminin uzerindeki komisyon oranlarinda kendi site alternatifi one cikarilir.
- **Aylik kar projeksiyonu:** Tahmini aylik net kar tutari gosterilir.

### Basari (Yesil)

- **Saglikli marj:** Net marj yuzde on besin uzerindeyse surdurulebilir fiyatlama onaylanir.

---

## Veri Yonetimi

### Kalici Saklama

Tum veriler tarayicinin localStorage'inda `maliyet_` on ekiyle saklanir. Tarayici kapatilip acildiginda veriler korunur.

### Yedekleme ve Geri Yukleme

- **Tam yedek:** Tum uygulama verilerini tek bir JSON dosyasi olarak disari aktarma ve geri yukleme.
- **Recete aktarimi:** Receteleri bagimsiz JSON dosyasi olarak iceride/disarida aktarma.
- **Parametre sifirlama:** Ozellestirilen komisyon, kargo ve vergi oranlarini fabrika varsayilanlarina dondurme.

### Rapor Disari Aktarma

Rapor sayfasindaki veriler uc formatta disari aktarilabilir:

| Format | Aciklama |
|--------|----------|
| Excel (.xlsx) | SheetJS ile olusturulan Microsoft Excel dosyasi |
| CSV (.csv) | UTF-8 BOM destekli, Turkce karakterlerle uyumlu |
| JSON (.json) | Makine tarafindan okunabilir yapili veri |

---

## Tarayici Destegi

| Tarayici | Destek |
|----------|--------|
| Chrome / Chromium | Tam destek (PWA dahil) |
| Firefox | Tam destek |
| Safari / iOS Safari | Tam destek |
| Edge | Tam destek |

Uygulama PWA olarak mobil ve masaustu cihazlara yuklenebilir. Service Worker ile cevrimdisi calisma desteklenir.

---

## Lisans

Bu proje MIT Lisansi ile lisanslanmistir.
