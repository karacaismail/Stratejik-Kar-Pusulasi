// Inputs
const calculatorForm = document.getElementById('calculatorForm');
const hesapType = document.getElementById('hesapType');
const kargoType = document.getElementById('kargoType');
const pazarType = document.getElementById('pazarType');
const gelirVergiType = document.getElementById("gelirVergiType");
const kdvType = document.getElementById("kdvType");
const kategoriType = document.getElementById("kategoriType");
const alis = document.getElementById("alis_input");
const hesapType_input = document.getElementById("hesapType_input");
const ekMasraf = document.getElementById("ekMasraf_input");
const ambalaj_input = document.getElementById("ambalaj_input");
const iscilik_input = document.getElementById("iscilik_input");
const kargoType_input = document.getElementById("kargoType_input");
const pazarType_input = document.getElementById("pazarType_input");
const kampanya_input = document.getElementById('kampanya_input');
const indirim_input = document.getElementById('indirim_input');
const paylasBtn = document.getElementById("paylasBtn");
// Dividers
const vl4 = document.getElementById('vl4');
const vl6 = document.getElementById('vl6');
// Kargo Parameter Variables
const kargoForm = document.getElementById('kargoForm');
const kargoParamType_input = document.getElementById('kargoParamType_input');
const btnDeleteAllKargo = document.getElementById('btnDeleteAllKargo');
const kargo_list = document.getElementById('kargo_list');
const kargoParamType = document.getElementById("kargoParamType");
// Pazar Parameter Variables
const pazarForm = document.getElementById('pazarForm');
const pazarParamType_input = document.getElementById('pazarParamType_input');
const btnDeleteAllPazar = document.getElementById('btnDeleteAllPazar');
const pazar_list = document.getElementById('pazar_list');
const pazarParamType = document.getElementById("pazarParamType");
// Outputs
const satisBirim = document.getElementById("satisBirim");
const netKar = document.getElementById("netKarBirim");
const karMarj = document.getElementById("karMarjBirim");
const karOran = document.getElementById("karOranBirim");
const kdv = document.getElementById("kdvBirim");
const gelirVergi = document.getElementById("gelirVergiBirim");
const gider = document.getElementById("giderBirim");
const vergidenOnce = document.getElementById("vergidenOnceBirim");
const brutMarj = document.getElementById("brutMarjBirim");
const netMarj = document.getElementById("netMarjBirim");
const matrah = document.getElementById("matrahBirim");
const giderVergisiz = document.getElementById("giderVergisizBirim");
const calcBirim = document.getElementById("calcBirim");
const vergilerToplamiBirim = document.getElementById("vergilerToplamiBirim");
const alisFiyatiBirim = document.getElementById("alisFiyatiBirim");
const kargoTutariBirim = document.getElementById("kargoTutariBirim");
const pazarTutariBirim = document.getElementById("pazarTutariBirim");
const ekMasrafTutariBirim = document.getElementById("ekMasrafTutariBirim");
const ambalajliBirim = document.getElementById("ambalajliBirim");
const iscilikliBirim = document.getElementById("iscilikliBirim");
const kampanyaliBirim = document.getElementById("kampanyaliBirim");
const indirimliBirim = document.getElementById("indirimliBirim");
const basabasBirim = document.getElementById("basabasBirim");
const iskontoBirim = document.getElementById("iskontoBirim");
const sonucContainer = document.getElementById("sonucContainer");
const sermayelerToplamiBirim = document.getElementById("sermayelerToplamiBirim");
const masrafToplamiBirim = document.getElementById("masrafToplamiBirim");
// GENERAL VERIABLES
const kategoriSelect2 = $('#kategoriType');
const kategoriParamSelect2 = $('#kategoriParamType');
const cards = $("#cards");
const documentVar = $(document);
// LISTENER
hesapType.addEventListener('change', hesapBirim);
calculatorForm.addEventListener('submit', hesaplat);
kargoType.addEventListener("change", kargoListener);
pazarType.addEventListener("change", pazarListener);
pazarParamType.addEventListener("change", pazarParamListener);
window.addEventListener('resize', resize);
// KARGO
const kargolar = [
  mng = {
    firma: 'MNG', tutar: 10
  }, aras = {
    firma: 'Aras', tutar: 11
  }, surat = {
    firma: 'Sürat', tutar: 12
  }, yurtici = {
    firma: 'Yurtiçi', tutar: 13
  }, ptt = {
    firma: 'PTT', tutar: 14
  }, dhl = {
    firma: 'DHL', tutar: 15
  }, tnt = {
    firma: 'TNT', tutar: 16
  }, ups = {
    firma: 'UPS', tutar: 17
  }]
const kargoParam = {
  firma: "", tutar: 0, tanimla: function (firmaId) {
    this.firma = kargolar[firmaId].firma;
    kargolar[firmaId].tutar = kargoParamType_input.value;
  }
}
const kargoParamVar = {
  items: "",
  creatItem: function () {
    kargo_list.innerHTML = "";
    for (let i = 0; i < this.items.length; i++) {
      const li = document.createElement('li');
      const span = document.createElement('span');
      const a = document.createElement('a');
      let text = this.items[i].firma + " : " + this.items[i].tutar;
      span.appendChild(document.createTextNode(text));
      li.className = 'list-group-item list-group-item-secondary align-items-center';
      li.appendChild(span);
      a.classList = 'delete-item float-end';
      a.setAttribute('href', '#');
      a.innerHTML = '<i class="fas fa-times"></i>';
      li.appendChild(a);
      kargo_list.appendChild(li);
    }
  }, addNewItem: function (e) {
    if (kargoParamType_input.value === '') {
      alert('You must add a new item.');
    } else {
      kargoParam.tanimla(kargoParamType.options[kargoParamType.selectedIndex].value);
      kargoParamVar.setItemToLS(kargoParam.firma, kargoParamType_input.value);
      kargoParamVar.creatItem();
      kargoParamType_input.value = '';
    }
    e.preventDefault();
  }, getItemsFromLS: function () {
    if (localStorage.getItem('localKargo') === null) {
      this.items = [];
    } else {
      this.items = JSON.parse(localStorage.getItem('localKargo'));
    }
    return this.items;
  }, setItemToLS: function (id, value) {
    let localData = {
      firma: id, tutar: value
    };
    kargoParam.tanimla(kargoParamType.options[kargoParamType.selectedIndex].value);
    this.items = kargoParamVar.getItemsFromLS();
    let index = kargoParamVar.items.findIndex((element) => element.firma === localData.firma);
    if (index !== -1) {
      kargoParamVar.items.splice(index, 1);
    }
    this.items.push(localData);
    localStorage.setItem('localKargo', JSON.stringify(this.items));
  }, loadItems: function () {
    this.items = kargoParamVar.getItemsFromLS();
    kargoParamVar.creatItem();
  }, deleteItemFromLS: function (text) {
    let array = text.split(" : ");
    this.items = kargoParamVar.getItemsFromLS();
    let index = kargoParamVar.items.findIndex((element) => element.firma === array[0]);
    if (index !== -1) {
      kargoParamVar.items.splice(index, 1);
    }
    localStorage.setItem('localKargo', JSON.stringify(this.items));
  }, deleteItem: function (e) {
    if (e.target.className === 'fas fa-times') {
      if (confirm('are you sure ?')) {
        e.target.parentElement.parentElement.remove();
        kargoParamVar.deleteItemFromLS(e.target.parentElement.parentElement.textContent);
      }
    }
    e.preventDefault();
  }, deleteAllItems: function (e) {
    if (confirm('are you sure ? ')) {
      while (kargo_list.children.length !== 0) {
        kargo_list.firstElementChild.remove();
      }
      localStorage.clear();
    }
    e.preventDefault();
  }
}
kargoParamVar.loadItems();
kargoForm.addEventListener('submit', kargoParamVar.addNewItem);
kargo_list.addEventListener('click', kargoParamVar.deleteItem);
btnDeleteAllKargo.addEventListener('click', kargoParamVar.deleteAllItems);
const kargo = {
  firma: "", tutar: 0, tanimla: function (firmaId) {
    kargoParamVar.getItemsFromLS();
    let index = kargoParamVar.items.findIndex((element) => element.firma === kargolar[firmaId].firma);
    if (index !== -1) {
      this.tutar = kargoParamVar.items[index].tutar;
    } else {
      this.tutar = kargolar[firmaId].tutar;
    }
    this.firma = kargolar[firmaId].firma;
  }
}

function kargoListener() {
  kargo.tanimla(kargoType.options[kargoType.selectedIndex].value);
  kargoType_input.value = kargo.tutar;
}

// PAZAR YERLERİ
const pazarlar = [
  epttavm = {
    firma: 'ePTTAvm', kategori: [{
      id: "0", text: 'epttavm 1', komisyon: 10
    }, {
      id: "1", text: 'epttavm 2', komisyon: 11
    }, {
      id: "2", text: 'epttavm 3', komisyon: 12
    }]
  }, hepsiburada = {
    firma: 'Hepsiburada', kategori: [{
      id: "0", text: 'hepsiburada 1', komisyon: 13
    }, {
      id: "1", text: 'hepsiburada 2', komisyon: 14
    }, {
      id: "2", text: 'hepsiburada 3', komisyon: 15
    }]
  }, trendyol = {
    firma: 'Trendyol', kategori: [{
      id: "0", text: 'trendyol 1', komisyon: 16
    }, {
      id: "1", text: 'trendyol 2', komisyon: 17
    }, {
      id: "2", text: 'trendyol 3', komisyon: 18
    }]
  }, n11 = {
    firma: 'N11', kategori: [{
      id: "0", text: 'n11 1', komisyon: 19
    }, {
      id: "1", text: 'n11 2', komisyon: 20
    }, {
      id: "2", text: 'n11 3', komisyon: 21
    }]
  }, etsy = {
    firma: 'Etsy', kategori: [{
      id: "0", text: 'etsy 1', komisyon: 22
    }, {
      id: "1", text: 'etsy 2', komisyon: 23
    }, {
      id: "2", text: 'etsy 3', komisyon: 24
    }]
  }, ebay = {
    firma: 'Ebay', kategori: [{
      id: "0", text: 'ebay 1', komisyon: 25
    }, {
      id: "1", text: 'ebay 2', komisyon: 26
    }, {
      id: "2", text: 'ebay 3', komisyon: 27
    }]
  }, amazon = {
    firma: 'Amazon', kategori: [{
      id: "0", text: 'amazon 1', komisyon: 29
    }, {
      id: "1", text: 'amazon 2', komisyon: 30
    }, {
      id: "2", text: 'amazon 3', komisyon: 31
    }]
  }, komisyonlu = {
    firma: 'Komisyonlu satış', kategori: [{
      id: "0", text: 'komisyonlu 1', komisyon: 32
    }, {
      id: "1", text: 'komisyonlu 2', komisyon: 33
    }, {
      id: "2", text: 'komisyonlu 3', komisyon: 34
    }]
  }, e_ihracat = {
    firma: 'Website (E-İhracat)', kategori: [{
      id: "0", text: 'e_ihracat 1', komisyon: 35
    }, {
      id: "1", text: 'e_ihracat 2', komisyon: 36
    }, {
      id: "2", text: 'e_ihracat 3', komisyon: 37
    }]
  }, ulusal = {
    firma: 'Website (Ulusal)', kategori: [{
      id: "0", text: 'ulusal 1', komisyon: 38
    }, {
      id: "1", text: 'ulusal 2', komisyon: 39
    }, {
      id: "2", text: 'ulusal 3', komisyon: 40
    }]
  }]
const pazarParam = {
  firma: "", data: "", komisyon: "", text: "", tanimla: function (firmaId) {
    this.firma = pazarlar[firmaId].firma;
    this.data = pazarlar[firmaId].kategori;
    pazarlar[firmaId].tutar = pazarParamType_input.value;
  }
}
const pazarParamVar = {
  items: "", creatItem: function () {
    pazar_list.innerHTML = "";
    for (let i = 0; i < this.items.length; i++) {
      const li = document.createElement('li');
      const span = document.createElement('span');
      const span2 = document.createElement('span');
      const br = document.createElement('br');
      const a = document.createElement('a');
      let text = this.items[i].kategori + " : " + this.items[i].komisyon;
      span.appendChild(document.createTextNode(text));
      span2.appendChild(document.createTextNode(this.items[i].firma));
      span2.style.fontSize = '12px';
      li.className = 'list-group-item list-group-item-secondary align-items-center';
      li.appendChild(span);
      a.classList = 'delete-item float-end';
      a.setAttribute('href', '#');
      a.innerHTML = '<i class="fas fa-times"></i>';
      li.appendChild(a);
      li.appendChild(br);
      li.appendChild(span2);
      pazar_list.appendChild(li);
    }
  }, addNewItem: function (e) {
    if (pazarParamType_input.value === '') {
      alert('You must add a new item.');
    } else {
      pazarParam.tanimla(pazarParamType.options[pazarParamType.selectedIndex].value);
      pazarParamVar.setItemToLS(pazarParam.firma, pazarParam.text, pazarParamType_input.value);
      pazarParamVar.creatItem();
      pazarParamType_input.value = '';
    }
    e.preventDefault();
  }, getItemsFromLS: function () {
    if (localStorage.getItem('localPazar') === null) {
      this.items = [];
    } else {
      this.items = JSON.parse(localStorage.getItem('localPazar'));
    }
    return this.items;
  }, setItemToLS: function (id, category, value) {
    let localData = {
      firma: id, kategori: category, komisyon: value
    };
    pazarParam.tanimla(pazarParamType.options[pazarParamType.selectedIndex].value);
    this.items = pazarParamVar.getItemsFromLS();
    let index = pazarParamVar.items.findIndex((element) => element.kategori === localData.kategori);
    if (index !== -1) {
      pazarParamVar.items.splice(index, 1);
    }
    this.items.push(localData);
    localStorage.setItem('localPazar', JSON.stringify(this.items));
  }, loadItems: function () {
    this.items = pazarParamVar.getItemsFromLS();
    pazarParamVar.creatItem();
  }, deleteItemFromLS: function (text) {
    let array = text.split(" : ");
    this.items = pazarParamVar.getItemsFromLS();
    let index = pazarParamVar.items.findIndex((element) => element.kategori === array[0]);
    if (index !== -1) {
      pazarParamVar.items.splice(index, 1);
    }
    localStorage.setItem('localPazar', JSON.stringify(this.items));
  }, deleteItem: function (e) {
    if (e.target.className === 'fas fa-times') {
      if (confirm('are you sure ?')) {
        e.target.parentElement.parentElement.remove();
        pazarParamVar.deleteItemFromLS(e.target.parentElement.parentElement.textContent);
      }
    }
    e.preventDefault();
  }, deleteAllItems: function (e) {
    if (confirm('are you sure ? ')) {
      while (pazar_list.children.length !== 0) {
        pazar_list.firstElementChild.remove();
      }
      localStorage.clear();
    }
    e.preventDefault();
  }
}
pazarParamVar.loadItems();
pazarForm.addEventListener('submit', pazarParamVar.addNewItem);
pazar_list.addEventListener('click', pazarParamVar.deleteItem);
btnDeleteAllPazar.addEventListener('click', pazarParamVar.deleteAllItems);
const pazar = {
  firma: "", data: "", tanimla: function (firmaId) {
    this.firma = pazarlar[firmaId].firma;
    this.data = pazarlar[firmaId].kategori;
  }
}
const pazarSelected = {
  komisyon: "",
  text: "",
  tanimla: function (firmaId, komisyon) {
    pazarParamVar.getItemsFromLS();
    let index2 = kategoriSelect2.find(':selected').val();
    let index = pazarParamVar.items.findIndex((element) => element.kategori === pazarlar[firmaId].kategori[index2].text);
    if (index !== -1) {
      this.komisyon = pazarParamVar.items[index].komisyon;
    } else {
      this.komisyon = komisyon;
    }
  }
}
kategoriSelect2.on('select2:select', function (e) {
  pazarSelectedListener(e.params.data.komisyon);
  pazarType_input.value = pazarSelected.komisyon;
});

function pazarSelectedListener(komisyon) {
  pazarSelected.tanimla(pazarType.options[pazarType.selectedIndex].value, komisyon);
}

function pazarListener() {
  pazar.tanimla(pazarType.options[pazarType.selectedIndex].value);
  kategoriSelect2.html("<option selected disabled value=''>ÜRÜN KATEGORİSİ</option>");
  kategoriSelect2.select2({
    placeholder: 'ÜRÜN KATEGORİSİ', data: pazar.data,
  });
}

kategoriParamSelect2.on('select2:select', function (e) {
  pazarParam.komisyon = e.params.data.komisyon;
  pazarParam.text = e.params.data.text;
});

function pazarParamListener() {
  pazar.tanimla(pazarParamType.options[pazarParamType.selectedIndex].value);
  kategoriParamSelect2.html("<option selected disabled>ÜRÜN KATEGORİSİ</option>");
  kategoriParamSelect2.select2({
    placeholder: 'ÜRÜN KATEGORİSİ', data: pazar.data,
  });
}

// hesaplat() Fonksiyonunun Değişkenleri
const hesapVar = {
  // Hesap Değişkenleri
  alisTutar: "",
  satisTutar: "",
  tanimla: function (alis, satis) {
    this.alisTutar = Number(alis.value);
    this.satisTutar = Number(satis.value);
  },
  karMarjiHesabi: "",
  karOraniHesabi: "",
  kdvHesabi: "",
  kdvOrani: "",
  gelirVergisiHesabi: "",
  gelirVergisiOrani: "",
  giderlerHesabi: "",
  matrahHesabi: "",
  vergidenOnceHesabi: "",
  netKarHesabi: "",
  brutMarjHesabi: "",
  netMarjHesabi: "",
  giderVergisizHesabi: "",
  yeniTahminiKar: "",
  vergilerToplamiHesabi: "",
  sermayelerToplamiHesabi: "",
  masrafToplamiHesabi: "",
  kargoTutariHesabi: "",
  pazarTutariHesabi: "",
  kampanyaHesabi: "",
  indirimHesabi: "",
  basabasHesabi: "",
  ekMasrafHesabi: "",
  ambalajHesabi: "",
  iscilikHesabi: "",
  iskontoHesabi: "",
  // Birim Değişkenleri
  karMarjVarBirim: "",
  karOranVarBirim: "",
  kdvVarBirim: "",
  matrahVarBirim: "",
  gelirVergiVarBirim: "",
  giderVarBirim: "",
  netKarVarBirim: "",
  vergidenOnceVarBirim: "",
  giderVergisizVarBirim: "",
  brutMarjVarBirim: "",
  netMarjVarBirim: "",
  vergilerToplamiBirimVarBirim: "",
  sermayelerToplamiBirimVarBirim: "",
  masrafToplamiBirimVarBirim: "",
  alisFiyatiBirimVarBirim: "",
  kargoTutariBirimVarBirim: "",
  pazarTutariBirimVarBirim: "",
  satisBirimVarBirim: "",
  ekMasrafTutariBirimVarBirim: "",
  ambalajliBirimVarBirim: "",
  iscilikliBirimVarBirim: "",
  kampanyaliBirimVarBirim: "",
  indirimliBirimVarBirim: "",
  basabasBirimVarBirim: "",
  iskontoVarBirim: "",
  // Hesaplama Fonksiyonları
  pazarOran: function (satisTutarParam) {
    return Number(((satisTutarParam * pazarType_input.value) / 100));
  },
  karMarjiHesapla: function (satisTutarParam) {
    this.karMarjiHesabi = ((satisTutarParam - this.alisTutar) / this.alisTutar) * 100;
  },
  karOraniHesapla: function (satisTutarParam) {
    this.karOraniHesabi = ((satisTutarParam - this.alisTutar) / satisTutarParam) * 100;
  },
  kdvHesapla: function (satisTutarParam) {
    this.kdvOrani = kdvType.options[kdvType.selectedIndex].value;
    this.kdvHesabi = satisTutarParam * this.kdvOrani / 100;
  },
  ekMasrafHesapla: function () {
    this.ekMasrafHesabi = Number(ekMasraf.value);
  },
  ambalajHesapla: function () {
    this.ambalajHesabi = Number(ambalaj_input.value);
  },
  iscilikHesapla: function () {
    this.iscilikHesabi = Number(iscilik_input.value);
  },
  matrahHesapla: function (satisTutarParam) {
    this.matrahHesabi = satisTutarParam - Number(this.alisTutar) - Number(this.kargoTutariHesabi) - this.pazarOran(satisTutarParam) - Number(this.ekMasrafHesabi) + Number(this.ambalajHesabi) + Number(this.iscilikHesabi);
  },
  gelirVergisiHesapla: function () {
    this.gelirVergisiOrani = gelirVergiType.options[gelirVergiType.selectedIndex].value;
    this.gelirVergisiHesabi = this.matrahHesabi * this.gelirVergisiOrani / 100;
  },
  giderlerHesapla: function (satisTutarParam) {
    this.giderlerHesabi = Number(this.kdvHesabi) + Number(this.gelirVergisiHesabi) + this.pazarOran(satisTutarParam) + Number(this.ekMasrafHesabi) + Number(this.ambalajHesabi) + Number(this.iscilikHesabi) + Number(this.kargoTutariHesabi) + Number(this.alisTutar);
  },
  netKarHesapla: function (satisTutarParam) {
    this.netKarHesabi = satisTutarParam - this.giderlerHesabi;
  },
  vergidenOnceHesapla: function () {
    this.vergidenOnceHesabi = Number(this.netKarHesabi) + Number(this.kdvHesabi) + Number(this.gelirVergisiHesabi);
  },
  giderVergisizHesapla: function () {
    this.giderVergisizHesabi = Number(this.netKarHesabi) + Number(this.kdvHesabi);
  },
  brutMarjHesapla: function (satisTutarParam) {
    this.brutMarjHesabi = (satisTutarParam - this.alisTutar) / satisTutarParam;
  },
  netMarjHesapla: function (satisTutarParam) {
    this.netMarjHesabi = this.netKarHesabi / satisTutarParam * 100;
  },
  vergilerToplami: function () {
    this.vergilerToplamiHesabi = Number(this.kdvHesabi) + Number(this.gelirVergisiHesabi);
  },
  sermayelerToplami: function () {
    this.sermayelerToplamiHesabi = Number(this.alisTutar) + Number(this.iscilikHesabi) + Number(this.ambalajHesabi) + Number(this.ekMasrafHesabi);
  },
  masrafToplami: function () {
    this.masrafToplamiHesabi = Number(kargoType_input.value) + Number(this.kdvHesabi) + Number(this.gelirVergisiHesabi) ;
  },
  kargoTutari: function () {
    this.kargoTutariHesabi = Number(kargoType_input.value);
  },
  pazarTutari: function (satisTutarParam) {
    this.pazarTutariHesabi = this.pazarOran(satisTutarParam);
  },
  ranges: {
    range001: function (tahminiSatis, istenenKar, tahminiKar) {
      if (tahminiKar < istenenKar) {
        if ((istenenKar - tahminiKar) < 0.009) {
          hesapVar.satisTutar = tahminiSatis;
          return tahminiSatis;
        } else {
          tahminiSatis = Number(tahminiSatis) + 0.01;
          hesapVar.satisTutar = tahminiSatis;
          hesapVar.satisFunc();
          hesapVar.yeniTahminiKar = tahminiSatis - hesapVar.giderlerHesabi;
          return hesapVar.netKarFunc(tahminiSatis, istenenKar, hesapVar.yeniTahminiKar);
        }
      } else if (tahminiKar > istenenKar) {
        if ((tahminiKar - istenenKar) < 0.009) {
          hesapVar.satisTutar = tahminiSatis;
          return tahminiSatis;
        } else {
          tahminiSatis = Number(tahminiSatis) - 0.01;
          hesapVar.satisTutar = tahminiSatis;
          hesapVar.satisFunc();
          hesapVar.yeniTahminiKar = tahminiSatis - hesapVar.giderlerHesabi;
          return hesapVar.netKarFunc(tahminiSatis, istenenKar, hesapVar.yeniTahminiKar);
        }
      } else {
        hesapVar.satisTutar = tahminiSatis;
        return tahminiSatis;
      }
    },
    range01: function (tahminiSatis, istenenKar, tahminiKar) {
      if (tahminiKar < istenenKar) {
        if ((istenenKar - tahminiKar) < 0.1) {
          hesapVar.ranges.range001(tahminiSatis, istenenKar, tahminiKar);
        } else {
          tahminiSatis = Number(tahminiSatis) + 0.1;
          hesapVar.satisTutar = tahminiSatis;
          hesapVar.satisFunc();
          hesapVar.yeniTahminiKar = tahminiSatis - hesapVar.giderlerHesabi;
          return hesapVar.netKarFunc(tahminiSatis, istenenKar, hesapVar.yeniTahminiKar);
        }
      } else if (tahminiKar > istenenKar) {
        if ((tahminiKar - istenenKar) < 0.1) {
          hesapVar.ranges.range001(tahminiSatis, istenenKar, tahminiKar);
        } else {
          tahminiSatis = Number(tahminiSatis) - 0.1;
          hesapVar.satisTutar = tahminiSatis;
          hesapVar.satisFunc();
          hesapVar.yeniTahminiKar = tahminiSatis - hesapVar.giderlerHesabi;
          return hesapVar.netKarFunc(tahminiSatis, istenenKar, hesapVar.yeniTahminiKar);
        }
      } else {
        hesapVar.satisTutar = tahminiSatis;
        return tahminiSatis;
      }
    },
    range1: function (tahminiSatis, istenenKar, tahminiKar) {
      if (tahminiKar < istenenKar) {
        if ((istenenKar - tahminiKar) < 1) {
          hesapVar.ranges.range01(tahminiSatis, istenenKar, tahminiKar);
        } else {
          tahminiSatis++;
          hesapVar.satisTutar = tahminiSatis;
          hesapVar.satisFunc();
          hesapVar.yeniTahminiKar = tahminiSatis - hesapVar.giderlerHesabi;
          return hesapVar.netKarFunc(tahminiSatis, istenenKar, hesapVar.yeniTahminiKar);
        }
      } else if (tahminiKar > istenenKar) {
        if ((tahminiKar - istenenKar) < 1) {
          hesapVar.ranges.range01(tahminiSatis, istenenKar, tahminiKar);
        } else {
          tahminiSatis--;
          hesapVar.satisTutar = tahminiSatis;
          hesapVar.satisFunc();
          hesapVar.yeniTahminiKar = tahminiSatis - hesapVar.giderlerHesabi;
          return hesapVar.netKarFunc(tahminiSatis, istenenKar, hesapVar.yeniTahminiKar);
        }
      } else {
        hesapVar.satisTutar = tahminiSatis;
        return tahminiSatis;
      }
    },
    range10: function (tahminiSatis, istenenKar, tahminiKar) {
      if (tahminiKar < istenenKar) {
        if ((istenenKar - tahminiKar) < 10) {
          hesapVar.ranges.range1(tahminiSatis, istenenKar, tahminiKar);
        } else {
          tahminiSatis = tahminiSatis + 10;
          hesapVar.satisTutar = tahminiSatis;
          hesapVar.satisFunc();
          hesapVar.yeniTahminiKar = tahminiSatis - hesapVar.giderlerHesabi;
          return hesapVar.netKarFunc(tahminiSatis, istenenKar, hesapVar.yeniTahminiKar);
        }
      } else if (tahminiKar > istenenKar) {
        if ((tahminiKar - istenenKar) < 10) {
          hesapVar.ranges.range1(tahminiSatis, istenenKar, tahminiKar);
        } else {
          tahminiSatis = tahminiSatis - 10;
          hesapVar.satisTutar = tahminiSatis;
          hesapVar.satisFunc();
          hesapVar.yeniTahminiKar = tahminiSatis - hesapVar.giderlerHesabi;
          return hesapVar.netKarFunc(tahminiSatis, istenenKar, hesapVar.yeniTahminiKar);
        }
      } else {
        hesapVar.satisTutar = tahminiSatis;
        return tahminiSatis;
      }
    },
    range100: function (tahminiSatis, istenenKar, tahminiKar) {
      if (tahminiKar < istenenKar) {
        if ((istenenKar - tahminiKar) < 100) {
          hesapVar.ranges.range10(tahminiSatis, istenenKar, tahminiKar);
        } else {
          tahminiSatis = tahminiSatis + 100;
          hesapVar.satisTutar = tahminiSatis;
          hesapVar.satisFunc();
          hesapVar.yeniTahminiKar = tahminiSatis - hesapVar.giderlerHesabi;
          return hesapVar.netKarFunc(tahminiSatis, istenenKar, hesapVar.yeniTahminiKar);
        }
      } else if (tahminiKar > istenenKar) {
        if ((tahminiKar - istenenKar) < 100) {
          hesapVar.ranges.range10(tahminiSatis, istenenKar, tahminiKar);
        } else {
          tahminiSatis = tahminiSatis - 100;
          hesapVar.satisTutar = tahminiSatis;
          hesapVar.satisFunc();
          hesapVar.yeniTahminiKar = tahminiSatis - hesapVar.giderlerHesabi;
          return hesapVar.netKarFunc(tahminiSatis, istenenKar, hesapVar.yeniTahminiKar);
        }
      } else {
        hesapVar.satisTutar = tahminiSatis;
        return tahminiSatis;
      }
    },
  },
  netKarFunc: function (tahminiSatis, istenenKar, tahminiKar) {
    this.satisTutar = tahminiSatis;
    this.satisFunc();
    this.ranges.range100(tahminiSatis, istenenKar, tahminiKar);
  },
  kampanyaHesapla: function (satisTutarParam) {
    this.kampanyaHesabi = satisTutarParam - ((satisTutarParam * Number(kampanya_input.value)) / 100);
  },
  indirimHesapla: function (satisTutarParam) {
    this.indirimHesabi = satisTutarParam - ((satisTutarParam * Number(indirim_input.value)) / 100);
  },
  basabasHesapla: function () {
    this.basabasHesabi = this.giderlerHesabi;
  },
  iskontoHesapla: function (satisTutarParam) {
    this.iskontoHesabi = satisTutarParam - ((satisTutarParam * Number(kampanya_input.value)) / 100) - ((satisTutarParam * Number(indirim_input.value)) / 100);
  },
  satisFunc: function () {
    this.ekMasrafHesapla();
    this.ambalajHesapla();
    this.iscilikHesapla();
    this.karMarjiHesapla(this.satisTutar);
    this.karOraniHesapla(this.satisTutar);
    this.kdvHesapla(this.satisTutar);
    this.matrahHesapla(this.satisTutar);
    this.gelirVergisiHesapla();
    this.giderlerHesapla(this.satisTutar);
    this.netKarHesapla(this.satisTutar);
    this.vergidenOnceHesapla();
    this.giderVergisizHesapla();
    this.brutMarjHesapla(this.satisTutar);
    this.netMarjHesapla(this.satisTutar);
    this.vergilerToplami();
    this.sermayelerToplami();
    this.masrafToplami();
    this.kargoTutari();
    this.pazarTutari(this.satisTutar);
    this.kampanyaHesapla(this.satisTutar);
    this.indirimHesapla(this.satisTutar);
    this.basabasHesapla();
    this.iskontoHesapla(this.satisTutar);
  },
  birimFunc: function () {
    this.karMarjVarBirim = Number(this.karMarjiHesabi).toFixed(2) + " %";
    this.karOranVarBirim = Number(this.karOraniHesabi).toFixed(2) + " %";
    this.kdvVarBirim = Number(this.kdvHesabi).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + " ₺";
    this.matrahVarBirim = Number(this.matrahHesabi).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + " ₺";
    this.gelirVergiVarBirim = Number(this.gelirVergisiHesabi).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + " ₺";
    this.giderVarBirim = Number(this.giderlerHesabi).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + " ₺";
    this.netKarVarBirim = Number(this.netKarHesabi).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + " ₺";
    this.vergidenOnceVarBirim = Number(this.vergidenOnceHesabi).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + " ₺";
    this.giderVergisizVarBirim = Number(this.giderVergisizHesabi).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + " ₺";
    this.brutMarjVarBirim = Number(this.brutMarjHesabi).toFixed(2) + " %";
    this.netMarjVarBirim = Number(this.netMarjHesabi).toFixed(2) + " %";
    this.masrafToplamiBirimVarBirim = Number(this.masrafToplamiHesabi).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + " ₺";
    this.sermayelerToplamiBirimVarBirim = Number(this.sermayelerToplamiHesabi).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + " ₺";
    this.alisFiyatiBirimVarBirim = Number(this.alisTutar).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + " ₺";
    this.kargoTutariBirimVarBirim = Number(this.kargoTutariHesabi).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + " ₺";
    this.pazarTutariBirimVarBirim = Number(this.pazarTutariHesabi).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + " ₺";
    this.satisBirimVarBirim = Number(this.satisTutar).toFixed(2) + " ₺";
    this.ekMasrafTutariBirimVarBirim = Number(this.ekMasrafHesabi).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + " ₺";
    this.ambalajliBirimVarBirim = Number(this.ambalajHesabi).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + " ₺";
    this.iscilikliBirimVarBirim = Number(this.iscilikHesabi).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + " ₺";
    this.kampanyaliBirimVarBirim = Number(this.kampanyaHesabi).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + " ₺";
    this.indirimliBirimVarBirim = Number(this.indirimHesabi).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + " ₺";
    this.basabasBirimVarBirim = Number(this.basabasHesabi).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + " ₺";
    this.iskontoVarBirim = Number(this.iskontoHesabi).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + " ₺";
    hesapVar.innerHTMLFunc();
  },
  innerHTMLFunc: function () {
    karMarj.innerHTML = this.karMarjVarBirim;
    karOran.innerHTML = this.karOranVarBirim;
    kdv.innerHTML = this.kdvVarBirim;
    matrah.innerHTML = this.matrahVarBirim;
    gelirVergi.innerHTML = this.gelirVergiVarBirim;
    gider.innerHTML = this.giderVarBirim;
    netKar.innerHTML = this.netKarVarBirim;
    vergidenOnce.innerHTML = this.vergidenOnceVarBirim;
    giderVergisiz.innerHTML = this.giderVergisizVarBirim;
    brutMarj.innerHTML = this.brutMarjVarBirim;
    netMarj.innerHTML = this.netMarjVarBirim;
    masrafToplamiBirim.innerHTML = this.masrafToplamiBirimVarBirim;
    sermayelerToplamiBirim.innerHTML = this.sermayelerToplamiBirimVarBirim;
    alisFiyatiBirim.innerHTML = this.alisFiyatiBirimVarBirim;
    kargoTutariBirim.innerHTML = this.kargoTutariBirimVarBirim;
    pazarTutariBirim.innerHTML = this.pazarTutariBirimVarBirim;
    satisBirim.innerHTML = this.satisBirimVarBirim;
    ekMasrafTutariBirim.innerHTML = this.ekMasrafTutariBirimVarBirim;
    ambalajliBirim.innerHTML = this.ambalajliBirimVarBirim;
    iscilikliBirim.innerHTML = this.iscilikliBirimVarBirim;
    kampanyaliBirim.innerHTML = this.kampanyaliBirimVarBirim;
    indirimliBirim.innerHTML = this.indirimliBirimVarBirim;
    basabasBirim.innerHTML = this.basabasBirimVarBirim;
    iskontoBirim.innerHTML = this.iskontoVarBirim;
  },
}

// Placeholders and Units
function hesapBirim() {
  if (hesapType.value === '1') {
    hesapType_input.placeholder = "Satış Tutarı Giriniz";
    calcBirim.innerHTML = ".00 ₺";
  } else if (hesapType.value === '2') {
    hesapType_input.placeholder = "Net Kar Tutarı Giriniz";
    calcBirim.innerHTML = ".00 ₺";
  } else if (hesapType.value === '3') {
    hesapType_input.placeholder = "Kar Marjı Giriniz";
    calcBirim.innerHTML = "%";
  } else if (hesapType.value === '4') {
    hesapType_input.placeholder = "Kar Oranı Giriniz";
    calcBirim.innerHTML = "%";
  }
}

// Calculator
function hesaplat() {
  // Clone
  if (chart.datasetsBar.length <= 1) {
    chartUpdate.cloneHesapVar = Object.assign({}, hesapVar);
  }
  // Calculator Functions
  hesapVar.tanimla(alis, hesapType_input);
  // Hesaplama Tipi Koşulları
  if (hesapType.value === "1") {
    hesapVar.satisFunc();
    hesapVar.birimFunc();
  } else if (hesapType.value === "2") {
    chartUpdate.cloneNetKarBirim = netKar.innerHTML;
    if (gelirVergiType.value <= 27 && pazarType_input.value <= 21) {
      hesapVar.netKarFunc(((Number(hesapVar.alisTutar) + Number(hesapType_input.value)) * (1.2)), hesapType_input.value, (hesapType_input.value - 1));
    } else if (gelirVergiType.value <= 27 && pazarType_input.value > 21) {
      hesapVar.netKarFunc(((Number(hesapVar.alisTutar) + Number(hesapType_input.value)) * (2.5)), hesapType_input.value, (hesapType_input.value - 1));
    } else if (gelirVergiType.value > 27) {
      hesapVar.netKarFunc(((Number(hesapVar.alisTutar) + Number(hesapType_input.value)) * (5)), Number(hesapType_input.value), Number(hesapType_input.value - 1));
    }
    hesapVar.satisFunc();
    hesapVar.birimFunc();
    netKar.innerHTML = Number(hesapType_input.value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + " ₺";
  } else if (hesapType.value === "3") {
    hesapVar.satisTutar = ((Number(hesapType_input.value) * Number(alis.value)) / 100) + Number(alis.value);
    hesapVar.satisFunc();
    hesapVar.birimFunc();
  } else if (hesapType.value === "4") {
    hesapVar.satisTutar = (100 * Number(alis.value)) / (100 - Number(hesapType_input.value));
    hesapVar.satisFunc();
    hesapVar.birimFunc();
  }
  mediaQueries.queryFunc();
  mediaQueries.listeners();
  sonucContainer.classList.remove("none");
  // Chart Funcs
  chartUpdate.cloneDatasetFunc();
  chart.chartFunc();
  if (chartUpdate.cloneHesapVar.satisTutar != "" && chartUpdate.cloneHesapVar.satisTutar != hesapVar.satisTutar) {
    chartUpdate.dataUpdate();
  }
  // Divider Position Func
  let top = cards.offset().top;
  vl6.style.top = (top - 4) + "px";
}

function resize() {
  let top = cards.offset().top;
  vl6.style.top = (top - 4) + "px";
}

/* ####################### SELECT2 MENU ####################### */
documentVar.ready(function () {
  kategoriSelect2.select2({
    placeholder: 'ÜRÜN KATEGORİSİ', data: pazar.data, // minimumInputLength: 2,
  });
});
documentVar.ready(function () {
  kategoriParamSelect2.select2({
    placeholder: 'ÜRÜN KATEGORİSİ', data: pazar.data, // minimumInputLength: 2,
  });
});
/* ####################### CHART ####################### */
Chart.register(ChartDataLabels);
const chart = {
  chartPie: "",
  chartBar: "",
  chartLine: "",
  pieChart: "",
  barChart: "",
  lineChart: "",
  canvasPie: "",
  canvasBar: "",
  canvasLine: "",
  pluginPie: {
    layout: {
      padding: {
        bottom: 50,
      }
    },
    plugins: {
      tooltip: {
        padding: 12,
        caretPadding: 20,
        boxPadding: 8,
        borderWidth: 1,
        borderColor: "rgb(255,255,255)",
        callbacks: {
          label: function (tooltipItem) {
            return chart.chartPie.data.labels[tooltipItem.dataIndex];
          }
        },
        bodyFont: {
          weight: "bolder",
        },
      },
      crosshair: false,
      datalabels: {
        formatter: function (value, context) {
          if (context.chart.data.datasets.indexOf(context.dataset) === context.chart.data.datasets.length - 1) {
            let sum = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
            return ((value / sum) * 100).toFixed(1) + '%';
          }
        },
        anchor: "end",
        align: "end",
        offset: 25,
        clamp: true,
        color: '#92929f',
      },
      legend: {
        position: 'top',
        align: 'center',
        labels: {
          color: '#92929f',
          font: {
            size: 13,
          }
        },
      },
    }
  },
  pluginLine: {
    elements: {
      line: {
        borderColor: "#fff",
      },
      point: {
        hitRadius: 25,
        pointBorderWidth: 2
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#92929f",
        },
        grid: {
          color: (context) => {
            if (context.tick.value === 1) {
              return "rgba(192,192,192,0.5)";
            } else {
              return "#92929f";
            }
          },
          borderColor: "#92929f",
        },
      },
      y: {
        ticks: {
          color: "#92929f",
        },
        grid: {
          color: "#92929f",
          borderColor: "#92929f",
        },
      },
    },
    plugins: {
      tooltip: {
        padding: 12,
        caretPadding: 20,
        boxPadding: 8,
        borderWidth: 1,
        borderColor: "#92929f",
        callbacks: {
          title: function () {
          },
          label: function (context) {
            return context.dataset.labels[context.dataIndex];
          },
        },
        bodyFont: {
          weight: "bolder",
        },
      },
      datalabels: {
        display: false,
      },
      legend: {
        labels: {
          color: "#92929f"
        }
      }
    },
  },
  pluginBar: {
    scales: {
      x: {
        ticks: {
          color: "#92929f",
        },
        grid: {
          color: "#92929f",
          borderColor: "#92929f",
        },
      },
      y: {
        ticks: {
          color: "#92929f",
        },
        grid: {
          color: "#92929f",
          borderColor: "#92929f",
        },
      },
    },
    plugins: {
      tooltip: {
        padding: 12,
        caretPadding: 20,
        boxPadding: 8,
        borderWidth: 1,
        borderColor: "white",
        callbacks: {
          title: function () {
          },
          label: function (tooltipItem) {
            return chart.chartBar.data.datasets[tooltipItem.datasetIndex].labels[tooltipItem.dataIndex];
          }
        },
        bodyFont: {
          weight: "bolder",
        },
      },
      crosshair: false,
      datalabels: {
        display: false,
      },
      legend: {
        display: false,
      }
    },
  },
  labels: "",
  data: "",
  datasetsBar: [],
  datasetsLine: "",
  backgroundColor: [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
    'rgb(140,248,126)',
    'rgba(255, 206, 86, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 159, 64, 1)',
    'rgba(153, 102, 255, 1)',
  ],
  hoverBackgroundColor: [
    'rgb(169,0,32)',
    'rgb(0,82,138)',
    'rgb(84,0,255)',
    'rgb(150,81,0)',
    'rgb(17,129,0)',
    'rgb(187,135,0)',
    'rgb(0,82,138)',
    'rgb(150,81,0)',
    'rgb(84,0,255)',
  ],
  hoverOffset: 16,
  config: {
    configPie: {
      type: 'pie',
      data: {
        labels: "",
        datasets: [{
          data: "",
          backgroundColor: "",
          hoverOffset: 0,
          hoverBackgroundColor: "",
          borderWidth: 0,
        }]
      },
      options: "",
      plugins: "",
    },
    configBar: {
      type: 'bar',
      data: {
        labels: "",
        datasets: [{
          data: "",
          backgroundColor: "",
        }]
      },
      options: "",
      plugins: "",
    },
    configLine: {
      type: 'line',
      data: {
        labels: "",
        datasets: "",
      },
      options: "",
    },
  },
  legendMargin: {
    id: "legendMargin",
    beforeInit(context) {
      let fitValue = context.legend.fit;
      context.legend.fit = function () {
        fitValue.bind(context.legend)();
        return context.legend.height += 40;
      }
    },
  },
  chartFunc: function () {
    this.createChartElements();
    // Dinamic Data
    this.data = [
      Number(hesapVar.alisTutar),
      Number(ambalaj_input.value),
      Number(hesapVar.netKarHesabi),
      Number(ekMasraf.value),
      Number(hesapVar.kdvHesabi),
      Number(hesapVar.gelirVergisiHesabi),
      Number(iscilik_input.value),
      Number(hesapVar.pazarTutariHesabi),
      Number(hesapVar.kargoTutariHesabi),
    ];
    this.labels = [
      `Alış Tutarı : ${alisFiyatiBirim.innerHTML}`,
      `Ambalaj Gideri : ${ambalajliBirim.innerHTML}`,
      `Net Kar : ${netKar.innerHTML}`,
      `Ek Masraf : ${ekMasrafTutariBirim.innerHTML}`,
      `KDV : ${kdv.innerHTML}`,
      `Gelir Vergisi : ${gelirVergi.innerHTML}`,
      `İşçilik Gideri : ${iscilikliBirim.innerHTML}`,
      `Pazar Komisyonu : ${pazarTutariBirim.innerHTML}`,
      `Kargo : ${kargoTutariBirim.innerHTML}`,
    ];
    // Pie Config
    this.config.configPie.data.datasets[0].data = this.data;
    this.config.configPie.data.labels = this.labels;
    this.config.configPie.data.datasets[0].backgroundColor = this.backgroundColor;
    this.config.configPie.data.datasets[0].hoverOffset = this.hoverOffset;
    this.config.configPie.data.datasets[0].hoverBackgroundColor = this.hoverBackgroundColor;
    this.config.configPie.options = this.pluginPie;
    this.config.configPie.plugins = [this.legendMargin];
    // Line Config
    this.datasetsLine = [
      {
        label: "Başabaş Noktası",
        fill: true,
        data: [
          Number(hesapVar.giderlerHesabi),
          Number(hesapVar.giderlerHesabi),
          Number(hesapVar.giderlerHesabi),
        ],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        labels: [
          `Başabaş Noktası : ${gider.innerHTML}`,
          `Başabaş Noktası : ${gider.innerHTML}`,
          `Başabaş Noktası : ${gider.innerHTML}`,
        ],
      },
      {
        label: "Satış Tutarı",
        fill: true,
        data: [
          0,
          Number(hesapVar.satisTutar)/2,
          Number(hesapVar.satisTutar),
        ],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        labels: [
          'Satış Tutarı',
          'Satış Tutarı',
          `Satış Tutarı : ${satisBirim.innerHTML}`
        ],
      },
    ];
    this.config.configLine.data.labels = ['', '', ''];
    this.config.configLine.data.datasets = this.datasetsLine;
    this.config.configLine.options = this.pluginLine;
    // Bar Config
    this.config.configBar.data.datasets = this.datasetsBar;
    this.config.configBar.data.labels = [
      "Alış Tutarı",
      "Ambalaj Gideri",
      "Net Kar",
      "Ek Masraf",
      "KDV",
      "Gelir Vergisi",
      "İşçilik Gideri",
      "Pazar Komisyonu",
      "Kargo",
    ];
    this.config.configBar.options = this.pluginBar;
    // Create Chart
    this.chartPie = new Chart(document.getElementById('chart1'), this.config.configPie);
    this.chartBar = new Chart(document.getElementById('chart2'), this.config.configBar);
    this.chartLine = new Chart(document.getElementById('chart3'), this.config.configLine);
  },
  createChartElements: function () {
    // Container
    this.pieChart = document.getElementById('pieChart');
    this.barChart = document.getElementById('barChart');
    this.lineChart = document.getElementById('lineChart');
    // CanvasPie
    this.canvasPie = document.createElement('canvas');
    this.canvasPie.id = "chart1";
    this.canvasPie.style.width = "400px";
    this.canvasPie.style.height = "400px";
    this.canvasPie.style.maxWidth = "400px";
    this.canvasPie.style.maxHeight = "400px";
    this.canvasPie.style.minWidth = "400px";
    this.canvasPie.style.minHeight = "400px";
    this.canvasPie.style.margin = "auto";
    this.pieChart.appendChild(this.canvasPie);
    // CanvasBar
    this.canvasBar = document.createElement('canvas');
    this.canvasBar.id = "chart2";
    this.canvasBar.style.width = "400px";
    this.canvasBar.style.height = "400px";
    this.canvasBar.style.maxWidth = "400px";
    this.canvasBar.style.maxHeight = "400px";
    this.canvasBar.style.minWidth = "400px";
    this.canvasBar.style.minHeight = "400px";
    this.canvasBar.style.margin = "auto";
    this.barChart.appendChild(this.canvasBar);
    // CanvasLine
    this.canvasLine = document.createElement('canvas');
    this.canvasLine.id = "chart3";
    this.canvasLine.style.width = "400px";
    this.canvasLine.style.height = "400px";
    this.canvasLine.style.maxWidth = "400px";
    this.canvasLine.style.maxHeight = "400px";
    this.canvasLine.style.minWidth = "400px";
    this.canvasLine.style.minHeight = "400px";
    this.canvasLine.style.margin = "auto";
    this.lineChart.appendChild(this.canvasLine);
    // ReBuild
    if (this.chartPie) {
      this.chartPie.destroy();
      this.chartBar.destroy();
      this.chartLine.destroy();
      this.canvasPie.remove();
      this.canvasBar.remove();
      this.canvasLine.remove();
    }
  }
}
const chartUpdate = {
  newDataset: "",
  cloneHesapVar: "",
  cloneNetKarBirim: "",
  cloneDatasetFunc: function () {
    if (chartUpdate.cloneHesapVar.satisTutar != "" && chartUpdate.cloneHesapVar.satisTutar != hesapVar.satisTutar) {
      chart.datasetsBar = [{
        data: [
          Number(chartUpdate.cloneHesapVar.alisTutar),
          Number(chartUpdate.cloneHesapVar.ambalajHesabi),
          Number(chartUpdate.cloneHesapVar.netKarHesabi),
          Number(chartUpdate.cloneHesapVar.ekMasrafHesabi),
          Number(chartUpdate.cloneHesapVar.kdvHesabi),
          Number(chartUpdate.cloneHesapVar.gelirVergisiHesabi),
          Number(chartUpdate.cloneHesapVar.iscilikHesabi),
          Number(chartUpdate.cloneHesapVar.pazarTutariHesabi),
          Number(chartUpdate.cloneHesapVar.kargoTutariHesabi),
        ],
        backgroundColor: 'rgba(192, 192, 192, 0.5)',
        labels: [
          `Alış Tutarı : ${chartUpdate.cloneHesapVar.alisFiyatiBirimVarBirim}`,
          `Ambalaj Gideri : ${chartUpdate.cloneHesapVar.ambalajliBirimVarBirim}`,
          `Net Kar : ${chartUpdate.cloneNetKarBirim}`,
          `Ek Masraf : ${chartUpdate.cloneHesapVar.ekMasrafTutariBirimVarBirim}`,
          `KDV : ${chartUpdate.cloneHesapVar.kdvVarBirim}`,
          `Gelir Vergisi : ${chartUpdate.cloneHesapVar.gelirVergiVarBirim}`,
          `İşçilik Gideri : ${chartUpdate.cloneHesapVar.iscilikliBirimVarBirim}`,
          `Pazar Komisyonu : ${chartUpdate.cloneHesapVar.pazarTutariBirimVarBirim}`,
          `Kargo : ${chartUpdate.cloneHesapVar.kargoTutariBirimVarBirim}`,
        ],
      }];
    } else {
      if (chart.datasetsBar.length === 0) {
        chart.datasetsBar = [{
          data: [
            Number(hesapVar.alisTutar),
            Number(ambalaj_input.value),
            Number(hesapVar.netKarHesabi),
            Number(ekMasraf.value),
            Number(hesapVar.kdvHesabi),
            Number(hesapVar.gelirVergisiHesabi),
            Number(iscilik_input.value),
            Number(hesapVar.pazarTutariHesabi),
            Number(hesapVar.kargoTutariHesabi),
          ],
          backgroundColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgb(140,248,126)',
            'rgba(255, 206, 86, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(153, 102, 255, 1)',
          ],
          labels: [
            `Alış Tutarı : ${alisFiyatiBirim.innerHTML}`,
            `Ambalaj Gideri : ${ambalajliBirim.innerHTML}`,
            `Net Kar : ${netKar.innerHTML}`,
            `Ek Masraf : ${ekMasrafTutariBirim.innerHTML}`,
            `KDV : ${kdv.innerHTML}`,
            `Gelir Vergisi : ${gelirVergi.innerHTML}`,
            `İşçilik Gideri : ${iscilikliBirim.innerHTML}`,
            `Pazar Komisyonu : ${pazarTutariBirim.innerHTML}`,
            `Kargo : ${kargoTutariBirim.innerHTML}`,
          ],
        }];
      } else if (chart.datasetsBar.length === 2) {
        chart.datasetsBar = [
          {
            data: [
              Number(chartUpdate.cloneHesapVar.alisTutar),
              Number(chartUpdate.cloneHesapVar.ambalajHesabi),
              Number(chartUpdate.cloneHesapVar.netKarHesabi),
              Number(chartUpdate.cloneHesapVar.ekMasrafHesabi),
              Number(chartUpdate.cloneHesapVar.kdvHesabi),
              Number(chartUpdate.cloneHesapVar.gelirVergisiHesabi),
              Number(chartUpdate.cloneHesapVar.iscilikHesabi),
              Number(chartUpdate.cloneHesapVar.pazarTutariHesabi),
              Number(chartUpdate.cloneHesapVar.kargoTutariHesabi),
            ],
            backgroundColor: 'rgba(192, 192, 192, 0.5)',
            labels: [
              `Alış Tutarı : ${chartUpdate.cloneHesapVar.alisFiyatiBirimVarBirim}`,
              `Ambalaj Gideri : ${chartUpdate.cloneHesapVar.ambalajliBirimVarBirim}`,
              `Net Kar : ${chartUpdate.cloneNetKarBirim}`,
              `Ek Masraf : ${chartUpdate.cloneHesapVar.ekMasrafTutariBirimVarBirim}`,
              `KDV : ${chartUpdate.cloneHesapVar.kdvVarBirim}`,
              `Gelir Vergisi : ${chartUpdate.cloneHesapVar.gelirVergiVarBirim}`,
              `İşçilik Gideri : ${chartUpdate.cloneHesapVar.iscilikliBirimVarBirim}`,
              `Pazar Komisyonu : ${chartUpdate.cloneHesapVar.pazarTutariBirimVarBirim}`,
              `Kargo : ${chartUpdate.cloneHesapVar.kargoTutariBirimVarBirim}`,
            ],
          },
          {
            data: [
              Number(hesapVar.alisTutar),
              Number(ambalaj_input.value),
              Number(hesapVar.netKarHesabi),
              Number(ekMasraf.value),
              Number(hesapVar.kdvHesabi),
              Number(hesapVar.gelirVergisiHesabi),
              Number(iscilik_input.value),
              Number(hesapVar.pazarTutariHesabi),
              Number(hesapVar.kargoTutariHesabi),
            ],
            backgroundColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
              'rgb(140,248,126)',
              'rgba(255, 206, 86, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(153, 102, 255, 1)',
            ],
            labels: [
              `Alış Tutarı : ${alisFiyatiBirim.innerHTML}`,
              `Ambalaj Gideri : ${ambalajliBirim.innerHTML}`,
              `Net Kar : ${netKar.innerHTML}`,
              `Ek Masraf : ${ekMasrafTutariBirim.innerHTML}`,
              `KDV : ${kdv.innerHTML}`,
              `Gelir Vergisi : ${gelirVergi.innerHTML}`,
              `İşçilik Gideri : ${iscilikliBirim.innerHTML}`,
              `Pazar Komisyonu : ${pazarTutariBirim.innerHTML}`,
              `Kargo : ${kargoTutariBirim.innerHTML}`,
            ],
          },
        ]
      }
    }
  },
  addData: function (context, dataset) {
    chart.datasetsBar.push(dataset);
    context.update();
  },
  removeData: function (context) {
    context.data.datasets.shift();
    context.update();
  },
  chartCondition: function (context) {
    this.newDataset = {
      data: [
        Number(hesapVar.alisTutar),
        Number(ambalaj_input.value),
        Number(hesapVar.netKarHesabi),
        Number(ekMasraf.value),
        Number(hesapVar.kdvHesabi),
        Number(hesapVar.gelirVergisiHesabi),
        Number(iscilik_input.value),
        Number(hesapVar.pazarTutariHesabi),
        Number(hesapVar.kargoTutariHesabi),
      ],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(153, 102, 255)',
        'rgb(255, 159, 64)',
        'rgb(140,248,126)',
        'rgb(255, 206, 86)',
        'rgb(54, 162, 235)',
        'rgb(255, 159, 64)',
        'rgb(153, 102, 255)',
      ],
      labels: [
        `Alış Tutarı : ${alisFiyatiBirim.innerHTML}`,
        `Ambalaj Gideri : ${ambalajliBirim.innerHTML}`,
        `Net Kar : ${netKar.innerHTML}`,
        `Ek Masraf : ${ekMasrafTutariBirim.innerHTML}`,
        `KDV : ${kdv.innerHTML}`,
        `Gelir Vergisi : ${gelirVergi.innerHTML}`,
        `İşçilik Gideri : ${iscilikliBirim.innerHTML}`,
        `Pazar Komisyonu : ${pazarTutariBirim.innerHTML}`,
        `Kargo : ${kargoTutariBirim.innerHTML}`,
      ],
    }
    if (context.data.datasets.length === 1) {
      chartUpdate.addData(context, chartUpdate.newDataset);
    } else if (context.data.datasets.length === 2) {
      chartUpdate.removeData(chart.chartBar);
      chartUpdate.addData(context, chartUpdate.newDataset);
    }
  },
  dataUpdate: function () {
    chartUpdate.chartCondition(chart.chartBar);
    chart.chartBar.update();
  },
}
/* ####################### QUERY STRING ####################### */
const paylas = {
  url: new URL(window.location),
  params: new URLSearchParams(window.location.search),
  newUrl: '',
  alertBody: '',
  div: '',
  button: '',
  queryString: function () {
    this.params.set("alis", alis.value);
    this.params.set("hesap", hesapType.options[hesapType.selectedIndex].value);
    this.params.set("hesapTutar", hesapType_input.value);
    this.params.set("kargo", kargoType.options[kargoType.selectedIndex].value);
    this.params.set("kargoTutar", kargoType_input.value);
    this.params.set("gelir", gelirVergiType.options[gelirVergiType.selectedIndex].value);
    this.params.set("kdv", kdvType.options[kdvType.selectedIndex].value);
    this.params.set("pazar", pazarType.options[pazarType.selectedIndex].value);
    this.params.set("kategori", kategoriType.options[kategoriType.selectedIndex].value);
    this.params.set("komisyon", pazarType_input.value);
    this.params.set("ekMasraf", ekMasraf.value);
    this.params.set("kampanya", kampanya_input.value);
    this.params.set("indirim", indirim_input.value);
    this.params.set("ambalaj", ambalaj_input.value);
    this.params.set("iscilik", iscilik_input.value);
  },
  paylasFunc: function () {
    paylas.queryString();
    this.newUrl = paylas.url.href + "?" + paylas.params.toString();
    navigator.clipboard.writeText(this.newUrl);
    this.alertBody = document.getElementById('alertContainer');
    this.div = document.createElement('div');
    this.div.id = 'alert';
    this.div.className = "alert alert-success alert-dismissible";
    this.div.setAttribute('role', 'alert');
    this.div.innerHTML = 'Hesaplamalarınız Kopyalandı';
    this.button = document.createElement('button');
    this.button.className = 'btn-close';
    this.button.type = 'button';
    this.button.setAttribute('data-bs-dismiss', 'alert');
    this.button.setAttribute('aria-label', 'Close');
    this.div.appendChild(this.button);
    this.alertBody.appendChild(this.div);
    setTimeout(function () {
      $('#alert').remove();
    }, 5000);
  },
};
paylasBtn.addEventListener('click', paylas.paylasFunc);
if (paylas.url.search) {
  if (paylas.params.has('alis')) {
    alis.value = paylas.params.get('alis');
  }
  if (paylas.params.has('hesap')) {
    hesapType_input.value = paylas.params.get('hesapTutar');
    hesapType.value = paylas.params.get('hesap')
    hesapType.dispatchEvent(new Event("change"));
  }
  if (paylas.params.has('kargo')) {
    kargoType.value = paylas.params.get('kargo');
    kargoType_input.value = paylas.params.get('kargoTutar')
  }
  if (paylas.params.has('gelir')) {
    gelirVergiType.value = paylas.params.get('gelir');
  }
  if (paylas.params.has('kdv')) {
    kdvType.value = paylas.params.get('kdv');
  }
  if (paylas.params.has('pazar')) {
    pazarType.value = paylas.params.get('pazar');
    pazarType.dispatchEvent(new Event("change"));
    kategoriType.value = paylas.params.get('kategori');
    pazarType_input.value = paylas.params.get('komisyon');
  }
  if (paylas.params.has('ekMasraf')) {
    ekMasraf.value = paylas.params.get('ekMasraf');
  }
  if (paylas.params.has('kampanya')) {
    kampanya_input.value = paylas.params.get('kampanya');
  }
  if (paylas.params.has('indirim')) {
    indirim_input.value = paylas.params.get('indirim');
  }
  if (paylas.params.has('ambalaj')) {
    ambalaj_input.value = paylas.params.get('ambalaj');
  }
  if (paylas.params.has('iscilik')) {
    iscilik_input.value = paylas.params.get('iscilik');
  }
}
/* ####################### MEDIA QUERY ####################### */
const mediaQueries = {
  mediaQuery: {
    query1: window.matchMedia("(max-width: 1199px)"),
    query2: window.matchMedia("(max-width: 991px)"),
  },
  media1: function (query) {
    if (query.matches) {
      vl4.style.display = 'none';
    } else {
      vl4.style.display = 'block';
    }
  },
  media2: function (query) {
    if (query.matches) {
      vl6.style.display = 'block';
    } else {
      vl6.style.display = 'none';
    }
  },
  listeners: function () {
    this.mediaQuery.query1.addListener(this.media1);
    this.mediaQuery.query2.addListener(this.media2);
  },
  queryFunc: function () {
    this.media1(this.mediaQuery.query1);
    this.media2(this.mediaQuery.query2);
  },
}

/*  
alis isci ekstra ambalaj
sermayeler

- kategori kaldirildi  kargo+  vergilendirme+ kdv+ 
toplam masraf 




*/