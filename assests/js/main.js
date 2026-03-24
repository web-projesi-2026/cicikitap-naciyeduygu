/* ========================================
   script.js — Kişisel Web Sayfası Etkileşimleri
   ======================================== */

/**
 * 3D Tilt (Eğilme) Efekti
 * Fare kartın üzerinde hareket ettiğinde kart hafifçe eğilir.
 * Fare karttan ayrıldığında kart düzleşir.
 */
document.querySelectorAll('.card').forEach(function(card) {

  // Fare hareket ettikçe kartı eğilt
  card.addEventListener('mousemove', function(e) {
    var rect = card.getBoundingClientRect();

    // Farenin kart içindeki konumunu -0.5 ile +0.5 arasına normalize et
    var x = (e.clientX - rect.left) / rect.width  - 0.5;
    var y = (e.clientY - rect.top)  / rect.height - 0.5;

    // Eğilme açısını uygula (maksimum 6 derece)
    card.style.transform =
      'translateY(-8px) scale(1.02) ' +
      'rotateX(' + (-y * 6) + 'deg) ' +
      'rotateY(' + ( x * 6) + 'deg)';
  });

  // Fare karttan ayrılınca sıfırla
  card.addEventListener('mouseleave', function() {
    card.style.transform = '';
  });

});


/**
 * Kart Tıklama Efekti
 * Karta tıklandığında kısa bir "pulse" animasyonu verir.
 */
document.querySelectorAll('.card').forEach(function(card) {

  card.addEventListener('click', function() {
    // Mevcut animasyonu temizle
    card.style.transition = 'transform 0.1s ease';
    card.style.transform   = 'scale(0.96)';

    // 150ms sonra geri getir
    setTimeout(function() {
      card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
      card.style.transform  = '';
    }, 150);
  });

});


/**
 * Sayfa Yüklenince Kartları Sırayla Göster
 * IntersectionObserver ile kartlar ekrana girdiğinde görünür hale gelir.
 * (CSS animasyonu zaten bunu yapıyor; bu blok ek destek sağlar.)
 */
var observer = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.card').forEach(function(card) {
  observer.observe(card);
});
