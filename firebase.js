// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDRDT2SA8roel_0XnUjWg--8QGj7FFDPaE",
  authDomain: "inventory-management-4eaf9.firebaseapp.com",
  projectId: "inventory-management-4eaf9",
  storageBucket: "inventory-management-4eaf9.appspot.com",
  messagingSenderId: "991714129551",
  appId: "1:991714129551:web:e19115e2ae167e885de2fa",
  measurementId: "G-SCM3J9JFY7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app)

export {firestore}