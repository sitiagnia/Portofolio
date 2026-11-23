/* =========================================================
   DATA PORTOFOLIO
   Semua isi halaman diambil dari file ini.
   Cara mengubah:
   1. Buka http://localhost/portofolioQ/isi-data.html
   2. Isi form, klik "Unduh data.js"
   3. Ganti file ini dengan file hasil unduhan (lewat VS Code)
   Atau edit langsung teks di bawah ini di VS Code.

   Dua bahasa: teks yang berbeda antara Indonesia & Inggris ditulis
   sebagai { "id": "teks Indonesia", "en": "English text" }.
   Teks yang sama untuk kedua bahasa cukup ditulis biasa: "teks".
   Kolom yang dikosongkan ("") tidak ditampilkan di halaman.
   ========================================================= */
window.DATA_PORTOFOLIO = {
  "nama": "Siti Agniatul Rohmah",
  "panggilan": "AGNI",
  "sapaan": ["Hello!", "Halo!", "Hai!", "Hola!", "Annyeong!"],
  "bio": {
    "id": "Saya lulusan D3 Sistem Informasi dari Politeknik Negeri Subang. Saat ini saya magang sebagai Staff IT di Dahana, dan sebelumnya menjalani PKL sebagai Staff IT di Telkom Subang Centrum. Saya juga berpengalaman berorganisasi di HIMATIKOM hingga menjadi Kepala Biro Kominfo.",
    "en": "I am an Information Systems graduate (Associate Degree, D3) from Politeknik Negeri Subang. I am currently an IT Staff intern at Dahana, and previously completed my field internship as IT Staff at Telkom Subang Centrum. I also have organizational experience in HIMATIKOM, where I became Head of the Communication & Information Bureau."
  },
  "penutup": {
    "id": "Semoga kamu suka portofolio saya!",
    "en": "Hope you enjoy my portfolio!"
  },
  "foto": "asset/foto.jpg",
  "skills": [
    { "label": "HTML", "nama": "HTML", "level": 90, "keterangan": { "id": "Menyusun struktur halaman yang rapi, semantik, dan mudah diakses.", "en": "Building clean, semantic, and accessible page structures." } },
    { "label": "CSS", "nama": "CSS", "level": 85, "keterangan": { "id": "Membuat tampilan responsif dengan Flexbox, Grid, dan animasi.", "en": "Creating responsive layouts with Flexbox, Grid, and animations." } },
    { "label": "JS", "nama": "JavaScript", "level": 75, "keterangan": { "id": "Menambahkan interaksi: form, validasi, dan manipulasi DOM.", "en": "Adding interactivity: forms, validation, and DOM manipulation." } },
    { "label": "PHP", "nama": "PHP", "level": 70, "keterangan": { "id": "Membangun halaman dinamis dan memproses data form di server.", "en": "Building dynamic pages and processing form data on the server." } },
    { "label": "SQL", "nama": "MySQL", "level": 65, "keterangan": { "id": "Merancang tabel dan menulis query untuk menyimpan data.", "en": "Designing tables and writing queries to store data." } },
    { "label": "Figma", "nama": "Figma", "level": 80, "keterangan": { "id": "Merancang wireframe dan desain antarmuka sebelum dikoding.", "en": "Designing wireframes and user interfaces before coding." } }
  ],
  "pendidikan": [
    {
      "waktu": "September 2026",
      "tempat": "Politeknik Negeri Subang",
      "jurusan": { "id": "D3 Sistem Informasi", "en": "Associate Degree (D3) in Information Systems" },
      "detail": [{ "id": "IPK 3,40", "en": "GPA 3.40" }]
    }
  ],
  "pengalaman": [
    {
      "waktu": { "id": "Sekarang", "en": "Present" },
      "peran": { "id": "Magang — Staff IT, Dahana", "en": "Intern — IT Staff, Dahana" },
      "detail": []
    },
    {
      "waktu": { "id": "Praktik Kerja Lapangan (PKL)", "en": "Field Internship (PKL)" },
      "peran": { "id": "Staff IT, Telkom Subang Centrum", "en": "IT Staff, Telkom Subang Centrum" },
      "detail": []
    },
    {
      "waktu": "2024 – 2025",
      "peran": { "id": "Kepala Biro Kominfo, HIMATIKOM Politeknik Negeri Subang", "en": "Head of Communication & Information Bureau, HIMATIKOM Politeknik Negeri Subang" },
      "detail": [{ "id": "HIMATIKOM: Himpunan Mahasiswa Teknologi Informasi dan Komputer.", "en": "HIMATIKOM: Information Technology and Computer Student Association." }]
    },
    {
      "waktu": "2023 – 2024",
      "peran": { "id": "Anggota Biro Kominfo, HIMATIKOM Politeknik Negeri Subang", "en": "Member of Communication & Information Bureau, HIMATIKOM Politeknik Negeri Subang" },
      "detail": [{ "id": "HIMATIKOM: Himpunan Mahasiswa Teknologi Informasi dan Komputer.", "en": "HIMATIKOM: Information Technology and Computer Student Association." }]
    }
  ],
  /* Karya untuk halaman karya.html.
     - kategori: "logo", "grafis", "uiux", "web", "video", atau "lainnya"
     - gambar  : taruh file di folder asset/karya/ (kosongkan jika belum ada → tampil sampul berwarna)
     - link    : tautan ke Behance/Drive/website (opsional)
     - "contoh": true → hanya tampil di laptop sendiri (localhost). Hapus contoh setelah karya asli diisi. */
  "karya": [
    {
      "judul": { "id": "Contoh: Desain Logo", "en": "Sample: Logo Design" },
      "kategori": "logo",
      "tahun": "2025",
      "gambar": "",
      "deskripsi": { "id": "Ganti dengan cerita singkat: untuk siapa logo ini dibuat, konsepnya, dan arti warna/bentuknya.", "en": "Replace with a short story: who the logo is for, the concept, and the meaning of its colors and shapes." },
      "alat": "Adobe Illustrator",
      "link": "",
      "contoh": true
    },
    {
      "judul": { "id": "Contoh: Poster Acara", "en": "Sample: Event Poster" },
      "kategori": "grafis",
      "tahun": "2024",
      "gambar": "",
      "deskripsi": { "id": "Contoh poster publikasi acara organisasi.", "en": "A sample publication poster for an organization event." },
      "alat": "Canva, Adobe Photoshop",
      "link": "",
      "contoh": true
    },
    {
      "judul": { "id": "Contoh: Desain UI Aplikasi", "en": "Sample: App UI Design" },
      "kategori": "uiux",
      "tahun": "2025",
      "gambar": "",
      "deskripsi": { "id": "Contoh rancangan tampilan aplikasi di Figma.", "en": "A sample app interface design made in Figma." },
      "alat": "Figma",
      "link": "",
      "contoh": true
    },
    {
      "judul": { "id": "Contoh: Website Portofolio", "en": "Sample: Portfolio Website" },
      "kategori": "web",
      "tahun": "2026",
      "gambar": "",
      "deskripsi": { "id": "Contoh website yang dibuat dengan HTML, CSS, dan JavaScript.", "en": "A sample website built with HTML, CSS, and JavaScript." },
      "alat": "HTML, CSS, JavaScript",
      "link": "",
      "contoh": true
    }
  ],
  "kontak": {
    "telepon": "",
    "whatsapp": "",
    "email": "sitiagnii07@gmail.com",
    "linkedin": "siti-agniatul-rohmah-147392371",
    "github": "sitiagnia",
    "instagram": "aagniiaa"
  },
  "dataDiri": {
    "tempatTanggalLahir": "",
    "jenisKelamin": "",
    "hobi": "",
    "alamat": "",
    "pendidikanTerakhir": { "id": "D3 Sistem Informasi — Politeknik Negeri Subang", "en": "Associate Degree (D3) in Information Systems — Politeknik Negeri Subang" },
    "ipk": "3,40"
  }
};
