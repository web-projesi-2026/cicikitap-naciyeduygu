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
        themeBtn.innerHTML = targetTheme === 'light'
            ? '<i class="fas fa-moon"></i>'
            : '<i class="fas fa-sun"></i>';
    }
}

// Sayfa yüklendiğinde temayı ayarla
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

// Yukarı Çık Butonu Kontrolü
window.onscroll = function () {
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
        if (modal.classList.contains('active') && e.target === modal) {
            modal.classList.remove('active');
        }
    });
});

// Sepet Sistemi
let cart = JSON.parse(localStorage.getItem('cici-cart')) || [];

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');

    if (cartCount) {
        cartCount.innerText = cart.length;
    }

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

        if (cartTotal) {
            cartTotal.innerText = '0 TL';
        }

        return;
    }

    cartList.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        let priceValue = 0;

        if (typeof item.price === "string") {
            priceValue = parseFloat(item.price.replace(' TL', ''));
        } else {
            priceValue = parseFloat(item.price);
        }

        total += priceValue;

        cartList.innerHTML += `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.title}">
                <div>
                    <h4>${item.title}</h4>
                    <p>${priceValue.toFixed(2)} TL</p>
                </div>
                <button onclick="removeFromCart(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });

    if (cartTotal) {
        cartTotal.innerText = total.toFixed(2) + ' TL';
    }
}

// Kitap Verileri
const bookList = document.getElementById("book-list");

let allBooks = [];
let sepet = JSON.parse(localStorage.getItem("sepet")) || [];
let favoriler = JSON.parse(localStorage.getItem("favoriler")) || [];

// JSON Kitapları Yükleme
if (bookList) {
    fetch("assets/data/books.json")
        .then(response => response.json())
        .then(books => {
            allBooks = books;
            kitaplariGoster(allBooks);
        })
        .catch(error => {
            bookList.innerHTML = "<p>Kitaplar yüklenirken hata oluştu.</p>";
            console.log("JSON yükleme hatası:", error);
        });
}

// Kitapları Ekranda Gösterme
function kitaplariGoster(books) {
    if (!bookList) return;

    bookList.innerHTML = "";

    if (books.length === 0) {
        bookList.innerHTML = "<p>Aradığınız kritere uygun kitap bulunamadı.</p>";
        return;
    }

    books.forEach(book => {
        const card = document.createElement("div");
        card.className = "book-card";

        card.innerHTML = `
            <img src="${book.resim}" alt="${book.ad}">
            <h3>${book.ad}</h3>
            <p><strong>Yazar:</strong> ${book.yazar}</p>
            <p><strong>Kategori:</strong> ${book.kategori}</p>
            <p class="price">${book.fiyat} TL</p>

            <button onclick="sepeteEkle(${book.id}, '${book.ad}', ${book.fiyat}, '${book.resim}')">
                Sepete Ekle
            </button>

            <button onclick="favoriyeEkle(${book.id}, '${book.ad}')">
                Favorilere Ekle
            </button>
        `;

        bookList.appendChild(card);
    });
}

// Arama + Kategori Filtreleme + Sıralama
function kitaplariFiltrele() {
    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    const sortFilter = document.getElementById("sortFilter");

    const searchValue = searchInput ? searchInput.value.toLowerCase() : "";
    const categoryValue = categoryFilter ? categoryFilter.value : "all";
    const sortValue = sortFilter ? sortFilter.value : "default";

    let filteredBooks = allBooks.filter(book => {
        const kitapAdi = book.ad.toLowerCase();
        const yazarAdi = book.yazar.toLowerCase();
        const kategoriAdi = book.kategori;

        const aramaUyumlu =
            kitapAdi.includes(searchValue) ||
            yazarAdi.includes(searchValue);

        const kategoriUyumlu =
            categoryValue === "all" ||
            kategoriAdi === categoryValue;

        return aramaUyumlu && kategoriUyumlu;
    });

    if (sortValue === "nameAsc") {
        filteredBooks.sort((a, b) => a.ad.localeCompare(b.ad));
    }

    if (sortValue === "priceAsc") {
        filteredBooks.sort((a, b) => Number(a.fiyat) - Number(b.fiyat));
    }

    if (sortValue === "priceDesc") {
        filteredBooks.sort((a, b) => Number(b.fiyat) - Number(a.fiyat));
    }

    kitaplariGoster(filteredBooks);
}

// Sepete Ekleme
function sepeteEkle(id, ad, fiyat, resim) {
    const urun = { id, ad, fiyat, resim };

    sepet.push(urun);
    localStorage.setItem("sepet", JSON.stringify(sepet));

    addToCart(ad, fiyat + " TL", resim);

    alert(ad + " sepete eklendi.");
}

// Favorilere Ekleme
function favoriyeEkle(id, ad) {
    const mevcutMu = favoriler.some(item => item.id === id);

    if (mevcutMu) {
        alert("Bu kitap zaten favorilerde.");
        return;
    }

    favoriler.push({ id, ad });
    localStorage.setItem("favoriler", JSON.stringify(favoriler));

    alert(ad + " favorilere eklendi.");
}

// Fiyat Karşılaştırma Verisi
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

// Sayfa Yüklendiğinde Çalışacak Kodlar
window.addEventListener('DOMContentLoaded', () => {
    updateCartUI();

    const themeBtn = document.getElementById('theme-toggle-btn');

    if (themeBtn) {
        themeBtn.innerHTML = document.documentElement.getAttribute('data-theme') === 'light'
            ? '<i class="fas fa-moon"></i>'
            : '<i class="fas fa-sun"></i>';
    }

    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    const sortFilter = document.getElementById("sortFilter");

    if (searchInput) {
        searchInput.addEventListener("keyup", kitaplariFiltrele);
    }

    if (categoryFilter) {
        categoryFilter.addEventListener("change", kitaplariFiltrele);
    }

    if (sortFilter) {
        sortFilter.addEventListener("change", kitaplariFiltrele);
    }

    if (document.getElementById("compare-body")) {
        renderCompareTable(compareData);

        const compareInput = document.getElementById("compare-search");

        if (compareInput) {
            compareInput.addEventListener("input", filterCompare);
        }
    }
});

// İletişim Formu
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contact-form");

    if (!form) return;

    form.addEventListener("submit", async function (e) {
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
