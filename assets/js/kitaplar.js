import {
  db,
  collection,
  addDoc,
  getDocs,
  serverTimestamp
} from "./firebase.js";

const kitapListesi = document.getElementById("book-list");

async function kitaplariGetir() {
  const kitaplarRef = collection(db, "kitaplar");
  const sonuc = await getDocs(kitaplarRef);

  kitapListesi.innerHTML = "";

  sonuc.forEach((doc) => {
    const kitap = doc.data();

    kitapListesi.innerHTML += `
      <div class="book-card">
        <img src="${kitap.resim}" alt="${kitap.ad}">
        <h3>${kitap.ad}</h3>
        <p>${kitap.yazar}</p>
        <p>${kitap.fiyat} TL</p>
        <button>Favorilere Ekle</button>
      </div>
    `;
  });
}

kitaplariGetir();
