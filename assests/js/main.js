// Kart verileri
const cardsData = [
    {
        id: 1,
        title: "Eğitim Hayatım",
        description: "Eğitim yolculuğum ve başarılarım",
        image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663372407023/h4RnNWM7asRNrn7fVPYT3E/diploma-AmbtFbkfPPcH24Lh8L2wn9.webp",
        backgroundColor: "linear-gradient(135deg, #fef5e7 0%, #fdebd0 100%)"
    },
    {
        id: 2,
        title: "İlgi Duyduklarım",
        description: "Hoşlandığım şeyler ve aktiviteler",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=400&fit=crop",
        backgroundColor: "linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)"
    },
    {
        id: 3,
        title: "İzlediğim Filmler & Diziler",
        description: "Favori film ve dizi koleksiyonum",
        image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663372407023/h4RnNWM7asRNrn7fVPYT3E/movies-gmHxWxSKLYv7QrNyRvKpJA.webp",
        backgroundColor: "linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)"
    },
    {
        id: 4,
        title: "Okuduğum Kitaplar",
        description: "Sevdiğim kitaplar ve okuma listem",
        image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663372407023/h4RnNWM7asRNrn7fVPYT3E/books-7hJgySxpB7ywmmk5hRL2DD.webp",
        backgroundColor: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)"
    },
    {
        id: 5,
        title: "Evcil Hayvanlarım",
        description: "Sevgili kedi ve köpeğim",
        image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663372407023/h4RnNWM7asRNrn7fVPYT3E/pets-25f5STB8f7swANYh5QjUM9.webp",
        backgroundColor: "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)"
    },
    {
        id: 6,
        title: "Gelecek Planlarım",
        description: "Hayallerim ve hedeflerim",
        image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663372407023/h4RnNWM7asRNrn7fVPYT3E/sunset-Uc35HanRGc4BDP6wMAUpFb.webp",
        backgroundColor: "linear-gradient(135deg, #fffde7 0%, #fff9c4 100%)"
    }
];

// Kartları oluştur
function createCards() {
    const cardsGrid = document.getElementById('cardsGrid');
    
    cardsData.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.style.animationDelay = `${index * 0.1}s`;
        
        cardElement.innerHTML = `
            <div class="card-image" style="background: ${card.backgroundColor};">
                <img src="${card.image}" alt="${card.title}" loading="lazy">
            </div>
            <div class="card-content">
                <h2 class="card-title">${card.title}</h2>
                <p class="card-description">${card.description}</p>
            </div>
        `;
        
        cardsGrid.appendChild(cardElement);
    });
}

// Sayfa yüklendiğinde kartları oluştur
document.addEventListener('DOMContentLoaded', () => {
    createCards();
    
    // Kartlara tıklama efekti ekle (opsiyonel)
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', function() {
            console.log('Kart tıklandı:', this);
            // Burada ek işlemler yapabilirsiniz
        });
    });
});

// Smooth scroll efekti (opsiyonel)
document.addEventListener('scroll', () => {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
            card.style.opacity = '1';
        }
    });
});
