import { auth } from "./firebase.js";

import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

const girisForm = document.getElementById("girisForm");
const loginBtn = document.querySelector("button[onclick=\"toggleModal('login-modal')\"]");
const registerBtn = document.querySelector("button[onclick=\"toggleModal('register-modal')\"]");

girisForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("login-email").value;
  const sifre = document.getElementById("login-password").value;

  try {
    await signInWithEmailAndPassword(auth, email, sifre);

    alert("Giriş başarılı! 🐾");
    girisForm.reset();
    toggleModal("login-modal");

  } catch (error) {
    alert("Giriş hatası: " + error.message);
  }
});

onAuthStateChanged(auth, function (user) {
  if (user) {
    if (loginBtn) {
      loginBtn.innerHTML = user.email;
      loginBtn.onclick = null;
    }

    if (registerBtn) {
      registerBtn.innerHTML = "Çıkış Yap";
      registerBtn.onclick = async function () {
        await signOut(auth);
        location.reload();
      };
    }
  }
});
