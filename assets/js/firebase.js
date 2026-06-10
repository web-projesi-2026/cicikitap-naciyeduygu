import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC5LhMCjYpj_SHBHcc2_devYC802Wnj0wg",
  authDomain: "cici-kitap.firebaseapp.com",
  projectId: "cici-kitap",
  storageBucket: "cici-kitap.firebasestorage.app",
  messagingSenderId: "931873884855",
  appId: "1:931873884855:web:159e9ff1deef46f1b6db32"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
