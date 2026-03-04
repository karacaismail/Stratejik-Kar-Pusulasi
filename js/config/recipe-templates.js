/**
 * @module RecipeTemplates
 * @description Hazır reçete şablonları — yaygın ürün tipleri için başlangıç noktası
 */

const m = (ad, birim, miktar, birimFiyat) => ({
  id: `tpl_${ad.replace(/\s/g, '_').toLowerCase()}_${Math.random().toString(36).slice(2, 6)}`,
  ad, birim, miktar, birimFiyat,
});

export const RECETE_SABLONLARI = Object.freeze([
  Object.freeze({
    id: 'tpl_tshirt',
    ad: 'T-Shirt (Baskılı)',
    hammaddeler: [
      m('Penye kumaş', 'metre', 0.5, 80),
      m('Dikiş ipliği', 'gr', 10, 0.15),
      m('Etiket (yıkama talimatı)', 'adet', 1, 1.5),
      m('Baskı transfer', 'adet', 1, 12),
    ],
    ambalajlar: [
      m('OPP poşet', 'adet', 1, 0.75),
      m('Karton etiket', 'adet', 1, 1),
      m('Bant', 'adet', 1, 0.25),
    ],
    iscilik: 5, enerji: 0.5, depolama: 0, digerMasraf: 0, ekstra: 0,
  }),

  Object.freeze({
    id: 'tpl_kupa',
    ad: 'Baskılı Kupa',
    hammaddeler: [
      m('Seramik kupa (beyaz)', 'adet', 1, 15),
      m('Süblimasyon baskı mürekkebi', 'ml', 20, 0.8),
      m('Transfer kağıdı', 'adet', 1, 2),
    ],
    ambalajlar: [
      m('Balonlu naylon', 'metre', 0.3, 5),
      m('Mukavva kutu', 'adet', 1, 4),
      m('Bant', 'adet', 1, 0.25),
    ],
    iscilik: 3, enerji: 1, depolama: 0, digerMasraf: 0, ekstra: 0,
  }),

  Object.freeze({
    id: 'tpl_sabun',
    ad: 'El Yapımı Sabun',
    hammaddeler: [
      m('Zeytinyağı', 'gr', 100, 0.12),
      m('Hindistancevizi yağı', 'gr', 50, 0.18),
      m('NaOH (sodyum hidroksit)', 'gr', 15, 0.08),
      m('Esans yağı', 'ml', 5, 1.2),
      m('Doğal renklendirici', 'gr', 2, 0.5),
    ],
    ambalajlar: [
      m('Kraft kağıt', 'adet', 1, 1.5),
      m('Etiket sticker', 'adet', 1, 0.8),
      m('İp/kurdele', 'cm', 30, 0.03),
    ],
    iscilik: 2, enerji: 0.3, depolama: 0.5, digerMasraf: 0, ekstra: 0,
  }),

  Object.freeze({
    id: 'tpl_kozmetik',
    ad: 'Kozmetik Kit (3\'lü Set)',
    hammaddeler: [
      m('Nemlendirici krem', 'ml', 50, 0.6),
      m('Şampuan', 'ml', 100, 0.25),
      m('Vücut losyonu', 'ml', 75, 0.35),
      m('Plastik şişe (50ml)', 'adet', 1, 2),
      m('Plastik şişe (100ml)', 'adet', 1, 2.5),
      m('Plastik şişe (75ml)', 'adet', 1, 2.2),
    ],
    ambalajlar: [
      m('Karton kutu (set)', 'adet', 1, 6),
      m('İç separatör', 'adet', 1, 1.5),
      m('Etiket (x3)', 'adet', 3, 0.6),
    ],
    iscilik: 4, enerji: 1, depolama: 0.5, digerMasraf: 0, ekstra: 0,
  }),

  Object.freeze({
    id: 'tpl_taki',
    ad: 'Takı / Aksesuar',
    hammaddeler: [
      m('925 ayar gümüş', 'gr', 5, 18),
      m('Doğal taş (akik/turkuaz)', 'adet', 2, 8),
      m('Klips/kilit', 'adet', 1, 3),
      m('Zincir', 'cm', 45, 0.5),
    ],
    ambalajlar: [
      m('Kadife kutu', 'adet', 1, 5),
      m('OPP poşet', 'adet', 1, 0.5),
      m('Garanti kartı', 'adet', 1, 0.8),
    ],
    iscilik: 8, enerji: 0.5, depolama: 0, digerMasraf: 0, ekstra: 0,
  }),

  Object.freeze({
    id: 'tpl_mum',
    ad: 'El Yapımı Mum',
    hammaddeler: [
      m('Soya mumu / Parafin', 'gr', 200, 0.06),
      m('Fitil', 'cm', 15, 0.1),
      m('Esans yağı', 'ml', 3, 1.5),
      m('Boya pigment', 'gr', 1, 0.8),
    ],
    ambalajlar: [
      m('Cam kavanoz', 'adet', 1, 6),
      m('Etiket sticker', 'adet', 1, 0.8),
      m('Kapak', 'adet', 1, 1.5),
    ],
    iscilik: 2, enerji: 0.5, depolama: 0, digerMasraf: 0, ekstra: 0,
  }),

  Object.freeze({
    id: 'tpl_gida',
    ad: 'Organik Gıda Paketi',
    hammaddeler: [
      m('Ana ürün (kuruyemiş/baharat)', 'gr', 500, 0.08),
      m('Baharat/katkı', 'gr', 10, 0.3),
    ],
    ambalajlar: [
      m('Doypack ambalaj', 'adet', 1, 2.5),
      m('Etiket (barkodlu)', 'adet', 1, 0.6),
      m('Koli', 'adet', 0.1, 8),
    ],
    iscilik: 1, enerji: 0.3, depolama: 1, digerMasraf: 0, ekstra: 0,
  }),

  Object.freeze({
    id: 'tpl_kilif',
    ad: 'Telefon Kılıfı (Baskılı)',
    hammaddeler: [
      m('Silikon kılıf (boş)', 'adet', 1, 8),
      m('UV baskı mürekkebi', 'ml', 2, 1.5),
    ],
    ambalajlar: [
      m('OPP poşet', 'adet', 1, 0.5),
      m('Karton etiket', 'adet', 1, 0.8),
    ],
    iscilik: 1.5, enerji: 0.5, depolama: 0, digerMasraf: 0, ekstra: 0,
  }),
]);

/** Şablon adları listesi (dropdown için) */
export const SABLON_LISTESI = RECETE_SABLONLARI.map((s) => ({
  id: s.id,
  ad: s.ad,
}));
