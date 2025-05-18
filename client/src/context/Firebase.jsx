import { createContext, useContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
    createUserWithEmailAndPassword,
    getAuth,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    signOut,
    sendPasswordResetEmail as firebaseSendPasswordResetEmail,
} from "firebase/auth";
import {
    addDoc,
    collection,
    getFirestore,
    getDocs,
    getDoc,
    doc
} from "firebase/firestore";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyBWP7v45xEJr3iLho6RAfUjZoCkefuTffo",
    authDomain: "booksylane.firebaseapp.com",
    projectId: "booksylane",
    storageBucket: "booksylane.firebasestorage.app",
    messagingSenderId: "726462116283",
    appId: "1:726462116283:web:a20f51f1c88bcb5ab9949e"
};

const app = initializeApp(firebaseConfig);
const fireBaseAuth = getAuth(app);
const fireBaseFS = getFirestore(app);
const Gprovider = new GoogleAuthProvider();

const FireBase = createContext(null);
export const useFireBase = () => useContext(FireBase);

export const FireBaseProvider = (props) => {
    const [state, setState] = useState(null);

    useEffect(() => {
        onAuthStateChanged(fireBaseAuth, (user) => {
            if (user) {
                setState(user);
            } else {
                setState(null);
            }
            console.log("User status changed:", user);
        });
    }, []);

    const isLoggedIn = !!state;
//   import { doc, getDoc } from "firebase/firestore";

async function getBookById(id) {
  const docRef = doc(fireBaseFS, "books", id);  // "books" is your collection name
  const docSnap = await getDoc(docRef);
  return docSnap;
}


    
const sendPasswordResetEmail = (email) => {
    return firebaseSendPasswordResetEmail(fireBaseAuth, email);
};
    const signUpUser = (email, password) => {
        return createUserWithEmailAndPassword(fireBaseAuth, email, password);
    };

    const signInUser = (email, password) => {
        return signInWithEmailAndPassword(fireBaseAuth, email, password);
    };

    const signInUserWithGoogle = () => {
        return signInWithPopup(fireBaseAuth, Gprovider);
    };

    const logout = () => {
        return signOut(fireBaseAuth);
    };

    const listAllBooks = () => {
        return getDocs(collection(fireBaseFS, "books"));
    };

    const handleCreate = async (name, isbn, price, cover) => {
        return await addDoc(collection(fireBaseFS, 'books'), {
            name,
            isbn,
            price,
            coverUrl: cover,
            userId: state?.uid,
            userEmail: state?.email,
            displayName: state?.displayName,
            photoUrl: state?.photoURL
        });
    };

    return (
        <FireBase.Provider
            value={{
                signUpUser,
                signInUser,
                signInUserWithGoogle,
                logout,
                isLoggedIn,
                user: state,
                handleCreate,
                listAllBooks,
                getBookById,
                sendPasswordResetEmail
            }}
        >
            {props.children}
        </FireBase.Provider>
    );
};
export { fireBaseFS };  // add at bottom
    