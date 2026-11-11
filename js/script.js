/* =========================================================
   PORTOFOLIO — script.js
   Fitur:
   - Inisial otomatis dari nama (tampil saat belum ada foto)
   - Animasi muncul saat scroll
   - Foto profil: dari file asset/foto.jpg (jika ada),
     atau hasil unggahan lewat pop-up form (disimpan di browser)
   - Form foto: pilih / seret-lepas, validasi, pratinjau,
     simpan, batal, hapus
   ========================================================= */
'use strict';

/* ---------- Pengaturan ---------- */
const KUNCI_FOTO = 'portofolio_foto';
const MAKS_UKURAN = 2 * 1024 * 1024;                 // 2 MB
const TIPE_DIIZINKAN = ['image/jpeg', 'image/png', 'image/webp'];
const SISI_MAKS = 1000;                              // sisi terpanjang foto yang disimpan (px)

/* ---------- Penyimpanan aman (localStorage bisa diblokir) ---------- */
const penyimpanan = {
  ambil(kunci) {
    try { return localStorage.getItem(kunci); } catch (e) { return null; }
  },
  tulis(kunci, nilai) {
    try { localStorage.setItem(kunci, nilai); return true; } catch (e) { return false; }
  },
  hapus(kunci) {
    try { localStorage.removeItem(kunci); } catch (e) { /* abaikan */ }
  }
};

const kurangiGerak = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Notifikasi (toast) ---------- */
let timerToast;
function tampilkanToast(pesan, tipe = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = pesan;
  toast.className = `toast toast-${tipe} show`;
  clearTimeout(timerToast);
  timerToast = setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ---------- Inisial nama ---------- */
function ambilInisial(nama) {
  const huruf = nama.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((kata) => kata[0].toUpperCase());
  return huruf.join('') || '?';
}

function initInisial() {
  const elNama = document.getElementById('namaUtama');
  if (!elNama) return;
  const inisial = ambilInisial(elNama.textContent);
  document.querySelectorAll('[data-inisial]').forEach((el) => { el.textContent = inisial; });
}

/* ---------- Animasi muncul saat scroll ---------- */
function initReveal() {
  const elemen = document.querySelectorAll('.reveal');
  if (kurangiGerak || !('IntersectionObserver' in window)) {
    elemen.forEach((el) => el.classList.add('visible'));
    return;
  }
  const pengamat = new IntersectionObserver((entri, obs) => {
    entri.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  elemen.forEach((el) => pengamat.observe(el));
}

/* ---------- Utilitas foto ---------- */
function formatUkuran(byte) {
  if (byte < 1024) return `${byte} B`;
  if (byte < 1024 * 1024) return `${Math.round(byte / 1024)} KB`;
  return `${(byte / (1024 * 1024)).toFixed(2)} MB`;
}

/** Mengecilkan foto (sisi terpanjang maks. SISI_MAKS) lalu mengembalikan data URL JPEG. */
function olahGambar(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      const skala = Math.min(1, SISI_MAKS / Math.max(img.naturalWidth, img.naturalHeight));
      const lebar = Math.round(img.naturalWidth * skala);
      const tinggi = Math.round(img.naturalHeight * skala);

      const canvas = document.createElement('canvas');
      canvas.width = lebar;
      canvas.height = tinggi;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';               // latar putih untuk PNG transparan
      ctx.fillRect(0, 0, lebar, tinggi);
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, lebar, tinggi);

      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.86));
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Gambar tidak dapat dibaca'));
    };

    img.src = url;
  });
}

/** Mengecek apakah file foto bawaan (mis. asset/foto.jpg) ada. */
function cekFotoBawaan(src) {
  return new Promise((resolve) => {
    if (!src) { resolve(null); return; }
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/** Menampilkan foto (atau inisial jika src kosong) di dalam bingkai. */
function aturFoto(wadah, src) {
  if (!wadah) return;
  const inisial = wadah.querySelector('.avatar-initials');
  let img = wadah.querySelector('img');

  if (src) {
    if (!img) {
      img = document.createElement('img');
      img.alt = wadah.dataset.alt || 'Foto profil';
      wadah.prepend(img);
    }
    img.src = src;
    if (inisial) inisial.hidden = true;
  } else {
    if (img) img.remove();
    if (inisial) inisial.hidden = false;
  }
}

/* ---------- Foto profil & pop-up form ---------- */
async function initFoto() {
  const bingkaiUtama = document.querySelector('[data-avatar]');
  const dialog = document.getElementById('dialogFoto');
  const form = document.getElementById('formFoto');
  if (!bingkaiUtama || !dialog || !form) return;

  const input = document.getElementById('inputFoto');
  const dropzone = document.getElementById('dropzone');
  const pratinjau = document.getElementById('previewAvatar');
  const keterangan = document.getElementById('previewCaption');
  const infoFile = document.getElementById('fileInfo');
  const namaFile = document.getElementById('fileName');
  const ukuranFile = document.getElementById('fileSize');
  const pesan = document.getElementById('formMsg');
  const btnSimpan = document.getElementById('btnSimpan');
  const btnBatal = document.getElementById('btnBatal');
  const btnHapus = document.getElementById('btnHapus');
  const btnTutup = document.getElementById('btnTutup');
  const btnEditFoto = document.getElementById('btnEditFoto');

  let fotoUnggahan = penyimpanan.ambil(KUNCI_FOTO);   // foto dari form (localStorage)
  let fotoBawaan = null;                              // foto dari file asset/foto.jpg
  let fotoBaru = null;                                // foto yang dipilih tapi belum disimpan

  const fotoAktif = () => fotoUnggahan || fotoBawaan;

  const tulisPesan = (teks, tipe = '') => {
    pesan.textContent = teks;
    pesan.className = tipe ? `form-msg is-${tipe}` : 'form-msg';
  };

  const perbaruiTombol = () => {
    btnSimpan.disabled = !fotoBaru;
    btnBatal.hidden = !fotoBaru;
    btnHapus.hidden = !fotoUnggahan || Boolean(fotoBaru);
  };

  const tampilkanFotoAktif = () => aturFoto(bingkaiUtama, fotoAktif());

  const kembalikanForm = () => {
    fotoBaru = null;
    form.reset();
    infoFile.hidden = true;
    dropzone.classList.remove('has-file');
    aturFoto(pratinjau, fotoAktif());
    if (fotoUnggahan) keterangan.textContent = 'Foto unggahan kamu';
    else if (fotoBawaan) keterangan.textContent = 'Foto dari folder asset';
    else keterangan.textContent = 'Belum ada foto profil';
    perbaruiTombol();
  };

  const prosesFile = async (file) => {
    if (!file) return;

    if (!TIPE_DIIZINKAN.includes(file.type)) {
      tulisPesan('Format tidak didukung. Pilih file JPG, PNG, atau WEBP.', 'error');
      input.value = '';
      return;
    }
    if (file.size > MAKS_UKURAN) {
      tulisPesan(`Ukuran file ${formatUkuran(file.size)} terlalu besar. Maksimal 2 MB.`, 'error');
      input.value = '';
      return;
    }

    tulisPesan('Memproses foto…');
    try {
      fotoBaru = await olahGambar(file);
    } catch (err) {
      fotoBaru = null;
      tulisPesan('Foto tidak bisa dibaca. Coba pilih file lain.', 'error');
      input.value = '';
      perbaruiTombol();
      return;
    }

    aturFoto(pratinjau, fotoBaru);
    keterangan.textContent = 'Pratinjau foto baru';
    namaFile.textContent = file.name;
    ukuranFile.textContent = formatUkuran(file.size);
    infoFile.hidden = false;
    dropzone.classList.add('has-file');
    tulisPesan('Foto siap. Klik "Simpan Foto" untuk memakainya.');
    perbaruiTombol();
  };

  /* Buka & tutup pop-up */
  const bukaDialog = () => {
    kembalikanForm();
    tulisPesan('');
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  };
  const tutupDialog = () => {
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  };

  btnEditFoto.addEventListener('click', bukaDialog);
  btnTutup.addEventListener('click', tutupDialog);
  // Klik area gelap di luar kotak = tutup
  dialog.addEventListener('click', (e) => { if (e.target === dialog) tutupDialog(); });

  /* Pilih lewat dialog file */
  input.addEventListener('change', () => prosesFile(input.files[0]));

  /* Seret & lepas */
  ['dragenter', 'dragover'].forEach((jenis) => {
    dropzone.addEventListener(jenis, (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });
  });
  ['dragleave', 'dragend', 'drop'].forEach((jenis) => {
    dropzone.addEventListener(jenis, (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
    });
  });
  dropzone.addEventListener('drop', (e) => {
    const file = e.dataTransfer && e.dataTransfer.files[0];
    prosesFile(file);
  });
  // Cegah browser membuka file jika dilepas di luar area unggah
  ['dragover', 'drop'].forEach((jenis) => window.addEventListener(jenis, (e) => e.preventDefault()));

  /* Simpan */
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!fotoBaru) {
      tulisPesan('Pilih foto terlebih dahulu.', 'error');
      return;
    }

    const berhasil = penyimpanan.tulis(KUNCI_FOTO, fotoBaru);
    fotoUnggahan = fotoBaru;
    tampilkanFotoAktif();
    kembalikanForm();

    if (berhasil) {
      tutupDialog();
      tampilkanToast('Foto profil diperbarui ✓');
    } else {
      tulisPesan('Foto tampil, tetapi tidak bisa disimpan permanen di browser ini.', 'error');
    }
  });

  /* Batal */
  btnBatal.addEventListener('click', () => {
    kembalikanForm();
    tulisPesan('Pemilihan foto dibatalkan.');
  });

  /* Hapus */
  btnHapus.addEventListener('click', () => {
    if (!window.confirm('Hapus foto profil yang diunggah?')) return;
    penyimpanan.hapus(KUNCI_FOTO);
    fotoUnggahan = null;
    tampilkanFotoAktif();
    kembalikanForm();
    tulisPesan('Foto unggahan dihapus.', 'success');
    tampilkanToast('Foto profil dihapus');
  });

  /* Tampilan awal */
  tampilkanFotoAktif();
  kembalikanForm();
  fotoBawaan = await cekFotoBawaan(bingkaiUtama.dataset.default);
  if (!fotoUnggahan && fotoBawaan) {
    tampilkanFotoAktif();
    kembalikanForm();
  }
}

/* ---------- Jalankan semua ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initInisial();
  initReveal();
  initFoto();

  const tahun = document.getElementById('tahun');
  if (tahun) tahun.textContent = new Date().getFullYear();
});
