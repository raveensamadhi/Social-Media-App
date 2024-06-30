import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
/*
const firebaseConfig = {
  apiKey: "AIzaSyCtddVpRPP2Jwmiea0GKPndYiajEA1RSyU",
  authDomain: "social-media-app-1ce75.firebaseapp.com",
  projectId: "social-media-app-1ce75",
  storageBucket: "social-media-app-1ce75.appspot.com",
  messagingSenderId: "817878614657",
  appId: "1:817878614657:web:087a15348f015634378380",
  measurementId: "G-W3TEP9F9HF"
};*/

const firebaseConfig = {
  apiKey: "AIzaSyBY-EmLtxruXDqp1l1Q19oepmv11GQPOeo",
  authDomain: "sm-app-6b6a2.firebaseapp.com",
  projectId: "sm-app-6b6a2",
  storageBucket: "sm-app-6b6a2.appspot.com",
  messagingSenderId: "656803092540",
  appId: "1:656803092540:web:c6e6deda7c3456f9aa4b39"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const db = getFirestore(app);

export { auth, provider, db }
