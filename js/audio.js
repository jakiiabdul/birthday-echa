/* ==========================================================================
   AUDIO MANAGER — satu manager global untuk seluruh website.

   - bgm       : song.mp3, background music, loop, mulai setelah interaksi pertama.
   - birthday  : birthday.mp3, khusus Song Page.
   Aturan: keduanya TIDAK PERNAH berbunyi bersamaan.
     * playBirthday()  -> bgm di-pause (posisi tersimpan), birthday diputar.
     * pauseBirthday() / birthday selesai -> birthday berhenti, bgm lanjut
       dari posisi terakhir (tidak restart ke 0:00).
   Pengaturan (path & volume) ada di js/config.js -> CONFIG.audio
   ========================================================================== */
(function () {
  "use strict";

  const A = window.CONFIG.audio;

  const bgm = new Audio(A.bgm);
  bgm.loop = true;
  bgm.preload = "auto";
  bgm.volume = A.bgmVolume;

  const birthday = new Audio(A.birthday);
  birthday.loop = false;
  birthday.preload = "auto";
  birthday.volume = A.birthdayVolume;

  let started = false;        // bgm sudah pernah diizinkan mulai (setelah interaksi)
  let birthdayActive = false; // birthday sedang berperan (diputar / dalam proses putar)
  let retryBound = false;

  /* Bgm boleh berbunyi hanya jika sudah start dan birthday tidak aktif */
  function syncBgm() {
    if (!started) return;
    if (birthdayActive) {
      if (!bgm.paused) bgm.pause();
    } else if (bgm.paused) {
      const p = bgm.play();
      if (p && p.catch) p.catch(bindRetry);
    }
  }

  /* Jika browser menolak autoplay, coba lagi pada interaksi berikutnya */
  function bindRetry() {
    if (retryBound) return;
    retryBound = true;
    const retry = () => {
      retryBound = false;
      ["pointerdown", "keydown", "touchend"].forEach((e) => document.removeEventListener(e, retry, true));
      syncBgm();
    };
    ["pointerdown", "keydown", "touchend"].forEach((e) => document.addEventListener(e, retry, true));
  }

  /* Pengaman: apa pun yang terjadi, dua audio tidak boleh aktif bersamaan */
  bgm.addEventListener("play", () => { if (birthdayActive) bgm.pause(); });
  birthday.addEventListener("play", () => { if (!bgm.paused) bgm.pause(); });

  birthday.addEventListener("ended", () => {
    birthday.currentTime = 0;
    birthdayActive = false;
    syncBgm();
  });

  window.AudioManager = {
    bgm,
    birthday,

    /* Dipanggil saat interaksi pertama (password benar) */
    startBgm() {
      started = true;
      syncBgm();
    },

    playBirthday() {
      birthdayActive = true;
      bgm.pause();                       // posisi bgm tersimpan di bgm.currentTime
      const p = birthday.play();
      if (p && p.catch) p.catch(() => { birthdayActive = false; syncBgm(); });
      return p;
    },

    /* Pause/stop birthday lalu lanjutkan bgm dari posisi terakhir */
    pauseBirthday() {
      birthday.pause();
      birthdayActive = false;
      syncBgm();
    },

    toggleBirthday() {
      if (birthday.paused) this.playBirthday(); else this.pauseBirthday();
    },

    get birthdayPlaying() { return !birthday.paused; }
  };
})();
