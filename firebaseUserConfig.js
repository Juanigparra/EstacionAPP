// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfigSecondDB = {
  apiKey: "AIzaSyCsZSGQoU5VmirVre_gmzzjMZZujz-ry_w",
  authDomain: "estacionapp-ba744.firebaseapp.com",
  databaseURL: "https://estacionapp-ba744.firebaseio.com" ,
  projectId: "estacionapp-ba744",
  storageBucket: "estacionapp-ba744.appspot.com",
  messagingSenderId: "348368025272",
  appId: "1:348368025272:web:59b34f76ad54e831f9264d"
};

// Initialize Firebase
const appSecondDB = initializeApp(firebaseConfigSecondDB, "secondary"); // "secondary" es un nombre arbitrario para esta instancia
// ... (tu código existente)

export { appSecondDB, firebaseConfigSecondDB }; 
