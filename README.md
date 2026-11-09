# Lab Petualang — Bahan Ajar IPA

Dasbor bahan ajar IPA Kelas 7 & 8 SMPN 4 Magelang (guru: Nella Alfiani Rofiqoh, S.Pd).

- **Cek Perasaan**: pembuka pelajaran dengan 5 emoticon 3D (Semangat, Senang, Bosan, Mengantuk, Sedih). Siswa maju 5 orang per kelompok, lalu hasil kelas tampil sebagai grafik 3D, indeks perasaan, dan rekomendasi (`lab/mood.html`).
- **Slide Materi**: slide interaktif untuk 13 bab (`slide/slide.html?t=<materi>`), dengan judul bab & sub bab sesuai Buku Siswa IPA Kurikulum Merdeka dan CP IPA Fase D (Kep. BSKAP 046/H/KR/2025). Navigasi lewat **Menu Materi** (sub bab A, B, C, … → halaman), tanpa mode otomatis/manual. Kartu alat lab, simbol bahaya GHS, dan istilah bisa diketuk untuk melihat gambar, pengertian, cara pakai, dan contoh penerapan.
- **Lab 3D & Kuis**: simulasi 3D (beberapa mode, ruang lab realistis) dan kuis untuk setiap bab. Dari slide, tombol **Lab 3D** membuka simulasi dan **⬅ Materi / Kembali ke materi** kembali ke halaman slide tadi.
  - Kelas 7: Bab 1 Hakikat Ilmu Sains dan Metode Ilmiah (termasuk Pengukuran) · Bab 2 Zat dan Perubahannya · Bab 3 Suhu, Kalor dan Pemuaian · Bab 4 Gerak dan Gaya · Bab 5 Klasifikasi Makhluk Hidup (5 kingdom) · Bab 6 Ekologi dan Keanekaragaman Hayati Indonesia · Bab 7 Bumi dan Tata Surya.
  - Kelas 8: Bab 1 Pengenalan Sel · Bab 2 Struktur dan Fungsi Tubuh Makhluk Hidup · Bab 3 Usaha, Energi dan Pesawat Sederhana · Bab 4 Getaran, Gelombang dan Cahaya · Bab 5 Unsur, Senyawa dan Campuran · Bab 6 Struktur Bumi dan Perkembangannya.
  - Narasi Bu Nella punya tombol 🔊/🔇 (narasi suara nyala/mati, tersimpan) dan 💬/🙈 (tampilkan/sembunyikan teks). Di HP, panel materi bisa dikecilkan dan daftar mode bisa digeser.
- **Permainan & Kuis**: 8 mode HP siswa + 6 Mode Kelas tanpa HP; materi dipilih per kelas.
- **Studio Suara**: rekaman narasi Bu Nella untuk semua lab (tersimpan di `voice/<lab>/`).
- Tema terang/gelap, riwayat kelas & perasaan, sinkron GitHub.

Struktur:
- `index.html`: dasbor.
- `assets/materi.js`: daftar materi, subtopik, dan bank soal Kelas 7 & 8.
- `lab/lab.html?t=<materi>`: mesin lab 3D bersama (`engine.js` + `topics.js`).
- `lab/topics_plus.js`: mode tambahan (massa jenis, neraca Ohaus, katrol, bidang miring, pemisahan campuran, bunyi & medium, cahaya & lensa, sistem ekskresi, gempa, gunung api).
- `slide/`: mesin slide (`slide.js`, `anims.js`, `anims2.js`, `anims3.js`), gambar alat & simbol GHS (`ill.js`), dan isi per bab (`slide/data/<materi>.js`; field `sb` = sub bab).
- `lab/newton.html`, `lab/tata-surya.html`: lab khusus.

Buka: https://azizrizky.github.io/course/

Cadangan: setiap pembaruan disimpan sebagai cabang `backup/YYYY-MM-DD-…` di GitHub. Untuk mengunduh versi lama: pilih cabangnya di menu **Branches**, lalu **Code → Download ZIP**.

Kredit tekstur Bumi & Bulan: NASA (Blue Marble, Black Marble, LRO) — domain publik.
