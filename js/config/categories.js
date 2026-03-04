/**
 * @module Categories
 * @description Ürün kategorileri — Tabler ikon sınıfları ile (24 kategori)
 */

/**
 * @typedef {Object} Kategori
 * @property {string} ad - Görüntüleme adı
 * @property {string} ikon - Tabler ikon sınıfı
 * @property {number} kdv - KDV oranı (%)
 * @property {number} iade - Varsayılan iade oranı (%)
 * @property {number} ambalaj - Varsayılan ambalaj maliyeti (TL)
 * @property {number} kargo - Varsayılan kargo ücreti (TL)
 */

/** @type {Object<string, Kategori>} */
export const KATEGORILER = Object.freeze({
  giyim: {
    ad: 'Giyim & Aksesuar',
    ikon: 'ti-shirt',
    kdv: 10,
    iade: 30,
    ambalaj: 5,
    kargo: 25,
  },
  elektronik: {
    ad: 'Elektronik',
    ikon: 'ti-cpu',
    kdv: 20,
    iade: 12,
    ambalaj: 10,
    kargo: 35,
  },
  kozmetik: {
    ad: 'Kozmetik',
    ikon: 'ti-bottle',
    kdv: 20,
    iade: 15,
    ambalaj: 4,
    kargo: 22,
  },
  ev_yasam: {
    ad: 'Ev & Yaşam',
    ikon: 'ti-home',
    kdv: 20,
    iade: 18,
    ambalaj: 8,
    kargo: 32,
  },
  gida: {
    ad: 'Gıda',
    ikon: 'ti-apple',
    kdv: 10,
    iade: 5,
    ambalaj: 3,
    kargo: 28,
  },
  kitap: {
    ad: 'Kitap & Kırtasiye',
    ikon: 'ti-book',
    kdv: 10,
    iade: 8,
    ambalaj: 3,
    kargo: 20,
  },
  spor: {
    ad: 'Spor & Outdoor',
    ikon: 'ti-ball-football',
    kdv: 20,
    iade: 20,
    ambalaj: 6,
    kargo: 30,
  },
  oyuncak: {
    ad: 'Oyuncak & Hobi',
    ikon: 'ti-puzzle',
    kdv: 20,
    iade: 15,
    ambalaj: 5,
    kargo: 28,
  },
  otomotiv: {
    ad: 'Otomotiv',
    ikon: 'ti-car',
    kdv: 20,
    iade: 10,
    ambalaj: 8,
    kargo: 35,
  },
  aksesuar: {
    ad: 'Aksesuar',
    ikon: 'ti-diamond',
    kdv: 20,
    iade: 25,
    ambalaj: 3,
    kargo: 20,
  },
  anne_bebek: {
    ad: 'Anne & Bebek',
    ikon: 'ti-baby-carriage',
    kdv: 10,
    iade: 18,
    ambalaj: 5,
    kargo: 25,
  },
  ayakkabi: {
    ad: 'Ayakkabı',
    ikon: 'ti-shoe',
    kdv: 10,
    iade: 35,
    ambalaj: 4,
    kargo: 25,
  },
  bilgisayar: {
    ad: 'Bilgisayar & Tablet',
    ikon: 'ti-device-laptop',
    kdv: 20,
    iade: 8,
    ambalaj: 15,
    kargo: 40,
  },
  beyaz_esya: {
    ad: 'Beyaz Eşya',
    ikon: 'ti-wash-machine',
    kdv: 20,
    iade: 5,
    ambalaj: 20,
    kargo: 80,
  },
  canta: {
    ad: 'Çanta',
    ikon: 'ti-briefcase',
    kdv: 20,
    iade: 22,
    ambalaj: 4,
    kargo: 22,
  },
  cep_telefonu: {
    ad: 'Cep Telefonu',
    ikon: 'ti-device-mobile-vibration',
    kdv: 20,
    iade: 6,
    ambalaj: 8,
    kargo: 30,
  },
  ev_tekstil: {
    ad: 'Ev Tekstili',
    ikon: 'ti-ironing-1',
    kdv: 10,
    iade: 20,
    ambalaj: 5,
    kargo: 28,
  },
  hobi: {
    ad: 'Hobi & El İşi',
    ikon: 'ti-palette',
    kdv: 20,
    iade: 10,
    ambalaj: 4,
    kargo: 22,
  },
  kisisel_bakim: {
    ad: 'Kişisel Bakım',
    ikon: 'ti-razor',
    kdv: 20,
    iade: 12,
    ambalaj: 4,
    kargo: 22,
  },
  mobilya: {
    ad: 'Mobilya',
    ikon: 'ti-armchair',
    kdv: 20,
    iade: 8,
    ambalaj: 25,
    kargo: 100,
  },
  mucevher: {
    ad: 'Mücevher & Takı',
    ikon: 'ti-rings',
    kdv: 20,
    iade: 15,
    ambalaj: 3,
    kargo: 20,
  },
  pet: {
    ad: 'Pet Ürünleri',
    ikon: 'ti-paw',
    kdv: 10,
    iade: 10,
    ambalaj: 5,
    kargo: 28,
  },
  saat: {
    ad: 'Saat',
    ikon: 'ti-clock',
    kdv: 20,
    iade: 12,
    ambalaj: 4,
    kargo: 20,
  },
  diger: {
    ad: 'Diğer',
    ikon: 'ti-package',
    kdv: 20,
    iade: 15,
    ambalaj: 5,
    kargo: 25,
  },
});

/** Kategori ID listesi */
export const KATEGORI_LISTESI = Object.keys(KATEGORILER);
