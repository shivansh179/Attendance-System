import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyD7JbfTHm2qFvnpCe8PDHE42vcrujYbysU",
  authDomain: "ciie-summer-training-program.firebaseapp.com",
  databaseURL: "https://ciie-summer-training-program-default-rtdb.firebaseio.com",
  projectId: "ciie-summer-training-program",
  storageBucket: "ciie-summer-training-program.appspot.com",
  messagingSenderId: "230709441202",
  appId: "1:230709441202:web:84017542175ed5ffbe4fab"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { db, auth };
