/* =========================================
Naciye Duygu — PORTFOLYO
   app.js (EN GÜNCEL - FORMSPREE POST UYUMLU)
   ========================================= */

// ── CUSTOM CURSOR ──────────────────────────
const cursor = document.getElementById('cursor');
const trail  = document.getElementById('cursorTrail');
let mx = 0, my = 0, tx = 0, ty = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  if (cursor) {
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  }
});

function animateTrail() {
  tx += (mx - tx) * 0.12;
  ty += (my - ty) * 0.12;
  if (trail) {
    trail.style.left = tx + 'px';
    trail.style.top  = ty + 'px';
  }
  requestAnimationFrame(animateTrail);
}
animateTrail();

// ── NAV SCROLL ────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ── HAMBURGER / MOBILE MENU ───────────────
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });
}

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    if (hamburger) hamburger.classList.remove('open');
    if (mobileMenu) mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ── CANVAS BACKGROUND ─────────────────────
const canvas = document.getElementById('bgCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resizeCanvas() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const COLORS = ['#e63946','#ffd166','#2a9d8f','#6a4c93'];
  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.r  = Math.random() * 2 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.alpha = Math.random() * 0.6 + 0.2;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle   = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < 120; i++) particles.push(new Particle());

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.save();
          ctx.globalAlpha = (1 - dist / 100) * 0.12;
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth   = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}

// ── INTERSECTION OBSERVER ──────────────────
const reveals = document.querySelectorAll('.reveal-up');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      entry.target.querySelectorAll('.stat-num').forEach(n => animateCounter(n));
    }
  });
}, { threshold: 0.12 });
reveals.forEach(el => observer.observe(el));

// ── COUNTER ANIMATION ──────────────────────
function animateCounter(el) {
  if (el.classList.contains('counted')) return;
  el.classList.add('counted');
  const target = +el.dataset.target;
  let current  = 0;
  const step   = target / 40;
  const timer  = setInterval(() => {
    current += step;
    if (current >= target) { el.textContent = target + '+'; clearInterval(timer); }
    else el.textContent = Math.floor(current);
  }, 40);
}

// ── TOPIC PILLS ────────────────────────────
document.querySelectorAll('.pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.pill').forEach(p => p.classList.remove('selected'));
    pill.classList.add('selected');
    const topicInput = document.getElementById('topic');
    if(topicInput) topicInput.value = pill.dataset.topic;
  });
});

// ── MULTI-STEP FORM ────────────────────────
let currentStep = 1;

function goToStep(step) {
  document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.step').forEach((s, i) => {
    s.classList.remove('active','done');
    if (i + 1 < step) s.classList.add('done');
    if (i + 1 === step) s.classList.add('active');
  });
  const target = document.querySelector(`.form-step[data-step="${step}"]`);
  if (target) target.classList.add('active');
  currentStep = step;
}

function validateStep(step) {
  let valid = true;
  if (step === 1) {
    const name  = document.getElementById('name');
    const email = document.getElementById('email');
    if (!name || !email || !name.value.trim() || !email.value.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) valid = false;
  }
  if (step === 2) {
    const topic = document.getElementById('topic');
    const msg   = document.getElementById('message');
    if (!topic || !msg || !topic.value || !msg.value.trim()) valid = false;
  }
  return valid;
}

window.nextStep = function(from) {
  if (!validateStep(from)) {
    alert("Lütfen alanları doğru doldurun.");
    return;
  }
  if (from === 2) fillSummary();
  goToStep(from + 1);
};

window.prevStep = function(from) {
  goToStep(from - 1);
};

function fillSummary() {
  const nameVal  = document.getElementById('name')?.value || "";
  const emailVal = document.getElementById('email')?.value || "";
  const topicVal = document.getElementById('topic')?.value || "";
  const msgVal   = document.getElementById('message')?.value || "";

  if(document.getElementById('sumName')) document.getElementById('sumName').textContent = nameVal;
  if(document.getElementById('sumEmail')) document.getElementById('sumEmail').textContent = emailVal;
  if(document.getElementById('sumTopic')) document.getElementById('sumTopic').textContent = topicVal;
  if(document.getElementById('sumMsg')) document.getElementById('sumMsg').textContent = msgVal.length > 60 ? msgVal.slice(0, 60) + '…' : msgVal;
}

// ── FORMSPREE GÖNDERİMİ (POST GÜNCELLEMESİ) ──
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    const data = new FormData(contactForm);

    if (btn) {
      btn.innerText = "Gönderiliyor...";
      btn.disabled = true;
    }

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        contactForm.reset();
        document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
        const successEl = document.getElementById('formSuccess');
        if (successEl) successEl.classList.add('visible');
        const stepsBar = document.querySelector('.steps-bar');
        if (stepsBar) stepsBar.style.display = 'none';
      } else {
        const errorData = await response.json();
        alert("Hata: " + (errorData.errors ? errorData.errors[0].message : "Mesaj gönderilemedi."));
        if (btn) { btn.innerText = "Gönder"; btn.disabled = false; }
      }
    } catch (error) {
      alert("Bağlantı hatası oluştu.");
      if (btn) { btn.innerText = "Gönder"; btn.disabled = false; }
    }
  });
}

window.resetForm = function() {
  location.reload();
};

// ── SMOOTH ANCHOR SCROLL (6 SAYFA DESTEĞİ) ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const targetId = a.getAttribute('href');
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const offset = 80; // Header yüksekliği
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = target.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});
