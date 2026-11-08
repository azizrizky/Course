# Lab Petualang — Bahan Ajar IPA

Dasbor bahan ajar IPA Kelas 7 & 8 SMPN 4 Magelang (guru: Nella Alfiani Rofiqoh, S.Pd).

- **Cek Perasaan**: pembuka pelajaran dengan 5 emoticon 3D (Semangat, Senang, Bosan, Mengantuk, Sedih). Siswa maju 5 orang per kelompok, lalu hasil kelas tampil sebagai grafik 3D, indeks perasaan, dan rekomendasi (`lab/mood.html`).
- **Slide Materi**: slide pemaparan interaktif untuk 14 materi (`slide/slide.html?t=<materi>`). Isinya ringkasan, rumus + kalkulator, animasi, contoh soal + pembahasan, kuis, dan peta konsep. Acuan: CP IPA Fase D (BSKAP 046/H/KR/2025) dan buku IPA Kurikulum Merdeka.
- **Lab 3D & Kuis**: 14 materi, masing-masing dengan simulasi 3D (beberapa mode, ruang lab realistis) dan kuis.
  - Kelas 7: Hakikat Sains, Pengukuran, Wujud Zat, Kalor, Tata Surya, Klasifikasi Makhluk Hidup, Ekosistem, Gaya & Gerak.
  - Kelas 8: Sel, Sistem Organ, Usaha & Pesawat Sederhana, Unsur–Senyawa–Campuran, Getaran & Gelombang, Struktur Bumi.
- **Permainan & Kuis**: 8 mode HP siswa + 6 Mode Kelas tanpa HP; materi dipilih per kelas.
- **Studio Suara**: rekaman narasi Bu Nella untuk semua lab (tersimpan di `voice/<lab>/`).
- Tema terang/gelap, riwayat kelas & perasaan, sinkron GitHub.

Struktur:
- `index.html`: dasbor.
- `assets/materi.js`: daftar materi, subtopik, dan bank soal Kelas 7 & 8.
- `lab/lab.html?t=<materi>`: mesin lab 3D bersama (`engine.js` + `topics.js`).
- `lab/topics_plus.js`: mode tambahan (massa jenis, neraca Ohaus, katrol, bidang miring, pemisahan campuran, bunyi & medium, gempa, gunung api).
- `slide/`: mesin slide (`slide.js`, `anims.js`, `anims2.js`) dan isi per materi (`slide/data/<materi>.js`).
- `lab/newton.html`, `lab/tata-surya.html`: lab khusus.

Buka: https://azizrizky.github.io/course/

Cadangan: setiap pembaruan diberi tag Git `backup-YYYY-MM-DD-…`. Unduh versi lama lewat tab **Tags** di GitHub (Download ZIP).

Kredit tekstur Bumi & Bulan: NASA (Blue Marble, Black Marble, LRO) — domain publik.
