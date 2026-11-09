/* Lab Petualang — LKPD per sub bab. Kegiatan 'K0'/'K1' = memakai Kegiatan A/B dari LKPD bab. */
(function(){
const L = window.LKPD_DATA, S = L._sub = {};
const K = (judul, baca, poin, alat, langkah, tabel, jawab, perhatian) => Object.assign({judul, baca, poin, alat, langkah, tabel, jawab}, perhatian ? {perhatian} : {});
const T = (judul, head, rows, isi) => Object.assign({judul, head, rows}, isi ? {isi} : {});
const sub = (judul, tujuan, masalah, pemantik, diskusi, kegiatan, sajikan, refleksi) => ({judul, tujuan, masalah, pemantik, diskusi, kegiatan, sajikan, refleksi});

/* ---------- Kelas VII Bab 1 ---------- */
S['hakikat-sains'] = {
 A:sub('Kotak Misteri: Berpikir seperti Ilmuwan', ['Membedakan sains sebagai produk, proses, dan sikap ilmiah.', 'Melakukan pengamatan dan menarik kesimpulan sementara (inferensi) dari bukti.'],
  'Guru membawa sebuah kotak tertutup dan berkata, “Di dalamnya ada sebuah benda. Kalian tidak boleh membukanya, tetapi boleh mengguncang, mendengar, dan menimbang.” Seluruh kelas penasaran menebak isinya.',
  'Bagaimana ilmuwan menemukan jawaban tentang hal yang tidak dapat dilihat langsung, seperti isi Bumi atau atom?',
  ['Apa perbedaan pengamatan (observasi) dan dugaan (inferensi)?', 'Sikap apa yang harus dimiliki seorang ilmuwan?'],
  [K('Kotak Misteri', '<b>Sains (IPA)</b> adalah cara mempelajari alam secara sistematis. Sains merupakan <b>produk</b> (fakta, konsep, teori), <b>proses</b> (metode ilmiah), dan <b>sikap</b> (jujur, teliti, terbuka, rasa ingin tahu).',
    ['<b>Observasi</b>: mengamati dengan pancaindra/alat.', '<b>Inferensi</b>: kesimpulan sementara berdasarkan bukti.', 'Ilmuwan selalu siap mengubah dugaan jika ada bukti baru.'],
    'kotak tertutup berisi benda (disiapkan guru), timbangan, alat tulis.',
    ['Amati kotak tanpa membukanya: guncang, miringkan, dengarkan, timbang.', 'Catat setiap bukti yang kamu peroleh.', 'Tuliskan dugaan isi kotak berdasarkan bukti.', 'Bandingkan dugaan dengan kelompok lain, lalu buka kotak bersama guru.'],
    T('Tabel Pengamatan', ['Cara mengamati', 'Bukti yang diperoleh', 'Dugaan (inferensi)'], 4, ['Diguncang', 'Dimiringkan', 'Ditimbang', 'Didengar']),
    ['Apakah dugaanmu tepat? Bukti mana yang paling membantu?', 'Sebutkan contoh sains sebagai produk, proses, dan sikap dari kegiatan ini!'])],
  'Presentasikan dugaan kelompokmu beserta bukti-buktinya sebelum kotak dibuka.', 'Sikap ilmiah apa yang paling kamu latih hari ini? Ceritakan alasannya!'),
 B:sub('Aman di Laboratorium IPA', ['Mengidentifikasi alat laboratorium beserta fungsinya.', 'Menjelaskan arti simbol bahaya bahan kimia dan aturan keselamatan kerja.'],
  'Saat praktik pertama di laboratorium, seorang siswa memanaskan tabung reaksi dengan mulut tabung mengarah ke temannya, siswa lain meniup api spiritus. Guru segera menghentikan praktik.',
  'Mengapa aturan dan simbol di laboratorium sangat penting? Apa akibatnya jika diabaikan?',
  ['Alat laboratorium apa saja yang pernah kamu lihat? Apa kegunaannya?', 'Pernahkah kamu melihat simbol bahaya pada kemasan produk di rumah?'],
  [K('Mengenal Alat dan Simbol Bahaya', 'Setiap alat laboratorium punya fungsi dan cara pakai khusus. Bahan kimia diberi <b>simbol bahaya (GHS)</b> berbentuk belah ketupat merah agar pengguna waspada.',
    ['Simbol api = mudah terbakar · tengkorak = beracun · tangan terkikis = korosif.', 'Matikan pembakar spiritus dengan menutup tudungnya, jangan ditiup.', 'Panaskan tabung reaksi miring, mulut tabung menjauhi orang.'],
    'alat laboratorium (tabung reaksi, gelas ukur, pipet, pembakar spiritus, dll.), label kemasan produk rumah tangga.',
    ['Amati 8 alat laboratorium di meja kelompok.', 'Tuliskan nama dan fungsi setiap alat.', 'Amati label kemasan (pembersih lantai, pemutih, spiritus, obat nyamuk) dan temukan simbol bahayanya.', 'Susun 5 aturan keselamatan kerja kelompok.'],
    T('Tabel Pengamatan', ['Nama alat / bahan', 'Fungsi / arti simbol', 'Cara aman menggunakan'], 8),
    ['Mengapa gelas ukur tidak boleh dipanaskan?', 'Tuliskan simbol bahaya yang kamu temukan pada produk di rumah dan cara menyimpannya!'], 'Jangan membuka atau mencium bahan kimia. Cukup amati labelnya.')],
  'Buat poster “Aturan Emas Laboratorium IPA” lalu presentasikan.', 'Kebiasaan apa yang akan kamu terapkan agar selalu aman saat praktik?'),
 C:sub('Merancang Percobaan yang Adil', ['Mengidentifikasi variabel bebas, terikat, dan kontrol.', 'Merancang dan melakukan percobaan sederhana.'],
  'Penjual di koperasi mengaku bola bekel merek B <b>memantul lebih tinggi</b> daripada merek A. Teman-teman ingin membuktikannya, tetapi caranya berbeda-beda.',
  'Bagaimana merancang percobaan yang adil agar hasilnya dapat dipercaya?', ['Apa yang dimaksud hipotesis?', 'Hal apa saja yang harus dibuat sama saat menguji dua bola?'], ['K1'],
  'Presentasikan rancangan, data, dan kesimpulan percobaan.', 'Mengapa percobaan perlu diulang beberapa kali?'),
 D:sub('Mengukur dengan Teliti', ['Menggunakan alat ukur panjang dengan benar.', 'Membandingkan ketelitian mistar dan jangka sorong.'],
  'Penjual kelereng mengaku kelereng merek A <b>lebih besar</b>. Saat diukur dengan mistar, hasilnya hampir sama.',
  'Alat ukur apa yang tepat untuk mengukur benda kecil dengan teliti?', ['Apa itu besaran pokok dan satuan baku?', 'Mengapa hasil pengukuran bisa berbeda-beda?'], ['K0'],
  'Presentasikan hasil pengukuran dan alat mana yang paling teliti.', 'Kapan kamu memerlukan pengukuran yang teliti dalam kehidupan sehari-hari?'),
 E:sub('Menyusun Laporan Percobaan', ['Menyajikan data dalam tabel dan grafik.', 'Menyusun laporan percobaan yang lengkap.'],
  'Kelompok Rina sudah melakukan percobaan pertumbuhan kacang hijau, tetapi datanya hanya ditulis acak di buku. Saat diminta presentasi, mereka bingung menjelaskannya.',
  'Bagaimana cara menyajikan data agar mudah dipahami orang lain?', ['Apa saja bagian laporan percobaan?', 'Kapan sebaiknya memakai grafik garis atau diagram batang?'],
  [K('Dari Data Menjadi Laporan', '<b>Laporan percobaan</b> memuat judul, tujuan, rumusan masalah, hipotesis, alat dan bahan, langkah kerja, data, pembahasan, dan kesimpulan.',
    ['Data perubahan terhadap waktu → <b>grafik garis</b>.', 'Data perbandingan kelompok → <b>diagram batang</b>.', 'Kesimpulan menjawab rumusan masalah.'],
    'data percobaan (di bawah), kertas berpetak, penggaris, pensil warna.',
    ['Pelajari data tinggi kacang hijau: hari ke-1: 0 cm; ke-3: 1,5 cm; ke-5: 4 cm; ke-7: 7,5 cm (tempat terang) dan 0; 2; 6; 11 cm (tempat gelap).', 'Susun data ke dalam tabel.', 'Buat grafik garis kedua perlakuan pada satu kertas.', 'Tulis pembahasan dan kesimpulan.'],
    T('Tabel Data', ['Hari ke-', 'Tinggi di tempat terang (cm)', 'Tinggi di tempat gelap (cm)'], 4, ['1', '3', '5', '7']),
    ['Mengapa kacang hijau di tempat gelap tumbuh lebih tinggi tetapi pucat?', 'Tuliskan kesimpulan percobaan tersebut!'])],
  'Presentasikan laporan lengkap kelompokmu.', 'Bagian laporan mana yang paling sulit kamu tulis? Bagaimana cara memperbaikinya?')};

/* ---------- Kelas VII Bab 2 ---------- */
S['wujud-zat'] = {
 A:sub('Partikel yang Selalu Bergerak', ['Menjelaskan wujud zat dengan model partikel.', 'Menyelidiki pengaruh suhu terhadap gerak partikel melalui difusi.'],
  'Saat membuat teh, Adi melihat warna teh lebih cepat menyebar di air panas daripada di air dingin. Ia juga mencium wangi parfum temannya dari kejauhan.',
  'Mengapa warna teh dan bau parfum dapat menyebar sendiri?', ['Apa saja wujud zat dan cirinya?', 'Apakah partikel zat diam atau bergerak?'],
  [K('Difusi di Air Panas dan Dingin', 'Zat tersusun atas <b>partikel</b> yang selalu bergerak. Penyebaran partikel dari konsentrasi tinggi ke rendah disebut <b>difusi</b>. Makin tinggi suhu, partikel bergerak makin cepat.',
    ['Padat: partikel rapat, bergetar di tempat.', 'Cair: agak renggang, dapat berpindah.', 'Gas: sangat renggang, bergerak bebas.'],
    '2 gelas bening, air panas (± 60 °C), air dingin, kantong teh / pewarna makanan, stopwatch.',
    ['Isi gelas A dengan air panas dan gelas B dengan air dingin.', 'Masukkan kantong teh/1 tetes pewarna bersamaan.', 'Amati penyebaran warna setiap 1 menit.', 'Catat waktu sampai warna merata.'],
    T('Tabel Pengamatan', ['Waktu (menit)', 'Gelas air panas', 'Gelas air dingin'], 5, ['1', '2', '3', '4', '5']),
    ['Di gelas mana warna menyebar lebih cepat? Jelaskan dengan model partikel!', 'Gambarkan susunan partikel zat padat, cair, dan gas!'], 'Hati-hati dengan air panas.')],
  'Presentasikan hasil pengamatan dan gambar model partikel.', 'Contoh difusi apa lagi yang kamu temui sehari-hari?'),
 B:sub('Es yang Menghilang', ['Mengamati perubahan wujud.', 'Menjelaskan peran kalor dalam perubahan wujud.'], 'Es batu di gelas Ibu “menghilang” dan dinding luar gelas menjadi basah.', 'Ke mana es itu pergi, dan dari mana air di luar gelas?', ['Sebutkan 6 macam perubahan wujud zat!', 'Perubahan wujud mana yang menyerap kalor?'], ['K0'],
  'Presentasikan grafik suhu dan penjelasan pengembunan.', 'Di mana kamu melihat peristiwa mengembun dan menguap di rumah?'),
 C:sub('Fisika atau Kimia?', ['Membedakan perubahan fisika dan perubahan kimia.', 'Mengidentifikasi ciri-ciri reaksi kimia.'],
  'Ibu merobek kertas bekas untuk dibuang, sedangkan Ayah membakar sampah daun. Kakak memasak nasi, adik melarutkan gula di teh.',
  'Peristiwa mana yang menghasilkan zat baru?', ['Apa ciri perubahan kimia?', 'Apakah gula yang larut termasuk perubahan kimia?'],
  [K('Mengamati Perubahan Zat', '<b>Perubahan fisika</b> tidak menghasilkan zat baru (wujud/bentuk berubah). <b>Perubahan kimia</b> menghasilkan zat baru dengan ciri: perubahan warna, timbul gas, endapan, perubahan suhu, atau bau.',
    ['Contoh fisika: es mencair, kertas digunting, gula larut.', 'Contoh kimia: kertas terbakar, besi berkarat, buah membusuk.', 'Reaksi cuka + soda kue menghasilkan gas CO₂.'],
    'kertas, gunting, gelas, cuka, soda kue, balon, gula, air, potongan apel.',
    ['Gunting kertas kecil-kecil, amati.', 'Larutkan 1 sendok gula ke dalam air, amati.', 'Masukkan 1 sendok soda kue ke balon, pasang pada botol berisi cuka, tuangkan.', 'Biarkan potongan apel di udara 15 menit, amati warnanya.'],
    T('Tabel Pengamatan', ['Kegiatan', 'Yang diamati', 'Ciri reaksi kimia?', 'Fisika / kimia'], 4, ['Menggunting kertas', 'Melarutkan gula', 'Cuka + soda kue', 'Apel di udara']),
    ['Mengapa balon mengembang pada percobaan cuka + soda kue?', 'Sebutkan 3 perubahan kimia yang terjadi di dapur!'])],
  'Presentasikan tabel hasil dan pengelompokan perubahan fisika–kimia.', 'Perubahan kimia apa yang bermanfaat dan yang merugikan di sekitarmu?'),
 D:sub('Telur Terapung', ['Menghitung massa jenis.', 'Menjelaskan terapung, melayang, tenggelam.'], 'Telur tenggelam di air tawar, tetapi terapung di air garam.', 'Mengapa garam membuat telur terapung?', ['Apa yang dimaksud massa jenis?', 'Mengapa kapal besi bisa terapung?'], ['K1'],
  'Presentasikan perhitungan massa jenis dan pengamatan telur.', 'Di mana konsep massa jenis dipakai dalam kehidupan?')};

/* ---------- Kelas VII Bab 3 ---------- */
S['kalor'] = {
 A:sub('Bisakah Tangan Mengukur Suhu?', ['Menjelaskan pentingnya termometer.', 'Mengonversi skala suhu Celsius, Reamur, Fahrenheit, dan Kelvin.'],
  'Dina mencelupkan tangan kanan ke air hangat dan tangan kiri ke air dingin, lalu keduanya ke air biasa. Anehnya, tangan kanan merasa dingin dan tangan kiri merasa hangat!',
  'Apakah indra peraba dapat dipercaya untuk mengukur suhu?', ['Apa itu suhu?', 'Sebutkan jenis termometer yang kamu ketahui!'],
  [K('Tiga Baskom dan Termometer', '<b>Suhu</b> adalah derajat panas atau dingin benda, diukur dengan <b>termometer</b>. Satuan SI suhu adalah <b>kelvin (K)</b>.',
    ['C : R : (F − 32) : (K − 273) = 5 : 4 : 9 : 5.', '°F = (9/5 × °C) + 32 · K = °C + 273.', 'Termometer klinis rentang 35–42 °C.'],
    '3 baskom (air hangat ± 40 °C, air biasa, air es), termometer, kalkulator.',
    ['Celupkan tangan kanan ke air hangat, tangan kiri ke air es selama 1 menit.', 'Pindahkan kedua tangan ke air biasa, rasakan.', 'Ukur suhu ketiga baskom dengan termometer.', 'Konversikan setiap suhu ke skala R, F, dan K.'],
    T('Tabel Pengamatan', ['Baskom', 'Suhu (°C)', '°R', '°F', 'K'], 3, ['Air hangat', 'Air biasa', 'Air es']),
    ['Mengapa kedua tangan merasakan suhu yang berbeda pada air biasa?', 'Ubah suhu tubuh 37 °C ke skala Fahrenheit dan Kelvin!'])],
  'Presentasikan hasil pengukuran dan konversi suhu.', 'Kapan pengukuran suhu yang tepat sangat penting (misalnya saat sakit)?'),
 B:sub('Kalor Mengubah Suhu', ['Mengukur kenaikan suhu air.', 'Menghitung kalor dengan Q = m × c × ΔT.'], 'Ibu memanaskan air untuk membuat teh, tetapi gas cepat habis.', 'Berapa kalor yang dibutuhkan untuk memanaskan air?', ['Apa beda suhu dan kalor?', 'Sebutkan 3 cara perpindahan kalor!'], ['K0'],
  'Presentasikan grafik pemanasan dan perhitungan kalor.', 'Bagaimana cara menghemat gas saat memasak?'),
 C:sub('Mengapa Kabel Dibuat Kendur?', ['Menunjukkan pemuaian gas.', 'Menjelaskan penerapan pemuaian.'], 'Kabel listrik dipasang kendur dan rel kereta diberi celah.', 'Apa hubungannya dengan panas?', ['Apa itu pemuaian?', 'Zat mana yang paling besar pemuaiannya?'], ['K1'],
  'Presentasikan percobaan balon dan contoh penerapan pemuaian.', 'Apa yang terjadi jika jembatan tidak diberi celah sambungan?')};

/* ---------- Kelas VII Bab 4 ---------- */
S['gerak-gaya'] = {
 A:sub('Siapa Paling Cepat?', ['Membedakan jarak–perpindahan dan kelajuan–kecepatan.', 'Menghitung kelajuan rata-rata.'], 'Lomba balap mobil mainan berakhir ribut karena cara mengukurnya berbeda.', 'Bagaimana membandingkan kecepatan secara adil?', ['Apa beda jarak dan perpindahan?', 'Apa satuan kelajuan?'], ['K0'],
  'Presentasikan data dan juara sebenarnya.', 'Mengapa batas kecepatan di jalan raya penting?'),
 B:sub('Gaya Gesek yang Menguntungkan', ['Menyelidiki pengaruh permukaan terhadap gaya gesek.', 'Menjelaskan hukum Newton dalam kehidupan.'], 'Mobil mainan cepat berhenti di karpet tetapi melaju jauh di keramik.', 'Mengapa permukaan memengaruhi gerak?', ['Gaya apa yang membuat benda berhenti?', 'Sebutkan bunyi hukum I Newton!'], ['K1'],
  'Presentasikan data jarak berhenti dan contoh gaya gesek.', 'Bagaimana gaya gesek membantu keselamatan berkendara?')};

/* ---------- Kelas VII Bab 5 ---------- */
S['klasifikasi'] = {
 A:sub('Hidup atau Tidak Hidup?', ['Membedakan makhluk hidup dan benda mati.'], 'Di kebun sekolah ditemukan semut, lumut, jamur, batu berlumut, dan biji kering.', 'Bagaimana memastikan sesuatu itu makhluk hidup?', ['Sebutkan ciri makhluk hidup!', 'Apakah biji kering termasuk makhluk hidup?'], ['K0'],
  'Presentasikan temuan dan ciri kehidupannya.', 'Mengapa kita perlu menghargai setiap makhluk hidup?'),
 B:sub('Kunci Dikotomi', ['Menjelaskan tujuan klasifikasi.', 'Menyusun kunci dikotomi sederhana.'], 'Siswa bingung mengenali nama banyak makhluk hidup temuan di kebun.', 'Bagaimana cara cepat mengidentifikasinya?', ['Apa manfaat klasifikasi?', 'Apa itu tata nama ganda?'], ['K1'],
  'Uji kunci dikotomimu pada kelompok lain.', 'Bagian mana dari kunci dikotomimu yang perlu diperbaiki?'),
 C:sub('Sortir 5 Kingdom', ['Mengelompokkan makhluk hidup ke dalam 5 kingdom.', 'Menuliskan nama ilmiah dengan benar.'],
  'Pak kebun menemukan jamur di batang pohon, lumut di tembok, ganggang hijau di kolam, dan bakteri disebut-sebut penyebab bau sampah. Ia bertanya, “Apakah jamur itu tumbuhan?”',
  'Bagaimana makhluk hidup dikelompokkan dalam sistem 5 kingdom?', ['Apa beda prokariotik dan eukariotik?', 'Mengapa jamur tidak termasuk tumbuhan?'],
  [K('Sortir Kartu Makhluk Hidup', 'Sistem <b>5 kingdom</b> (Whittaker): <b>Monera</b> (prokariotik), <b>Protista</b>, <b>Fungi</b>, <b>Plantae</b>, <b>Animalia</b>. Nama ilmiah ditulis <i>Genus spesies</i>, miring atau digarisbawahi.',
    ['Fungi tidak berklorofil, dinding sel kitin.', 'Plantae berklorofil, dinding sel selulosa.', 'Contoh nama ilmiah: <i>Oryza sativa</i> (padi), <i>Panthera tigris</i> (harimau).'],
    '12 kartu gambar makhluk hidup (bakteri, Amoeba, Euglena, jamur tiram, ragi, lumut, paku, mangga, cacing, ikan, kupu-kupu, kucing).',
    ['Amati setiap kartu dan catat cirinya.', 'Kelompokkan kartu ke 5 kingdom.', 'Tuliskan alasan pengelompokan.', 'Cari dan tulis nama ilmiah 3 makhluk hidup.'],
    T('Tabel Pengelompokan', ['Kingdom', 'Anggota (kartu)', 'Ciri utama'], 5, ['Monera', 'Protista', 'Fungi', 'Plantae', 'Animalia']),
    ['Mengapa Euglena sulit dikelompokkan?', 'Tuliskan nama ilmiah padi dan harimau dengan benar!'])],
  'Presentasikan papan 5 kingdom kelompokmu.', 'Makhluk hidup apa yang paling unik menurutmu? Mengapa?')};

/* ---------- Kelas VII Bab 6 ---------- */
S['ekosistem'] = {
 A:sub('Cacing Suka Gelap?', ['Menyelidiki pengaruh faktor lingkungan terhadap organisme.', 'Menjelaskan adaptasi makhluk hidup.'],
  'Saat membalik pot, siswa menemukan cacing tanah yang segera bergerak menjauhi cahaya dan masuk ke tanah lembap.',
  'Mengapa cacing memilih tempat gelap dan lembap?', ['Apa saja faktor abiotik?', 'Sebutkan 3 jenis adaptasi!'],
  [K('Respons Cacing terhadap Lingkungan', 'Faktor <b>abiotik</b> (cahaya, suhu, air, kelembapan) memengaruhi makhluk hidup. Makhluk hidup beradaptasi secara <b>morfologi</b>, <b>fisiologi</b>, dan <b>tingkah laku</b>.',
    ['Cacing bernapas lewat kulit yang harus lembap.', 'Kaktus berdaun duri: adaptasi morfologi.', 'Cicak memutus ekor: adaptasi tingkah laku.'],
    'nampan, tanah kering, tanah lembap, kertas karton penutup, 5 cacing tanah, senter.',
    ['Isi separuh nampan dengan tanah kering, separuh tanah lembap.', 'Tutup separuh nampan dengan karton (gelap).', 'Letakkan cacing di tengah, tunggu 5 menit.', 'Hitung jumlah cacing di setiap bagian, kembalikan cacing ke alam.'],
    T('Tabel Pengamatan', ['Bagian nampan', 'Jumlah cacing (5 menit)', 'Jumlah cacing (10 menit)'], 4, ['Terang–kering', 'Terang–lembap', 'Gelap–kering', 'Gelap–lembap']),
    ['Di bagian mana cacing paling banyak? Mengapa?', 'Berikan contoh adaptasi hewan di sekitar rumahmu!'], 'Perlakukan cacing dengan lembut dan kembalikan ke tanah setelah selesai.')],
  'Presentasikan hasil pengamatan dan hubungannya dengan adaptasi.', 'Bagaimana kamu bisa menghormati hewan kecil di sekitarmu?'),
 B:sub('Siapa Makan Siapa?', ['Mengidentifikasi komponen ekosistem.', 'Menyusun jaring-jaring makanan.'], 'Kolam sekolah keruh dan ikannya mati.', 'Bagaimana komponen ekosistem saling berhubungan?', ['Sebutkan komponen biotik dan abiotik!', 'Apa peran pengurai?'], ['K0'],
  'Presentasikan jaring-jaring makanan.', 'Apa yang terjadi jika satu komponen hilang?'),
 C:sub('Peta Fauna Indonesia', ['Menjelaskan keanekaragaman hayati Indonesia.', 'Membedakan fauna Asiatis, peralihan, dan Australis.'],
  'Turis asing heran: mengapa di Kalimantan ada orangutan, tetapi di Papua ada kanguru pohon dan burung cenderawasih?',
  'Mengapa hewan di Indonesia bagian barat dan timur berbeda?', ['Apa itu keanekaragaman hayati?', 'Apa itu hewan endemik?'],
  [K('Menempel Fauna di Peta', 'Indonesia termasuk negara <b>megabiodiversitas</b>. Garis <b>Wallace</b> dan <b>Weber</b> membagi fauna menjadi <b>Asiatis</b> (barat), <b>peralihan</b> (tengah), dan <b>Australis</b> (timur).',
    ['Keanekaragaman tingkat gen, jenis, dan ekosistem.', 'Endemik = hanya ada di daerah tertentu.', 'Contoh endemik: komodo (NTT), anoa (Sulawesi), cenderawasih (Papua).'],
    'peta Indonesia, kartu gambar 12 hewan, spidol, lem.',
    ['Gambar garis Wallace dan Weber pada peta.', 'Tempel kartu hewan pada daerah asalnya.', 'Kelompokkan hewan menjadi Asiatis, peralihan, Australis.', 'Tandai hewan endemik.'],
    T('Tabel Pengelompokan', ['Hewan', 'Daerah asal', 'Tipe fauna', 'Endemik? (ya/tidak)'], 8),
    ['Mengapa fauna Sulawesi disebut peralihan?', 'Sebutkan 3 flora endemik Indonesia!'])],
  'Presentasikan peta fauna kelompokmu.', 'Apa yang membuatmu bangga dengan kekayaan hayati Indonesia?'),
 D:sub('Audit Sampah Sekolah', ['Menganalisis pencemaran di sekolah.', 'Merancang aksi pengurangan sampah.'], 'Banyak sampah plastik di sekitar kolam sekolah.', 'Bagaimana perilaku manusia memengaruhi ekosistem?', ['Apa itu eutrofikasi?', 'Sebutkan jenis pencemaran!'], ['K1'],
  'Presentasikan hasil audit dan rencana aksi.', 'Satu kebiasaan apa yang akan kamu ubah?'),
 E:sub('Kampanye Konservasi', ['Membedakan konservasi in situ dan ex situ.', 'Merancang kampanye pelestarian spesies endemik.'],
  'Populasi badak Jawa tinggal sekitar 80 ekor dan orangutan terus berkurang akibat hilangnya hutan.',
  'Apa yang bisa dilakukan pelajar untuk membantu pelestarian?', ['Apa beda in situ dan ex situ?', 'Mengapa spesies bisa punah?'],
  [K('Merancang Kampanye', '<b>Konservasi in situ</b>: perlindungan di habitat asli (taman nasional, cagar alam). <b>Konservasi ex situ</b>: di luar habitat (kebun binatang, kebun raya, penangkaran).',
    ['Penyebab kepunahan: perusakan habitat, perburuan, pencemaran.', 'TN Ujung Kulon melindungi badak Jawa.', 'Aksi kecil: tidak membeli satwa liar, menanam pohon, hemat kertas.'],
    'kertas plano, spidol, sumber bacaan (buku/internet).',
    ['Pilih satu spesies endemik terancam punah.', 'Cari informasi habitat, ancaman, dan upaya konservasinya.', 'Rancang poster/video kampanye.', 'Tentukan aksi nyata kelompok.'],
    T('Rencana Kampanye', ['Bagian', 'Isi'], 5, ['Spesies', 'Ancaman', 'Konservasi in situ', 'Konservasi ex situ', 'Aksi kelompok kami']),
    ['Mengapa konservasi in situ lebih diutamakan?', 'Apa pesan utama kampanyemu?'])],
  'Presentasikan kampanye konservasi kelompokmu.', 'Apa satu aksi nyata yang akan kamu lakukan untuk alam?')};

/* ---------- Kelas VII Bab 7 ---------- */
S['tata-surya'] = {
 A:sub('Model Skala Tata Surya', ['Mendeskripsikan anggota tata surya.', 'Membuat model skala jarak planet.'], 'Gambar tata surya di buku membuat planet tampak berdekatan.', 'Seberapa jauh sebenarnya jarak antarplanet?', ['Sebutkan 8 planet berurutan!', 'Apa beda planet dalam dan planet luar?'], ['K1'],
  'Peragakan model skala di halaman sekolah.', 'Apa yang membuat Bumi istimewa?'),
 B:sub('Fase Bulan', ['Memodelkan fase Bulan.', 'Menjelaskan gerhana.'], 'Bentuk Bulan terlihat berubah setiap malam.', 'Apakah Bulan benar-benar berubah bentuk?', ['Dari mana cahaya Bulan?', 'Apa itu revolusi Bulan?'], ['K0'],
  'Peragakan model fase Bulan.', 'Fase Bulan apa yang paling kamu sukai?'),
 C:sub('Mengenal Matahari Lebih Dekat', ['Mendeskripsikan lapisan dan aktivitas Matahari.', 'Menyelidiki pemanfaatan energi Matahari.'],
  'Di musim kemarau, jemuran cepat kering dan air di ember yang dijemur menjadi hangat. Panel surya di atap masjid juga menghasilkan listrik.',
  'Seberapa besar energi Matahari dan bagaimana memanfaatkannya?', ['Mengapa Matahari disebut bintang?', 'Sebutkan lapisan Matahari!'],
  [K('Pemanas Air Tenaga Surya', 'Matahari adalah <b>bintang</b> yang menghasilkan energi dari reaksi <b>fusi</b> hidrogen menjadi helium di intinya. Lapisannya: inti, zona radiatif, zona konveksi, fotosfer, kromosfer, korona.',
    ['Benda gelap menyerap radiasi lebih banyak daripada benda terang.', 'Energi Matahari dimanfaatkan: panel surya, pengering, pemanas air.', 'Jangan melihat Matahari langsung tanpa pelindung!'],
    '2 botol plastik berisi 300 mL air, cat/kertas hitam, kertas putih, 2 termometer, stopwatch.',
    ['Bungkus botol A dengan kertas hitam, botol B dengan kertas putih.', 'Ukur suhu awal air.', 'Jemur kedua botol di bawah sinar Matahari.', 'Ukur suhu setiap 5 menit selama 20 menit.'],
    T('Tabel Pengamatan', ['Waktu (menit)', 'Suhu botol hitam (°C)', 'Suhu botol putih (°C)'], 5, ['0', '5', '10', '15', '20']),
    ['Botol mana yang lebih cepat panas? Mengapa?', 'Sebutkan 3 manfaat Matahari bagi kehidupan di Bumi!'], 'Jangan menatap Matahari secara langsung.')],
  'Presentasikan grafik suhu dan desain pemanas air sederhana.', 'Bagaimana kita bisa lebih banyak memanfaatkan energi Matahari di rumah?')};

/* ---------- Kelas VIII Bab 1 ---------- */
S['sel'] = {
 A:sub('Mikroskop dan Sel Bawang', ['Menggunakan mikroskop dengan benar.', 'Menghitung perbesaran.'], 'Sinta ingin melihat sel, unit terkecil kehidupan.', 'Bagaimana cara mengamati sel?', ['Sebutkan bagian mikroskop!', 'Mengapa mulai dari perbesaran terkecil?'], ['K0'],
  'Pamerkan gambar sel bawang.', 'Apa yang paling mengejutkanmu saat melihat sel?'),
 B:sub('Sel Hewan vs Sel Tumbuhan', ['Membandingkan struktur sel hewan dan tumbuhan.'], 'Sinta bertanya: “Apakah sel pipi sama dengan sel bawang?”', 'Apa persamaan dan perbedaannya?', ['Organel apa yang hanya ada di sel tumbuhan?', 'Apa fungsi inti sel?'], ['K1'],
  'Presentasikan tabel perbandingan sel.', 'Bagaimana menjaga sel tubuh tetap sehat?'),
 C:sub('Bentuk Sesuai Fungsi', ['Menjelaskan spesialisasi sel.', 'Membuat model sel khusus dan mengaitkan bentuk dengan fungsinya.'],
  'Sel darah merah berbentuk cakram, sel saraf panjang bercabang, sel sperma berekor. Mengapa sel-sel di tubuh bentuknya berbeda-beda?',
  'Bagaimana bentuk sel berkaitan dengan fungsinya?', ['Apa itu spesialisasi sel?', 'Sebutkan tingkat organisasi kehidupan!'],
  [K('Model Sel Khusus', '<b>Spesialisasi sel</b> adalah perubahan bentuk dan fungsi sel agar dapat melakukan tugas khusus. Sel → jaringan → organ → sistem organ → organisme.',
    ['Sel darah merah: cakram bikonkaf, tanpa inti → mengangkut O₂.', 'Sel saraf: panjang bercabang → menghantar impuls.', 'Sel rambut akar: tonjolan panjang → memperluas penyerapan.'],
    'plastisin berbagai warna, kawat/lidi, karton, label.',
    ['Pilih 3 sel khusus (sel darah merah, saraf, otot, sperma, rambut akar, penjaga stomata).', 'Buat modelnya dari plastisin.', 'Beri label bagian yang khas.', 'Jelaskan hubungan bentuk dan fungsinya.'],
    T('Tabel Sel Khusus', ['Nama sel', 'Bentuk khas', 'Fungsi', 'Hubungan bentuk–fungsi'], 3),
    ['Mengapa sel darah merah tidak memiliki inti?', 'Urutkan tingkat organisasi kehidupan dari sel hingga organisme!'])],
  'Pamerkan model sel dan jelaskan di depan kelas.', 'Sel apa di tubuhmu yang menurutmu paling hebat? Mengapa?')};

/* ---------- Kelas VIII Bab 2 ---------- */
S['sistem-organ'] = {
 A:sub('Detektif Zat Makanan', ['Menguji kandungan zat makanan.', 'Menghitung energi makanan.'],
  'Kantin sekolah menjual nasi, roti, tahu, telur, dan gorengan. Petugas UKS ingin tahu makanan mana yang mengandung karbohidrat, protein, dan lemak.',
  'Bagaimana mengetahui kandungan zat makanan?', ['Sebutkan 6 zat gizi!', 'Apa fungsi sistem pencernaan?'],
  [K('Uji Bahan Makanan', 'Zat makanan diuji dengan pereaksi: <b>lugol</b> untuk amilum (biru kehitaman), <b>Benedict</b> untuk glukosa (merah bata), <b>biuret</b> untuk protein (ungu), <b>kertas buram</b> untuk lemak (noda transparan).',
    ['Energi = karbohidrat × 4 + protein × 4 + lemak × 9 (kkal).', 'Pencernaan: mulut → kerongkongan → lambung → usus halus → usus besar.', 'Enzim memecah makanan menjadi zat yang dapat diserap.'],
    'nasi, roti, putih telur, tahu, kacang, larutan lugol, biuret, kertas buram, pipet, plat tetes.',
    ['Haluskan setiap bahan dan beri sedikit air.', 'Tetesi lugol, amati warnanya.', 'Tetesi biuret pada sampel baru, amati.', 'Gosokkan bahan pada kertas buram, keringkan, amati.'],
    T('Tabel Pengamatan', ['Bahan', 'Uji lugol', 'Uji biuret', 'Uji kertas buram', 'Kandungan'], 5, ['Nasi', 'Roti', 'Putih telur', 'Tahu', 'Kacang']),
    ['Bahan mana yang mengandung amilum? Bagaimana kamu mengetahuinya?', 'Hitung energi makanan dengan 30 g karbohidrat, 8 g protein, 5 g lemak!'], 'Pereaksi tidak boleh dicicipi. Makanan uji tidak untuk dimakan.')],
  'Presentasikan hasil uji dan menu sehat kelompokmu.', 'Apakah menu makanmu sudah seimbang?'),
 B:sub('Denyut Nadi dan Jantung', ['Mengukur denyut nadi sebelum dan sesudah olahraga.', 'Menjelaskan kerja jantung.'], 'Siswa cepat terengah-engah setelah berlari.', 'Bagaimana olahraga memengaruhi kerja jantung?', ['Apa fungsi jantung?', 'Berapa denyut nadi normal remaja?'], ['K0'],
  'Presentasikan grafik denyut nadi.', 'Olahraga apa yang akan rutin kamu lakukan?'),
 C:sub('Menghitung Napas', ['Mengukur frekuensi pernapasan.', 'Menjelaskan mekanisme pernapasan dengan model paru-paru.'],
  'Saat pelajaran PJOK, siswa bernapas lebih cepat setelah berlari. Ada pula siswa yang sering batuk karena terpapar asap rokok di rumah.',
  'Bagaimana kita bernapas dan apa yang memengaruhinya?', ['Sebutkan organ pernapasan!', 'Apa beda pernapasan dada dan perut?'],
  [K('Frekuensi Napas dan Model Paru-paru', 'Saat <b>inspirasi</b> diafragma berkontraksi (mendatar), rongga dada membesar, udara masuk. Saat <b>ekspirasi</b> diafragma melengkung, udara keluar. Frekuensi napas normal remaja ± 16–20 kali/menit.',
    ['Pertukaran O₂ dan CO₂ terjadi di alveolus.', 'Asap rokok merusak silia dan alveolus.', 'Gangguan: asma, bronkitis, ISPA.'],
    'stopwatch, botol plastik dipotong, 2 balon, sedotan Y, plastisin, karet.',
    ['Hitung napas teman saat duduk tenang selama 1 menit.', 'Lompat di tempat 1 menit, hitung lagi.', 'Rakit model paru-paru botol: balon dalam botol, karet di dasar.', 'Tarik dan dorong karet, amati balon.'],
    T('Tabel Pengamatan', ['Nama', 'Napas/menit (istirahat)', 'Napas/menit (setelah lompat)'], 5),
    ['Mengapa frekuensi napas meningkat setelah aktivitas?', 'Bagian model mana yang mewakili diafragma dan paru-paru?'], 'Siswa yang memiliki asma cukup menjadi pencatat.')],
  'Presentasikan data napas dan peragakan model paru-paru.', 'Bagaimana kamu menjaga paru-paru dari asap dan polusi?'),
 D:sub('Ginjal Penyaring Darah', ['Menjelaskan organ ekskresi dan fungsinya.', 'Memodelkan proses penyaringan di ginjal.'],
  'Petugas UKS menempel poster “Cek warna urinmu!”. Urine yang pekat menandakan tubuh kurang minum. Siswa bertanya, bagaimana ginjal membuat urine?',
  'Bagaimana ginjal menyaring darah?', ['Sebutkan organ ekskresi dan zat yang dikeluarkan!', 'Mengapa kita harus cukup minum air?'],
  [K('Model Filtrasi Ginjal', '<b>Ginjal</b> menyaring darah di <b>nefron</b> melalui tiga tahap: <b>filtrasi</b> (glomerulus), <b>reabsorpsi</b> (tubulus proksimal), dan <b>augmentasi</b> (tubulus distal).',
    ['Organ ekskresi: ginjal (urine), kulit (keringat), paru-paru (CO₂), hati (empedu).', 'Minum ± 8 gelas air per hari.', 'Gangguan: batu ginjal, nefritis, diabetes melitus.'],
    'corong, kertas saring, kapas, air, pewarna makanan, pasir halus, manik-manik/kacang hijau, gelas.',
    ['Campurkan air, pewarna, pasir, dan manik-manik (mewakili darah).', 'Saring dengan kapas di corong (filtrasi kasar).', 'Saring lagi dengan kertas saring.', 'Amati zat yang tertahan dan yang lolos.'],
    T('Tabel Pengamatan', ['Komponen', 'Tertahan di saringan?', 'Mewakili apa dalam darah/urine'], 4, ['Manik-manik', 'Pasir halus', 'Pewarna', 'Air']),
    ['Apa yang diwakili manik-manik yang tertahan saringan?', 'Mengapa urine orang sehat tidak mengandung glukosa?'])],
  'Presentasikan model dan poster “Sayangi Ginjalmu”.', 'Berapa gelas air yang kamu minum hari ini? Apa targetmu?')};

/* ---------- Kelas VIII Bab 3 ---------- */
S['usaha'] = {
 A:sub('Berapa Usahamu Naik Tangga?', ['Menghitung usaha dan daya.'],
  'Andi dan Budi menaiki tangga sekolah setinggi 4 m. Andi berlari, Budi berjalan. Siapa yang melakukan usaha lebih besar dan siapa yang dayanya lebih besar?',
  'Apa beda usaha dan daya?', ['Kapan dikatakan melakukan usaha dalam IPA?', 'Apakah mendorong tembok termasuk usaha?'],
  [K('Usaha dan Daya Naik Tangga', '<b>Usaha (W)</b> = gaya × perpindahan, <b>W = F × s</b> (joule). Saat naik tangga, F = berat = m × g dan s = tinggi tangga. <b>Daya (P) = W ÷ t</b> (watt).',
    ['g ≈ 10 m/s².', 'Tidak ada perpindahan → usaha = 0.', '1 watt = 1 joule per detik.'],
    'tangga sekolah, meteran, stopwatch, timbangan badan.',
    ['Ukur tinggi tangga (s) dan massa tiap anggota (m).', 'Naiki tangga dengan berjalan, catat waktunya.', 'Ulangi dengan berjalan cepat (hati-hati).', 'Hitung usaha dan daya.'],
    T('Tabel Pengamatan', ['Nama', 'Massa (kg)', 'Waktu (s)', 'Usaha W (J)', 'Daya P (W)'], 4),
    ['Apakah usaha saat berjalan dan berjalan cepat sama? Mengapa?', 'Siapa yang dayanya paling besar?'], 'Jangan berlari atau saling mendorong di tangga.')],
  'Presentasikan perhitungan usaha dan daya.', 'Kegiatan apa yang membutuhkan daya besar dalam kehidupanmu?'),
 B:sub('Energi Bola Jatuh', ['Menjelaskan perubahan energi potensial dan kinetik.', 'Menerapkan hukum kekekalan energi.'],
  'Bola yang dijatuhkan memantul makin rendah lalu berhenti. Ke mana energinya pergi?', 'Apakah energi bisa hilang?', ['Sebutkan bentuk-bentuk energi!', 'Apa bunyi hukum kekekalan energi?'],
  [K('Perubahan Energi Bola', '<b>Energi potensial</b> Ep = m × g × h. <b>Energi kinetik</b> Ek = ½ × m × v². <b>Energi mekanik</b> = Ep + Ek. Energi tidak dapat diciptakan atau dimusnahkan, hanya berubah bentuk.',
    ['Saat bola jatuh: Ep berubah menjadi Ek.', 'Sebagian energi berubah menjadi bunyi dan panas saat memantul.', 'Contoh perubahan energi: listrik → cahaya (lampu).'],
    'bola tenis, timbangan, meteran, HP untuk merekam.',
    ['Timbang massa bola.', 'Jatuhkan bola dari 1 m, rekam tinggi pantulan 1, 2, dan 3.', 'Hitung Ep pada setiap tinggi.', 'Hitung energi yang “hilang” setiap pantulan.'],
    T('Tabel Pengamatan', ['Keadaan', 'Tinggi h (m)', 'Ep = m × g × h (J)', 'Energi berubah menjadi'], 4, ['Awal', 'Pantulan 1', 'Pantulan 2', 'Pantulan 3']),
    ['Mengapa pantulan bola makin rendah?', 'Sebutkan 3 perubahan energi di rumahmu!'])],
  'Presentasikan grafik tinggi pantulan dan perubahan energinya.', 'Bagaimana cara menghemat energi listrik di rumah?'),
 C:sub('Pesawat Sederhana', ['Menentukan keuntungan mekanis tuas dan bidang miring.'], 'Pak Satpam kesulitan menaikkan galon ke teras.', 'Alat sederhana apa yang dapat membantunya?', ['Sebutkan jenis pesawat sederhana!', 'Apa itu keuntungan mekanis?'], ['K0', 'K1'],
  'Presentasikan solusi untuk Pak Satpam.', 'Pesawat sederhana apa yang paling sering kamu gunakan?')};

/* ---------- Kelas VIII Bab 4 ---------- */
S['getaran-gelombang'] = {
 A:sub('Menyetel Jam Bandul', ['Menyelidiki periode dan frekuensi bandul.'], 'Jam bandul di ruang guru selalu terlambat.', 'Bagaimana menyetelnya agar tepat?', ['Apa itu periode dan frekuensi?', 'Apa itu amplitudo?'], ['K0'],
  'Presentasikan grafik panjang tali–periode.', 'Di mana lagi kamu menemukan getaran?'),
 B:sub('Gelombang dan Telepon Kaleng', ['Mengamati gelombang transversal dan longitudinal.', 'Menyelidiki perambatan bunyi melalui medium padat.'],
  'Adik membuat telepon dari kaleng dan benang. Suaranya terdengar jelas jika benang tegang, tetapi tidak terdengar jika benang kendur.',
  'Bagaimana bunyi merambat dari satu kaleng ke kaleng lain?', ['Apa beda gelombang transversal dan longitudinal?', 'Dapatkah bunyi merambat di ruang hampa?'],
  [K('Slinki dan Telepon Kaleng', '<b>Gelombang</b> adalah getaran yang merambat. Transversal: arah getar ⊥ arah rambat (bukit & lembah). Longitudinal: arah getar ∥ arah rambat (rapatan & renggangan). <b>Bunyi</b> adalah gelombang longitudinal yang memerlukan medium.',
    ['v = λ × f.', 'Bunyi merambat lebih cepat di zat padat daripada di udara.', 'Pendengaran manusia 20–20.000 Hz.'],
    'slinki, 2 kaleng bekas/gelas plastik, benang 5 m, paku kecil.',
    ['Getarkan slinki naik-turun, amati bukit dan lembah.', 'Dorong-tarik slinki, amati rapatan dan renggangan.', 'Rakit telepon kaleng, coba berbicara dengan benang tegang lalu kendur.', 'Ganti benang dengan kawat/benang nilon, bandingkan.'],
    T('Tabel Pengamatan', ['Kegiatan', 'Yang diamati', 'Jenis gelombang / medium'], 4, ['Slinki naik-turun', 'Slinki dorong-tarik', 'Benang tegang', 'Benang kendur']),
    ['Mengapa suara tidak terdengar saat benang kendur?', 'Hitung cepat rambat gelombang jika λ = 0,5 m dan f = 4 Hz!'])],
  'Peragakan gelombang slinki dan telepon kaleng.', 'Bagaimana kamu menjaga telinga dari bunyi yang terlalu keras?'),
 C:sub('Bayangan Lensa Cembung', ['Menyelidiki bayangan lensa cembung.'], 'Huruf kecil tampak besar melalui lup, tetapi terbalik jika lup dijauhkan.', 'Bagaimana lensa membentuk bayangan?', ['Sebutkan sifat cahaya!', 'Apa beda lensa cembung dan cekung?'], ['K1'],
  'Presentasikan diagram pembentukan bayangan.', 'Bagaimana menjaga kesehatan mata saat memakai gawai?')};

/* ---------- Kelas VIII Bab 5 ---------- */
S['materi'] = {
 A:sub('Logam atau Nonlogam?', ['Membedakan unsur logam dan nonlogam berdasarkan sifatnya.', 'Membaca informasi unsur pada tabel periodik.'],
  'Di laboratorium ada paku, kawat tembaga, aluminium foil, arang, belerang, dan pensil (grafit). Siswa ditugasi mengelompokkannya menjadi logam dan nonlogam.',
  'Sifat apa yang membedakan logam dan nonlogam?', ['Apa itu unsur?', 'Bagaimana aturan penulisan lambang unsur?'],
  [K('Uji Sifat Unsur', '<b>Unsur</b> adalah zat tunggal yang tidak dapat diuraikan lagi secara kimia. <b>Logam</b> umumnya mengilap, menghantarkan listrik dan panas, dapat ditempa. <b>Nonlogam</b> umumnya kusam, rapuh, bukan penghantar (kecuali grafit).',
    ['Lambang unsur: huruf kapital + huruf kecil (Fe, Cu, Al, C, S).', 'Tabel periodik: golongan (kolom) dan periode (baris).', 'Atom terdiri atas proton, neutron, dan elektron.'],
    'paku besi, kawat tembaga, aluminium foil, arang, belerang (diawasi guru), grafit pensil, baterai, lampu kecil, kabel, palu kecil.',
    ['Amati kilap setiap bahan.', 'Uji daya hantar listrik dengan rangkaian baterai–lampu.', 'Ketuk perlahan dengan palu untuk menguji kelenturan/rapuh.', 'Cari lambang dan nomor atom unsurnya di tabel periodik.'],
    T('Tabel Pengamatan', ['Bahan', 'Lambang', 'Mengilap?', 'Menghantar listrik?', 'Logam / nonlogam'], 6, ['Besi', 'Tembaga', 'Aluminium', 'Karbon (arang)', 'Belerang', 'Grafit']),
    ['Mengapa grafit menghantarkan listrik padahal nonlogam?', 'Sebutkan 3 unsur logam dan kegunaannya!'], 'Belerang hanya diamati, jangan dibakar atau dicium.')],
  'Presentasikan tabel sifat unsur.', 'Unsur apa yang paling penting dalam hidupmu? Mengapa?'),
 B:sub('Indikator Kubis Ungu', ['Mengelompokkan larutan asam, basa, netral.'], 'Bu kantin bertanya apakah cuka, sabun, dan air jeruk aman dicampur.', 'Bagaimana mengetahui sifat asam atau basa tanpa mencicipi?', ['Apa beda unsur dan senyawa?', 'Apa ciri asam dan basa?'], ['K0'],
  'Presentasikan tabel warna indikator.', 'Bahan kimia apa di rumah yang perlu disimpan hati-hati?'),
 C:sub('Memisahkan Garam dari Pasir', ['Memisahkan campuran berdasarkan sifat fisik.'], 'Garam Bu kantin tercampur pasir.', 'Bagaimana memisahkannya?', ['Apa beda campuran homogen dan heterogen?', 'Sebutkan metode pemisahan campuran!'], ['K1'],
  'Presentasikan diagram alir pemisahan.', 'Contoh pemisahan campuran apa yang ada di rumahmu?')};

/* ---------- Kelas VIII Bab 6 ---------- */
S['struktur-bumi'] = {
 A:sub('Model Lapisan Bumi', ['Mendeskripsikan lapisan-lapisan Bumi.', 'Membuat model lapisan Bumi berskala.'],
  'Saat mengupas telur rebus, Doni berkata, “Bumi itu mirip telur: ada kulit, putih, dan kuning telur.” Benarkah perumpamaan itu?',
  'Seperti apa susunan lapisan Bumi?', ['Sebutkan lapisan Bumi dari luar ke dalam!', 'Lapisan mana yang paling panas?'],
  [K('Model Plastisin Lapisan Bumi', 'Bumi tersusun atas <b>kerak</b> (± 5–70 km), <b>mantel</b> (± 2.900 km), <b>inti luar</b> cair, dan <b>inti dalam</b> padat. Atmosfer menyelimuti Bumi.',
    ['Kerak benua lebih tebal daripada kerak samudra.', 'Suhu inti ± 5.000–6.000 °C.', 'Arus konveksi mantel menggerakkan lempeng.'],
    'plastisin 4 warna, benang/pisau plastik, penggaris, kalkulator.',
    ['Hitung tebal setiap lapisan dengan skala (jari-jari Bumi 6.371 km = 6 cm).', 'Buat bola inti dalam, lapisi inti luar, mantel, lalu kerak.', 'Potong model menjadi dua dengan benang.', 'Beri label setiap lapisan.'],
    T('Tabel Skala Lapisan Bumi', ['Lapisan', 'Ketebalan sebenarnya (km)', 'Ketebalan model (cm)', 'Wujud'], 4, ['Kerak', 'Mantel', 'Inti luar', 'Inti dalam']),
    ['Mengapa kerak pada model hampir tidak terlihat?', 'Apakah perumpamaan Bumi seperti telur tepat? Jelaskan!'])],
  'Pamerkan model lapisan Bumi kelompokmu.', 'Apa yang paling menarik dari bagian dalam Bumi?'),
 B:sub('Lempeng Bergerak', ['Menjelaskan jenis batas lempeng dan dampaknya.'],
  'Pulau Sumatra, Jawa, dan Bali dikelilingi palung dan gunung api. Indonesia berada di pertemuan tiga lempeng besar.',
  'Mengapa pertemuan lempeng menyebabkan gempa dan gunung api?', ['Sebutkan lempeng di sekitar Indonesia!', 'Apa itu Cincin Api Pasifik?'],
  [K('Model Batas Lempeng', 'Kerak Bumi terpecah menjadi <b>lempeng tektonik</b> yang bergerak karena arus konveksi mantel. Batas lempeng: <b>divergen</b> (menjauh), <b>konvergen</b> (bertumbukan/menunjam), <b>transform</b> (bergeser).',
    ['Indonesia: lempeng Indo-Australia, Eurasia, dan Pasifik.', 'Konvergen → palung, gunung api, gempa.', 'Divergen → punggung tengah samudra.'],
    '2 potong roti tawar/busa spons, selai, piring, kertas.',
    ['Letakkan dua roti berdampingan, dorong saling mendekat (konvergen), amati lipatan.', 'Tarik saling menjauh (divergen), amati celah.', 'Geser berlawanan arah (transform), amati.', 'Gambarkan setiap jenis batas lempeng.'],
    T('Tabel Pengamatan', ['Gerakan', 'Yang terjadi pada model', 'Contoh di Bumi'], 3, ['Konvergen', 'Divergen', 'Transform']),
    ['Jenis batas lempeng apa yang ada di selatan Jawa?', 'Mengapa Indonesia banyak memiliki gunung api?'])],
  'Peragakan ketiga gerakan lempeng.', 'Bagaimana perasaanmu tinggal di negeri “cincin api”?'),
 C:sub('Meja Gempa', ['Memodelkan bangunan tahan gempa.'], 'Siswa panik saat simulasi gempa.', 'Bangunan seperti apa yang aman?', ['Apa penyebab gempa tektonik?', 'Apa itu episentrum?'], ['K0'],
  'Presentasikan hasil uji meja gempa.', 'Apa yang akan kamu lakukan saat gempa terjadi?'),
 D:sub('Siaga Gunung Api', ['Menyusun rencana mitigasi bencana gunung api.'], 'Magelang dikelilingi gunung api aktif seperti Merapi.', 'Apa yang harus disiapkan agar selamat?', ['Sebutkan bagian gunung api!', 'Sebutkan 4 status gunung api!'], ['K1'],
  'Presentasikan peta evakuasi dan tas siaga.', 'Apa yang sudah disiapkan keluargamu?')};
})();
/* Bangun dokumen LKPD lengkap: lkpdDoc(id) = LKPD bab, lkpdDoc(id, 'A') = LKPD sub bab */
window.lkpdDoc = function(id, sb){
  const B = window.LKPD_DATA[id]; if(!B) return null; if(!sb) return Object.assign({sub:null}, B);
  const s = (B._sub = B._sub, window.LKPD_DATA._sub[id] || {})[sb]; if(!s) return null;
  return Object.assign({}, B, s, {sub:sb, kegiatan:s.kegiatan.map(k => typeof k === 'string' ? B.kegiatan[+k.slice(1)] : k)});
};
window.lkpdKeys = function(){ const out = [], M = window.MATERI_DATA || {};
  Object.keys(M).forEach(id => { if(!window.LKPD_DATA[id]) return; out.push({key:id, id, sub:null});
    (M[id].subs || []).forEach(([k]) => { if(window.LKPD_DATA._sub[id] && window.LKPD_DATA._sub[id][k]) out.push({key:id + '__' + k, id, sub:k}); }); });
  return out; };
