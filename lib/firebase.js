import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDViQnT86wiFUH-s7bg2p1dMM27UQ92_PM",
  authDomain: "luminabooks-eb352.firebaseapp.com",
  projectId: "luminabooks-eb352",
  storageBucket: "luminabooks-eb352.firebasestorage.app",
  messagingSenderId: "703786932739",
  appId: "1:703786932739:web:879aeb8d0b6809ef20cc36",
  measurementId: "G-6GH7K6WXCN"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);

// Helper function to add books to Firestore
export async function addBookToDatabase(bookData) {
  try {
    const docRef = await addDoc(collection(db, "books"), bookData);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding book: ", error);
    return { success: false, error };
  }
}

// Helper function to fetch books from Firestore
export async function getBooks() {
  try {
    const querySnapshot = await getDocs(collection(db, "books"));
    const books = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return books;
  } catch (error) {
    console.error("Error fetching books: ", error);
    return [];
  }
}