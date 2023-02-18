import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAtBgQOP98BP-kfPojULSjRj6enAuToJ_I",
  authDomain: "team-ate.firebaseapp.com",
  projectId: "team-ate",
  storageBucket: "team-ate.appspot.com",
  messagingSenderId: "1078110272163",
  appId: "1:1078110272163:web:3c0ac8143d1ed0ceb8dd16",
  measurementId: "G-PJ6PRNK71S",
};

//init firebase
const app = initializeApp(firebaseConfig);
//init firestore
const appFireStore = getFirestore();

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

//Storage (images)
const storage = getStorage(app);

export { auth, provider, app, storage };
