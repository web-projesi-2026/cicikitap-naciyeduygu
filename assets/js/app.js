// Hamburger Menü Kontrolü
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Kedi Arka Plan Animasyonu
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
        cat.className = 'cat-emoji';
        catBg.appendChild(cat);
    }
}

// Modal Yönetimi (Giriş, Kayıt, Sepet, Kargo)
function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.toggle('active');
        // Kargo modalı açıldığında sonucu temizle
        if (modalId === 'tracking-modal' && !modal.classList.contains('active')) {
            const result = document.getElementById('modal-tracking-result');
            const input = document.getElementById('modal-tracking-input');
            if (result) result.innerText = "";
            if (input) input.value = "";
        }
    }
}

// Boş yere tıklandığında modalları kapat
window.addEventListener('click', (e) => {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (modal.classList.contains('active')) {
            const isClickInside = modal.contains(e.target);
            const isClickOnButton = e.target.closest('button') && 
                                   (e.target.closest('button').getAttribute('onclick')?.includes(modal.id));
            
            if (!isClickInside && !isClickOnButton) {
                modal.classList.remove('active');
            }
        }
    });
});

// Kargo Takip Modal Fonksiyonu
function trackOrderModal() {
    const input = document.getElementById('modal-tracking-input');
    const result = document.getElementById('modal-tracking-result');
    if (!input || !result) return;
    
    const no = input.value.trim();
    if (no === "") {
        result.innerText = "Lütfen bir kargo numarası girin.";
        result.style.color = "red";
    } else {
        result.innerText = `📦 ${no} numaralı kargonuz yolda! Çiçi kuryemiz hızla getiriyor. 🐾`;
        result.style.color = "#aaaaaa";
    }
}

// Sepet Sistemi
let cart = JSON.parse(localStorage.getItem('cici-cart')) || [];

function updateCartUI() {
    const cartList = document.getElementById('cart-items-list');
    const cartCount = document.getElementById('cart-count');
    const cartFooter = document.getElementById('cart-footer');
    const cartTotal = document.getElementById('cart-total');

    if (!cartList) return;

    if (cart.length === 0) {
        cartList.innerHTML = '<p style="text-align:center; color:#aaa;">Sepetiniz henüz boş. 🐾</p>';
        if (cartCount) cartCount.innerText = "0";
        if (cartFooter) cartFooter.style.display = 'none';
    } else {
        cartList.innerHTML = "";
        let total = 0;
        cart.forEach((item, index) => {
            const priceNum = parseFloat(item.price.replace(' TL', ''));
            total += priceNum;
            cartList.innerHTML += `
                <div class="cart-item">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <img src="${item.img}" style="width:40px; height:60px; object-fit:cover; border-radius:3px;">
                        <div>
                            <div style="font-weight:bold; font-size:0.9rem;">${item.title}</div>
                            <div style="font-size:0.8rem; color:#aaa;">${item.price}</div>
                        </div>
                    </div>
                    <button onclick="removeFromCart(${index})" style="background:none; border:none; color:#ff4444; cursor:pointer;"><i class="fas fa-trash"></i></button>
                </div>
            `;
        });
        if (cartCount) cartCount.innerText = cart.length;
        if (cartTotal) cartTotal.innerText = total.toFixed(2) + " TL";
        if (cartFooter) cartFooter.style.display = 'block';
    }
    localStorage.setItem('cici-cart', JSON.stringify(cart));
}

function addToCart(title, price, img) {
    cart.push({ title, price, img });
    updateCartUI();
    toggleModal('cart-modal');
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function completeOrder() {
    if (cart.length === 0) return;
    cart = [];
    updateCartUI();
    toggleModal('cart-modal');
    const overlay = document.getElementById('thanks-overlay');
    if (overlay) overlay.classList.add('active');
}

function closeThanks() {
    const overlay = document.getElementById('thanks-overlay');
    if (overlay) overlay.classList.remove('active');
}

// Sayfa Yüklendiğinde
window.addEventListener('DOMContentLoaded', () => {
    createFloatingCats();
    updateCartUI();
    
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
                    <button class="btn btn-primary" onclick="addToCart('${book.title}', '${book.price}', '${book.img}')">Sepete Ekle</button>
                </div>
            `;
        });
    }
});
