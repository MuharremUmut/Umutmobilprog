// script.js

// Çalışanları saklamak için boş bir dizi oluşturuyoruz
let calisanlar = [];

// Mesaj Gösterme Fonksiyonu
function showMessage(message, type = 'success') {
    const messageDiv = document.getElementById('message');
    messageDiv.style.display = 'block';
    messageDiv.textContent = message;
    if (type === 'error') {
        messageDiv.classList.remove('success');
        messageDiv.classList.add('error');
    } else {
        messageDiv.classList.remove('error');
        messageDiv.classList.add('success');
    }
    // Mesajı 3 saniye sonra gizle
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}

// Çalışan Ekleme
document.getElementById('addEmployeeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const isim = document.getElementById('addIsim').value.trim();
    const yas = parseInt(document.getElementById('addYas').value);
    const departman = document.getElementById('addDepartman').value.trim();
    const maas = parseFloat(document.getElementById('addMaas').value);

    // İsim boş mu kontrolü
    if (!isim) {
        showMessage("Hata: İsim boş bırakılamaz.", 'error');
        return;
    }

    // Yaş kontrolü
    if (isNaN(yas) || yas < 18) {
        showMessage("Hata: Yaş 18'den küçük veya geçersiz.", 'error');
        return;
    }

    // Maaş kontrolü
    if (isNaN(maas) || maas < 0) {
        showMessage("Hata: Maaş negatif olamaz veya geçersiz.", 'error');
        return;
    }

    // İsim benzersiz mi kontrolü
    let mevcut = calisanlar.find(calisan => calisan.isim.toLowerCase() === isim.toLowerCase());
    if (mevcut) {
        showMessage("Hata: Bu isimde bir çalışan zaten mevcut.", 'error');
        return;
    }

    // Yeni çalışanı ekleme
    calisanlar.push({ isim, yas, departman, maas });
    showMessage(`${isim} adlı çalışan başarıyla eklendi.`);
    document.getElementById('addEmployeeForm').reset();
    tumCalisanlariListele();
});

// Çalışan Güncelleme
document.getElementById('updateEmployeeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const isim = document.getElementById('updateIsim').value.trim();
    const yeniYas = parseInt(document.getElementById('updateYas').value);
    const yeniDepartman = document.getElementById('updateDepartman').value.trim();
    const yeniMaas = parseFloat(document.getElementById('updateMaas').value);

    // Çalışanı bulma
    let calisan = calisanlar.find(c => c.isim.toLowerCase() === isim.toLowerCase());
    if (!calisan) {
        showMessage("Hata: Güncellenmek istenen çalışan bulunamadı.", 'error');
        return;
    }

    // Yeni bilgiler doğrulama
    if (!isim) {
        showMessage("Hata: İsim boş bırakılamaz.", 'error');
        return;
    }

    if (isNaN(yeniYas) || yeniYas < 18) {
        showMessage("Hata: Yaş 18'den küçük veya geçersiz.", 'error');
        return;
    }

    if (isNaN(yeniMaas) || yeniMaas < 0) {
        showMessage("Hata: Maaş negatif olamaz veya geçersiz.", 'error');
        return;
    }

    // Çalışan bilgilerini güncelleme
    calisan.yas = yeniYas;
    calisan.departman = yeniDepartman;
    calisan.maas = yeniMaas;

    showMessage(`${isim} adlı çalışanın bilgileri başarıyla güncellendi.`);
    document.getElementById('updateEmployeeForm').reset();
    tumCalisanlariListele();
});

// Çalışan Silme
document.getElementById('deleteEmployeeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const isim = document.getElementById('deleteIsim').value.trim();

    // Çalışanın dizideki indeksini bulma
    let index = calisanlar.findIndex(c => c.isim.toLowerCase() === isim.toLowerCase());
    if (index === -1) {
        showMessage("Hata: Silinmek istenen çalışan bulunamadı.", 'error');
        return;
    }

    // Çalışanı silme
    calisanlar.splice(index, 1);
    showMessage(`${isim} adlı çalışan başarıyla silindi.`);
    document.getElementById('deleteEmployeeForm').reset();
    tumCalisanlariListele();
});

// Tüm Çalışanları Listeleme
function tumCalisanlariListele() {
    const tbody = document.querySelector('#calisanTable tbody');
    tbody.innerHTML = '';

    if (calisanlar.length === 0) {
        showMessage("Sistemde hiç çalışan bulunmamaktadır.", 'error');
        return;
    }

    calisanlar.forEach(c => {
        let row = tbody.insertRow();
        row.insertCell(0).textContent = c.isim;
        row.insertCell(1).textContent = c.yas;
        row.insertCell(2).textContent = c.departman;
        row.insertCell(3).textContent = c.maas.toFixed(2);
    });

    showMessage("Çalışanlar listelendi.");
}

// Departmana Göre Listeleme
function departmanaGoreListele() {
    const departman = document.getElementById('listeDepartman').value.trim().toLowerCase();
    if (!departman) {
        showMessage("Lütfen bir departman adı girin.", 'error');
        return;
    }

    const filtrelenmisCalisanlar = calisanlar.filter(c => c.departman.toLowerCase() === departman);

    const tbody = document.querySelector('#calisanTable tbody');
    tbody.innerHTML = '';

    if (filtrelenmisCalisanlar.length === 0) {
        showMessage("Bu departmanda çalışan bulunmamaktadır.", 'error');
        return;
    }

    filtrelenmisCalisanlar.forEach(c => {
        let row = tbody.insertRow();
        row.insertCell(0).textContent = c.isim;
        row.insertCell(1).textContent = c.yas;
        row.insertCell(2).textContent = c.departman;
        row.insertCell(3).textContent = c.maas.toFixed(2);
    });

    showMessage(`${departman.charAt(0).toUpperCase() + departman.slice(1)} Departmanındaki çalışanlar listelendi.`);
}

// Maaşa Göre Sıralama
function maasaGoreSirala() {
    const siralama = document.getElementById('siralama').value;
    const artanMi = siralama === 'artan';
    
    if (calisanlar.length === 0) {
        showMessage("Sistemde hiç çalışan bulunmamaktadır.", 'error');
        return;
    }

    // Çalışanları maaşa göre sıralama
    let siraliCalisanlar = [...calisanlar];
    siraliCalisanlar.sort((a, b) => artanMi ? a.maas - b.maas : b.maas - a.maas);

    const tbody = document.querySelector('#calisanTable tbody');
    tbody.innerHTML = '';

    siraliCalisanlar.forEach(c => {
        let row = tbody.insertRow();
        row.insertCell(0).textContent = c.isim;
        row.insertCell(1).textContent = c.yas;
        row.insertCell(2).textContent = c.departman;
        row.insertCell(3).textContent = c.maas.toFixed(2);
    });

    showMessage(`Çalışanlar maaşa göre ${artanMi ? "artan" : "azalan"} sırada listelendi.`);
}

// Maaşı Belirli Bir Değerin Altında Olan Çalışanları Listeleme
function maasAltindaListele() {
    const maasInput = document.getElementById('maasAltinda').value;
    const seviye = parseFloat(maasInput);
    if (isNaN(seviye)) {
        showMessage("Lütfen geçerli bir maaş seviyesi girin.", 'error');
        return;
    }

    const filtrelenmisCalisanlar = calisanlar.filter(c => c.maas < seviye);

    const tbody = document.querySelector('#calisanTable tbody');
    tbody.innerHTML = '';

    if (filtrelenmisCalisanlar.length === 0) {
        showMessage(`${seviye} TL'nin altında maaş alan çalışan bulunmamaktadır.`, 'error');
        return;
    }

    filtrelenmisCalisanlar.forEach(c => {
        let row = tbody.insertRow();
        row.insertCell(0).textContent = c.isim;
        row.insertCell(1).textContent = c.yas;
        row.insertCell(2).textContent = c.departman;
        row.insertCell(3).textContent = c.maas.toFixed(2);
    });

    showMessage(`${seviye} TL'nin altında maaş alan çalışanlar listelendi.`);
}

// En Yüksek Maaşlı Çalışanı Bulma
function enYuksekMaasliCalisaniBul() {
    if (calisanlar.length === 0) {
        showMessage("Sistemde hiç çalışan bulunmamaktadır.", 'error');
        return;
    }

    let enYuksek = calisanlar[0];
    calisanlar.forEach(c => {
        if (c.maas > enYuksek.maas) {
            enYuksek = c;
        }
    });

    const tbody = document.querySelector('#calisanTable tbody');
    tbody.innerHTML = '';

    let row = tbody.insertRow();
    row.insertCell(0).textContent = enYuksek.isim;
    row.insertCell(1).textContent = enYuksek.yas;
    row.insertCell(2).textContent = enYuksek.departman;
    row.insertCell(3).textContent = enYuksek.maas.toFixed(2);

    showMessage("En yüksek maaşlı çalışan listelendi.");
}

// Toplam Maaş Hesaplama
function toplamMaasHesapla() {
    if (calisanlar.length === 0) {
        showMessage("Sistemde hiç çalışan bulunmamaktadır.", 'error');
        return;
    }

    let toplamMaas = 0;
    let departmanMaas = {};

    calisanlar.forEach(c => {
        toplamMaas += c.maas;

        if (departmanMaas[c.departman]) {
            departmanMaas[c.departman] += c.maas;
        } else {
            departmanMaas[c.departman] = c.maas;
        }
    });

    const tbody = document.querySelector('#calisanTable tbody');
    tbody.innerHTML = '';

    // Toplam Maaş
    let row = tbody.insertRow();
    row.insertCell(0).textContent = "Toplam Maaş";
    row.insertCell(1).colSpan = 3;
    row.cells[1].textContent = `${toplamMaas.toFixed(2)} TL`;

    // Departmanlara Göre Toplam Maaş
    for (let dep in departmanMaas) {
        let depRow = tbody.insertRow();
        depRow.insertCell(0).textContent = `${dep} Departmanı Toplam Maaş`;
        depRow.insertCell(1).colSpan = 3;
        depRow.cells[1].textContent = `${departmanMaas[dep].toFixed(2)} TL`;
    }

    showMessage("Toplam maaş hesaplandı ve listelendi.");
}

// Başlangıçta bazı örnek çalışanlar ekleyelim
window.onload = function() {
    calisanlar.push({ isim: "Ahmet", yas: 30, departman: "İnsan Kaynakları", maas: 6000 });
    calisanlar.push({ isim: "Mehmet", yas: 25, departman: "Geliştirme", maas: 5500 });
    calisanlar.push({ isim: "Elif", yas: 28, departman: "Pazarlama", maas: 5000 });
    tumCalisanlariListele();
};
