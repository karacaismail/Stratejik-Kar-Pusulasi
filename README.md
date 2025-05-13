# Titanlar Stratejik Kâr Pusulası


## Stratejik Kâr Pusulası - E-Ticaret Kârlılık Analiz Platformu

**Stratejik Kâr Pusulası**, e-ticaret satıcılarının ürün ve operasyon kârlılığını detaylı bir şekilde analiz etmelerini, fiyatlandırma stratejileri geliştirmelerini ve kârlılıklarını optimize etmelerini sağlayan kapsamlı bir hesaplama ve analiz aracıdır.

## Projenin Amacı

Bu platformun temel amacı, e-ticaret dünyasındaki satıcıların karşılaştığı karmaşık maliyet yapılarını (ürün maliyeti, KDV, kargo ücretleri, pazar yeri komisyonları, ek giderler vb.) şeffaf bir şekilde yönetmelerine yardımcı olmaktır. Stratejik Kâr Pusulası, kullanıcıların:

* Her bir ürün veya satış senaryosu için net kârı ve kâr marjını doğru bir şekilde hesaplamasını,
* Farklı kargo firmaları ve pazar yerleri için maliyetleri karşılaştırmasını,
* İstenen kâr hedeflerine ulaşmak için optimum satış fiyatlarını belirlemesini,
* Veriye dayalı stratejik kararlar alarak e-ticaret operasyonlarının verimliliğini ve kârlılığını artırmasını sağlamaktır.

## Temel Özellikler

* **Detaylı Maliyet Girişi:** Ürün alış fiyatı, KDV oranları, ek operasyonel giderler.
* **Dinamik Kargo Ücreti Hesaplama:**
    * Farklı kargo firmaları için tanımlanabilir parametreler.
    * Ağırlık (desi/kg) bazında kademeli fiyatlandırma.
    * Kullanıcı tarafından kaydedilebilir ve yönetilebilir kargo profilleri.
* **Esnek Pazar Yeri Komisyonu Hesaplama:**
    * Farklı pazar yerleri için tanımlanabilir komisyon oranları.
    * Kategori bazlı farklı komisyon oranları tanımlayabilme.
    * Kullanıcı tarafından kaydedilebilir ve yönetilebilir pazar yeri profilleri.
* **Kârlılık Analizi:**
    * Net kâr hesaplama.
    * Kâr marjı (yüzdesel) hesaplama.
    * İstenen net kâr miktarına veya kâr marjına göre tahmini satış fiyatı önerme.
    * Başabaş noktası analizi için potansiyel.
* **Senaryo Bazlı Hesaplama:** Farklı parametrelerle birden fazla senaryo oluşturup sonuçları karşılaştırma.
* **Veri Depolama:** Tarayıcının `localStorage` özelliği sayesinde kargo ve pazar yeri parametrelerini kaydetme ve sonraki kullanımlar için hızlı erişim.
* **Grafiksel Raporlama:** Hesaplanan maliyet ve kâr dağılımlarını Chart.js ile görselleştirme (örneğin, maliyet kalemlerinin payı).
* **Kullanıcı Dostu Arayüz:** Metronic Bootstrap teması ile geliştirilmiş, anlaşılır ve kolay kullanımlı arayüz.

## Kullanılan Teknolojiler

* **Ön Yüz (Frontend):**
    * HTML5
    * CSS3 (SCSS ile geliştirilmiş)
    * JavaScript (ES6+)
    * jQuery 3.6.0
* **UI Kütüphanesi:**
    * Metronic (Bootstrap 5 tabanlı Admin Dashboard Teması)
    * Bootstrap 5
* **Grafik Kütüphanesi:**
    * Chart.js
* **Gelişmiş Arayüz Bileşenleri:**
    * Select2 (Gelişmiş seçim kutuları için)
* **Veri Depolama (Client-Side):**
    * Tarayıcı `localStorage`

## Yazılımın Faydaları

* **Bilinçli Fiyatlandırma:** Ürünlerinizi doğru fiyatlandırarak kârınızı maksimize edin ve zarardan kaçının.
* **Kârlılık Optimizasyonu:** Hangi ürünlerin, kargo seçeneklerinin veya pazar yerlerinin daha kârlı olduğunu analiz edin.
* **Risk Yönetimi:** Potansiyel maliyet artışlarının veya komisyon değişikliklerinin kârlılığınıza etkisini önceden görün.
* **Stratejik Karar Verme:** Veriye dayalı analizlerle e-ticaret stratejilerinizi güçlendirin.
* **Operasyonel Verimlilik:** Karmaşık hesaplamaları otomatikleştirerek zaman kazanın.
* **Pazarlık Gücü:** Kargo firmaları veya tedarikçilerle yapacağınız anlaşmalarda maliyetleriniz hakkında net bilgiye sahip olun.

## Avantajları

* **E-ticarete Özel Detaylar:** Genel hesap makinelerinin aksine, kargo desi/kg hesapları, pazar yeri kategori komisyonları gibi e-ticarete özgü kritik değişkenleri dikkate alır.
* **Özelleştirilebilirlik:** Sık kullandığınız kargo ve pazar yeri parametrelerini kaydederek kişiselleştirilmiş bir deneyim sunar.
* **Anlık Sonuçlar:** Girdiğiniz verilerle anında hesaplama yapar ve sonuçları gösterir.
* **Çevrimdışı Çalışabilirlik:** Temel hesaplama ve parametre yönetimi sunucuya ihtiyaç duymadan, doğrudan tarayıcı üzerinde çalışır.
* **Modern ve Profesyonel Arayüz:** Metronic teması sayesinde kullanıcı dostu ve estetik bir arayüze sahiptir.

## Diğer Emsallerinden Farkları

* **Derinlemesine Parametrizasyon:** Stratejik Kâr Pusulası, özellikle kargo ve pazar yeri komisyonları için çok katmanlı ve detaylı parametre girişine olanak tanır. Bu, gerçek dünya senaryolarına daha yakın hesaplamalar yapılmasını sağlar.
* **Senaryo Kaydetme ve Yönetimi:** Sadece anlık hesaplama yapmakla kalmaz, kullanıcıların kendi kargo anlaşmalarını ve pazar yeri komisyon yapılarını kaydedip yönetmelerine olanak tanır.
* **Stratejik Kâr Hedefleme:** Sadece mevcut durumu hesaplamakla kalmaz, "belirli bir net kâr elde etmek için satış fiyatı ne olmalı?" gibi proaktif sorulara yanıt arar.
* **Entegre Tema ve Bileşenler:** Metronic gibi güçlü bir admin teması üzerine kurulu olması, geliştirme sürecini hızlandırırken, son kullanıcıya da tutarlı ve zengin bir deneyim sunar.

## Kurulum

Stratejik Kâr Pusulası, istemci taraflı bir uygulama olduğu için kurulumu oldukça basittir:

1.  Proje dosyalarını bir web sunucusunun yayın dizinine kopyalayın.
2.  Veya `index.html` dosyasını doğrudan modern bir web tarayıcısında (Chrome, Firefox, Edge vb.) açın.

Herhangi bir sunucu taraflı dil veya veritabanı kurulumu gerektirmez (mevcut yapıya göre).

## Kullanım Kılavuzu

1.  **Satış Bilgileri Sekmesi:**
    * Ürününüzün **Alış Fiyatı (Net)**, **KDV Oranı (%)**, **Satış Fiyatı (KDV Dahil)** gibi temel bilgilerini girin.
    * Beklenen **Kargo Desi/Kg** değerini belirtin.
    * Varsa **Ek Giderleri** (paketleme, reklam vb.) girin.
    * Hesaplama yapmak istediğiniz **Kargo Firmasını** ve **Pazar Yerini** seçin.
    * Pazar yeri için ilgili **Kategoriyi** seçin.
    * **İstenen Net Kâr (TL)** veya **İstenen Kâr Marjı (%)** alanlarından birini doldurarak, bu hedefe ulaşmak için gereken satış fiyatını simüle edebilirsiniz.
    * "HESAPLA" butonuna tıklayarak sonuçları (Net Kâr, Kâr Marjı, Maliyet Dağılımı vb.) görün.
2.  **Parametreler Sekmesi:**
    * **Kargo Parametreleri:**
        * Yeni kargo firması ekleyebilir veya mevcutları düzenleyebilirsiniz.
        * Her firma için desi/kg aralıklarına göre fiyat tanımlayabilirsiniz.
        * Yaptığınız değişiklikleri "Tüm Kargoları Kaydet" butonu ile tarayıcınızın yerel depolamasına kaydedebilirsiniz.
    * **Pazar Yeri Parametreleri:**
        * Yeni pazar yeri ekleyebilir veya mevcutları düzenleyebilirsiniz.
        * Her pazar yeri için farklı kategorilere özel komisyon oranları tanımlayabilirsiniz.
        * Değişikliklerinizi "Tüm Pazarları Kaydet" ve "Kategorileri Kaydet" butonları ile kaydedebilirsiniz.

## Geliştirme Süreci ve Katkıda Bulunma

Stratejik Kâr Pusulası, e-ticaret satıcılarının ihtiyaç duyduğu temel kârlılık hesaplamalarını sunmak üzere `app-calc.js` çekirdek mantığıyla geliştirilmeye başlanmıştır. Metronic tema entegrasyonu ile kullanıcı arayüzü zenginleştirilmiş, dinamik kargo ve pazar yeri parametre yönetimi eklenmiştir.

**Gelecek Planları:**

* Daha fazla pazar yeri ve kargo firması için ön tanımlı şablonlar.
* API entegrasyonları ile güncel kargo fiyatları veya komisyon oranlarını çekebilme.
* Çoklu ürün kârlılık analizi ve sepet bazlı hesaplamalar.
* Daha gelişmiş raporlama ve veri dışa aktarma seçenekleri.
* Kullanıcı hesabı ve bulut tabanlı veri senkronizasyonu.

**Katkıda Bulunmak İçin:**

Stratejik Kâr Pusulası açık kaynak bir proje olmamakla birlikte (eğer öyleyse bu bölümü güncelleyebilirsiniz), projenin gelişimine fikirlerinizle veya geri bildirimlerinizle katkıda bulunabilirsiniz. Eğer proje açık kaynak ise:

1.  Bu repoyu fork edin.
2.  Yeni bir özellik veya hata düzeltme için bir branch oluşturun (`git checkout -b feature/yeni-mukemmel-ozellik`).
3.  Değişikliklerinizi commit edin (`git commit -am 'Yeni mükemmel özellik eklendi'`).
4.  Branch'inizi push edin (`git push origin feature/yeni-mukemmel-ozellik`).
5.  Bir Pull Request (PR) açın.

## Kod Örnekleri

Aşağıda `app-calc.js` dosyasından, projenin mantığını yansıtan basitleştirilmiş kod parçacıkları bulunmaktadır.

**Örnek: Kargo Parametresi Ekleme (Basitleştirilmiş)**

```javascript
// app-calc.js'den bir kesit (kargoParamVar.creatItem benzeri)
function displayCargoParameters(cargoData) {
    const listElement = document.getElementById('kargo-listesi');
    listElement.innerHTML = ''; // Önceki listeyi temizle

    cargoData.forEach(cargo => {
        const listItem = document.createElement('li');
        listItem.textContent = `Firma: ${cargo.name}, Fiyat: ${cargo.priceRanges[0].price} TL`;
        // ... daha fazla detay ve düzenleme/silme butonları eklenebilir ...
        listElement.appendChild(listItem);
    });
} Stratejik Kâr Pusulası - E-Ticaret Kârlılık Analiz Platformu

**Stratejik Kâr Pusulası**, e-ticaret satıcılarının ürün ve operasyon kârlılığını detaylı bir şekilde analiz etmelerini, fiyatlandırma stratejileri geliştirmelerini ve kârlılıklarını optimize etmelerini sağlayan kapsamlı bir hesaplama ve analiz aracıdır.

## Projenin Amacı

Bu platformun temel amacı, e-ticaret dünyasındaki satıcıların karşılaştığı karmaşık maliyet yapılarını (ürün maliyeti, KDV, kargo ücretleri, pazar yeri komisyonları, ek giderler vb.) şeffaf bir şekilde yönetmelerine yardımcı olmaktır. Stratejik Kâr Pusulası, kullanıcıların:

* Her bir ürün veya satış senaryosu için net kârı ve kâr marjını doğru bir şekilde hesaplamasını,
* Farklı kargo firmaları ve pazar yerleri için maliyetleri karşılaştırmasını,
* İstenen kâr hedeflerine ulaşmak için optimum satış fiyatlarını belirlemesini,
* Veriye dayalı stratejik kararlar alarak e-ticaret operasyonlarının verimliliğini ve kârlılığını artırmasını sağlamaktır.

## Temel Özellikler

* **Detaylı Maliyet Girişi:** Ürün alış fiyatı, KDV oranları, ek operasyonel giderler.
* **Dinamik Kargo Ücreti Hesaplama:**
    * Farklı kargo firmaları için tanımlanabilir parametreler.
    * Ağırlık (desi/kg) bazında kademeli fiyatlandırma.
    * Kullanıcı tarafından kaydedilebilir ve yönetilebilir kargo profilleri.
* **Esnek Pazar Yeri Komisyonu Hesaplama:**
    * Farklı pazar yerleri için tanımlanabilir komisyon oranları.
    * Kategori bazlı farklı komisyon oranları tanımlayabilme.
    * Kullanıcı tarafından kaydedilebilir ve yönetilebilir pazar yeri profilleri.
* **Kârlılık Analizi:**
    * Net kâr hesaplama.
    * Kâr marjı (yüzdesel) hesaplama.
    * İstenen net kâr miktarına veya kâr marjına göre tahmini satış fiyatı önerme.
    * Başabaş noktası analizi için potansiyel.
* **Senaryo Bazlı Hesaplama:** Farklı parametrelerle birden fazla senaryo oluşturup sonuçları karşılaştırma.
* **Veri Depolama:** Tarayıcının `localStorage` özelliği sayesinde kargo ve pazar yeri parametrelerini kaydetme ve sonraki kullanımlar için hızlı erişim.
* **Grafiksel Raporlama:** Hesaplanan maliyet ve kâr dağılımlarını Chart.js ile görselleştirme (örneğin, maliyet kalemlerinin payı).
* **Kullanıcı Dostu Arayüz:** Metronic Bootstrap teması ile geliştirilmiş, anlaşılır ve kolay kullanımlı arayüz.

## Kullanılan Teknolojiler

* **Ön Yüz (Frontend):**
    * HTML5
    * CSS3 (SCSS ile geliştirilmiş)
    * JavaScript (ES6+)
    * jQuery 3.6.0
* **UI Kütüphanesi:**
    * Metronic (Bootstrap 5 tabanlı Admin Dashboard Teması)
    * Bootstrap 5
* **Grafik Kütüphanesi:**
    * Chart.js
* **Gelişmiş Arayüz Bileşenleri:**
    * Select2 (Gelişmiş seçim kutuları için)
* **Veri Depolama (Client-Side):**
    * Tarayıcı `localStorage`

## Yazılımın Faydaları

* **Bilinçli Fiyatlandırma:** Ürünlerinizi doğru fiyatlandırarak kârınızı maksimize edin ve zarardan kaçının.
* **Kârlılık Optimizasyonu:** Hangi ürünlerin, kargo seçeneklerinin veya pazar yerlerinin daha kârlı olduğunu analiz edin.
* **Risk Yönetimi:** Potansiyel maliyet artışlarının veya komisyon değişikliklerinin kârlılığınıza etkisini önceden görün.
* **Stratejik Karar Verme:** Veriye dayalı analizlerle e-ticaret stratejilerinizi güçlendirin.
* **Operasyonel Verimlilik:** Karmaşık hesaplamaları otomatikleştirerek zaman kazanın.
* **Pazarlık Gücü:** Kargo firmaları veya tedarikçilerle yapacağınız anlaşmalarda maliyetleriniz hakkında net bilgiye sahip olun.

## Avantajları

* **E-ticarete Özel Detaylar:** Genel hesap makinelerinin aksine, kargo desi/kg hesapları, pazar yeri kategori komisyonları gibi e-ticarete özgü kritik değişkenleri dikkate alır.
* **Özelleştirilebilirlik:** Sık kullandığınız kargo ve pazar yeri parametrelerini kaydederek kişiselleştirilmiş bir deneyim sunar.
* **Anlık Sonuçlar:** Girdiğiniz verilerle anında hesaplama yapar ve sonuçları gösterir.
* **Çevrimdışı Çalışabilirlik:** Temel hesaplama ve parametre yönetimi sunucuya ihtiyaç duymadan, doğrudan tarayıcı üzerinde çalışır.
* **Modern ve Profesyonel Arayüz:** Metronic teması sayesinde kullanıcı dostu ve estetik bir arayüze sahiptir.

## Diğer Emsallerinden Farkları

* **Derinlemesine Parametrizasyon:** Stratejik Kâr Pusulası, özellikle kargo ve pazar yeri komisyonları için çok katmanlı ve detaylı parametre girişine olanak tanır. Bu, gerçek dünya senaryolarına daha yakın hesaplamalar yapılmasını sağlar.
* **Senaryo Kaydetme ve Yönetimi:** Sadece anlık hesaplama yapmakla kalmaz, kullanıcıların kendi kargo anlaşmalarını ve pazar yeri komisyon yapılarını kaydedip yönetmelerine olanak tanır.
* **Stratejik Kâr Hedefleme:** Sadece mevcut durumu hesaplamakla kalmaz, "belirli bir net kâr elde etmek için satış fiyatı ne olmalı?" gibi proaktif sorulara yanıt arar.
* **Entegre Tema ve Bileşenler:** Metronic gibi güçlü bir admin teması üzerine kurulu olması, geliştirme sürecini hızlandırırken, son kullanıcıya da tutarlı ve zengin bir deneyim sunar.

## Kurulum

Stratejik Kâr Pusulası, istemci taraflı bir uygulama olduğu için kurulumu oldukça basittir:

1.  Proje dosyalarını bir web sunucusunun yayın dizinine kopyalayın.
2.  Veya `index.html` dosyasını doğrudan modern bir web tarayıcısında (Chrome, Firefox, Edge vb.) açın.

Herhangi bir sunucu taraflı dil veya veritabanı kurulumu gerektirmez (mevcut yapıya göre).

## Kullanım Kılavuzu

1.  **Satış Bilgileri Sekmesi:**
    * Ürününüzün **Alış Fiyatı (Net)**, **KDV Oranı (%)**, **Satış Fiyatı (KDV Dahil)** gibi temel bilgilerini girin.
    * Beklenen **Kargo Desi/Kg** değerini belirtin.
    * Varsa **Ek Giderleri** (paketleme, reklam vb.) girin.
    * Hesaplama yapmak istediğiniz **Kargo Firmasını** ve **Pazar Yerini** seçin.
    * Pazar yeri için ilgili **Kategoriyi** seçin.
    * **İstenen Net Kâr (TL)** veya **İstenen Kâr Marjı (%)** alanlarından birini doldurarak, bu hedefe ulaşmak için gereken satış fiyatını simüle edebilirsiniz.
    * "HESAPLA" butonuna tıklayarak sonuçları (Net Kâr, Kâr Marjı, Maliyet Dağılımı vb.) görün.
2.  **Parametreler Sekmesi:**
    * **Kargo Parametreleri:**
        * Yeni kargo firması ekleyebilir veya mevcutları düzenleyebilirsiniz.
        * Her firma için desi/kg aralıklarına göre fiyat tanımlayabilirsiniz.
        * Yaptığınız değişiklikleri "Tüm Kargoları Kaydet" butonu ile tarayıcınızın yerel depolamasına kaydedebilirsiniz.
    * **Pazar Yeri Parametreleri:**
        * Yeni pazar yeri ekleyebilir veya mevcutları düzenleyebilirsiniz.
        * Her pazar yeri için farklı kategorilere özel komisyon oranları tanımlayabilirsiniz.
        * Değişikliklerinizi "Tüm Pazarları Kaydet" ve "Kategorileri Kaydet" butonları ile kaydedebilirsiniz.

## Geliştirme Süreci ve Katkıda Bulunma

Stratejik Kâr Pusulası, e-ticaret satıcılarının ihtiyaç duyduğu temel kârlılık hesaplamalarını sunmak üzere `app-calc.js` çekirdek mantığıyla geliştirilmeye başlanmıştır. Metronic tema entegrasyonu ile kullanıcı arayüzü zenginleştirilmiş, dinamik kargo ve pazar yeri parametre yönetimi eklenmiştir.

**Gelecek Planları:**

* Daha fazla pazar yeri ve kargo firması için ön tanımlı şablonlar.
* API entegrasyonları ile güncel kargo fiyatları veya komisyon oranlarını çekebilme.
* Çoklu ürün kârlılık analizi ve sepet bazlı hesaplamalar.
* Daha gelişmiş raporlama ve veri dışa aktarma seçenekleri.
* Kullanıcı hesabı ve bulut tabanlı veri senkronizasyonu.

**Katkıda Bulunmak İçin:**

Stratejik Kâr Pusulası açık kaynak bir proje olmamakla birlikte (eğer öyleyse bu bölümü güncelleyebilirsiniz), projenin gelişimine fikirlerinizle veya geri bildirimlerinizle katkıda bulunabilirsiniz. Eğer proje açık kaynak ise:

1.  Bu repoyu fork edin.
2.  Yeni bir özellik veya hata düzeltme için bir branch oluşturun (`git checkout -b feature/yeni-mukemmel-ozellik`).
3.  Değişikliklerinizi commit edin (`git commit -am 'Yeni mükemmel özellik eklendi'`).
4.  Branch'inizi push edin (`git push origin feature/yeni-mukemmel-ozellik`).
5.  Bir Pull Request (PR) açın.

## Kod Örnekleri

Aşağıda `app-calc.js` dosyasından, projenin mantığını yansıtan basitleştirilmiş kod parçacıkları bulunmaktadır.

**Örnek: Kargo Parametresi Ekleme (Basitleştirilmiş)**

```javascript
// app-calc.js'den bir kesit (kargoParamVar.creatItem benzeri)
function displayCargoParameters(cargoData) {
    const listElement = document.getElementById('kargo-listesi');
    listElement.innerHTML = ''; // Önceki listeyi temizle

    cargoData.forEach(cargo => {
        const listItem = document.createElement('li');
        listItem.textContent = `Firma: ${cargo.name}, Fiyat: ${cargo.priceRanges[0].price} TL`;
        // ... daha fazla detay ve düzenleme/silme butonları eklenebilir ...
        listElement.appendChild(listItem);
    });
}
