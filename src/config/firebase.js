// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD0bBeHSbXySJETNKkOeitypnXnXcApc2Q",
  authDomain: "cdazzdev-learning-platform.firebaseapp.com",
  projectId: "cdazzdev-learning-platform",
  storageBucket: "cdazzdev-learning-platform.appspot.com",
  messagingSenderId: "310671863731",
  appId: "1:310671863731:web:958617e5aeed7b28f4e5c6",
  measurementId: "G-GHEST8S03N"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);