/* ═══════════════════════════════════════════════════════════════
   NACIYE DUYGU — app.js
   Ortak JS: İmleç, Hamburger Menü, Canvas, Scroll, Form, Sayaç
   ═══════════════════════════════════════════════════════════════ */

// ── ÖZEL İMLEÇ ────────────────────────────────────────────────────
const cursor = document.getElementById('cursor');
const trail  = document.getElementById('cursorTrail');
let mx = 0, my = 0, tx = 0, ty = 0;

// Sadece pointer cihazlarda (masaüstü) çalıştır
if (window.matchMedia('(pointer: fine)').matches) {
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
}

// ── NAV SCROLL ────────────────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── HAMBURGER / MOBİL MENÜ ────────────────────────────────────────
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

function toggleMenu() {
  if (!hamburger || !mobileMenu) return;
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

if (hamburger) {
  hamburger.addEventListener('click', toggleMenu);
  // Klavye erişilebilirliği
  hamburger.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMenu(); }
  });
}

// Mobil menü linklerine tıklandığında menüyü kapat
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    if (hamburger) hamburger.classList.remove('open');
    if (mobileMenu) mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ESC tuşuyla menüyü kapat
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('open')) {
    toggleMenu();
  }
});

// ── CANVAS ARKA PLAN (sadece hero sayfasında) ─────────────────────
const canvas = document.getElementById('bgCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resizeCanvas() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  const COLORS = ['#e63946','#ffd166','#2a9d8f','#6a4c93'];

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x     = Math.random() * W;
      this.y     = Math.random() * H;
      this.r     = Math.random() * 2 + 0.5;
      this.vx    = (Math.random() - 0.5) * 0.4;
      this.vy    = (Math.random() - 0.5) * 0.4;
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

  // Mobilde daha az parçacık (performans)
  const particleCount = window.innerWidth < 768 ? 60 : 120;
  for (let i = 0; i < particleCount; i++) particles.push(new Particle());

  function drawConnections() {
    const maxDist = window.innerWidth < 768 ? 70 : 100;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          ctx.save();
          ctx.globalAlpha = (1 - dist / maxDist) * 0.12;
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

// ── INTERSECTION OBSERVER (reveal-up) ────────────────────────────
const reveals  = document.querySelectorAll('.reveal-up');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      entry.target.querySelectorAll('.stat-num').forEach(n => animateCounter(n));
    }
  });
}, { threshold: 0.12 });
reveals.forEach(el => observer.observe(el));

// ── SAYAÇ ANİMASYONU ──────────────────────────────────────────────
function animateCounter(el) {
  if (el.classList.contains('counted')) return;
  el.classList.add('counted');
  const target  = +el.dataset.target;
  let current   = 0;
  const step    = target / 40;
  const timer   = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target + '+';
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current);
    }
  }, 40);
}

// ── TOPIC PILLS ───────────────────────────────────────────────────
document.querySelectorAll('.pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.pill').forEach(p => p.classList.remove('selected'));
    pill.classList.add('selected');
    const topicInput = document.getElementById('topic');
    if (topicInput) topicInput.value = pill.dataset.topic;
  });
});

// ── MULTI-STEP FORM ───────────────────────────────────────────────
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn  = document.getElementById('submitBtn');
    const data = new FormData(contactForm);
    if (btn) { btn.innerText = 'Gönderiliyor...'; btn.disabled = true; }
    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        contactForm.reset();
        document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
        const success = document.getElementById('formSuccess');
        const stepsBar = document.querySelector('.steps-bar');
        if (success)  success.classList.add('visible');
        if (stepsBar) stepsBar.style.display = 'none';
      } else {
        alert('Bir hata oluştu, lütfen tekrar deneyin.');
        if (btn) { btn.innerText = 'Gönder'; btn.disabled = false; }
      }
    } catch {
      alert('Bağlantı hatası oluştu.');
      if (btn) { btn.innerText = 'Gönder'; btn.disabled = false; }
    }
  });
}

window.nextStep = function(from) {
  const name  = document.getElementById('name');
  const email = document.getElementById('email');
  const topic = document.getElementById('topic');
  const msg   = document.getElementById('message');

  if (from === 1 && (!name.value.trim() || !email.value.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/))) {
    alert('Lütfen adınızı ve geçerli bir e-posta girin.'); return;
  }
  if (from === 2 && (!topic.value || !msg.value.trim())) {
    alert('Lütfen bir konu seçin ve mesajınızı yazın.'); return;
  }
  if (from === 2) {
    document.getElementById('sumName').textContent  = name.value;
    document.getElementById('sumEmail').textContent = email.value;
    document.getElementById('sumTopic').textContent = topic.value;
    document.getElementById('sumMsg').textContent   = msg.value.length > 60
      ? msg.value.slice(0, 60) + '…' : msg.value;
  }
  document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.step').forEach((s, i) => {
    s.classList.remove('active', 'done');
    if (i + 1 < from + 1) s.classList.add('done');
    if (i + 1 === from + 1) s.classList.add('active');
  });
  document.querySelector(`.form-step[data-step="${from + 1}"]`).classList.add('active');
};

window.prevStep = function(from) {
  document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.step').forEach((s, i) => {
    s.classList.remove('active', 'done');
    if (i + 1 < from - 1) s.classList.add('done');
    if (i + 1 === from - 1) s.classList.add('active');
  });
  document.querySelector(`.form-step[data-step="${from - 1}"]`).classList.add('active');
};

window.resetForm = function() { location.reload(); };

// ── PROJECT CARD GLOW ─────────────────────────────────────────────
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x    = ((e.clientX - rect.left) / rect.width)  * 100;
    const y    = ((e.clientY - rect.top)  / rect.height) * 100;
    const glow = card.querySelector('.project-glow');
    if (glow) {
      glow.style.background =
        `radial-gradient(circle at ${x}% ${y}%, rgba(230,57,70,0.15), transparent 60%)`;
    }
  });
});

// ── SMOOTH ANCHOR SCROLL ──────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset          = 80;
      const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
  });
});

// ── SKILL TAG HOVER (inline style yerine JS) ──────────────────────
document.querySelectorAll('.skill-tag').forEach(tag => {
  tag.addEventListener('mouseenter', () => {
    tag.style.backgroundColor = '#e63946';
    tag.style.borderColor     = '#e63946';
    tag.style.transform       = 'translateY(-5px)';
    tag.style.boxShadow       = '0 8px 20px rgba(230,57,70,0.3)';
  });
  tag.addEventListener('mouseleave', () => {
    tag.style.backgroundColor = 'transparent';
    tag.style.borderColor     = 'rgba(255,255,255,0.2)';
    tag.style.transform       = 'translateY(0)';
    tag.style.boxShadow       = 'none';
  });
});

// ── LİGHTBOX ─────────────────────────────────────────────────────
window.openLightbox = function(src, alt) {
  const lb  = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  if (!lb || !img) return;
  img.src = src;
  img.alt = alt || '';
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeLightbox = function(e) {
  if (e && e.target !== e.currentTarget && !e.target.classList.contains('lightbox-close')) return;
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  lb.classList.remove('open');
  document.body.style.overflow = '';
};

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') window.closeLightbox();
});

// ── GALERİ FİLTRE ─────────────────────────────────────────────────
const filterBtns = document.querySelectorAll('#filterBtns .pill');
const galleryItems = document.querySelectorAll('#galleryGrid .gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Aktif butonu güncelle
    filterBtns.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');

    const filter = btn.dataset.filter;

    galleryItems.forEach(item => {
      const category = item.dataset.category;
      if (filter === 'all' || category === filter) {
        item.style.display = '';
        // Reveal animasyonu yeniden tetikle
        item.classList.remove('visible');
        setTimeout(() => item.classList.add('visible'), 50);
      } else {
        item.style.display = 'none';
      }
    });
  });
});

// Sayfa yüklendiğinde tüm görselleri görünür yap
window.addEventListener('load', () => {
  galleryItems.forEach((item, i) => {
    setTimeout(() => item.classList.add('visible'), i * 80);
  });
});
