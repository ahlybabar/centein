/**
 * ============================================================
 * CINEMATIC LOVE LETTER — INTERACTIVE EXPERIENCE
 * ============================================================
 * Edit the configuration below to personalize her experience.
 */

const CONFIG = {
  // --- Personal Information ---
  herName: "Centein", // Her name
  yourName: "Ahly", // Your name

  // --- Letter Content (paragraphs reveal sequentially) ---
  letterParagraphs: [
    "From the moment our paths crossed, the world seemed to arrange itself around your laughter. You turned ordinary days into stories worth keeping, and silence into something safe and warm.",
    "There is a calm in knowing you are my home. Whatever roads we wander, however the seasons change, my favorite place has always been beside you.",
    "I made this letter because words on paper can be kept in a drawer for fifty years, read by candlelight when our hair is silver and our memories are long. I want this promise to live with you forever.",
    "You are the dream I never knew to ask for, and the reality I will spend the rest of my life cherishing. I choose you, every morning, in every life, without hesitation.",
    "Thank you for being my anchor, my partner, and the love of my life."
  ],

  // --- Voice Memos ---
  memos: [
    {
      id: 1,
      src: "assets/to my future wife.m4a",
      title: "Audio #1",
      label: "A memory from that autumn evening"
    },
    {
      id: 2,
      src: "assets/to my future wife (2) (1).m4a",
      title: "Audio #2",
      label: "What I whisper before you fall asleep"
    }
  ],

  // --- Optional Photos (1–3 photo paths, or leave empty []) ---
  photos: [
    // { src: "assets/photo-1.jpg", caption: "Our first trip together" },
    // { src: "assets/photo-2.jpg", caption: "Under the harbor lights" }
  ],

  // --- Closing text ---
  closingLine: "I love you — always have, always will."
};

/* ============================================================
   INITIALIZATION & PLACEHOLDER HYDRATION
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  hydrateContent();
  initParticleSystem();
  initIntroSequence();
  initEnvelopeInteraction();
  initAudioPlayers();
  initClosingReplay();
});

/**
 * Replaces template placeholders with configured text
 */
function hydrateContent() {
  const herNameElements = document.querySelectorAll("#her-name-text, #letter-salutation");
  const introFrom = document.getElementById("intro-from");
  const signature = document.querySelector(".letter-signature");
  const letterBody = document.getElementById("letter-body");
  const closingLine = document.getElementById("closing-line");

  // Salutation & Intro
  if (document.getElementById("her-name-text")) {
    document.getElementById("her-name-text").textContent = CONFIG.herName;
  }
  if (document.getElementById("letter-salutation")) {
    document.getElementById("letter-salutation").textContent = `My Dearest ${CONFIG.herName},`;
  }
  if (introFrom) {
    introFrom.textContent = `from ${CONFIG.yourName}`;
  }
  if (signature) {
    signature.textContent = CONFIG.yourName;
  }
  if (closingLine && CONFIG.closingLine) {
    closingLine.textContent = CONFIG.closingLine;
  }

  // Voice memo titles
  CONFIG.memos.forEach((memo, idx) => {
    const memoEl = document.getElementById(`voice-memo-${idx + 1}`);
    if (memoEl) {
      const titleEl = memoEl.querySelector(".memo-title");
      if (titleEl && memo.title) titleEl.textContent = memo.title;
      const audioEl = document.getElementById(`audio-${idx + 1}`);
      if (audioEl && memo.src) audioEl.src = memo.src;
    }
  });

  // Paragraphs
  if (letterBody && CONFIG.letterParagraphs.length > 0) {
    letterBody.innerHTML = "";
    CONFIG.letterParagraphs.forEach((paraText) => {
      const p = document.createElement("p");
      p.className = "letter-paragraph";
      p.textContent = paraText;
      letterBody.appendChild(p);
    });
  }

  // Keepsake photos (optional)
  const photosSection = document.getElementById("keepsake-photos-section");
  const photosGrid = document.getElementById("keepsake-photos-grid");
  if (photosSection && photosGrid && CONFIG.photos && CONFIG.photos.length > 0) {
    photosSection.style.display = "block";
    photosGrid.innerHTML = "";
    CONFIG.photos.forEach((photo) => {
      const card = document.createElement("div");
      card.className = "keepsake-polaroid";
      card.innerHTML = `
        <img src="${photo.src}" alt="${photo.caption || 'Memory'}" loading="lazy" />
        ${photo.caption ? `<div class="keepsake-caption">${photo.caption}</div>` : ""}
      `;
      photosGrid.appendChild(card);
    });
  }
}

/* ============================================================
   AMBIENT PARTICLE CANVAS (STARDUST & BOKEH)
   ============================================================ */
function initParticleSystem() {
  const canvas = document.getElementById("particles-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Determine particle density based on screen dimensions
  const count = Math.min(Math.floor((width * height) / 14000), 75);
  const particles = [];

  class Particle {
    constructor() {
      this.reset(true);
    }
    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 10;
      this.size = Math.random() * 2.2 + 0.8;
      this.speedY = -(Math.random() * 0.45 + 0.15);
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.alpha = Math.random() * 0.5 + 0.15;
      this.targetAlpha = this.alpha;
      this.pulseSpeed = Math.random() * 0.02 + 0.008;
      // Warm candle gold, starlight ivory, or soft rose
      const colors = ["212, 166, 86", "245, 234, 214", "232, 196, 184", "255, 240, 200"];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    update() {
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.y * 0.008) * 0.2;
      this.alpha += Math.sin(Date.now() * this.pulseSpeed * 0.05) * 0.01;
      if (this.y < -10 || this.x < -10 || this.x > width + 10) {
        this.reset(false);
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${Math.max(0, Math.min(1, this.alpha))})`;
      ctx.shadowBlur = this.size * 5;
      ctx.shadowColor = `rgba(212, 166, 86, 0.4)`;
      ctx.fill();
    }
  }

  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

/* ============================================================
   SCENE 1: INTRO SEQUENCE
   ============================================================ */
function initIntroSequence() {
  const introPretext = document.getElementById("intro-pretext");
  const herNameEl = document.getElementById("her-name-text");
  const introLabel = document.querySelector(".intro-label");
  const introFrom = document.getElementById("intro-from");
  const sceneIntro = document.getElementById("scene-intro");
  const sceneEnvelope = document.getElementById("scene-envelope");

  // Wrap each letter of her name in a span for individual staggered reveal
  if (herNameEl) {
    const rawText = herNameEl.textContent.trim();
    herNameEl.innerHTML = "";
    [...rawText].forEach((char) => {
      const span = document.createElement("span");
      span.className = "char";
      span.textContent = char === " " ? "\u00A0" : char;
      herNameEl.appendChild(span);
    });
  }

  // Animation timeline using GSAP if available, otherwise gentle fallback
  if (window.gsap) {
    const tl = gsap.timeline({
      defaults: { ease: "power2.out" }
    });

    tl.to(introPretext, { opacity: 0.85, y: 0, duration: 1.2, delay: 0.4 })
      .to(introLabel, { opacity: 0.7, duration: 0.8 }, "-=0.4")
      .to(herNameEl, { opacity: 1, duration: 0.1 }, "-=0.4")
      .to(
        "#her-name-text .char",
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 1.0,
          ease: "back.out(1.4)"
        },
        "-=0.2"
      )
      .to(introFrom, { opacity: 0.6, y: 0, duration: 1.0 }, "+=0.3")
      // Linger on the intro
      .to({}, { duration: 2.2 })
      // Transition from Scene 1 to Scene 2 (The Envelope)
      .to(sceneIntro, {
        opacity: 0,
        scale: 0.96,
        duration: 1.4,
        ease: "power2.inOut",
        onComplete: () => {
          sceneIntro.classList.remove("active");
          sceneEnvelope.classList.add("active");
          revealEnvelopePrompt();
        }
      });
  } else {
    // Fallback if GSAP is unavailable
    setTimeout(() => {
      sceneIntro.classList.remove("active");
      sceneEnvelope.classList.add("active");
      revealEnvelopePrompt();
    }, 4500);
  }
}

function revealEnvelopePrompt() {
  const prompt = document.getElementById("envelope-prompt");
  if (prompt) {
    prompt.style.transition = "opacity 1.5s ease";
    prompt.style.opacity = "0.7";
  }
}

/* ============================================================
   SCENE 2: ENVELOPE OPENING ANIMATION
   ============================================================ */
function initEnvelopeInteraction() {
  const envelope = document.getElementById("envelope");
  const seal = document.getElementById("wax-seal");
  const flap = document.getElementById("envelope-flap");
  const letterInside = document.getElementById("envelope-letter-inside");
  const prompt = document.getElementById("envelope-prompt");
  const sceneEnvelope = document.getElementById("scene-envelope");
  const sceneLetter = document.getElementById("scene-letter");

  let isOpening = false;

  const triggerOpen = () => {
    if (isOpening) return;
    isOpening = true;

    // Remove idle animation immediately
    envelope.style.animation = "none";
    if (prompt) prompt.style.opacity = "0";

    // Play subtle audio chime / haptic if available
    tryHapticFeedback();

    if (window.gsap) {
      const openTl = gsap.timeline();

      // 1. Seal cracks & breaks
      openTl
        .to(".wax-crack-left, .wax-crack-right", {
          opacity: 1,
          height: "24px",
          duration: 0.4,
          ease: "power2.out"
        })
        .to(seal, {
          scale: 1.15,
          duration: 0.25,
          ease: "power1.out"
        })
        .to(seal, {
          scale: 0.8,
          opacity: 0,
          y: 15,
          duration: 0.5,
          ease: "power2.in"
        })
        // 2. Flap opens upward in 3D
        .to(
          flap,
          {
            rotateX: 180,
            duration: 1.1,
            ease: "power2.inOut"
          },
          "-=0.2"
        )
        // 3. Letter peeks out and slides upward
        .to(
          letterInside,
          {
            y: -80,
            duration: 0.9,
            ease: "power2.out"
          },
          "-=0.5"
        )
        // 4. Burst of gentle golden particles from the envelope
        .call(() => burstHeartsAndSparks(envelope))
        // 5. Cinematic zoom push-in into the letter scene
        .to(
          "#envelope-wrapper",
          {
            scale: 1.25,
            opacity: 0,
            y: 40,
            duration: 1.2,
            ease: "power3.inOut"
          },
          "+=0.2"
        )
        .call(() => {
          sceneEnvelope.classList.remove("active");
          sceneLetter.classList.add("active");
          revealLetterContent();
        });
    } else {
      // Basic fallback
      seal.style.opacity = "0";
      setTimeout(() => {
        sceneEnvelope.classList.remove("active");
        sceneLetter.classList.add("active");
        revealLetterContent();
      }, 1000);
    }
  };

  envelope.addEventListener("click", triggerOpen);
  envelope.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      triggerOpen();
    }
  });
}

/**
 * Burst of romantic light particles upon seal opening
 */
function burstHeartsAndSparks(anchorEl) {
  const rect = anchorEl.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const burstCount = 18;
  for (let i = 0; i < burstCount; i++) {
    const el = document.createElement("div");
    const isHeart = Math.random() > 0.4;
    el.textContent = isHeart ? "♡" : "✦";
    el.style.position = "fixed";
    el.style.left = `${centerX}px`;
    el.style.top = `${centerY}px`;
    el.style.pointerEvents = "none";
    el.style.zIndex = "9999";
    el.style.fontSize = `${Math.random() * 14 + 12}px`;
    el.style.color = isHeart ? "var(--heart-pink)" : "var(--gold-light)";
    el.style.opacity = "1";
    document.body.appendChild(el);

    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 120 + 40;
    const destX = centerX + Math.cos(angle) * distance;
    const destY = centerY + Math.sin(angle) * distance - 30;

    if (window.gsap) {
      gsap.to(el, {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance - 40,
        opacity: 0,
        scale: Math.random() * 0.6 + 0.8,
        rotation: Math.random() * 40 - 20,
        duration: Math.random() * 0.8 + 0.8,
        ease: "power2.out",
        onComplete: () => el.remove()
      });
    } else {
      setTimeout(() => el.remove(), 1200);
    }
  }
}

function tryHapticFeedback() {
  if (navigator.vibrate) {
    try {
      navigator.vibrate([30, 40, 40]);
    } catch (_) { }
  }
}

/* ============================================================
   SCENE 3: LETTER REVEAL & SEQUENTIAL READING
   ============================================================ */
function revealLetterContent() {
  const salutation = document.getElementById("letter-salutation");
  const paragraphs = document.querySelectorAll(".letter-paragraph");
  const closing = document.querySelector(".letter-closing");
  const signature = document.querySelector(".letter-signature");
  const footerOrnament = document.querySelector(".letter-footer .letter-ornament");
  const memosSection = document.getElementById("voice-memos-section");
  const closingSection = document.getElementById("closing-section");

  if (window.gsap) {
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    tl.to(salutation, { opacity: 1, duration: 1.2, delay: 0.3 })
      .to(
        paragraphs,
        {
          opacity: 1,
          y: 0,
          stagger: 0.65,
          duration: 1.1
        },
        "-=0.4"
      )
      .to(closing, { opacity: 1, duration: 0.9 }, "+=0.2")
      .to(signature, { opacity: 1, duration: 1.1 }, "-=0.3")
      .to(footerOrnament, { opacity: 0.5, duration: 0.8 }, "-=0.5");

    const photosSection = document.getElementById("keepsake-photos-section");
    if (photosSection && photosSection.style.display !== "none") {
      tl.to(photosSection, { opacity: 1, y: 0, duration: 1.0 }, "+=0.2");
    }

    tl.to(memosSection, { opacity: 1, y: 0, duration: 1.2 }, "+=0.4")
      .to(closingSection, { opacity: 1, y: 0, duration: 1.2 }, "+=0.2");
  } else {
    // Fallback
    salutation.style.opacity = "1";
    paragraphs.forEach((p) => {
      p.style.opacity = "1";
      p.style.transform = "translateY(0)";
    });
    if (closing) closing.style.opacity = "1";
    if (signature) signature.style.opacity = "1";
    const photosSection = document.getElementById("keepsake-photos-section");
    if (photosSection) {
      photosSection.style.opacity = "1";
      photosSection.style.transform = "translateY(0)";
    }
    if (memosSection) memosSection.style.opacity = "1";
    if (closingSection) closingSection.style.opacity = "1";
  }
}

/* ============================================================
   CUSTOM AUDIO PLAYERS (VOICE MEMOS)
   ============================================================ */
function initAudioPlayers() {
  const players = [
    {
      card: document.getElementById("voice-memo-1"),
      audio: document.getElementById("audio-1"),
      btn: document.getElementById("play-btn-1"),
      canvas: document.getElementById("waveform-1"),
      progress: document.getElementById("progress-fill-1"),
      bar: document.getElementById("progress-bar-1"),
      time: document.getElementById("memo-time-1")
    },
    {
      card: document.getElementById("voice-memo-2"),
      audio: document.getElementById("audio-2"),
      btn: document.getElementById("play-btn-2"),
      canvas: document.getElementById("waveform-2"),
      progress: document.getElementById("progress-fill-2"),
      bar: document.getElementById("progress-bar-2"),
      time: document.getElementById("memo-time-2")
    }
  ];

  players.forEach((p, index) => {
    if (!p.audio || !p.btn) return;

    // Draw static initial waveform
    initWaveformCanvas(p.canvas);

    // Play/Pause toggle
    p.btn.addEventListener("click", () => {
      // Pause other players
      players.forEach((other, otherIdx) => {
        if (otherIdx !== index && !other.audio.paused) {
          other.audio.pause();
          other.card.classList.remove("playing");
        }
      });

      if (p.audio.paused) {
        const playPromise = p.audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              p.card.classList.add("playing");
              startWaveformAnimation(p.canvas, p.audio);
            })
            .catch(() => {
              // If audio file doesn't exist yet or is blocked, simulate playback
              simulateMemoPlayback(p);
            });
        }
      } else {
        p.audio.pause();
        p.card.classList.remove("playing");
      }
    });

    // Time update & progress
    p.audio.addEventListener("timeupdate", () => {
      if (!p.audio.duration) return;
      const pct = (p.audio.currentTime / p.audio.duration) * 100;
      p.progress.style.width = `${pct}%`;
      p.time.textContent = formatTime(p.audio.currentTime);
    });

    p.audio.addEventListener("loadedmetadata", () => {
      p.time.textContent = formatTime(p.audio.duration);
    });

    p.audio.addEventListener("ended", () => {
      p.card.classList.remove("playing");
      p.progress.style.width = "0%";
      p.audio.currentTime = 0;
      p.time.textContent = formatTime(p.audio.duration || 0);
    });

    // Progress bar scrubbing
    if (p.bar) {
      p.bar.addEventListener("click", (e) => {
        const rect = p.bar.getBoundingClientRect();
        const clickPos = (e.clientX - rect.left) / rect.width;
        if (p.audio.duration) {
          p.audio.currentTime = clickPos * p.audio.duration;
        }
      });
    }
  });
}

/**
 * Renders static or animated audio waveform bars
 */
function initWaveformCanvas(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  canvas.width = (rect.width || 240) * dpr;
  canvas.height = (rect.height || 30) * dpr;
  ctx.scale(dpr, dpr);

  drawStaticWaveform(ctx, rect.width || 240, rect.height || 30, 0);
}

function drawStaticWaveform(ctx, w, h, progress = 0) {
  ctx.clearRect(0, 0, w, h);
  const barWidth = 3;
  const gap = 3;
  const totalBars = Math.floor(w / (barWidth + gap));

  // Pseudo-random but consistent heights resembling human speech cadence
  for (let i = 0; i < totalBars; i++) {
    const seed = Math.sin(i * 0.45) * 0.5 + Math.cos(i * 0.22) * 0.4;
    const barHeight = Math.max(4, Math.abs(seed) * (h * 0.85));
    const x = i * (barWidth + gap);
    const y = (h - barHeight) / 2;

    const isPlayed = i / totalBars <= progress;
    ctx.fillStyle = isPlayed ? "rgba(232, 201, 122, 0.9)" : "rgba(212, 166, 86, 0.25)";

    ctx.beginPath();
    roundRect(ctx, x, y, barWidth, barHeight, 2);
    ctx.fill();
  }
}

/**
 * Animated waveform while playing
 */
function startWaveformAnimation(canvas, audio) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();
  const w = rect.width || 240;
  const h = rect.height || 30;

  function render() {
    if (audio.paused || audio.ended) return;

    const progress = audio.duration ? audio.currentTime / audio.duration : 0;
    ctx.clearRect(0, 0, w, h);
    const barWidth = 3;
    const gap = 3;
    const totalBars = Math.floor(w / (barWidth + gap));
    const now = Date.now() * 0.005;

    for (let i = 0; i < totalBars; i++) {
      const dynamic = Math.sin(now + i * 0.5) * 0.25 + 0.75;
      const seed = Math.sin(i * 0.45) * 0.5 + Math.cos(i * 0.22) * 0.4;
      const barHeight = Math.max(4, Math.abs(seed) * (h * 0.85) * dynamic);
      const x = i * (barWidth + gap);
      const y = (h - barHeight) / 2;

      const isPlayed = i / totalBars <= progress;
      ctx.fillStyle = isPlayed ? "rgba(232, 201, 122, 0.95)" : "rgba(212, 166, 86, 0.25)";

      ctx.beginPath();
      roundRect(ctx, x, y, barWidth, barHeight, 2);
      ctx.fill();
    }

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

/**
 * Graceful playback simulation if mp3 files are not yet uploaded by user
 */
function simulateMemoPlayback(playerObj) {
  playerObj.card.classList.add("playing");
  let simulatedSec = 0;
  const totalSec = 45; // 45 second preview

  const interval = setInterval(() => {
    if (!playerObj.card.classList.contains("playing")) {
      clearInterval(interval);
      return;
    }
    simulatedSec += 1;
    const pct = (simulatedSec / totalSec) * 100;
    playerObj.progress.style.width = `${pct}%`;
    playerObj.time.textContent = formatTime(simulatedSec);

    if (simulatedSec >= totalSec) {
      clearInterval(interval);
      playerObj.card.classList.remove("playing");
      playerObj.progress.style.width = "0%";
      playerObj.time.textContent = formatTime(totalSec);
    }
  }, 1000);
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
}

function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

/* ============================================================
   REPLAY EXPERIENCE
   ============================================================ */
function initClosingReplay() {
  const replayBtn = document.getElementById("replay-btn");
  if (!replayBtn) return;

  replayBtn.addEventListener("click", () => {
    // Smoothly scroll back to the top of the letter
    const scrollContainer = document.getElementById("letter-scroll");
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
}
