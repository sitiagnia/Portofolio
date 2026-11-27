# Folder `asset` — tempat foto, gambar, dan video portofolio

Taruh semua file gambar/video di sini lewat VS Code (seret file ke folder yang sesuai di panel Explorer).

```
asset/
├── foto/    ← foto profil & foto pribadi
├── karya/   ← gambar hasil karya (logo, poster, desain UI, website, dll.)
└── video/   ← video (jika nanti dibutuhkan)
```

## 1. Foto profil → `asset/foto/`

- Beri nama **`profil.jpg`** → otomatis tampil di bingkai foto halaman utama.
- Foto potret (tegak), wajah jelas, latar rapi. Ukuran ideal ±800 × 1000 px.
- Ingin nama file lain? Ubah bagian `"foto"` di `js/data.js`, mis. `"foto": "asset/foto/agni-2026.jpg"`.

## 2. Gambar karya → `asset/karya/`

- Satu file per karya, mis. `logo-himatikom.png`, `poster-dies-natalis.jpg`.
- Tulis lokasinya di bagian `"karya"` pada `js/data.js` (atau lewat form `isi-data.html`):
  ```js
  "gambar": "asset/karya/logo-himatikom.png",
  ```
- Lebar ideal ±1200 px. Jika gambar dikosongkan, kartu memakai sampul berwarna.

## 3. Video → `asset/video/`

Disiapkan untuk nanti. Video besar (> 50 MB) sebaiknya diunggah ke YouTube/Google Drive,
lalu link-nya ditaruh di kolom `"link"` karya.

## Aturan nama file

- Huruf kecil semua, tanpa spasi — pakai tanda hubung: `poster-acara-2025.jpg` ✅, `Poster Acara 2025.JPG` ❌
- Format: **JPG** (foto), **PNG** (logo/gambar transparan), **WEBP** (lebih ringan)
- Usahakan tiap file < 1 MB supaya halaman cepat dibuka (bisa dikecilkan di squoosh.app atau tinypng.com)

Setelah menambah file: cek di `http://localhost/portofolioQ/`, lalu commit & push ke GitHub.
