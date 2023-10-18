import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBdJKtbU19I7d-IsX0g3-aU21DT1nBCq3g",
  authDomain: "task-management-202111.firebaseapp.com",
  projectId: "task-management-202111",
  storageBucket: "task-management-202111.appspot.com",
  messagingSenderId: "498542936471",
  appId: "1:498542936471:web:acfc6d6b4579b0214184d2",
};

// Initialize Firebase
// firebase.initializeApp(firebaseConfig);
export const app = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(app);
