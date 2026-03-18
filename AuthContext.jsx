import { createContext, useContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider,
  signOut, updateProfile, sendEmailVerification, sendPasswordResetEmail
} from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAarEYS8mG3RcNKHqmQsUiNguhCDOb8ycs",
  authDomain: "login-99b88.firebaseapp.com",
  projectId: "login-99b88",
  storageBucket: "login-99b88.firebasestorage.app",
  messagingSenderId: "676552242891",
  appId: "1:676552242891:web:3f50a347f49a8849cccd4e"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const provider = new GoogleAuthProvider();

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u || null));
  }, []);

  const loginWithEmail = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const loginWithGoogle = () => signInWithPopup(auth, provider);

  const registerWithEmail = async (name, email, password) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    await sendEmailVerification(cred.user);
    await setDoc(doc(db, "users", cred.user.uid), {
      uid: cred.user.uid, name, email,
      createdAt: serverTimestamp(), provider: "email", profileComplete: false,
    });
    return cred;
  };

  const registerWithGoogle = async () => {
    const result = await signInWithPopup(auth, provider);
    await setDoc(doc(db, "users", result.user.uid), {
      uid: result.user.uid, name: result.user.displayName,
      email: result.user.email, photo: result.user.photoURL,
      createdAt: serverTimestamp(), provider: "google", profileComplete: false,
    }, { merge: true });
    return result;
  };

  const logout = () => signOut(auth);
  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  return (
    <AuthContext.Provider value={{ user, loginWithEmail, loginWithGoogle, registerWithEmail, registerWithGoogle, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);