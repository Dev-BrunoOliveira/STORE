import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDPabVh2gEo0KDCht37UIdXLH7uRERkMaQ",
  authDomain: "fila-max.firebaseapp.com",
  databaseURL: "https://fila-max-default-rtdb.firebaseio.com",
  projectId: "fila-max",
  storageBucket: "fila-max.firebasestorage.app",
  messagingSenderId: "510563372182",
  appId: "1:510563372182:web:9c7e98733c23f9e51cc6b7",
  measurementId: "G-Y1F9VL0W81",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { app, db };
