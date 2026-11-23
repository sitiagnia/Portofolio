/* =========================================================
   PORTOFOLIO — script.js
   Fitur:
   - Inisial otomatis dari nama (tampil saat belum ada foto)
   - Animasi muncul saat scroll
   - Foto profil dari file asset/foto.jpg (hanya pemilik yang bisa
     mengganti lewat VS Code; tidak ada form unggah di halaman)
   - Navbar: menu hamburger (HP/tablet), penanda menu aktif,
     bilah progres scroll, tombol kembali ke atas
   - Tema terang / gelap
   - Stiker: klik untuk ganti sapaan, mata mengikuti kursor
   - Skills: klik ubin untuk melihat level & keterangan
   - Foto miring 3D mengikuti kursor (desktop)
   - Salin nomor / email, tautan kontak (email, WhatsApp, LinkedIn, GitHub, Instagram)
   - Bagian Karya: filter kategori, kartu, pop-up detail
   - Dua bahasa: Indonesia & Inggris (tombol ID | EN)
   ========================================================= */
'use strict';

/* ---------- Pengaturan ---------- */
const KUNCI_TEMA = 'portofolio_tema';
const KUNCI_BAHASA = 'portofolio_bahasa';
const DATA = window.DATA_PORTOFOLIO || {};               // isi dari js/data.js
const SAPAAN = (Array.isArray(DATA.sapaan) && DATA.sapaan.length) ? DATA.sapaan : ['Hello!'];

/* ---------- Teks antarmuka dalam dua bahasa ---------- */
const TEKS = {
  id: {
    skip: 'Lewati ke konten utama',
    navUtama: 'Navigasi utama',
    navBeranda: 'Beranda', navSkills: 'Keahlian', navPengalaman: 'Pengalaman', navDataDiri: 'Data Diri', navKontak: 'Kontak', navKarya: 'Karya',
    keBeranda: 'Kembali ke beranda',
    temaKeGelap: 'Ganti ke tema gelap', temaKeTerang: 'Ganti ke tema terang',
    bukaMenu: 'Buka menu', tutupMenu: 'Tutup menu',
    gantiBahasa: 'Switch to English',
    sapaanLabel: 'Ganti sapaan', sapaanTitle: 'Klik aku!',
    judulSkills: 'Keahlian', judulPendidikan: 'Pendidikan', judulPengalaman: 'Pengalaman',
    judulDataDiri: 'Data Diri',
    pilihSkill: 'Pilih keahlian untuk melihat detail',
    kontak: 'Kontak',
    keAtas: 'Kembali ke atas',
    salin: 'Salin', salinTelepon: 'Salin nomor telepon', salinEmail: 'Salin alamat email',
    disalin: 'Disalin', gagalSalin: 'Gagal menyalin',
    judulHalaman: (n) => `${n} | Portofolio`,
    deskripsi: (n) => `Portofolio pribadi ${n} — profil, keahlian, pengalaman, dan kontak.`,
    altFoto: (n) => `Foto ${n}`,
    dd: { nama: 'Nama Lengkap', ttl: 'Tempat, Tanggal Lahir', jk: 'Jenis Kelamin', hobi: 'Hobi', alamat: 'Domisili', pendidikan: 'Pendidikan', ipk: 'IPK', email: 'Email' },
    karyaKicker: 'Hasil Karya', karyaJudul: 'Karya Saya',
    karyaSub: 'Kumpulan hasil karya saya, mulai dari desain logo, desain grafis, hingga desain antarmuka dan website.',
    lihatKarya: 'Lihat karya saya',
    filterLabel: 'Saring berdasarkan kategori', semua: 'Semua',
    kategori: { logo: 'Desain Logo', grafis: 'Desain Grafis', uiux: 'UI/UX', web: 'Website', video: 'Video', lainnya: 'Lainnya' },
    kosong: 'Karya akan segera ditambahkan. Nantikan, ya!',
    lihatDetail: 'Lihat detail', tutup: 'Tutup', sebelumnya: 'Karya sebelumnya', berikutnya: 'Karya berikutnya',
    kunjungi: 'Lihat karya', alat: 'Alat', contoh: 'Contoh',
  },
  en: {
    skip: 'Skip to main content',
    navUtama: 'Main navigation',
    navBeranda: 'Home', navSkills: 'Skills', navPengalaman: 'Experience', navDataDiri: 'Profile', navKontak: 'Contact', navKarya: 'Works',
    keBeranda: 'Back to home',
    temaKeGelap: 'Switch to dark theme', temaKeTerang: 'Switch to light theme',
    bukaMenu: 'Open menu', tutupMenu: 'Close menu',
    gantiBahasa: 'Ganti ke Bahasa Indonesia',
    sapaanLabel: 'Change greeting', sapaanTitle: 'Click me!',
    judulSkills: 'Skills', judulPendidikan: 'Education', judulPengalaman: 'Experience',
    judulDataDiri: 'Profile',
    pilihSkill: 'Choose a skill to see details',
    kontak: 'Contact',
    keAtas: 'Back to top',
    salin: 'Copy', salinTelepon: 'Copy phone number', salinEmail: 'Copy email address',
    disalin: 'Copied', gagalSalin: 'Copy failed',
    judulHalaman: (n) => `${n} | Portfolio`,
    deskripsi: (n) => `Personal portfolio of ${n} — profile, skills, experience, and contact.`,
    altFoto: (n) => `Photo of ${n}`,
    dd: { nama: 'Full Name', ttl: 'Place, Date of Birth', jk: 'Gender', hobi: 'Hobbies', alamat: 'Location', pendidikan: 'Education', ipk: 'GPA', email: 'Email' },
    karyaKicker: 'Portfolio', karyaJudul: 'My Works',
    karyaSub: 'A collection of things I have made, from logo design and graphic design to interface and website design.',
    lihatKarya: 'See my works',
    filterLabel: 'Filter by category', semua: 'All',
    kategori: { logo: 'Logo Design', grafis: 'Graphic Design', uiux: 'UI/UX', web: 'Website', video: 'Video', lainnya: 'Others' },
    kosong: 'Works will be added soon. Stay tuned!',
    lihatDetail: 'View details', tutup: 'Close', sebelumnya: 'Previous work', berikutnya: 'Next work',
    kunjungi: 'View project', alat: 'Tools', contoh: 'Sample',
  }
};

/* Bahasa awal: pilihan tersimpan → bahasa browser → Indonesia */
let bahasa = (() => {
  let simpan = null;
  try { simpan = localStorage.getItem(KUNCI_BAHASA); } catch (e) { /* abaikan */ }
  if (simpan === 'id' || simpan === 'en') return simpan;
  const nav = (navigator.language || 'id').toLowerCase();
  return nav.startsWith('id') || nav.startsWith('ms') ? 'id' : 'en';
})();

/** Teks antarmuka sesuai bahasa aktif. */
function t(kunci) {
  return TEKS[bahasa][kunci] ?? TEKS.id[kunci] ?? kunci;
}

/** Nilai dari data.js: boleh teks biasa atau { "id": "...", "en": "..." }. */
function pilih(nilai) {
  if (nilai && typeof nilai === 'object' && !Array.isArray(nilai)) {
    return nilai[bahasa] || nilai.id || nilai.en || '';
  }
  return nilai ?? '';
}

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

/* ---------- Foto profil (hanya dari file, tidak bisa diubah pengunjung) ---------- */
/**
 * Foto diambil dari file yang ditunjuk atribut data-default di index.html
 * (bawaan: asset/foto.jpg). Untuk mengganti foto, ganti file itu lewat VS Code.
 * Jika file belum ada, yang tampil adalah inisial nama.
 */
function initFoto() {
  const bingkai = document.querySelector('[data-avatar]');
  const src = bingkai && bingkai.dataset.default;
  if (!src) return;

  const img = new Image();
  img.alt = bingkai.dataset.alt || 'Foto profil';
  img.onload = () => {
    bingkai.prepend(img);
    const inisial = bingkai.querySelector('.avatar-initials');
    if (inisial) inisial.hidden = true;
  };
  img.src = src;
}


/* ---------- Tema terang / gelap ---------- */
function initTema() {
  const root = document.documentElement;
  const tombol = document.getElementById('themeToggle');
  const metaWarna = document.querySelector('meta[name="theme-color"]');
  if (!tombol) return;

  const terapkan = () => {
    const gelap = root.getAttribute('data-theme') === 'dark';
    const label = gelap ? t('temaKeTerang') : t('temaKeGelap');
    tombol.setAttribute('aria-label', label);
    tombol.setAttribute('title', label);
    if (metaWarna) metaWarna.setAttribute('content', gelap ? '#16171b' : '#efefef');
  };

  tombol.addEventListener('click', () => {
    const temaBaru = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', temaBaru);
    penyimpanan.tulis(KUNCI_TEMA, temaBaru);
    terapkan();
  });
  document.addEventListener('gantibahasa', terapkan);
  terapkan();
}

/* ---------- Bahasa Indonesia / Inggris ---------- */
/** Mengisi semua elemen bertanda data-i18n (teks) dan data-i18n-* (atribut). */
function terapkanTeksAntarmuka() {
  document.documentElement.lang = bahasa;
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  ['aria-label', 'title', 'placeholder'].forEach((attr) => {
    document.querySelectorAll(`[data-i18n-${attr}]`).forEach((el) => {
      el.setAttribute(attr, t(el.getAttribute(`data-i18n-${attr}`)));
    });
  });
  const tombol = document.getElementById('langToggle');
  if (tombol) {
    tombol.setAttribute('aria-label', t('gantiBahasa'));
    tombol.title = t('gantiBahasa');
    tombol.querySelectorAll('[data-lang]').forEach((s) => s.classList.toggle('on', s.dataset.lang === bahasa));
  }
}

function initBahasa() {
  const tombol = document.getElementById('langToggle');
  if (!tombol) return;
  tombol.addEventListener('click', () => {
    bahasa = bahasa === 'id' ? 'en' : 'id';
    penyimpanan.tulis(KUNCI_BAHASA, bahasa);
    terapkanTeksAntarmuka();
    renderData();
    document.dispatchEvent(new CustomEvent('gantibahasa'));
  });
}

/* ---------- Navbar, progres scroll, tombol ke atas ---------- */
function initNavigasi() {
  const nav = document.getElementById('nav');
  const menu = document.getElementById('navMenu');
  const hamburger = document.getElementById('hamburger');
  const progres = document.getElementById('progress');
  const tombolAtas = document.getElementById('floatTop');
  if (!nav || !menu || !hamburger) return;

  const tautan = Array.from(menu.querySelectorAll('.nav-link'));

  const labelHamburger = () => {
    hamburger.setAttribute('aria-label', menu.classList.contains('open') ? t('tutupMenu') : t('bukaMenu'));
  };
  const tutupMenu = () => {
    menu.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    labelHamburger();
  };

  hamburger.addEventListener('click', () => {
    const terbuka = menu.classList.toggle('open');
    hamburger.classList.toggle('active', terbuka);
    hamburger.setAttribute('aria-expanded', String(terbuka));
    labelHamburger();
  });
  document.addEventListener('gantibahasa', labelHamburger);
  labelHamburger();
  tautan.forEach((link) => link.addEventListener('click', tutupMenu));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') tutupMenu(); });
  document.addEventListener('click', (e) => { if (!nav.contains(e.target)) tutupMenu(); });
  // Menu otomatis tertutup jika layar diperlebar (mis. tablet diputar)
  window.matchMedia('(min-width: 901px)').addEventListener('change', (e) => { if (e.matches) tutupMenu(); });

  // Bayangan navbar, bilah progres, dan tombol ke atas
  let menunggu = false;
  const perbarui = () => {
    const y = window.scrollY;
    const maks = document.documentElement.scrollHeight - window.innerHeight;
    nav.classList.toggle('scrolled', y > 10);
    if (progres) progres.style.transform = `scaleX(${maks > 0 ? y / maks : 0})`;
    if (tombolAtas) tombolAtas.classList.toggle('show', y > window.innerHeight * 0.8);
    menunggu = false;
  };
  window.addEventListener('scroll', () => {
    if (!menunggu) { menunggu = true; requestAnimationFrame(perbarui); }
  }, { passive: true });
  window.addEventListener('resize', perbarui);
  perbarui();

  // Tandai menu sesuai bagian yang sedang terlihat
  if (!('IntersectionObserver' in window)) return;
  const tandaiAktif = (id) => {
    tautan.forEach((link) => {
      const cocok = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('active', cocok);
      if (cocok) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };
  const pengamat = new IntersectionObserver((entri) => {
    entri.forEach((e) => { if (e.isIntersecting) tandaiAktif(e.target.id); });
  }, { rootMargin: '-45% 0px -50% 0px' });
  // Hanya tautan ke bagian di halaman ini (href diawali "#") yang dipantau
  tautan
    .map((link) => link.getAttribute('href'))
    .filter((href) => href && href.startsWith('#') && href.length > 1)
    .map((href) => document.getElementById(href.slice(1)))
    .filter(Boolean)
    .forEach((el) => pengamat.observe(el));
}

/* ---------- Stiker: ganti sapaan & mata mengikuti kursor ---------- */
function initStiker() {
  const tombol = document.getElementById('sticker');
  const judul = document.getElementById('judulHello');
  if (!tombol || !judul) return;

  let indeks = 0;
  tombol.addEventListener('click', () => {
    indeks = (indeks + 1) % SAPAAN.length;
    judul.textContent = SAPAAN[indeks];
    judul.dataset.diganti = "1";
    judul.classList.remove('ganti');
    tombol.classList.remove('putar');
    void judul.offsetWidth;                 // mulai ulang animasi
    judul.classList.add('ganti');
    tombol.classList.add('putar');
  });
  tombol.addEventListener('animationend', () => tombol.classList.remove('putar'));

  // Mata mengikuti kursor (hanya perangkat dengan mouse)
  if (kurangiGerak || !window.matchMedia('(pointer: fine)').matches) return;
  const pupil = tombol.querySelectorAll('.pupil');
  window.addEventListener('pointermove', (e) => {
    const kotak = tombol.getBoundingClientRect();
    const dx = e.clientX - (kotak.left + kotak.width / 2);
    const dy = e.clientY - (kotak.top + kotak.height / 2);
    const jarak = Math.hypot(dx, dy) || 1;
    const geser = Math.min(3, jarak / 60);
    pupil.forEach((p) => {
      p.style.transform = `translate(${(dx / jarak) * geser}px, ${(dy / jarak) * geser}px)`;
    });
  }, { passive: true });
}

/* ---------- Skills: klik ubin untuk detail ---------- */
/* Indeks ubin yang sedang dipilih (-1 = belum ada). Dipertahankan saat bahasa diganti. */
let skillAktif = -1;

function pilihSkill(indeks) {
  const ubin = Array.from(document.querySelectorAll('#isiSkills .skill'));
  const el = ubin[indeks];
  if (!el) return;
  skillAktif = indeks;
  ubin.forEach((u) => {
    const aktif = u === el;
    u.classList.toggle('active', aktif);
    u.setAttribute('aria-pressed', String(aktif));
  });
  const level = Math.max(0, Math.min(100, Number(el.dataset.level) || 0));
  document.getElementById('skillName').textContent = el.dataset.name || el.textContent.trim();
  document.getElementById('skillPct').textContent = `${level}%`;
  document.getElementById('skillDesc').textContent = el.dataset.desc || '';
  document.getElementById('skillBar').style.width = `${level}%`;
}

function initSkills() {
  const wadah = document.getElementById('isiSkills');
  if (!wadah || !wadah.children.length) return;
  const daftar = () => Array.from(wadah.querySelectorAll('.skill'));

  wadah.addEventListener('click', (e) => {
    const u = e.target.closest('.skill');
    if (u) pilihSkill(daftar().indexOf(u));
  });

  // Tombol panah untuk berpindah antar ubin
  wadah.addEventListener('keydown', (e) => {
    const arah = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    const u = e.target.closest('.skill');
    if (!arah || !u) return;
    e.preventDefault();
    const semua = daftar();
    const tujuan = (semua.indexOf(u) + arah + semua.length) % semua.length;
    semua[tujuan].focus();
    pilihSkill(tujuan);
  });

  // Pilih ubin pertama; bar baru terisi saat bagian skills terlihat
  const skills = document.getElementById('skills');
  if ('IntersectionObserver' in window && skills && !kurangiGerak) {
    const obs = new IntersectionObserver((entri) => {
      if (entri[0].isIntersecting) { if (skillAktif < 0) pilihSkill(0); obs.disconnect(); }
    }, { threshold: 0.3 });
    obs.observe(skills);
  } else {
    pilihSkill(0);
  }
}

/* ---------- Foto miring 3D mengikuti kursor (desktop) ---------- */
function initTilt() {
  const wadah = document.getElementById('photo');
  const bingkai = wadah && wadah.querySelector('.photo-frame');
  if (!bingkai || kurangiGerak || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  wadah.addEventListener('pointermove', (e) => {
    const kotak = wadah.getBoundingClientRect();
    const x = (e.clientX - kotak.left) / kotak.width - 0.5;
    const y = (e.clientY - kotak.top) / kotak.height - 0.5;
    bingkai.classList.add('tilting');
    bingkai.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.01)`;
  });
  wadah.addEventListener('pointerleave', () => {
    bingkai.classList.remove('tilting');
    bingkai.style.transform = '';
  });
}

/* ---------- Salin nomor / email ---------- */
async function salinTeks(teks) {
  try {
    await navigator.clipboard.writeText(teks);
    return true;
  } catch (e) {
    // Cadangan untuk browser lama / non-HTTPS
    const area = document.createElement('textarea');
    area.value = teks;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
    area.remove();
    return ok;
  }
}

function initSalin() {
  // Satu pendengar untuk semua tombol salin (tetap jalan walau kontak dibuat ulang)
  document.addEventListener('click', async (e) => {
    const tombol = e.target.closest('[data-copy]');
    if (!tombol) return;
    const ok = await salinTeks(tombol.dataset.copy);
    if (!ok) { tampilkanToast(t('gagalSalin'), 'error'); return; }
    tampilkanToast(`${t('disalin')}: ${tombol.dataset.copy}`);
    const ikon = tombol.querySelector('use');
    tombol.classList.add('copied');
    if (ikon) ikon.setAttribute('href', '#i-check');
    setTimeout(() => {
      tombol.classList.remove('copied');
      if (ikon) ikon.setAttribute('href', '#i-copy');
    }, 1600);
  });
}

/* ---------- Isi halaman dari js/data.js ---------- */
/* Semua teks dimasukkan lewat textContent, jadi aman dari kode HTML yang tidak sengaja ikut terketik. */
function buat(tag, kelas, teks) {
  const el = document.createElement(tag);
  if (kelas) el.className = kelas;
  if (teks !== undefined && teks !== null) el.textContent = teks;
  return el;
}

function ikon(nama, kelas = 'ic') {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('class', kelas);
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const use = document.createElementNS(ns, 'use');
  use.setAttribute('href', `#i-${nama}`);
  svg.appendChild(use);
  return svg;
}

function isiTeks(id, teks) {
  const el = document.getElementById(id);
  if (el && teks) el.textContent = teks;
}

/** Membuat satu entri pendidikan/pengalaman yang bisa dibuka-tutup. */
function buatEntri(judul, subjudul, detail) {
  const entri = buat('details', 'entry');
  const ringkas = document.createElement('summary');
  const teks = buat('span');
  teks.append(buat('span', 'entry-year', judul));
  if (subjudul) teks.append(buat('span', 'entry-text', subjudul));
  ringkas.append(teks, ikon('down', 'ic entry-chev'));
  entri.append(ringkas);

  const butir = (detail || []).filter((d) => String(d).trim());
  if (butir.length) {
    const daftar = buat('ul', 'entry-detail');
    butir.forEach((d) => daftar.append(buat('li', '', d)));
    entri.append(daftar);
  } else {
    entri.classList.add('tanpa-detail');
  }
  return entri;
}

function renderData() {
  const d = DATA;
  if (!d || !d.nama) return;                     // tanpa data.js: biarkan HTML apa adanya

  // Nama panggilan (besar), nama lengkap & teks perkenalan
  isiTeks('namaUtama', d.nama);
  const panggilan = document.getElementById('namaPanggilan');
  if (panggilan) {
    panggilan.textContent = d.panggilan || '';
    panggilan.hidden = !d.panggilan;
  }
  document.querySelectorAll('[data-nama]').forEach((el) => { el.textContent = d.nama; });
  document.title = t('judulHalaman')(d.nama);
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute('content', t('deskripsi')(d.nama));
  isiTeks('isiBio', pilih(d.bio));
  isiTeks('isiPenutup', pilih(d.penutup));
  const elHello = document.getElementById('judulHello');
  if (elHello && SAPAAN[0] && !elHello.dataset.diganti) elHello.textContent = SAPAAN[0];

  // Foto
  const bingkai = document.querySelector('[data-avatar]');
  if (bingkai) {
    if (d.foto) bingkai.dataset.default = d.foto;
    bingkai.dataset.alt = t('altFoto')(d.nama);
    const img = bingkai.querySelector('img');
    if (img) img.alt = bingkai.dataset.alt;
  }

  // Skills
  const wadahSkill = document.getElementById('isiSkills');
  if (wadahSkill && Array.isArray(d.skills)) {
    wadahSkill.replaceChildren(...d.skills.filter((s) => s && (s.label || s.nama)).map((s) => {
      const nama = pilih(s.nama) || s.label;
      const b = buat('button', 'skill', s.label || nama);
      b.type = 'button';
      b.dataset.name = nama;
      b.dataset.level = String(s.level ?? 0);
      b.dataset.desc = pilih(s.keterangan);
      b.title = nama;
      b.setAttribute('aria-pressed', 'false');
      return b;
    }));
    const blokSkill = document.getElementById('skills');
    if (blokSkill) blokSkill.hidden = wadahSkill.children.length === 0;
    if (skillAktif >= 0) pilihSkill(Math.min(skillAktif, wadahSkill.children.length - 1));
  }

  // Pendidikan & pengalaman
  const detailDari = (daftar) => (daftar || []).map(pilih);
  const wadahPend = document.getElementById('isiPendidikan');
  if (wadahPend && Array.isArray(d.pendidikan)) {
    wadahPend.replaceChildren(...d.pendidikan.map((p) =>
      // Judul: "Kampus · Waktu", mis. "Politeknik Negeri Subang · September 2026"
      buatEntri([pilih(p.tempat), pilih(p.waktu)].filter(Boolean).join(' · '), pilih(p.jurusan), detailDari(p.detail))));
    document.getElementById('pendidikan').hidden = d.pendidikan.length === 0;
  }
  const wadahPeng = document.getElementById('isiPengalaman');
  if (wadahPeng && Array.isArray(d.pengalaman)) {
    wadahPeng.replaceChildren(...d.pengalaman.map((p) => buatEntri(pilih(p.waktu), pilih(p.peran), detailDari(p.detail))));
    document.getElementById('pengalaman').hidden = d.pengalaman.length === 0;
  }

  // Kontak cepat
  const k = d.kontak || {};
  const wadahKontak = document.getElementById('kontak');
  if (wadahKontak) {
    const baris = [];
    const tambah = (href, ikonNama, teks, salin, labelSalin, luar) => {
      const li = buat('li');
      const a = buat('a');
      a.href = href;
      if (luar) { a.target = '_blank'; a.rel = 'noopener'; }
      const bulat = buat('span', 'contact-ic');
      bulat.append(ikon(ikonNama));
      a.append(bulat, document.createTextNode(teks));
      li.append(a);
      if (salin) {
        const tb = buat('button', 'copy-btn');
        tb.type = 'button';
        tb.dataset.copy = salin;
        tb.title = t('salin');
        tb.setAttribute('aria-label', labelSalin);
        tb.append(ikon('copy'));
        li.append(tb);
      }
      baris.push(li);
    };
    const angka = (s) => String(s || '').replace(/[^\d+]/g, '');
    // Ambil username dari username biasa, "@username", atau link lengkap (tanpa ?query / #hash)
    const namaPengguna = (s) => String(s || '').trim()
      .replace(/[?#].*$/, '')
      .replace(/^@/, '')
      .replace(/^(https?:\/\/)?(www\.)?[a-z.]+\.(com|id)\//i, '')
      .replace(/\/+$/, '');

    if (k.telepon) tambah(`tel:${angka(k.telepon)}`, 'phone', k.telepon, angka(k.telepon), t('salinTelepon'));
    if (k.email) tambah(`mailto:${k.email}`, 'mail', k.email, k.email, t('salinEmail'));
    if (k.whatsapp) tambah(`https://wa.me/${String(k.whatsapp).replace(/\D/g, '')}`, 'chat', 'WhatsApp', null, '', true);
    if (k.linkedin) {
      const u = namaPengguna(k.linkedin).replace(/^in\//i, '');
      tambah(`https://www.linkedin.com/in/${u}/`, 'linkedin', `in/${u}`, null, '', true);
    }
    if (k.github) {
      const u = namaPengguna(k.github);
      tambah(`https://github.com/${u}`, 'github', `github.com/${u}`, null, '', true);
    }
    if (k.instagram) {
      const u = namaPengguna(k.instagram);
      tambah(`https://instagram.com/${u}`, 'instagram', `@${u}`, null, '', true);
    }
    wadahKontak.replaceChildren(...baris);
    wadahKontak.hidden = baris.length === 0;
  }

  // Data diri
  const dl = document.getElementById('isiDataDiri');
  if (dl) {
    const dd = d.dataDiri || {};
    const label = t('dd');
    // IPK: koma untuk Indonesia (3,40), titik untuk Inggris (3.40)
    let ipk = pilih(dd.ipk);
    if (ipk && typeof dd.ipk === 'string') ipk = bahasa === 'en' ? ipk.replace(',', '.') : ipk.replace('.', ',');
    const pasangan = [
      [label.nama, d.nama],
      [label.ttl, pilih(dd.tempatTanggalLahir)],
      [label.jk, pilih(dd.jenisKelamin)],
      [label.hobi, pilih(dd.hobi)],
      [label.alamat, pilih(dd.alamat)],
      [label.pendidikan, pilih(dd.pendidikanTerakhir)],
      [label.ipk, ipk],
      [label.email, k.email]
    ].filter(([, nilai]) => nilai && String(nilai).trim());
    dl.replaceChildren(...pasangan.map(([lbl, nilai]) => {
      const div = buat('div');
      div.append(buat('dt', '', lbl), buat('dd', '', nilai));
      return div;
    }));
  }
}

/* ---------- Halaman Karya ---------- */
/*
 * Data diambil dari bagian "karya" di js/data.js.
 * Karya bertanda "contoh": true hanya tampil saat dibuka di laptop sendiri
 * (localhost), jadi pengunjung tidak melihat karya contoh.
 */
const KATEGORI_KARYA = ['logo', 'grafis', 'uiux', 'web', 'video', 'lainnya'];
const IKON_KATEGORI = { logo: 'pen', grafis: 'image', uiux: 'layout', web: 'code', video: 'play', lainnya: 'star' };
const DI_LAPTOP = ['localhost', '127.0.0.1', '::1', ''].includes(location.hostname);

let filterKarya = 'semua';
let daftarTampil = [];      // karya yang sedang terlihat (setelah filter)
let indeksDetail = -1;      // karya yang sedang dibuka di pop-up

function semuaKarya() {
  return (Array.isArray(DATA.karya) ? DATA.karya : [])
    .filter((k) => k && pilih(k.judul))
    .filter((k) => !k.contoh || DI_LAPTOP)
    .map((k) => ({ ...k, kategori: KATEGORI_KARYA.includes(k.kategori) ? k.kategori : 'lainnya' }));
}

/** Gambar karya, atau sampul berwarna berisi ikon kategori jika belum ada gambar. */
function mediaKarya(k, kelas) {
  const wadah = buat('div', `${kelas} warna-${k.kategori}`);
  const sampul = buat('div', 'karya-sampul');
  sampul.append(ikon(IKON_KATEGORI[k.kategori], 'ic karya-sampul-ikon'));
  wadah.append(sampul);
  if (k.gambar) {
    const img = new Image();
    img.alt = pilih(k.judul);
    img.loading = 'lazy';
    img.decoding = 'async';
    img.onload = () => { sampul.hidden = true; };
    img.onerror = () => img.remove();          // file belum ada → tetap pakai sampul
    img.src = k.gambar;
    wadah.append(img);
  }
  return wadah;
}

function renderFilterKarya(list) {
  const wadah = document.getElementById('filterKarya');
  if (!wadah) return;
  const jumlah = {};
  list.forEach((k) => { jumlah[k.kategori] = (jumlah[k.kategori] || 0) + 1; });
  const pilihan = ['semua', ...KATEGORI_KARYA.filter((c) => jumlah[c])];
  if (!pilihan.includes(filterKarya)) filterKarya = 'semua';

  wadah.replaceChildren(...pilihan.map((c) => {
    const b = buat('button', 'chip-filter');
    b.type = 'button';
    b.dataset.kategori = c;
    b.setAttribute('aria-pressed', String(c === filterKarya));
    b.append(buat('span', '', c === 'semua' ? t('semua') : t('kategori')[c]));
    b.append(buat('span', 'chip-jumlah', String(c === 'semua' ? list.length : jumlah[c])));
    return b;
  }));
  wadah.setAttribute('aria-label', t('filterLabel'));
  wadah.hidden = list.length === 0;
}

function renderKarya() {
  const grid = document.getElementById('isiKarya');
  if (!grid) return;
  const list = semuaKarya();
  renderFilterKarya(list);

  daftarTampil = list.filter((k) => filterKarya === 'semua' || k.kategori === filterKarya);
  grid.replaceChildren(...daftarTampil.map((k, i) => {
    const kartu = buat('button', 'karya-card');
    kartu.type = 'button';
    kartu.dataset.indeks = String(i);
    kartu.setAttribute('aria-label', `${pilih(k.judul)} — ${t('lihatDetail')}`);
    kartu.style.setProperty('--d', String(i % 6));

    const info = buat('div', 'karya-info');
    const meta = buat('span', 'karya-meta', [t('kategori')[k.kategori], k.tahun].filter(Boolean).join(' · '));
    info.append(meta, buat('span', 'karya-judul', pilih(k.judul)));
    if (k.contoh) kartu.append(buat('span', 'badge-contoh', t('contoh')));
    kartu.append(mediaKarya(k, 'karya-media'), info);
    return kartu;
  }));

  const kosong = document.getElementById('karyaKosong');
  if (kosong) kosong.hidden = list.length > 0;
}

function bukaDetailKarya(i) {
  const dialog = document.getElementById('dialogKarya');
  const k = daftarTampil[i];
  if (!dialog || !k) return;
  indeksDetail = i;

  document.getElementById('detailMedia').replaceChildren(mediaKarya(k, 'detail-media-isi'));
  document.getElementById('detailMeta').textContent = [t('kategori')[k.kategori], k.tahun].filter(Boolean).join(' · ');
  document.getElementById('detailJudul').textContent = pilih(k.judul);
  const desk = document.getElementById('detailDeskripsi');
  desk.textContent = pilih(k.deskripsi);
  desk.hidden = !pilih(k.deskripsi);

  const alat = document.getElementById('detailAlat');
  alat.replaceChildren();
  if (k.alat) {
    alat.append(buat('span', 'detail-label', `${t('alat')}:`));
    String(k.alat).split(',').map((x) => x.trim()).filter(Boolean)
      .forEach((a) => alat.append(buat('span', 'chip-alat', a)));
  }
  alat.hidden = !k.alat;

  const link = document.getElementById('detailLink');
  link.hidden = !k.link;
  if (k.link) link.href = k.link;

  const banyak = daftarTampil.length > 1;
  document.getElementById('detailPrev').hidden = !banyak;
  document.getElementById('detailNext').hidden = !banyak;

  if (!dialog.open) {
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  }
}

function initKarya() {
  const grid = document.getElementById('isiKarya');
  if (!grid) return;
  const dialog = document.getElementById('dialogKarya');
  const tutup = () => { if (dialog.open && typeof dialog.close === 'function') dialog.close(); else dialog.removeAttribute('open'); };
  const geser = (arah) => bukaDetailKarya((indeksDetail + arah + daftarTampil.length) % daftarTampil.length);

  renderKarya();

  document.getElementById('filterKarya').addEventListener('click', (e) => {
    const b = e.target.closest('.chip-filter');
    if (!b) return;
    filterKarya = b.dataset.kategori;
    renderKarya();
  });

  grid.addEventListener('click', (e) => {
    const kartu = e.target.closest('.karya-card');
    if (kartu) bukaDetailKarya(Number(kartu.dataset.indeks));
  });

  document.getElementById('detailTutup').addEventListener('click', tutup);
  document.getElementById('detailPrev').addEventListener('click', () => geser(-1));
  document.getElementById('detailNext').addEventListener('click', () => geser(1));
  dialog.addEventListener('click', (e) => { if (e.target === dialog) tutup(); });
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' && daftarTampil.length > 1) geser(1);
    if (e.key === 'ArrowLeft' && daftarTampil.length > 1) geser(-1);
  });

  // Ganti bahasa: tulis ulang kartu & isi pop-up yang sedang terbuka
  document.addEventListener('gantibahasa', () => {
    renderKarya();
    if (dialog.open && indeksDetail >= 0) bukaDetailKarya(indeksDetail);
  });
}

/* ---------- Jalankan semua ---------- */
document.addEventListener('DOMContentLoaded', () => {
  terapkanTeksAntarmuka();
  renderData();
  initBahasa();
  initTema();
  initNavigasi();
  initInisial();
  initReveal();
  initStiker();
  initSkills();
  initTilt();
  initSalin();
  initFoto();
  initKarya();

  const tahun = document.getElementById('tahun');
  if (tahun) tahun.textContent = new Date().getFullYear();
});
