/* ═══ NAVİGASYON VE SCROLL ═════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  // Sayfa kaydırıldığında nav bar'ı şeffaf yapma
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.style.padding = '1rem 5%';
      nav.style.background = 'rgba(10, 10, 15, 0.95)';
    } else {
      nav.style.padding = '1.5rem 5%';
      nav.style.background = 'rgba(10, 10, 15, 0.8)';
    }
  });

  // Hamburger menü açma/kapama
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
      hamburger.classList.toggle('active');
    });
  }

  // Mobil linklere tıklandığında menüyü kapatma
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      hamburger.classList.remove('active');
    });
  });

  // Smooth scroll (Yumuşak kaydırma)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  // Canvas Arka Plan Efekti (Opsiyonel)
  initCanvas();
});

/* ═══ ARKA PLAN CANVASI ══════════════════════════════════════════════ */
function initCanvas() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const particleCount = 100;

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 1;
      this.speedX = Math.random() * 0.5 - 0.25;
      this.speedY = Math.random() * 0.5 - 0.25;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x > canvas.width) this.x = 0;
      if (this.x < 0) this.x = canvas.width;
      if (this.y > canvas.height) this.y = 0;
      if (this.y < 0) this.y = canvas.height;
    }

    draw() {
      ctx.fillStyle = 'rgba(99, 102, 241, 0.5)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }

  animate();
}
