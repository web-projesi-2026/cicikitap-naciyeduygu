/* =========================================
   NACİYE DUYGU — PORTFOLYO
   app.js (KESİN ÇÖZÜM - GLOW + 6 SAYFA)
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

   function askAI(){
  const input = document.getElementById("aiInput").value.toLowerCase();
  const output = document.getElementById("aiResponse");

  if(input.includes("merhaba")){
    output.innerText="Merhaba 👋";
  }
  else if(input.includes("proje")){
    output.innerText="Yeni bir portfolyo projesi yapabilirsin.";
  }
  else if(input.includes("cv")){
    output.innerText="Projelerini ve becerilerini detaylandır.";
  }
  else{
    output.innerText="Bu soruya cevap öğreniyorum...";
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

// ── MULTI-STEP FORM (FORMSPREE) ───────────
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    const data = new FormData(contactForm);
    if (btn) { btn.innerText = "Gönderiliyor..."; btn.disabled = true; }
    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        contactForm.reset();
        document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
        if (document.getElementById('formSuccess')) document.getElementById('formSuccess').classList.add('visible');
        if (document.querySelector('.steps-bar')) document.querySelector('.steps-bar').style.display = 'none';
      } else {
        alert("Bir hata oluştu, lütfen tekrar deneyin.");
        if (btn) { btn.innerText = "Gönder"; btn.disabled = false; }
      }
    } catch (error) {
      alert("Bağlantı hatası oluştu.");
      if (btn) { btn.innerText = "Gönder"; btn.disabled = false; }
    }
  });
}

window.nextStep = function(from) {
  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const topic = document.getElementById('topic');
  const msg = document.getElementById('message');
  
  if (from === 1 && (!name.value.trim() || !email.value.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/))) {
    alert("Lütfen adınızı ve geçerli bir e-posta girin."); return;
  }
  if (from === 2 && (!topic.value || !msg.value.trim())) {
    alert("Lütfen bir konu seçin ve mesajınızı yazın."); return;
  }
  
  if (from === 2) {
    document.getElementById('sumName').textContent = name.value;
    document.getElementById('sumEmail').textContent = email.value;
    document.getElementById('sumTopic').textContent = topic.value;
    document.getElementById('sumMsg').textContent = msg.value.length > 60 ? msg.value.slice(0, 60) + '…' : msg.value;
  }
  
  document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.step').forEach((s, i) => {
    s.classList.remove('active','done');
    if (i + 1 < from + 1) s.classList.add('done');
    if (i + 1 === from + 1) s.classList.add('active');
  });
  document.querySelector(`.form-step[data-step="${from + 1}"]`).classList.add('active');
};

window.prevStep = function(from) {
  document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.step').forEach((s, i) => {
    s.classList.remove('active','done');
    if (i + 1 < from - 1) s.classList.add('done');
    if (i + 1 === from - 1) s.classList.add('active');
  });
  document.querySelector(`.form-step[data-step="${from - 1}"]`).classList.add('active');
};

window.resetForm = function() { location.reload(); };

// ── PROJECT CARD GLOW (PARLAMA EFEKTİ) ─────
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width)  * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    const glow = card.querySelector('.project-glow');
    if (glow) {
      glow.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(230, 57, 70, 0.15), transparent 60%)`;
    }
  });
});

// ── SMOOTH ANCHOR SCROLL (6 SAYFA) ──────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  });
});
