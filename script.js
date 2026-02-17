// SHANUM PROFILE - SCRIPT 16.2 (NEEDLE ANIMATION & FULL NAME)
document.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("core-audio");

  // --- INIT ---
  initCursorEffect();
  initLenisSystem();
  initThemeControl();
  initBirthdayLogic();
  initParallaxEngine();
  initTimelineScroll();
  init3DInteraction();

  initMusicStudio();
  initCompactPuzzle();
  initFloatingTraits();
  initTextAnimations();
  initPortalMagnetic();
  initMobileMenu();
  initGlobalAudio();
  initAgeDisplay();

  function initGlobalAudio() {
    const music = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-btn');
    if (!music || !musicBtn) return;

    function updateUI() {
      if (!musicBtn) return;
      if (music.paused) {
        musicBtn.classList.add('paused');
        musicBtn.classList.remove('playing');
      } else {
        musicBtn.classList.add('playing');
        musicBtn.classList.remove('paused');
      }
    }

    const tryPlay = () => {
      if (localStorage.getItem('musicPlaying') !== 'false') {
        music.play().then(() => {
          updateUI();
          localStorage.setItem('musicPlaying', 'true');
        }).catch(() => {
          updateUI();
        });
      }
    };

    // Auto-try on start
    tryPlay();

    // Interaction Fallback
    const interactions = ['click', 'touchstart', 'scroll', 'keydown', 'mousemove'];
    const onFirstInteraction = () => {
      if (music.paused && localStorage.getItem('musicPlaying') !== 'false') {
        tryPlay();
      }
      interactions.forEach(ev => document.removeEventListener(ev, onFirstInteraction));
    };
    interactions.forEach(ev => document.addEventListener(ev, onFirstInteraction, { once: true }));

    musicBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (music.paused) {
        music.play().then(updateUI);
        localStorage.setItem('musicPlaying', 'true');
      } else {
        music.pause();
        localStorage.setItem('musicPlaying', 'false');
        updateUI();
      }
    });

    // Handle unexpected pause (e.g. system interruption)
    music.onplay = updateUI;
    music.onpause = updateUI;
  }


  function initAgeDisplay() {
    const birthDate = "2007-04-12";
    const calculateAge = (birth) => {
      const today = new Date();
      const bDate = new Date(birth);
      return today.getFullYear() - bDate.getFullYear();
    };

    const age = calculateAge(birthDate);
    const elements = ['index-age', 'hero-age', 'countdown-age'];
    elements.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerText = `${age} Years Old`;
    });
  }


  function initPortalMagnetic() {
    const wrap = document.querySelector(".portal-magnetic-wrap");
    const logo = document.querySelector(".portal-logo");
    if (!wrap || !logo) return;

    wrap.addEventListener("mousemove", (e) => {
      const rect = wrap.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Magnetic strength
      gsap.to(logo, {
        x: x * 0.4,
        y: y * 0.4,
        rotationX: -y * 0.1,
        rotationY: x * 0.1,
        duration: 0.6,
        ease: "power2.out"
      });

      const aura = logo.querySelector(".portal-aura");
      if (aura) {
        gsap.to(aura, {
          x: x * 0.2,
          y: y * 0.2,
          duration: 1,
          ease: "power2.out"
        });
      }
    });

    wrap.addEventListener("mouseleave", () => {
      gsap.to(logo, { x: 0, y: 0, rotationX: 0, rotationY: 0, duration: 1, ease: "elastic.out(1, 0.3)" });
      const aura = logo.querySelector(".portal-aura");
      if (aura) gsap.to(aura, { x: 0, y: 0, duration: 1 });
    });
  }


  function initTextAnimations() {
    // 1. BLUR TEXT SETUP
    const blurLines = document.querySelectorAll(".blur-line");
    blurLines.forEach(line => {
      const text = line.textContent.trim();
      line.innerHTML = text.split('').map(char =>
        `<span>${char === ' ' ? '&nbsp;' : char}</span>`
      ).join('');

      const spans = line.querySelectorAll("span");
      gsap.to(spans, {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        scale: 1,
        duration: 2,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: {
          trigger: line,
          start: "top 90%",
          once: true
        }
      });
    });

    // 2. SPLIT TEXT SETUP
    const splitElements = document.querySelectorAll(".split-text");
    splitElements.forEach(el => {
      const text = el.innerText;
      const words = text.split(' ');

      el.innerHTML = words.map(word =>
        `<div class="split-text-wrap"><span>${word === '' ? '&nbsp;' : word}</span></div>`
      ).join(' ');

      const spans = el.querySelectorAll("span");
      gsap.to(spans, {
        y: "0%",
        opacity: 1,
        duration: 1.5,
        stagger: 0.03,
        ease: "power4.out",
        scrollTrigger: {
          trigger: el,
          start: "top 95%",
          once: true
        }
      });
    });
  }
  function initFloatingTraits() {
    gsap.utils.toArray(".f-word").forEach(word => {
      const speed = parseFloat(word.style.getPropertyValue("--s")) || 1;
      gsap.to(word, {
        y: -200 * speed,
        scrollTrigger: {
          trigger: "#traits-sec",
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    });
  }

  function initTimelineScroll() {
    gsap.utils.toArray(".timeline-item").forEach(item => {
      gsap.to(item, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.2,
        scrollTrigger: {
          trigger: item,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      });
    });
  }



  function initCursorEffect() {
    const canvas = document.getElementById("cursor-canvas");
    const ctx = canvas.getContext("2d");

    // Set canvas size
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const particles = [];
    const maxParticles = 80;
    let mouseX = 0;
    let mouseY = 0;

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = (Math.random() - 0.5) * 2;
        this.life = 1;
        this.decay = Math.random() * 0.01 + 0.005;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= this.decay;
        this.size *= 0.98;
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.life;

        // Get accent color from CSS variable
        const accentColor = getComputedStyle(document.documentElement)
          .getPropertyValue('--color-accent').trim();

        // Draw glow
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
        gradient.addColorStop(0, accentColor);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Draw core
        ctx.fillStyle = accentColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
    }

    // Mouse move event
    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Create particles at cursor position
      for (let i = 0; i < 2; i++) {
        if (particles.length < maxParticles) {
          particles.push(new Particle(mouseX, mouseY));
        }
      }
    });

    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();

        // Remove dead particles
        if (particles[i].life <= 0 || particles[i].size < 0.1) {
          particles.splice(i, 1);
        }
      }

      // Draw connections between nearby particles
      ctx.strokeStyle = getComputedStyle(document.documentElement)
        .getPropertyValue('--color-accent').trim();

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.save();
            ctx.globalAlpha = (1 - distance / 100) * 0.2 * particles[i].life * particles[j].life;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      requestAnimationFrame(animate);
    }
    animate();
  }

  function initLenisSystem() {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });

    document.querySelectorAll(".nav-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const targetId = btn.dataset.section;
        const target = document.getElementById(targetId);
        if (target) lenis.scrollTo(target);
      });
    });

    lenis.on('scroll', () => {
      document.querySelectorAll("section").forEach(sec => {
        const rect = sec.getBoundingClientRect();
        if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
          document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
          document.querySelector(`.nav-btn[data-section="${sec.id}"]`)?.classList.add("active");
        }
      });
    });
  }

  function initThemeControl() {
    const toggle = document.getElementById("theme-toggle");
    const html = document.documentElement;
    toggle.onclick = () => {
      const isDark = html.getAttribute("data-theme") === "dark";
      const next = isDark ? "light" : "dark";
      html.setAttribute("data-theme", next);
      toggle.innerHTML = next === "dark" ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
      gsap.fromTo(toggle, { rotation: 0 }, { rotation: 360, duration: 0.6, ease: "back.out(1.5)" });
    };
  }

  function initBirthdayLogic() {
    const now = new Date();
    const d = now.getDate();
    const m = now.getMonth() + 1;

    // Check for finished param
    const urlParams = new URLSearchParams(window.location.search);
    const hasFinished = urlParams.get('finished');

    if (d === 12 && m === 4) {
      // Show persistent overlay on every refresh
      const overlay = document.getElementById("bday-overlay");
      if (overlay) {
        overlay.style.display = "flex";
        gsap.from(".bday-gate-content", {
          opacity: 0,
          scale: 0.8,
          y: 50,
          duration: 1.2,
          ease: "power4.out"
        });
      }

      // Start global particles
      startGlobalCelebration();

      // Update Countdown Section with Navigation Button (integrated look)
      const timerSec = document.getElementById("timer-sec");
      if (timerSec) {
        const content = timerSec.querySelector(".content-box");
        content.innerHTML = `
          <h2 style="font-family:'Playfair Display', serif; font-size: clamp(2rem, 5vw, 4rem); color: var(--color-accent); margin-bottom:10px;">Happy Birthday!</h2>
          <p style="color:var(--color-text-dim); margin-bottom: 30px; letter-spacing: 2px;">A magical world awaits you today.</p>
          <a href="birthday.html" class="bday-gate-btn" style="text-decoration:none; display:inline-block; padding: 12px 30px; font-size: 0.9rem;">Open World <i class="fas fa-external-link-alt" style="margin-left:8px;"></i></a>
        `;
      }
    }

    function startGlobalCelebration() {
      const container = document.createElement("div");
      container.style.position = "fixed";
      container.style.top = "0";
      container.style.left = "0";
      container.style.width = "100%";
      container.style.height = "100%";
      container.style.pointerEvents = "none";
      container.style.zIndex = "999";
      document.body.appendChild(container);

      const items = ["🌸", "❄️", "✨", "💮", "🌺", "💖", "🌷"];
      setInterval(() => {
        const p = document.createElement("div");
        p.innerText = items[Math.floor(Math.random() * items.length)];
        p.style.position = "absolute";
        p.style.left = Math.random() * 100 + "vw";
        p.style.top = "-5vh";
        p.style.fontSize = Math.random() * 20 + 10 + "px";
        p.style.opacity = Math.random() * 0.6 + 0.4;
        container.appendChild(p);

        gsap.to(p, {
          y: "110vh",
          x: (Math.random() - 0.5) * 400 + "px",
          rotation: Math.random() * 720,
          duration: Math.random() * 8 + 5,
          ease: "none",
          onComplete: () => p.remove()
        });
      }, 400);
    }


    // Original Countdown Logic
    function tick() {
      const targetYear = (now.getMonth() + 1 > 4 || (now.getMonth() + 1 === 4 && now.getDate() >= 12))
        ? now.getFullYear() + 1 : now.getFullYear();
      const target = new Date(`April 12, ${targetYear} 00:00:00`).getTime();
      const current = new Date().getTime();
      const diff = target - current;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      const dVal = document.getElementById("d-val");
      if (dVal) {
        dVal.innerText = days.toString().padStart(2, '0');
        document.getElementById("h-val").innerText = hours.toString().padStart(2, '0');
        document.getElementById("m-val").innerText = mins.toString().padStart(2, '0');
        document.getElementById("s-val").innerText = secs.toString().padStart(2, '0');
      }
    }
    setInterval(tick, 1000);
    tick();
  }



  function initParallaxEngine() {
    gsap.to("#pg-1", { xPercent: -20, scrollTrigger: { trigger: "body", scrub: true } });
    gsap.to("#pg-2", { xPercent: 20, scrollTrigger: { trigger: "body", scrub: true } });
    gsap.to("#pg-3", { xPercent: -15, scrollTrigger: { trigger: "body", scrub: true } });

    // Smooth parallax for story section image
    gsap.fromTo("#story-sec .hero-visual-wrap img",
      { y: "-20vh" },
      {
        y: "20vh",
        scrollTrigger: {
          trigger: "#story-sec",
          start: "top bottom",
          end: "bottom top",
          scrub: true
        },
        ease: "none"
      }
    );

    // Fade in sections with blur effect
    document.querySelectorAll("section").forEach(sec => {
      gsap.from(sec, {
        opacity: 0, y: 80, filter: "blur(10px)",
        scrollTrigger: { trigger: sec, start: "top 85%", toggleActions: "play none none reverse" }
      });
    });
  }
  function init3DInteraction() {
    const ring = document.getElementById("ring-engine");
    const cards = gsap.utils.toArray(".ring-card-item");
    const count = cards.length;
    if (!ring || cards.length === 0) return;

    const radius = 850;
    const anglePer = 360 / count;

    cards.forEach((card, i) => {
      gsap.set(card, {
        rotationY: i * anglePer,
        transformOrigin: `50% 50% ${radius}px`,
        z: -radius
      });
    });

    let rotY = 0;
    let lastX = 0;
    let dragging = false;
    let velocity = 0;
    const box = document.getElementById("ring-container");

    const updateParallax = () => {
      cards.forEach((card, i) => {
        const currentAngle = (rotY + (i * anglePer)) % 360;
        const normalizedAngle = ((currentAngle + 180) % 360) - 180;
        const distance = Math.abs(normalizedAngle);
        const brightness = Math.max(0.2, 1 - (distance / 90));
        gsap.set(card, { filter: `brightness(${brightness})` });

        const img = card.querySelector("img");
        if (img) {
          const xOffset = Math.sin(normalizedAngle * (Math.PI / 180)) * 65;
          gsap.set(img, { x: xOffset });
        }
      });
    };

    const onStart = (x) => {
      dragging = true;
      lastX = x;
      velocity = 0;
      autoRotate.pause();
    };

    const onMove = (x) => {
      if (!dragging) return;
      const deltaX = x - lastX;
      velocity = deltaX * 0.15;
      rotY += velocity;
      gsap.set(ring, { rotationY: rotY });
      updateParallax();
      lastX = x;
    };

    const onEnd = () => {
      if (!dragging) return;
      dragging = false;

      gsap.to({ v: velocity }, {
        v: 0,
        duration: 2,
        ease: "power2.out",
        onUpdate: function () {
          if (dragging) this.kill();
          rotY += this.targets()[0].v;
          gsap.set(ring, { rotationY: rotY });
          updateParallax();
        },
        onComplete: () => {
          if (!dragging) autoRotate.resume();
        }
      });
    };

    box.addEventListener("mousedown", (e) => onStart(e.clientX));
    window.addEventListener("mousemove", (e) => onMove(e.clientX));
    window.addEventListener("mouseup", onEnd);

    box.addEventListener("touchstart", (e) => onStart(e.touches[0].clientX));
    window.addEventListener("touchmove", (e) => onMove(e.touches[0].clientX));
    window.addEventListener("touchend", onEnd);

    const autoRotate = gsap.to({}, {
      duration: 1,
      repeat: -1,
      onUpdate: () => {
        if (!dragging) {
          rotY += 0.15;
          gsap.set(ring, { rotationY: rotY });
          updateParallax();
        }
      }
    });

    updateParallax();
  }


  function initMusicStudio() {
    const tracks = [
      { t: "As It Was", a: "Harry Styles", s: "Assets/music/Harry Styles - As It Was (Official Video).mp3" },
      { t: "Fine Line", a: "Harry Styles", s: "Assets/music/Harry Styles - Fine Line (Official Audio).mp3" },
      { t: "Lover", a: "Taylor Swift", s: "Assets/music/lover-taylor.mp3" },
      { t: "Flutter of a Butterfly", a: "Anthony Lazaro & Jason LaPierre", s: "Assets/music/Anthony Lazaro & Jason LaPierre - Flutter of a Butterfly.mp3" },
      { t: "Small Rainbows", a: "Anthony Lazaro", s: "Assets/music/Anthony Lazaro - Small Rainbows.mp3" },
      { t: "And Time Froze", a: "Duara", s: "Assets/music/Duara - And Time Froze (Official Visualizer).mp3" },
      { t: "Kita Sama", a: "Daun Jatuh", s: "Assets/music/Daun Jatuh - Kita Sama (Official Audio).mp3" },
      { t: "Di Antara Rindu", a: "Indische Party", s: "Assets/music/Di Antara Rindu.mp3" },
      { t: "Pastikan Riuh Akhiri Malammu", a: "Perunggu", s: "Assets/music/Perunggu - Pastikan Riuh Akhiri Malammu (Official Music Video).mp3" },
      { t: "Pelukku Untuk Pelikmu", a: "Fiersa Besari", s: "Assets/music/Pelukku-untuk-pelikmu.mp3" }
    ];
    const list = document.getElementById("track-list");
    const toggle = document.getElementById("v-toggle");
    const prevBtn = document.getElementById("v-prev");
    const nextBtn = document.getElementById("v-next");
    const volumeSlider = document.getElementById("v-volume");
    const spin = document.getElementById("v-spin");
    const needle = document.getElementById("v-needle");
    const progContainer = document.getElementById("v-prog-container");
    const timeCurrent = document.getElementById("time-current");
    const timeTotal = document.getElementById("time-total");

    if (!list || !toggle || !audio) return;

    let active = -1; let playing = false;

    // Initialize volume
    audio.volume = 0.7;

    tracks.forEach((tr, i) => {
      const row = document.createElement("div");
      row.className = "playlist-row";
      row.innerHTML = `<strong>${tr.t}</strong><br><small>${tr.a}</small>`;
      row.onclick = () => load(i);
      list.appendChild(row);
    });

    // Drag scroll functionality for playlist
    let isDragging = false;
    let startY = 0;
    let scrollTop = 0;

    list.addEventListener('mousedown', (e) => {
      isDragging = true;
      startY = e.pageY - list.offsetTop;
      scrollTop = list.scrollTop;
    });

    list.addEventListener('mouseleave', () => {
      isDragging = false;
    });

    list.addEventListener('mouseup', () => {
      isDragging = false;
    });

    list.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const y = e.pageY - list.offsetTop;
      const walk = (y - startY) * 2;
      list.scrollTop = scrollTop - walk;
    });

    // Touch support for mobile
    list.addEventListener('touchstart', (e) => {
      startY = e.touches[0].pageY - list.offsetTop;
      scrollTop = list.scrollTop;
    });

    list.addEventListener('touchmove', (e) => {
      const y = e.touches[0].pageY - list.offsetTop;
      const walk = (y - startY) * 2;
      list.scrollTop = scrollTop - walk;
    });

    // Prevent page scroll when scrolling inside playlist
    list.addEventListener('wheel', (e) => {
      const delta = e.deltaY;
      const contentHeight = list.scrollHeight;
      const viewHeight = list.offsetHeight;
      const currentScroll = list.scrollTop;

      // If there's scrollable content
      if (contentHeight > viewHeight) {
        // Prevent Lenis/Page from scrolling
        e.stopPropagation();

        // Manual scroll logic if needed, but stopPropagation often suffices 
        // depending on how Lenis is implemented. 
        // To be safe with Lenis, we can also use data-lenis-prevent attribute in HTML 
        // but adding it via JS here for the specific element.
      }
    }, { passive: false });

    // Ensure Lenis doesn't take over this element
    list.setAttribute('data-lenis-prevent', '');

    function load(i) {
      active = i;
      audio.src = tracks[i].s;
      document.getElementById("cur-song").innerText = tracks[i].t;
      document.querySelectorAll(".playlist-row").forEach((el, idx) => el.classList.toggle("active", idx === i));
      audio.play(); playing = true; update();
    }

    toggle.onclick = () => {
      if (active === -1) { load(0); return; }
      if (playing) audio.pause(); else audio.play();
      playing = !playing; update();
    };

    // Previous button
    prevBtn.onclick = () => {
      if (active > 0) {
        load(active - 1);
      } else {
        load(tracks.length - 1); // Loop to last song
      }
    };

    // Next button
    nextBtn.onclick = () => {
      if (active < tracks.length - 1) {
        load(active + 1);
      } else {
        load(0); // Loop to first song
      }
    };

    // Volume control
    volumeSlider.oninput = (e) => {
      audio.volume = e.target.value / 100;
    };

    function update() {
      toggle.innerHTML = playing ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
      spin.classList.toggle("is-playing", playing);
      if (needle) needle.classList.toggle("active", playing);
    }

    // Format time helper
    function formatTime(seconds) {
      if (isNaN(seconds)) return "0:00";
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    audio.ontimeupdate = () => {
      const p = (audio.currentTime / audio.duration) * 100;
      document.getElementById("v-prog").style.width = p + "%";
      timeCurrent.innerText = formatTime(audio.currentTime);
      timeTotal.innerText = formatTime(audio.duration);
    };

    // Auto next song when current ends
    audio.onended = () => {
      if (active < tracks.length - 1) {
        load(active + 1);
      } else {
        playing = false;
        update();
      }
    };

    // Seek functionality
    progContainer.onclick = (e) => {
      const rect = progContainer.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      audio.currentTime = percentage * audio.duration;
    };
  }

  function initCompactPuzzle() {
    const board = document.getElementById("p-grid");
    if (!board) return;
    let pieces = []; let empty = 8;
    const words = ["shanum", "naysila", "priyambodo", "shanum", "naysila", "priyambodo", "shanum", "naysila"];
    const correctSequence = ["shanum", "naysila", "priyambodo", "shanum", "naysila", "priyambodo", "shanum", "naysila", ""];
    const assets = ["1.jpeg", "2.jpeg", "3.jpeg", "4.jpeg", "6.jpeg", "7.jpeg", "8.jpeg"];
    let solved = false;

    function build() {
      board.innerHTML = ""; pieces = []; solved = false; empty = 8;
      board.style.display = "grid"; // Ensure grid is restored
      for (let i = 0; i < 9; i++) {
        const p = document.createElement("div");
        p.style.width = "100%"; p.style.aspectRatio = "1";
        p.style.display = "flex"; p.style.alignItems = "center"; p.style.justifyContent = "center";
        p.style.fontSize = "0.75rem"; p.style.color = "var(--color-accent)";
        p.style.fontWeight = "700"; p.dataset.correctIdx = i;
        if (i === empty) { p.style.visibility = "hidden"; }
        else {
          p.innerText = words[i]; p.style.background = "var(--color-accent-dim)";
          p.style.cursor = "pointer"; p.style.borderRadius = "10px";
        }
        const idx = i;
        p.onclick = () => move(idx);
        pieces.push(p); board.appendChild(p);
      }
    }

    function move(idx, silent = false) {
      if (solved && !silent) return;
      const r = Math.floor(idx / 3), c = idx % 3;
      const er = Math.floor(empty / 3), ec = empty % 3;
      if (Math.abs(r - er) + Math.abs(c - ec) === 1) {
        const txt = pieces[idx].innerText;
        const cIdx = pieces[idx].dataset.correctIdx;
        pieces[idx].innerText = ""; pieces[idx].style.visibility = "hidden"; pieces[idx].style.background = "none";
        pieces[idx].dataset.correctIdx = pieces[empty].dataset.correctIdx;
        pieces[empty].innerText = txt; pieces[empty].style.visibility = "visible";
        pieces[empty].style.background = "var(--color-accent-dim)"; pieces[empty].dataset.correctIdx = cIdx;
        pieces[empty].style.borderRadius = "10px";
        empty = idx;
        if (!silent) checkMatch();
      }
    }

    function checkMatch() {
      let currentSequence = pieces.map(p => p.innerText.toLowerCase());
      let isCorrect = true;

      for (let i = 0; i < correctSequence.length; i++) {
        if (currentSequence[i] !== correctSequence[i]) {
          isCorrect = false;
          break;
        }
      }

      if (isCorrect) {
        solved = true;
        const pic = assets[Math.floor(Math.random() * assets.length)];

        // Show full image instead of fragments
        setTimeout(() => {
          board.innerHTML = "";
          board.style.display = "block";
          const img = document.createElement("img");
          img.src = `Assets/img/${pic}`;
          img.style.width = "100%";
          img.style.height = "100%";
          img.style.objectFit = "cover";
          img.style.borderRadius = "30px";
          img.style.display = "block";
          board.appendChild(img);
          gsap.from(img, { scale: 0.9, opacity: 0, duration: 1, ease: "power2.out" });
        }, 300);
      }
    }

    document.getElementById("p-sh").onclick = () => {
      build();
      // Shuffle silently
      for (let i = 0; i < 150; i++) {
        move(Math.floor(Math.random() * 9), true);
      }
    };
    document.getElementById("p-sv").onclick = () => build();
    build();
  }
  function initMobileMenu() {
    const hamburger = document.getElementById("hamburger-btn");
    const navSide = document.getElementById("nav-side");
    const navBtns = document.querySelectorAll(".nav-btn");

    if (!hamburger || !navSide) return;

    // Toggle Menu
    hamburger.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent closing immediately
      navSide.classList.toggle("active");

      // Animate hamburger icon change
      const icon = hamburger.querySelector("i");
      if (navSide.classList.contains("active")) {
        gsap.to(icon, { rotation: 90, duration: 0.3 });
        icon.className = "fas fa-times";
      } else {
        gsap.to(icon, { rotation: 0, duration: 0.3 });
        icon.className = "fas fa-bars";
      }
    });

    // Close when clicking a link
    navBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        navSide.classList.remove("active");
        const icon = hamburger.querySelector("i");
        icon.className = "fas fa-bars";
        gsap.to(icon, { rotation: 0, duration: 0.3 });
      });
    });

    // Close when clicking outside
    document.addEventListener("click", (e) => {
      if (!navSide.contains(e.target) && !hamburger.contains(e.target) && navSide.classList.contains("active")) {
        navSide.classList.remove("active");
        const icon = hamburger.querySelector("i");
        icon.className = "fas fa-bars";
        gsap.to(icon, { rotation: 0, duration: 0.3 });
      }
    });
  }
});
