// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "vigno-9f55c.firebaseapp.com",
  projectId: "vigno-9f55c",
  storageBucket: "vigno-9f55c.firebasestorage.app",
  messagingSenderId: "732864435750",
  appId: "1:732864435750:web:41a0662d327bb0d859b8e7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

export {app,auth}