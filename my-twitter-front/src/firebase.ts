// firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCN0VXyJh3PUfhuJ0bSFE8itC3I1H4ReSs",
  authDomain: "my-twitter-fb8ef.firebaseapp.com",
  projectId: "my-twitter-fb8ef",
  storageBucket: "my-twitter-fb8ef.appspot.com",
  messagingSenderId: "289390394952",
  appId: "1:289390394952:web:fc39be524c413b2eb5227d",
};

const firebaseApp = initializeApp(firebaseConfig);
const fireAuth = getAuth(firebaseApp);

export { fireAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged };
