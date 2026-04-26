// Hamburger Menü Kontrolü
function toggleMenu() {
    const navLinks = document.getElementById('nav-links');
    if (navLinks) {
        navLinks.classList.toggle('active');
    }
}

// Karanlık / Aydınlık Mod Kontrolü
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const targetTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', targetTheme);
    localStorage.setItem('theme', targetTheme);
    
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
        themeBtn.innerHTML = targetTheme === 'light' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    }
}

// Sayfa yüklendiğinde temayı ayarla
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

// Yukarı Çık Butonu Kontrolü
const backToTopBtn = document.getElementById('back-to-top');

window.onscroll = function() {
    const btn = document.getElementById('back-to-top');
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        if (btn) btn.style.display = "flex";
    } else {
        if (btn) btn.style.display = "none";
    }
};

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Modal Yönetimi
function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.toggle('active');
        if (modalId === 'cart-modal' && modal.classList.contains('active')) {
            renderCart();
        }
    }
}

// Boş yere tıklandığında modalları kapat
window.addEventListener('click', (e) => {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (modal.classList.contains('active')) {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        }
    });
});

// Sepet Sistemi
let cart = JSON.parse(localStorage.getItem('cici-cart')) || [];

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) cartCount.innerText = cart.length;
    localStorage.setItem('cici-cart', JSON.stringify(cart));
}

function addToCart(title, price, img) {
    cart.push({ title, price, img });
    updateCartUI();
    alert(title + " sepete eklendi! 🐾");
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
    renderCart();
}

function renderCart() {
    const cartList = document.getElementById('cart-items-list');
    const cartTotal = document.getElementById('cart-total');
    if (!cartList) return;

    if (cart.length === 0) {
        cartList.innerHTML = '<p>Sepetiniz henüz boş. 🐾</p>';
        if (cartTotal) cartTotal.innerText = '0 TL';
        return;
    }

    cartList.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const priceValue = parseFloat(item.price.replace(' TL', ''));
        total += priceValue;

        cartList.innerHTML += `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.title}">
                <div>
                    <h4>${item.title}</h4>
                    <p>${item.price}</p>
                </div>
                <button onclick="removeFromCart(${index})"><i class="fas fa-trash"></i></button>
            </div>
        `;
    });

    if (cartTotal) cartTotal.innerText = total.toFixed(2) + ' TL';
}

// Sayfa Yüklendiğinde
window.addEventListener('DOMContentLoaded', () => {
    updateCartUI();

    // Tema butonu ikonunu ayarla
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
        themeBtn.innerHTML = document.documentElement.getAttribute('data-theme') === 'light' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    }

    // Öne çıkan kitapları yükle
    const featuredGrid = document.getElementById('featured-books');
    if (featuredGrid) {
        const sampleBooks = [
            { title: "Kuyucaklı Yusuf", author: "Sabahattin Ali", price: "45.00 TL", img: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400" },
            { title: "Suç ve Ceza", author: "Dostoyevski", price: "65.00 TL", img: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400" },
            { title: "Çalıkuşu", author: "Reşat Nuri Güntekin", price: "50.00 TL", img: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400" },
            { title: "Küçük Prens", author: "Antoine de Saint-Exupéry", price: "35.00 TL", img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400" }
        ];

        featuredGrid.innerHTML = '';
        sampleBooks.forEach(book => {
            featuredGrid.innerHTML += `
                <div class="book-card">
                    <img src="${book.img}" alt="${book.title}">
                    <h3>${book.title}</h3>
                    <p style="color: var(--accent-color);">${book.author}</p>
                    <p>${book.price}</p>
                    <button class="btn btn-primary" onclick="addToCart('${book.title}', '${book.price}', '${book.img}')">Sepete Ekle</button>
                </div>
            `;
        });
    }

    // Fiyat karşılaştırma sayfasındaysak
    if (document.getElementById("compare-body")) {
        renderCompareTable(compareData);
        const compareInput = document.getElementById("compare-search");
        if (compareInput) {
            compareInput.addEventListener("input", filterCompare);
        }
    }
});

// Fiyat karşılaştırma verisi
const compareData = [
    { book: "Suç ve Ceza", platform: "Çiçi Kitap", price: 65, status: "En Uygun" },
    { book: "Suç ve Ceza", platform: "KitapYurdu", price: 72, status: "-" },
    { book: "Suç ve Ceza", platform: "D&R", price: 80, status: "-" },
    { book: "Kuyucaklı Yusuf", platform: "Çiçi Kitap", price: 45, status: "En Uygun" },
    { book: "Kuyucaklı Yusuf", platform: "Trendyol", price: 52, status: "-" },
    { book: "Kuyucaklı Yusuf", platform: "Amazon", price: 55, status: "-" },
    { book: "Küçük Prens", platform: "Çiçi Kitap", price: 35, status: "En Uygun" },
    { book: "Küçük Prens", platform: "KitapYurdu", price: 42, status: "-" },
    { book: "Küçük Prens", platform: "D&R", price: 48, status: "-" }
];

function renderCompareTable(data) {
    const tbody = document.getElementById("compare-body");
    if (!tbody) return;

    tbody.innerHTML = "";
    data.forEach(item => {
        tbody.innerHTML += `
            <tr>
                <td>${item.book}</td>
                <td>${item.platform}</td>
                <td>${item.price} TL</td>
                <td class="${item.status === "En Uygun" ? "best-price" : ""}">
                    ${item.status}
                </td>
            </tr>
        `;
    });
}

function filterCompare() {
    const input = document.getElementById("compare-search");
    if (!input) return;
    const searchText = input.value.toLowerCase();
    const filtered = compareData.filter(item =>
        item.book.toLowerCase().includes(searchText)
    );
    renderCompareTable(filtered);
}

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("contact-form");
    if (!form) return;

    form.addEventListener("submit", async function(e) {
        e.preventDefault();

        const message = document.getElementById("form-message");
        const button = form.querySelector("button");

        button.innerText = "Gönderiliyor...";
        button.disabled = true;

        const formData = new FormData(form);

        try {
            const response = await fetch("https://formspree.io/f/xgorqqoo", {
                method: "POST",
                body: formData,
                headers: {
                    "Accept": "application/json"
                }
            });

            if (response.ok) {
                message.style.display = "block";
                message.style.color = "#2ecc71";
                message.innerText = "Mesajınız başarıyla gönderildi! 🐾";
                form.reset();
            } else {
                message.style.display = "block";
                message.style.color = "#ff4d4d";
                message.innerText = "Gönderim sırasında hata oluştu.";
            }
        } catch (error) {
            message.style.display = "block";
            message.style.color = "#ff4d4d";
            message.innerText = "Bağlantı hatası oluştu.";
        }

        button.innerText = "Gönder";
        button.disabled = false;
    });

});
