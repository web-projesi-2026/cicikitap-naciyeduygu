/* ========================================
   script.js — Modern Etkileşimler
   ======================================== */

/**
 * 3D Tilt (Eğilme) Efekti
 * Fare kartın üzerinde hareket ettiğinde kart hafifçe eğilir.
 */
document.querySelectorAll('.card').forEach(function(card) {
  card.addEventListener('mousemove', function(e) {
    var rect = card.getBoundingClientRect();
    // Farenin kart içindeki konumunu normalize et (-0.5 ile +0.5 arası)
    var x = (e.clientX - rect.left) / rect.width  - 0.5;
    var y = (e.clientY - rect.top)  / rect.height - 0.5;
    
    // Eğilme açısını uygula (maksimum 10 dereceye çıkarıldı daha belirgin olması için)
    // CSS'deki transform: translateY(-10px) ile birleştirildi
    card.style.transform =
      'translateY(-10px) ' +
      'rotateX(' + (-y * 10) + 'deg) ' +
      'rotateY(' + ( x * 10) + 'deg)';
    
    // Gölgeyi fareye göre biraz kaydırarak derinlik kat
    card.style.boxShadow = 
      (-x * 20) + 'px ' + (20 + -y * 20) + 'px 40px rgba(0,0,0,0.15)';
  });

  // Fare karttan ayrılınca sıfırla
  card.addEventListener('mouseleave', function() {
    card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
    card.style.boxShadow = '';
    card.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.5s ease';
  });

  // Fare karta girince geçişi yumuşat (hareket anında transition 0.1s olmalı)
  card.addEventListener('mouseenter', function() {
    card.style.transition = 'transform 0.1s ease, box-shadow 0.1s ease';
  });
});

/**
 * Kart Tıklama Efekti
 * Karta tıklandığında kısa bir "pulse" (basılma) animasyonu verir.
 */
document.querySelectorAll('.card').forEach(function(card) {
  card.addEventListener('mousedown', function() {
    card.style.transition = 'transform 0.1s ease';
    card.style.transform = 'scale(0.95) translateY(0)';
  });
  
  card.addEventListener('mouseup', function() {
    card.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    card.style.transform = 'scale(1.02) translateY(-10px)';
  });
});

/**
 * Sayfa Yüklenince Kartları Sırayla Göster (Scroll Animation)
 * IntersectionObserver ile kartlar ekrana girdiğinde görünür hale gelir.
 */
var observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

var observer = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry, index) {
    if (entry.isIntersecting) {
      // Hafif gecikme ile sırayla belirme (stagger effect)
      setTimeout(function() {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, 100);
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.card').forEach(function(card) {
  observer.observe(card);
});
