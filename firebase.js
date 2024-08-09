// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Import getFirestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBokd9-6HqtAOlSNBBY6V5BhGdPMsdb7lM",
  authDomain: "inventorytracker-e6d47.firebaseapp.com",
  projectId: "inventorytracker-e6d47",
  storageBucket: "inventorytracker-e6d47.appspot.com",
  messagingSenderId: "861590733217",
  appId: "1:861590733217:web:440e72d44bf5fb1eab4be0",
  measurementId: "G-Y5XRQGD6ZW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore
const firestore = getFirestore(app); // Make sure this is correctly defined

// Export the Firestore instance
export { firestore };
