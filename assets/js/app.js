// Hamburger Menü Kontrolü
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Kedi Arka Plan Animasyonu Oluşturucu
function createFloatingCats() {
    const catBg = document.getElementById('cat-bg');
    if (!catBg) return;
    
    const cats = ['🐾', '🐱', '🐈', '😸', '😻'];
    for (let i = 0; i < 20; i++) {
        const cat = document.createElement('i');
        cat.innerText = cats[Math.floor(Math.random() * cats.length)];
        cat.style.position = 'fixed';
        cat.style.left = Math.random() * 100 + 'vw';
        cat.style.top = Math.random() * 100 + 'vh';
        cat.style.fontSize = (Math.random() * 20 + 10) + 'px';
        cat.style.color = 'rgba(255, 255, 255, 0.1)';
        cat.style.zIndex = '-1';
        cat.style.pointerEvents = 'none';
        cat.style.userSelect = 'none';
        catBg.appendChild(cat);
    }
}

// Kargo Takip Sistemi
function trackOrder() {
    const input = document.getElementById('tracking-input');
    const result = document.getElementById('tracking-result');
    if (!input || !result) return;

    const no = input.value.trim();
    if (no === "") {
        result.innerText = "Lütfen bir kargo numarası girin.";
        result.style.color = "red";
    } else {
        result.innerText = `📦 ${no} numaralı kargonuz yolda! Çiçi kuryemiz hızla getiriyor.`;
        result.style.color = "#aaaaaa";
    }
}

// Sepet Sistemi
let cartCount = 0;
function addToCart() {
    cartCount++;
    const countSpan = document.getElementById('cart-count');
    if (countSpan) {
        countSpan.innerText = cartCount;
    }
    alert("Kitap sepete eklendi! 🐾");
}

// Sayfa Yüklendiğinde
window.addEventListener('DOMContentLoaded', () => {
    createFloatingCats();
    
    // Öne Çıkan Kitaplar (index.html için)
    const featuredGrid = document.getElementById('featured-books');
    if (featuredGrid) {
        const sampleBooks = [
            { title: "Kuyucaklı Yusuf", author: "Sabahattin Ali", price: "45.00 TL", img: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400" },
            { title: "Suç ve Ceza", author: "Dostoyevski", price: "65.00 TL", img: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400" },
            { title: "Çalıkuşu", author: "Reşat Nuri Güntekin", price: "50.00 TL", img: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400" },
            { title: "Küçük Prens", author: "Antoine de Saint-Exupéry", price: "35.00 TL", img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400" }
        ];

        sampleBooks.forEach(book => {
            const isPagesDir = window.location.pathname.includes('/pages/');
            const authorUrl = isPagesDir ? `project.html?author=${encodeURIComponent(book.author)}` : `pages/project.html?author=${encodeURIComponent(book.author)}`;
            
            featuredGrid.innerHTML += `
                <div class="book-card">
                    <img src="${book.img}" alt="${book.title}">
                    <h3>${book.title}</h3>
                    <p style="color: #aaa; cursor: pointer; text-decoration: underline;" onclick="window.location.href='${authorUrl}'">${book.author}</p>
                    <p>${book.price}</p>
                    <button class="btn btn-primary" onclick="addToCart()">Sepete Ekle</button>
                </div>
            `;
        });
    }
});
