/* ==========================================================================
   MAIN — navigasi, password, puzzle, amplop, message, flower, gallery,
   chatbot, dan musik. Semua teks/foto diambil dari js/config.js
   ========================================================================== */
(function () {
  "use strict";

  const C = window.CONFIG;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const get = (o, p) => p.split(".").reduce((a, k) => (a == null ? a : a[k]), o);

  const photoSrc = (key) => C.paths.photos + C.photos[key].file;
  const photoPos = (key) => C.photos[key].pos || "50% 50%";

  /* Foto dengan crop, selotip, dan nomor (dipakai message & gallery) */
  function photoBox(key, num) {
    const p = C.photos[key];
    const box = document.createElement("div");
    box.className = "ph" + (p.rot ? " rot" : "");
    if (p.rot) box.style.setProperty("--rot", p.rot + "deg");
    const img = document.createElement("img");
    img.src = photoSrc(key);
    img.alt = "Foto " + (num || "");
    img.decoding = "async";
    img.style.objectPosition = p.pos || "50% 50%";
    box.appendChild(img);
    const tape = document.createElement("i");
    tape.className = "tape";
    box.appendChild(tape);
    if (num) {
      const n = document.createElement("span");
      n.className = "num";
      n.textContent = String(num).padStart(2, "0");
      box.appendChild(n);
    }
    return box;
  }

  /* ---------- Binding teks & dekorasi dari config ---------- */
  $$("[data-t]").forEach((el) => { el.textContent = get(C, el.dataset.t) ?? ""; });
  $$("[data-decor]").forEach((el) => { el.src = C.paths.decor + el.dataset.decor + ".png"; });
  $("#pwInput").placeholder = C.password.placeholder;
  document.title = C.envelope.title;

  /* ---------- Sparkle latar ---------- */
  $$(".screen").forEach((scr) => {
    const wrap = document.createElement("div");
    wrap.className = "sparkles";
    for (let i = 0; i < 9; i++) {
      const s = document.createElement("img");
      s.src = C.paths.decor + "sparkle.png";
      s.alt = "";
      const size = 9 + Math.random() * 14;
      s.style.cssText = `left:${Math.random() * 96}%;top:${Math.random() * 92}%;width:${size}px;animation-delay:${(Math.random() * 3.6).toFixed(2)}s;animation-duration:${(2.8 + Math.random() * 2.4).toFixed(2)}s`;
      wrap.appendChild(s);
    }
    scr.insertBefore(wrap, scr.firstChild);
  });

  /* ==========================================================================
     NAVIGASI
     ========================================================================== */
  let current = "password";
  let locked = false;
  const veil = $("#veil");
  const hooks = { enter: {}, leave: {} };

  function show(name) {
    const from = $("#" + current), to = $("#" + name);
    if (hooks.leave[current]) hooks.leave[current]();
    from.classList.remove("active");
    to.classList.add("active");
    to.scrollTop = 0;
    current = name;
    if (hooks.enter[name]) hooks.enter[name]();
  }

  function go(name, opts) {
    if (locked || name === current || !$("#" + name)) return;
    locked = true;
    if (opts && opts.veil) {
      veil.classList.add("on");
      setTimeout(() => {
        show(name);
        veil.classList.remove("on");
        setTimeout(() => (locked = false), 700);
      }, 750);
    } else {
      show(name);
      setTimeout(() => (locked = false), 700);
    }
  }

  $$("[data-go]").forEach((b) => b.addEventListener("click", () => go(b.dataset.go)));

  /* ==========================================================================
     1. PASSWORD + JUMPSCARE
     ========================================================================== */
  const pwForm = $("#pwForm"), pwInput = $("#pwInput"), pwScreen = $("#password");
  let pwBusy = false;

  const jump = $("#jump"), jumpImg = $("#jumpImg");
  const jc = C.password.jumpscare;
  jumpImg.style.backgroundImage = `url("${photoSrc(jc.photo)}")`;
  jumpImg.style.backgroundPosition = photoPos(jc.photo);
  jump.style.setProperty("--jd", jc.durationMs + "ms");
  jump.style.setProperty("--jz", jc.zoom);
  const jumpAudio = jc.sound ? new Audio(jc.sound) : null;

  async function wrongPassword() {
    pwBusy = true;
    pwInput.blur();
    pwScreen.classList.add("wrong");
    await wait(C.password.wrong.popupMs);
    jump.classList.add("on");
    if (jumpAudio) { jumpAudio.currentTime = 0; jumpAudio.play().catch(() => {}); }
    await wait(jc.durationMs);
    jump.classList.remove("on");
    if (jumpAudio) jumpAudio.pause();
    pwScreen.classList.remove("wrong");
    pwInput.value = "";
    pwBusy = false;
    pwInput.focus({ preventScroll: true });
  }

  pwForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (pwBusy || locked) return;
    const v = pwInput.value.trim().toLowerCase();
    if (!v) { pwForm.classList.remove("shake"); void pwForm.offsetWidth; pwForm.classList.add("shake"); return; }
    const answers = [].concat(C.password.answer).map((a) => String(a).trim().toLowerCase());
    if (answers.includes(v)) {
      pwInput.blur();
      window.AudioManager.startBgm();   // interaksi pertama -> mulai background music
      go("puzzle");
    } else {
      wrongPassword();
    }
  });

  /* ==========================================================================
     2. PUZZLE GESER 3x3
     ========================================================================== */
  const board = $("#pzBoard");
  const N = 3, TOTAL = 9;
  let cells = [];            // cells[posisi] = index tile (8 = kosong)
  const tiles = [];          // elemen tile berdasarkan index

  (function buildPuzzle() {
    const url = `url("${photoSrc(C.puzzle.photo)}")`;
    for (let t = 0; t < TOTAL; t++) {
      const cell = document.createElement("div");
      cell.className = "pz-cell" + (t === TOTAL - 1 ? " blank" : "");
      const tile = document.createElement("div");
      tile.className = "pz-tile";
      const inner = document.createElement("i");
      inner.style.setProperty("--c", t % N);
      inner.style.setProperty("--r", Math.floor(t / N));
      inner.style.backgroundImage = url;
      inner.style.backgroundPosition = photoPos(C.puzzle.photo);
      tile.appendChild(inner);
      cell.appendChild(tile);
      cell.addEventListener("click", () => tapTile(t));
      board.appendChild(cell);
      tiles.push(cell);
    }
  })();

  function render() {
    cells.forEach((t, pos) => {
      tiles[t].style.left = (pos % N) * (100 / N) + "%";
      tiles[t].style.top = Math.floor(pos / N) * (100 / N) + "%";
    });
    tiles[TOTAL - 1].classList.toggle("solved", isSolved());
  }
  const isSolved = () => cells.every((t, i) => t === i);

  function neighbors(pos) {
    const r = Math.floor(pos / N), c = pos % N, out = [];
    if (r > 0) out.push(pos - N);
    if (r < N - 1) out.push(pos + N);
    if (c > 0) out.push(pos - 1);
    if (c < N - 1) out.push(pos + 1);
    return out;
  }

  function tapTile(t) {
    if (t === TOTAL - 1) return;
    const pos = cells.indexOf(t), blank = cells.indexOf(TOTAL - 1);
    if (!neighbors(pos).includes(blank)) return;
    cells[blank] = t;
    cells[pos] = TOTAL - 1;
    render();
  }

  function shuffle() {
    cells = Array.from({ length: TOTAL }, (_, i) => i);
    let blank = TOTAL - 1, last = -1;
    for (let i = 0; i < 90 || isSolved(); i++) {
      const opts = neighbors(blank).filter((p) => p !== last);
      const next = opts[Math.floor(Math.random() * opts.length)];
      cells[blank] = cells[next];
      cells[next] = TOTAL - 1;
      last = blank;
      blank = next;
    }
    render();
  }
  $("#pzShuffle").addEventListener("click", shuffle);
  shuffle();

  /* ==========================================================================
     3. AMPLOP  →  4. SAPAAN  →  5. MENU
     ========================================================================== */
  const envBtn = $("#envBtn"), envScreen = $("#envelope");
  envBtn.addEventListener("click", () => {
    if (locked) return;
    envBtn.classList.add("opening");
    envScreen.classList.add("opening");
    setTimeout(() => go("greeting"), 550);
  });
  hooks.leave.envelope = () => setTimeout(() => {
    envBtn.classList.remove("opening");
    envScreen.classList.remove("opening");
  }, 800);

  $("#grBg").style.backgroundImage = `url("${photoSrc(C.greeting.bgPhoto)}")`;
  $("#grBtn").addEventListener("click", () => go("hub", { veil: true }));

  /* ==========================================================================
     6a. MESSAGE (foto + efek ketik)
     ========================================================================== */
  const msgPhotos = $("#msgPhotos");
  C.message.photos.forEach((k, i) => msgPhotos.appendChild(photoBox(k, i + 1)));

  const msgText = $("#msgText");
  let typeToken = 0;

  function typeLetter() {
    const token = ++typeToken;
    msgText.innerHTML = "";
    const parts = C.message.letter.map((txt) => {
      const p = document.createElement("p");
      const typed = document.createElement("span");
      const ghost = document.createElement("span");
      ghost.className = "g";
      ghost.textContent = txt;
      p.append(typed, ghost);
      msgText.appendChild(p);
      return { typed, ghost, txt, i: 0 };
    });
    const cursor = document.createElement("span");
    cursor.className = "cursor";
    let idx = 0;
    (function tick() {
      if (token !== typeToken) return;
      const part = parts[idx];
      if (!part) { cursor.remove(); return; }
      if (part.i < part.txt.length) {
        part.i += 1;
        part.typed.textContent = part.txt.slice(0, part.i);
        part.ghost.textContent = part.txt.slice(part.i);
        part.typed.after(cursor);
        setTimeout(tick, C.message.typingSpeedMs);
      } else {
        idx++;
        setTimeout(tick, 260);
      }
    })();
  }
  hooks.enter.message = () => setTimeout(typeLetter, 500);
  hooks.leave.message = () => { typeToken++; };

  /* ==========================================================================
     6b. FLOWER
     ========================================================================== */
  const flBubbles = $("#flBubbles");
  C.flower.bubbles.forEach((txt, i) => {
    const b = document.createElement("div");
    b.className = "fl-bubble";
    b.style.setProperty("--i", i);
    b.textContent = txt;
    flBubbles.appendChild(b);
  });

  /* ==========================================================================
     6c. GALLERY + CHATBOT
     ========================================================================== */
  const gaGrid = $("#gaGrid");
  C.gallery.photos.forEach((k, i) => {
    const box = photoBox(k, i + 1);
    box.style.setProperty("--i", i);
    gaGrid.appendChild(box);
  });

  const chat = $("#chat"), chatMsgs = $("#chatMsgs"), chatInput = $("#chatInput"), chatSend = $("#chatSend");
  const cb = C.chatbot, TOTAL_Q = cb.questions.length;
  $("#chatAvatar").textContent = cb.avatar;
  $("#chatName").textContent = cb.name;
  $("#chatSub").textContent = cb.subtitle;
  $("#chatLabel").textContent = cb.startLabel;
  $("#chatCount").textContent = "0/" + TOTAL_Q;
  chatInput.placeholder = cb.placeholder;
  chatSend.textContent = cb.send;

  let chatStarted = false, chatStep = 0, chatBusy = true, chatToken = 0;

  function addBubble(text, who) {
    const b = document.createElement("div");
    b.className = "bubble " + who;
    b.textContent = text;
    chatMsgs.appendChild(b);
    chatMsgs.scrollTop = chatMsgs.scrollHeight;
    return b;
  }
  async function botSay(text, token) {
    const t = document.createElement("div");
    t.className = "bubble bot typing";
    t.innerHTML = "<i></i><i></i><i></i>";
    chatMsgs.appendChild(t);
    chatMsgs.scrollTop = chatMsgs.scrollHeight;
    await wait(650 + Math.min(text.length * 8, 700));
    t.remove();
    if (token !== chatToken) return;
    addBubble(text, "bot");
  }
  function setProgress(n) {
    $("#chatCount").textContent = n + "/" + TOTAL_Q;
    $("#chatFill").style.width = (n / TOTAL_Q) * 100 + "%";
    $("#chatLabel").textContent = n === 0 ? cb.startLabel : n >= TOTAL_Q ? cb.doneLabel : cb.midLabel;
  }
  async function askQuestion() {
    const token = chatToken;
    await botSay(`Pertanyaan ${chatStep + 1} dari ${TOTAL_Q}\n\n${cb.questions[chatStep]}`, token);
    chatBusy = false;
    chatInput.disabled = false; chatSend.disabled = false;
    chatInput.focus({ preventScroll: true });
  }
  async function startChat() {
    chatStarted = true;
    chatBusy = true;
    chatInput.disabled = true; chatSend.disabled = true;
    const token = chatToken;
    for (const line of cb.intro) await botSay(line, token);
    if (token === chatToken) await askQuestion();
  }
  /* Simpan jawaban ke Google Sheets (fire-and-forget; kegagalan tidak mengganggu UI).
     Request dibuat sebagai "simple request" supaya browser TIDAK mengirim preflight
     (Apps Script tidak menjawab OPTIONS): method POST, tanpa header custom,
     Content-Type text/plain, mode no-cors. Isi body tetap JSON.stringify({no,question,answer}).

     LOGGING SEMENTARA: semua log berawalan "[chatbot]" dan tampil di Console (F12).
     Untuk mematikan: ubah CHAT_DEBUG di bawah menjadi false (atau hapus baris log). */
  const CHAT_DEBUG = true;
  const clog = (...a) => { if (CHAT_DEBUG) console.log("[chatbot]", ...a); };
  const cwarn = (...a) => { if (CHAT_DEBUG) console.warn("[chatbot]", ...a); };
  const chatEndpoint = () =>
    String(C.CHATBOT_ENDPOINT || (C.chatbot && (C.chatbot.CHATBOT_ENDPOINT || C.chatbot.endpoint)) || "").trim();
  clog("main.js dimuat (build save-v3). CHATBOT_ENDPOINT =", chatEndpoint() || "(kosong)");

  function saveAnswer(no, question, answer) {
    clog("saveAnswer() dipanggil #" + no);
    const url = chatEndpoint();
    clog("endpoint:", url || "(kosong)");
    if (!/^https?:\/\//i.test(url)) {
      cwarn("BERHENTI sebelum fetch: CHATBOT_ENDPOINT belum berisi URL http(s). Isi di js/config.js");
      return;
    }
    const payload = { no: no, question: question, answer: answer };
    const body = JSON.stringify(payload);
    clog("payload:", body);
    try {
      clog("fetch POST dikirim ...");
      fetch(url, {
        method: "POST",
        mode: "no-cors",                                     // simple request: tanpa preflight
        credentials: "omit",
        redirect: "follow",                                  // Apps Script membalas 302 setelah doPost dijalankan
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: body
      }).then(
        (res) => clog("fetch BERHASIL #" + no + " (response opaque: type=" + res.type + ", status=" + res.status + " — normal untuk no-cors; cek Sheet/Executions)"),
        (err) => cwarn("fetch GAGAL #" + no + ":", err)
      );
    } catch (err) {
      cwarn("fetch melempar error sebelum terkirim #" + no + ":", err);
    }
  }

  $("#chatForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const v = chatInput.value.trim();
    if (!v || chatBusy) return;
    chatBusy = true;
    chatInput.value = "";
    chatInput.disabled = true; chatSend.disabled = true;
    addBubble(v, "me");
    saveAnswer(chatStep + 1, cb.questions[chatStep], v);
    chatStep++;
    setProgress(chatStep);
    const token = chatToken;
    await botSay(cb.replies[chatStep - 1] || "", token);
    if (chatStep < TOTAL_Q) {
      await askQuestion();
    } else {
      await botSay(cb.final, token);
      chatInput.placeholder = cb.doneLabel;
    }
  });

  function openChat() {
    chat.classList.add("open");
    $(".chat-dot").style.display = "none";
    if (!chatStarted) startChat();
  }
  $("#chatFab").addEventListener("click", openChat);
  $("#chatClose").addEventListener("click", () => chat.classList.remove("open"));

  hooks.enter.gallery = () => setTimeout(() => chat.classList.add("show"), 900);
  hooks.leave.gallery = () => { chat.classList.remove("show"); };

  /* ==========================================================================
     7. MUSIC
     ========================================================================== */
  const AM = window.AudioManager;
  const audio = AM.birthday;        // player Song Page = birthday.mp3
  const vinyl = $("#muVinyl"), muIcon = $("#muIcon"), muFill = $("#muFill");
  const fmt = (s) => (isFinite(s) ? Math.floor(s / 60) + ":" + String(Math.floor(s % 60)).padStart(2, "0") : "0:00");

  function syncPlayUI() {
    const playing = !audio.paused;
    vinyl.classList.toggle("playing", playing);
    muIcon.textContent = playing ? "❚❚" : "▶";
  }
  audio.addEventListener("play", syncPlayUI);
  audio.addEventListener("pause", syncPlayUI);
  audio.addEventListener("ended", () => { syncPlayUI(); muFill.style.width = "0"; $("#muCur").textContent = "0:00"; });
  const setDur = () => { $("#muDur").textContent = fmt(audio.duration); };
  audio.addEventListener("loadedmetadata", setDur);
  if (audio.readyState >= 1) setDur();
  audio.addEventListener("timeupdate", () => {
    $("#muCur").textContent = fmt(audio.currentTime);
    if (audio.duration) muFill.style.width = (audio.currentTime / audio.duration) * 100 + "%";
  });
  $("#muPlay").addEventListener("click", () => AM.toggleBirthday());
  /* Meninggalkan Song Page: birthday dijeda, bgm lanjut dari posisi terakhir */
  hooks.leave.music = () => { AM.pauseBirthday(); };
})();
