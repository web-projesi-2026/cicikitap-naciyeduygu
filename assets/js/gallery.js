const allBooks = [
    { id: 1, title: "Sefiller", author: "Victor Hugo", cat: "dunya", price: "75.00 TL", img: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400" },
    { id: 2, title: "Aşk-ı Memnu", author: "Halid Ziya Uşaklıgil", cat: "turk", price: "55.00 TL", img: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400" },
    { id: 3, title: "Dönüşüm", author: "Franz Kafka", cat: "dunya", price: "30.00 TL", img: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400" },
    { id: 4, title: "Kendi Gök Kubbemiz", author: "Yahya Kemal Beyatlı", cat: "siir", price: "40.00 TL", img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400" },
    { id: 5, title: "Tutunamayanlar", author: "Oğuz Atay", cat: "roman", price: "85.00 TL", img: "https://images.unsplash.com/photo-1532012197367-e37a701f6ed1?w=400" },
    { id: 6, title: "1984", author: "George Orwell", cat: "dunya", price: "45.00 TL", img: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400" },
    { id: 7, title: "Mai ve Siyah", author: "Halid Ziya Uşaklıgil", cat: "turk", price: "50.00 TL", img: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400" },
    { id: 8, title: "Saatleri Ayarlama Enstitüsü", author: "Ahmet Hamdi Tanpınar", cat: "roman", price: "60.00 TL", img: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400" },
    { id: 9, title: "Otuz Beş Yaş", author: "Cahit Sıtkı Tarancı", cat: "siir", price: "25.00 TL", img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400" },
    { id: 10, title: "Karamazov Kardeşler", author: "Dostoyevski", cat: "dunya", price: "90.00 TL", img: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400" },
    { id: 11, title: "Kuyucaklı Yusuf", author: "Sabahattin Ali", cat: "turk", price: "40.00 TL", img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400" },
    { id: 12, title: "Fareler ve İnsanlar", author: "John Steinbeck", cat: "dunya", price: "35.00 TL", img: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400" },
    { id: 13, title: "İçimizdeki Şeytan", author: "Sabahattin Ali", cat: "turk", price: "45.00 TL", img: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400" },
    { id: 14, title: "Beyaz Gemi", author: "Cengiz Aytmatov", cat: "dunya", price: "38.00 TL", img: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400" },
    { id: 15, title: "Anayurt Oteli", author: "Yusuf Atılgan", cat: "roman", price: "42.00 TL", img: "https://images.unsplash.com/photo-1532012197367-e37a701f6ed1?w=400" },
    { id: 16, title: "Bülbülü Öldürmek", author: "Harper Lee", cat: "dunya", price: "55.00 TL", img: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400" },
    { id: 17, title: "Çile", author: "Necip Fazıl Kısakürek", cat: "siir", price: "48.00 TL", img: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400" },
    { id: 18, title: "Kürk Mantolu Madonna", author: "Sabahattin Ali", cat: "turk", price: "35.00 TL", img: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400" },
    { id: 19, title: "Simyacı", author: "Paulo Coelho", cat: "dunya", price: "40.00 TL", img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400" },
    { id: 20, title: "Sergüzeşt", author: "Samipaşazade Sezai", cat: "turk", price: "30.00 TL", img: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400" }
];

function displayBooks(books) {
    const grid = document.getElementById("gallery-grid");
    if (!grid) return;
    
    grid.innerHTML = "";
    books.forEach(book => {
        grid.innerHTML += `
            <div class="book-card">
                <img src="${book.img}" alt="${book.title}">
                <h3>${book.title}</h3>
                <p style="color: #aaa; cursor: pointer; text-decoration: underline;" onclick="window.location.href='project.html?author=${encodeURIComponent(book.author)}'">${book.author}</p>
                <p>${book.price}</p>
                <button class="btn btn-primary" onclick="addToCart('${book.title}', '${book.price}', '${book.img}')">Sepete Ekle</button>
            </div>
        `;
    });
}

function filterBooks(category) {
    if (category === 'all') {
        displayBooks(allBooks);
    } else {
        const filtered = allBooks.filter(b => b.cat === category);
        displayBooks(filtered);
    }
}

window.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get("cat");
    
    if (catParam) {
        filterBooks(catParam);
    } else {
        displayBooks(allBooks);
    }
});
