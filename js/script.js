/* =========================================================
   PORTOFOLIO — script.js
   Fitur:
   - Tema terang / gelap (tersimpan di browser)
   - Menu navigasi mobile + penanda menu aktif saat scroll
   - Inisial otomatis dari nama
   - Efek mengetik untuk peran/profesi
   - Animasi muncul saat scroll
   - Form unggah foto profil: pilih / seret-lepas, validasi,
     pratinjau, potong persegi, simpan, batal, dan hapus
   ========================================================= */
'use strict';

/* ---------- Pengaturan ---------- */
const KUNCI_FOTO = 'portofolio_foto';
const KUNCI_TEMA = 'portofolio_tema';
const MAKS_UKURAN = 2 * 1024 * 1024;                 // 2 MB
const TIPE_DIIZINKAN = ['image/jpeg', 'image/png', 'image/webp'];
const UKURAN_SIMPAN = 600;                           // sisi foto yang disimpan (px)

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

/* ---------- Tema terang / gelap ---------- */
function initTema() {
  const root = document.documentElement;
  const tombol = document.getElementById('themeToggle');
  const mediaGelap = window.matchMedia('(prefers-color-scheme: dark)');
  if (!tombol) return;

  const temaAktif = () => root.getAttribute('data-theme') || (mediaGelap.matches ? 'dark' : 'light');

  const perbaruiLabel = () => {
    const label = temaAktif() === 'dark' ? 'Ganti ke tema terang' : 'Ganti ke tema gelap';
    tombol.setAttribute('aria-label', label);
    tombol.setAttribute('title', label);
  };

  tombol.addEventListener('click', () => {
    const temaBaru = temaAktif() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', temaBaru);
    penyimpanan.tulis(KUNCI_TEMA, temaBaru);
    perbaruiLabel();
  });

  if (mediaGelap.addEventListener) mediaGelap.addEventListener('change', perbaruiLabel);
  perbaruiLabel();
}

/* ---------- Navigasi ---------- */
function initNavigasi() {
  const navbar = document.getElementById('navbar');
  const menu = document.getElementById('navMenu');
  const hamburger = document.getElementById('hamburger');
  if (!navbar || !menu || !hamburger) return;

  const tautan = Array.from(menu.querySelectorAll('.nav-link'));

  const tutupMenu = () => {
    menu.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Buka menu');
  };

  hamburger.addEventListener('click', () => {
    const terbuka = menu.classList.toggle('open');
    hamburger.classList.toggle('active', terbuka);
    hamburger.setAttribute('aria-expanded', String(terbuka));
    hamburger.setAttribute('aria-label', terbuka ? 'Tutup menu' : 'Buka menu');
  });

  tautan.forEach((link) => link.addEventListener('click', tutupMenu));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') tutupMenu(); });
  document.addEventListener('click', (e) => { if (!navbar.contains(e.target)) tutupMenu(); });

  // Bayangan navbar saat halaman di-scroll
  const cekScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', cekScroll, { passive: true });
  cekScroll();

  // Tandai menu sesuai section yang sedang terlihat
  if (!('IntersectionObserver' in window)) return;
  const tandaiAktif = (id) => {
    tautan.forEach((link) => {
      const cocok = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('active', cocok);
      if (cocok) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  };
  const pengamat = new IntersectionObserver((entri) => {
    entri.forEach((e) => { if (e.isIntersecting) tandaiAktif(e.target.id); });
  }, { rootMargin: '-45% 0px -50% 0px' });

  tautan
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean)
    .forEach((section) => pengamat.observe(section));
}

/* ---------- Inisial nama (dipakai saat belum ada foto) ---------- */
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

/* ---------- Efek mengetik ---------- */
function initEfekKetik() {
  const el = document.getElementById('typing');
  if (!el) return;

  let daftarPeran;
  try { daftarPeran = JSON.parse(el.dataset.roles); } catch (e) { daftarPeran = []; }
  if (!Array.isArray(daftarPeran) || daftarPeran.length === 0) return;

  if (kurangiGerak || daftarPeran.length === 1) {
    el.textContent = daftarPeran[0];
    return;
  }

  let indeks = 0;
  let posisi = daftarPeran[0].length;   // mulai dari kata pertama yang sudah tampil
  let menghapus = true;

  const langkah = () => {
    const kata = daftarPeran[indeks];
    posisi += menghapus ? -1 : 1;
    el.textContent = kata.slice(0, posisi);

    let jeda = menghapus ? 45 : 95;
    if (!menghapus && posisi === kata.length) {
      menghapus = true;
      jeda = 1800;
    } else if (menghapus && posisi === 0) {
      menghapus = false;
      indeks = (indeks + 1) % daftarPeran.length;
      jeda = 350;
    }
    setTimeout(langkah, jeda);
  };

  setTimeout(langkah, 2000);
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
  }, { threshold: 0.12 });
  elemen.forEach((el) => pengamat.observe(el));
}

/* ---------- Utilitas foto ---------- */
function formatUkuran(byte) {
  if (byte < 1024) return `${byte} B`;
  if (byte < 1024 * 1024) return `${Math.round(byte / 1024)} KB`;
  return `${(byte / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Membaca file gambar, memotongnya menjadi persegi, mengecilkan
 * ukurannya, lalu mengembalikan data URL JPEG (hemat penyimpanan).
 */
function olahGambar(file, sisiMaks = UKURAN_SIMPAN) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      const lebar = img.naturalWidth;
      const tinggi = img.naturalHeight;
      const sisi = Math.min(lebar, tinggi);
      const sx = (lebar - sisi) / 2;
      // Foto potret: geser potongan sedikit ke atas agar wajah tidak terpotong
      const sy = tinggi > lebar ? (tinggi - sisi) * 0.25 : (tinggi - sisi) / 2;
      const target = Math.min(sisi, sisiMaks);

      const canvas = document.createElement('canvas');
      canvas.width = target;
      canvas.height = target;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';                 // latar putih untuk PNG transparan
      ctx.fillRect(0, 0, target, target);
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, sx, sy, sisi, sisi, 0, 0, target, target);

      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.88));
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Gambar tidak dapat dibaca'));
    };

    img.src = url;
  });
}

/** Menampilkan foto (atau inisial jika src kosong) di dalam elemen avatar. */
function aturAvatar(wadah, src) {
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

function tampilkanFotoDiHalaman(src) {
  document.querySelectorAll('[data-avatar]').forEach((wadah) => aturAvatar(wadah, src));
}

/* ---------- Form foto profil ---------- */
function initFormFoto() {
  const form = document.getElementById('formFoto');
  if (!form) return;

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
  const btnEditFoto = document.getElementById('btnEditFoto');

  let fotoTersimpan = penyimpanan.ambil(KUNCI_FOTO);
  let fotoBaru = null;

  const tulisPesan = (teks, tipe = '') => {
    pesan.textContent = teks;
    pesan.className = tipe ? `form-msg is-${tipe}` : 'form-msg';
  };

  const perbaruiTombol = () => {
    btnSimpan.disabled = !fotoBaru;
    btnBatal.hidden = !fotoBaru;
    btnHapus.hidden = !fotoTersimpan || Boolean(fotoBaru);
  };

  const kembalikanTampilan = () => {
    fotoBaru = null;
    form.reset();
    infoFile.hidden = true;
    dropzone.classList.remove('has-file');
    aturAvatar(pratinjau, fotoTersimpan);
    keterangan.textContent = fotoTersimpan ? 'Foto profil saat ini' : 'Belum ada foto profil';
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

    tulisPesan('Memproses foto…', 'info');
    try {
      fotoBaru = await olahGambar(file);
    } catch (err) {
      fotoBaru = null;
      tulisPesan('Foto tidak bisa dibaca. Coba pilih file lain.', 'error');
      input.value = '';
      perbaruiTombol();
      return;
    }

    aturAvatar(pratinjau, fotoBaru);
    keterangan.textContent = 'Pratinjau foto baru';
    namaFile.textContent = file.name;
    ukuranFile.textContent = formatUkuran(file.size);
    infoFile.hidden = false;
    dropzone.classList.add('has-file');
    tulisPesan('Foto siap. Klik "Simpan Foto" untuk memakainya.', 'info');
    perbaruiTombol();
  };

  // Pilih lewat dialog file
  input.addEventListener('change', () => prosesFile(input.files[0]));

  // Seret & lepas
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

  // Simpan
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!fotoBaru) {
      tulisPesan('Pilih foto terlebih dahulu.', 'error');
      return;
    }

    const berhasil = penyimpanan.tulis(KUNCI_FOTO, fotoBaru);
    fotoTersimpan = fotoBaru;
    tampilkanFotoDiHalaman(fotoTersimpan);
    kembalikanTampilan();

    if (berhasil) {
      tulisPesan('Foto profil berhasil disimpan.', 'success');
      tampilkanToast('Foto profil diperbarui ✓');
    } else {
      tulisPesan('Foto tampil, tetapi tidak bisa disimpan permanen di browser ini.', 'error');
      tampilkanToast('Penyimpanan browser tidak tersedia', 'error');
    }
  });

  // Batal
  btnBatal.addEventListener('click', () => {
    kembalikanTampilan();
    tulisPesan('Pemilihan foto dibatalkan.');
  });

  // Hapus
  btnHapus.addEventListener('click', () => {
    if (!window.confirm('Hapus foto profil? Tampilan akan kembali ke inisial nama.')) return;
    penyimpanan.hapus(KUNCI_FOTO);
    fotoTersimpan = null;
    tampilkanFotoDiHalaman(null);
    kembalikanTampilan();
    tulisPesan('Foto profil dihapus.', 'success');
    tampilkanToast('Foto profil dihapus');
  });

  // Tombol kamera di foto hero: lompat ke form & buka pemilih file
  if (btnEditFoto) {
    btnEditFoto.addEventListener('click', () => {
      document.getElementById('foto').scrollIntoView({ behavior: kurangiGerak ? 'auto' : 'smooth' });
      input.click();
    });
  }

  // Tampilan awal
  tampilkanFotoDiHalaman(fotoTersimpan);
  kembalikanTampilan();
}

/* ---------- Jalankan semua ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initTema();
  initNavigasi();
  initInisial();
  initEfekKetik();
  initReveal();
  initFormFoto();

  const tahun = document.getElementById('tahun');
  if (tahun) tahun.textContent = new Date().getFullYear();
});
