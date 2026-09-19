/* ==========================================================================
   CONFIG — semua teks, foto, dan pengaturan yang mudah diubah ada di sini.
   Tidak perlu menyentuh index.html / style.css / main.js untuk mengganti isi.
   ========================================================================== */

window.CONFIG = {
  /* ---------- Lokasi aset (relatif terhadap website/site/index.html) ------- */
  paths: {
    photos: 'assets/photos/',
    decor: 'assets/decorations/',
    audio: 'assets/audio/', // folder audio (song.mp3 & birthday.mp3)
  },

  /* ---------- Penyimpanan jawaban chatbot (Google Sheets) -------------------
     Tempel URL Web App Google Apps Script di bawah (lihat website/google-apps-script/SETUP.md).
     Selama masih berisi "PASTE_..." atau kosong, jawaban TIDAK dikirim ke mana pun.
     Jangan menaruh API key / password di sini.                                    */
  CHATBOT_ENDPOINT:
    'https://script.google.com/macros/s/AKfycbza0Cijqc3Ea9IUzqd1Sd1L72Isi734aT2XC2VXy6AJT2znUxWj41SFHDzpcvVqRLbt/exec',

  /* ---------- Audio --------------------------------------------------------
     bgm      : background music, loop, jalan terus di semua halaman
     birthday : lagu khusus Song Page (saat diputar, bgm otomatis dijeda)
     volume   : 0 – 1                                                          */
  audio: {
    bgm: 'assets/audio/song.mp3',
    birthday: 'assets/audio/birthday.mp3',
    bgmVolume: 0.25,
    birthdayVolume: 0.9,
  },

  /* ---------- Perpustakaan foto -------------------------------------------
     file : nama file di /assets/photos
     pos  : titik fokus crop (object-position) "x% y%"
     rot  : (opsional) putar foto, mis. -90 kalau piksel aslinya miring       */
  photos: {
    p01: { file: 'foto01.jpg', pos: '55% 65%' },
    p02: { file: 'foto02.jpg', pos: '50% 58%' },
    p03: { file: 'foto03.jpg', pos: '50% 50%', rot: -90 },
    p04: { file: 'foto04.jpg', pos: '62% 40%' },
    p05: { file: 'foto05.jpg', pos: '50% 72%' },
    p06: { file: 'foto06.jpg', pos: '50% 28%' },
    p07: { file: 'foto07.jpg', pos: '50% 62%' },
    p08: { file: 'foto08.jpg', pos: '50% 55%' },
    p09: { file: 'foto09.jpg', pos: '58% 45%' },
    p10: { file: 'foto10.jpg', pos: '50% 40%' },
    p11: { file: 'foto11.jpg', pos: '50% 50%' }, // khusus jumpscare
  },

  /* ---------- 1. Password ------------------------------------------------- */
  password: {
    /* GANTI password di sini. Boleh lebih dari satu jawaban. Tidak peduli huruf besar/kecil. */
    answer: ['blubub'],
    title: 'Masukan Password 💖',
    hint: 'Panggilan sayang yang kata kamu nyebelin buat kamu, lima huruf aja 🤍',
    placeholder: 'Masukan password...',
    button: 'Masuk',

    /* Popup saat password salah */
    wrong: {
      title: 'PASSWORD SALAH!!! 😡',
      text: 'coba inget-inget lagi yaa 🥺',
      popupMs: 1400, // lama popup tampil sebelum jumpscare
    },

    /* >>> JUMPSCARE (SEMENTARA) <<<
       Sekarang memakai foto dari /assets tanpa suara.
       Untuk mengganti:
         - photo : ganti dengan kunci foto lain di daftar `photos` di atas (mis. "p03")
         - sound : isi path file suara, mis. "assets/audio/scream.mp3" (null = tanpa suara)
         - zoom  : seberapa besar foto membesar (1 = tidak zoom)                        */
    jumpscare: {
      photo: 'p11',
      zoom: 1.7,
      durationMs: 1600,
      sound: null,
    },
  },

  /* ---------- 2. Puzzle --------------------------------------------------- */
  puzzle: {
    photo: 'p09',
    title: 'Puzzle Time 💖',
    subtitle: 'Susun fotonya sampai bener yaa 🤍',
    shuffle: 'Shuffle',
    next: 'Next',
  },

  /* ---------- 3. Amplop --------------------------------------------------- */
  envelope: {
    title: 'Happy Birthday',
    hint: 'Click Amplop',
  },

  /* ---------- 4. Halaman sapaan (pengganti latar video ucapan) ------------ */
  greeting: {
    title: 'Happy Birthday',
    subtitle: 'hope this little surprise will make you happy ♡',
    button: 'Click Here',
    bgPhoto: 'p05', // foto yang di-blur sebagai latar
  },

  /* ---------- 5. Menu ----------------------------------------------------- */
  hub: {
    title: 'These are for you',
    labels: { message: 'Message', flower: 'Flower', cake: 'Cake' },
  },

  /* ---------- 6a. Message ------------------------------------------------- */
  message: {
    badge: '♡ A LITTLE MESSAGE',
    title: 'Just For You',
    subtitle:
      'Beberapa foto mungkin hanya menangkap satu detik, tapi setiap detiknya punya cerita yang selalu ingin aku simpan.',
    letterTitle: 'Untuk Sayangku cintaku manisku duniaku dan pastinya calon istriku kelak ♡',
    letter: [
      'happy birthday dedekk sayangg ♡',
      'Hari ini adalah hari yang sangat spesial, karena di tanggal inilah seseorang yang paling berarti dalam hidupku dilahirkan. Aku bersyukur sekali bisa mengenalmu, bisa jadi bagian dari perjalananmu, dan bisa menemanimu sampai hari ini. Semoga di usiamu yang sekarang, Allah selalu melimpahkan kesehatan, umur yang berkah, rezeki yang luas, hati yang tenang, serta segala doa dan harapan yang selama ini kamu simpan diam-diam dapat segera dikabulkan.',
      'Terima kasih sudah jadi perempuan yang selalu berusaha kuat, meskipun aku tahu tidak semua beban yang kamu pikul pernah kamu ceritakan. Terima kasih sudah bertahan sejauh ini, sudah sabar sama aku, dan sudah selalu bikin hariku terasa lebih ringan. Apa pun yang terjadi nanti, aku mau tetap di sini bareng kamu. I love you, selamat ulang tahun yaww sayang ♡',
    ],
    photos: ['p04', 'p02', 'p08', 'p07'], // 4 foto
    footer: 'every picture has a little piece of us ♡',
    back: '← Back',
    typingSpeedMs: 22,
  },

  /* ---------- 6b. Flower -------------------------------------------------- */
  flower: {
    label: 'Flower', // teks di bawah buket
    bubbles: [
      // 6 kalimat (kiri atas, kiri tengah, kiri bawah, kanan atas, kanan tengah, kanan bawah)
      'sayang banget aku sama kamu dekk',
      'blububb',
      'semoga semua impian kamu dan kita tercapai',
      'MBG, my bini guwehh',
      'be e be de u dul, bedull',
      'bahagia selalu yaaww sayang',
    ],
    back: 'Back',
  },

  /* ---------- 6c. Gallery (Cake) ------------------------------------------ */
  gallery: {
    title: 'Our Little Gallery',
    description:
      'Mungkin buat orang lain ini cuma kumpulan foto biasa. Tapi buat aku, setiap foto punya cerita kecilnya sendiri. Ada tawa, ada momen random, ada hal-hal sederhana yang justru bikin semuanya terasa spesial. Jadi aku simpan semuanya di sini, khusus buat kita. ❤️',
    /* urutan = nomor 01–10. Slot 01 besar, slot 06 lebar. */
    photos: ['p04', 'p02', 'p08', 'p10', 'p09', 'p06', 'p07', 'p05', 'p03', 'p01'],
    back: '← Kembali',
    next: 'Next →',
    footer: 'setiap foto punya cerita kecilnya sendiri 💌',
  },

  /* ---------- Chatbot (di halaman gallery) -------------------------------- */
  chatbot: {
    name: 'BlububBot ❤️',
    subtitle: 'aku punya beberapa pertanyaan buat kamu',
    avatar: 'B',
    startLabel: 'Yuk mulai ❤️',
    midLabel: 'Semangat yaa ❤️',
    doneLabel: 'Makasih yaa ❤️',
    placeholder: 'Tulis jawaban dedeekk...',
    send: 'Kirim',
    intro: [
      'Haiii ❤️ aku BlububBot.',
      'Aku dititipin sama bedul beberapa pertanyaan buat kamu hihi. Ada 10 pertanyaan, jawab semuanya dengan jujur yaaww 😊',
      'Tenang aja, gaa ada jawaban benar atau salah kok. Aku cuma pengen tau isi hati dedekk ajaa 💌',
    ],
    /* 10 pertanyaan */
    questions: [
      'Aku mulai dari yang gampang dulu yaaww hihi. Apa hal pertama yang bikin dedekk mulai suka sama aku? ❤️',
      'Dari semua momen yang pernah kita lewatin, momen mana yang paling dedekk inget sampai sekarang?',
      'Kalau kamu bisa ngulang satu hari bareng aku, hari yang mana yang bakal kamu pilih?',
      'Apa sih hal kecil dari aku yang diam-diam bikin dedekk senyum? 😳',
      'Ada gaa hal dari aku yang pengen dedekk ubah? Jujur aja yaaww 😆',
      'Lagu apa yang paling bikin dedekk keinget sama aku? 🎧',
      'Tempat mana yang pengen banget dedekk datengin bareng aku? ✈️',
      'Apa doa yang paling sering dedekk selipin buat kita? 🤲',
      'Kalau kamu boleh bilang satu hal ke bedul sekarang, kamu mau bilang apa? 💭',
      'Pertanyaan terakhir nih. Apa harapan dedekk buat kita di tahun depan? ✨',
    ],
    /* balasan bot setelah tiap jawaban (urutan sama dengan pertanyaan) */
    replies: [
      'Hehe makasih yaaww udah jujur sayang 🥹',
      'Wah, aku juga inget lagi sama momen itu 🥰',
      'Noted! Nanti kita ulang bareng-bareng yaa ✨',
      'Ih aku jadi salting dehh hihihi 😳',
      'Oke, aku catet yaww 😆',
      'Ohyaa sayangg? maaciw yaaww 🎶',
      'Aamiin, Nanti kita ke sana bareng-bareng yaaww 🤍',
      'Aamiin, aku juga selalu doain hal yang sama kokk 🤲',
      'Aku simpen baik-baik yaa kata-kata dedeekk 💌',
      'Aamiin, semoga semuanya terwujud yaaww sayangg 🤍',
    ],
    final:
      'Yeay, semua pertanyaannya udah kejawab 🎉 Makasih yaa udah jujur. Sekarang klik Next di bawah galeri, masih ada satu lagi buat kamu 🎧',
  },

  /* ---------- 7. Music ---------------------------------------------------- */
  music: {
    title: 'This song reminds me of you',
    songTitle: 'Selamat Ulang Tahun',
    songArtist: 'Jamrud',
    back: 'Back',
  },
};
