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
   - Salin nomor / email, form kirim pesan via WhatsApp / email
   ========================================================= */
'use strict';

/* ---------- Pengaturan ---------- */
const KUNCI_TEMA = 'portofolio_tema';
const DATA = window.DATA_PORTOFOLIO || {};               // isi dari js/data.js
const SAPAAN = (Array.isArray(DATA.sapaan) && DATA.sapaan.length) ? DATA.sapaan : ['Hello!'];

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
    const label = gelap ? 'Ganti ke tema terang' : 'Ganti ke tema gelap';
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
  terapkan();
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
  document.addEventListener('click', (e) => { if (!nav.contains(e.target)) tutupMenu(); });
  // Menu otomatis tertutup jika layar diperlebar (mis. tablet diputar)
  window.matchMedia('(min-width: 761px)').addEventListener('change', (e) => { if (e.matches) tutupMenu(); });

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
  tautan
    .map((link) => document.querySelector(link.getAttribute('href')))
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
function initSkills() {
  const ubin = Array.from(document.querySelectorAll('.skill'));
  const nama = document.getElementById('skillName');
  const persen = document.getElementById('skillPct');
  const bar = document.getElementById('skillBar');
  const ket = document.getElementById('skillDesc');
  if (!ubin.length || !nama || !bar) return;

  const pilih = (el) => {
    ubin.forEach((u) => {
      const aktif = u === el;
      u.classList.toggle('active', aktif);
      u.setAttribute('aria-pressed', String(aktif));
    });
    const level = Math.max(0, Math.min(100, Number(el.dataset.level) || 0));
    nama.textContent = el.dataset.name || el.textContent.trim();
    persen.textContent = `${level}%`;
    ket.textContent = el.dataset.desc || '';
    bar.style.width = `${level}%`;
  };

  ubin.forEach((u) => u.addEventListener('click', () => pilih(u)));

  // Tombol panah kiri/kanan untuk berpindah antar ubin
  ubin.forEach((u, i) => u.addEventListener('keydown', (e) => {
    const arah = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!arah) return;
    e.preventDefault();
    const tujuan = ubin[(i + arah + ubin.length) % ubin.length];
    tujuan.focus();
    pilih(tujuan);
  }));

  // Pilih ubin pertama; bar baru terisi saat bagian skills terlihat
  ubin.forEach((u) => u.setAttribute('aria-pressed', 'false'));
  const skills = document.getElementById('skills');
  if ('IntersectionObserver' in window && skills && !kurangiGerak) {
    const obs = new IntersectionObserver((entri) => {
      if (entri[0].isIntersecting) { pilih(ubin[0]); obs.disconnect(); }
    }, { threshold: 0.3 });
    obs.observe(skills);
  } else {
    pilih(ubin[0]);
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
  document.querySelectorAll('[data-copy]').forEach((tombol) => {
    tombol.addEventListener('click', async () => {
      const ok = await salinTeks(tombol.dataset.copy);
      if (!ok) { tampilkanToast('Gagal menyalin', 'error'); return; }
      tampilkanToast(`Disalin: ${tombol.dataset.copy}`);
      const ikon = tombol.querySelector('use');
      tombol.classList.add('copied');
      if (ikon) ikon.setAttribute('href', '#i-check');
      setTimeout(() => {
        tombol.classList.remove('copied');
        if (ikon) ikon.setAttribute('href', '#i-copy');
      }, 1600);
    });
  });
}

/* ---------- Form kirim pesan (WhatsApp / email) ---------- */
function initPesan() {
  const form = document.getElementById('formPesan');
  if (!form) return;
  const nama = document.getElementById('pesanNama');
  const isi = document.getElementById('pesanIsi');
  const hitung = document.getElementById('charCount');
  const pesan = document.getElementById('pesanMsg');
  const batas = Number(isi.getAttribute('maxlength')) || 500;

  const tulis = (teks, tipe = '') => {
    pesan.textContent = teks;
    pesan.className = tipe ? `form-msg is-${tipe}` : 'form-msg';
  };

  isi.addEventListener('input', () => { hitung.textContent = `${isi.value.length}/${batas}`; });
  [nama, isi].forEach((el) => el.addEventListener('input', () => el.parentElement.classList.remove('invalid')));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const via = (e.submitter && e.submitter.dataset.via) || 'wa';
    const n = nama.value.trim();
    const p = isi.value.trim();

    nama.parentElement.classList.toggle('invalid', !n);
    isi.parentElement.classList.toggle('invalid', p.length < 5);
    if (!n) { tulis('Nama belum diisi.', 'error'); nama.focus(); return; }
    if (p.length < 5) { tulis('Pesan terlalu pendek (minimal 5 karakter).', 'error'); isi.focus(); return; }

    if (via === 'email' && !form.dataset.email) { tulis('Email tujuan belum diatur.', 'error'); return; }
    if (via !== 'email' && !form.dataset.wa) { tulis('Nomor WhatsApp tujuan belum diatur.', 'error'); return; }

    const teks = `Halo, saya ${n}.\n\n${p}`;
    let url;
    if (via === 'email') {
      const subjek = encodeURIComponent(`Pesan dari ${n} (portofolio)`);
      url = `mailto:${form.dataset.email}?subject=${subjek}&body=${encodeURIComponent(teks)}`;
      window.location.href = url;
    } else {
      url = `https://wa.me/${form.dataset.wa}?text=${encodeURIComponent(teks)}`;
      window.open(url, '_blank', 'noopener');
    }
    tulis(via === 'email' ? 'Membuka aplikasi email…' : 'Membuka WhatsApp…', 'success');
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

  // Nama & teks perkenalan
  isiTeks('namaUtama', d.nama);
  document.querySelectorAll('[data-nama]').forEach((el) => { el.textContent = d.nama; });
  document.title = `${d.nama} | Portofolio`;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute('content', `Portofolio pribadi ${d.nama} — profil, keahlian, pengalaman, dan kontak.`);
  isiTeks('isiBio', d.bio);
  isiTeks('isiPenutup', d.penutup);
  if (SAPAAN[0]) isiTeks('judulHello', SAPAAN[0]);

  // Foto
  const bingkai = document.querySelector('[data-avatar]');
  if (bingkai) {
    if (d.foto) bingkai.dataset.default = d.foto;
    bingkai.dataset.alt = `Foto ${d.nama}`;
  }

  // Skills
  const wadahSkill = document.getElementById('isiSkills');
  if (wadahSkill && Array.isArray(d.skills)) {
    wadahSkill.replaceChildren(...d.skills.filter((s) => s && (s.label || s.nama)).map((s) => {
      const b = buat('button', 'skill', s.label || s.nama);
      b.type = 'button';
      b.dataset.name = s.nama || s.label;
      b.dataset.level = String(s.level ?? 0);
      b.dataset.desc = s.keterangan || '';
      b.title = s.nama || s.label;
      return b;
    }));
    const blokSkill = document.getElementById('skills');
    if (blokSkill) blokSkill.hidden = wadahSkill.children.length === 0;
  }

  // Pendidikan & pengalaman
  const wadahPend = document.getElementById('isiPendidikan');
  if (wadahPend && Array.isArray(d.pendidikan)) {
    wadahPend.replaceChildren(...d.pendidikan.map((p) =>
      buatEntri([p.waktu, p.tempat].filter(Boolean).join(': '), p.jurusan, p.detail)));
    document.getElementById('pendidikan').hidden = d.pendidikan.length === 0;
  }
  const wadahPeng = document.getElementById('isiPengalaman');
  if (wadahPeng && Array.isArray(d.pengalaman)) {
    wadahPeng.replaceChildren(...d.pengalaman.map((p) => buatEntri(p.waktu, p.peran, p.detail)));
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
        const t = buat('button', 'copy-btn');
        t.type = 'button';
        t.dataset.copy = salin;
        t.title = 'Salin';
        t.setAttribute('aria-label', labelSalin);
        t.append(ikon('copy'));
        li.append(t);
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

    if (k.telepon) tambah(`tel:${angka(k.telepon)}`, 'phone', k.telepon, angka(k.telepon), 'Salin nomor telepon');
    if (k.email) tambah(`mailto:${k.email}`, 'mail', k.email, k.email, 'Salin alamat email');
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

  // Tujuan form pesan
  const formPesan = document.getElementById('formPesan');
  if (formPesan) {
    formPesan.dataset.wa = String(k.whatsapp || '').replace(/\D/g, '');
    formPesan.dataset.email = k.email || '';
    // Sembunyikan tombol kirim yang tujuannya belum diatur
    const btnWa = formPesan.querySelector('[data-via="wa"]');
    const btnEmail = formPesan.querySelector('[data-via="email"]');
    if (btnWa) btnWa.hidden = !formPesan.dataset.wa;
    if (btnEmail) btnEmail.hidden = !formPesan.dataset.email;
    const intro = document.getElementById('introPesan');
    if (intro) {
      const jalur = [formPesan.dataset.wa && 'WhatsApp', formPesan.dataset.email && 'email'].filter(Boolean).join(' atau ');
      intro.textContent = `Ada pertanyaan atau tawaran kerja sama? Tulis pesanmu, lalu kirim lewat ${jalur || 'kontak di atas'}.`;
    }
    document.getElementById('pesan').hidden = !formPesan.dataset.wa && !formPesan.dataset.email;
  }

  // Data diri
  const dl = document.getElementById('isiDataDiri');
  if (dl) {
    const dd = d.dataDiri || {};
    const pasangan = [
      ['Nama Lengkap', d.nama],
      ['Tempat, Tanggal Lahir', dd.tempatTanggalLahir],
      ['Jenis Kelamin', dd.jenisKelamin],
      ['Hobi', dd.hobi],
      ['Alamat', dd.alamat],
      ['Pendidikan', dd.pendidikanTerakhir],
      ['IPK', dd.ipk],
      ['Email', k.email]
    ].filter(([, nilai]) => nilai && String(nilai).trim());
    dl.replaceChildren(...pasangan.map(([label, nilai]) => {
      const div = buat('div');
      div.append(buat('dt', '', label), buat('dd', '', nilai));
      return div;
    }));
  }
}

/* ---------- Jalankan semua ---------- */
document.addEventListener('DOMContentLoaded', () => {
  renderData();
  initTema();
  initNavigasi();
  initInisial();
  initReveal();
  initStiker();
  initSkills();
  initTilt();
  initSalin();
  initPesan();
  initFoto();

  const tahun = document.getElementById('tahun');
  if (tahun) tahun.textContent = new Date().getFullYear();
});
