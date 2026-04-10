// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZdL15dvVapaoL70YBk2jNT7Z63-eSXcs",
  authDomain: "rocroccar.firebaseapp.com",
  projectId: "rocroccar",
  storageBucket: "rocroccar.firebasestorage.app",
  messagingSenderId: "419855627405",
  appId: "1:419855627405:web:df26c89089e1063fab9ec4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };
export default app;
