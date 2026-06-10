import { auth, db } from "./firebase.js";

import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const kayitForm = document.getElementById("kayitForm");

kayitForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const adsoyad = document.getElementById("adsoyad").value;
  const email = document.getElementById("email").value;
  const sifre = document.getElementById("sifre").value;
  const sifreTekrar = document.getElementById("sifreTekrar").value;

  if (sifre !== sifreTekrar) {
    alert("Şifreler uyuşmuyor!");
    return;
  }

  try {
    const kullaniciBilgisi = await createUserWithEmailAndPassword(auth, email, sifre);
    const kullanici = kullaniciBilgisi.user;

    await setDoc(doc(db, "uyeler", kullanici.uid), {
      adsoyad: adsoyad,
      email: email,
      rol: "kullanici",
      tarih: new Date().toLocaleDateString("tr-TR")
    });

    alert("Kayıt başarılı! 🐾");
    kayitForm.reset();
    toggleModal("register-modal");

  } catch (error) {
    alert("Hata: " + error.message);
  }
});
