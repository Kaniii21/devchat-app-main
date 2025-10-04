"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { doc, setDoc, getDoc, getFirestore } from "firebase/firestore";
import { GithubAuthProvider } from "firebase/auth"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile as firebaseUpdateProfile,
} from "firebase/auth"
import { auth, app } from "@/services/firebase"

const AuthContext = createContext()

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
  const db = getFirestore(app);
  const [user, setUser] = useState(null)
  const [authUser, setAuthUser] = useState(null) // Keep track of the actual Firebase auth user
  const [loading, setLoading] = useState(true)

  const getUserData = async (uid) => {
    console.log("Attempting to fetch user data for uid:", uid);
    const userDocRef = doc(db, "users", uid);
    try {
      const userDocSnap = await getDoc(userDocRef);
      console.log("User doc snapshot exists:", userDocSnap.exists());
      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        
        // Check if we have an avatarImage in Firestore and use it for photoURL if exists
        if (data.avatarImage && !data.photoURL) {
          data.photoURL = data.avatarImage;
        }
        
        console.log("Retrieved user data:", { ...data, uid });
        return data;
      } else {
        console.log("No user document found!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user document:", error);
      throw error;
    }
  };

  // Google Login
  const googleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const userData = userCredential.user;
      setAuthUser(userData); // Save auth user

      const userDocRef = doc(db, "users", userData.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
          uid: userData.uid,
          email: userData.email,
          displayName: userData.displayName,
          isAdmin: false,
        });
      }
      const userDataFromDb = await getUserData(userData.uid)
      setUser(userDataFromDb)
    } catch (error) {
      throw error
    }
  }

  // Github Login
  const githubLogin = async () => {
    try {
      const provider = new GithubAuthProvider()
      const userCredential = await signInWithPopup(auth, provider);
      const userData = userCredential.user;
      setAuthUser(userData); // Save auth user

      const userDocRef = doc(db, "users", userData.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
          uid: userData.uid,
          email: userData.email,
          displayName: userData.displayName,
          isAdmin: false,
        });
      }
      setUser(await getUserData(userData.uid))
    } catch (error) {
      throw error
    }
  }

  // Register a new user
  const register = async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const currentUser = userCredential.user;
      setAuthUser(currentUser); // Save auth user

      // Update the user profile with display name
      if (currentUser) {
        displayName && await firebaseUpdateProfile(currentUser, {
          displayName: displayName,
        })
      }
      const userDocRef = doc(db, "users", currentUser.uid);
      await setDoc(userDocRef, {
        uid: currentUser.uid,
        email: email,
        displayName: displayName,
        isAdmin: false,
      });

      return currentUser
    } catch (error) {
      throw error
    }
  }

  // Login existing user
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const currentUser = userCredential.user;
      setAuthUser(currentUser); // Save auth user

      const userDataFromDb = await getUserData(currentUser.uid);
      setUser({
        ...userDataFromDb,
        uid: currentUser.uid
      });
      return currentUser
    } catch (error) {
      throw error
    }
  }

  // Logout user
  const logout = async () => {
    try {
      await signOut(auth)
      setAuthUser(null);
    } catch (error) {
      throw error
    }
  }

  // Listen for auth state changes
  useEffect(() => {
    console.log("Setting up auth state listener");
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log("Auth state changed. Current user:", currentUser?.uid);
      setAuthUser(currentUser); // Save the Firebase auth user object
      
      if (currentUser) {
        try {
          console.log("Fetching user data from Firestore");
          const userData = await getUserData(currentUser.uid);
          
          // Create the user object with data from both auth and Firestore
          const updatedUser = {
            ...userData,
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName || userData?.displayName,
            // Use avatarImage for display but keep it separate from auth photoURL
            photoURL: userData?.avatarImage || currentUser.photoURL,
            // Keep track of original auth photoURL separately
            authPhotoURL: currentUser.photoURL
          };
          console.log("Setting user state with:", updatedUser);
          setUser(updatedUser);
        } catch (error) {
          console.error("Error in auth state change:", error);
          // Set basic user data if database fetch fails
          const basicUser = {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            isAdmin: false,
          };
          console.log("Setting basic user state:", basicUser);
          setUser(basicUser);
        }
      } else {
        console.log("No current user, setting user state to null");
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      console.log("Cleaning up auth state listener");
      unsubscribe();
    };
  }, []);

  const value = {
    user,
    authUser, // Include the auth user in the context
    loading,
    isAdmin: user?.isAdmin,
    register,
    login,
    googleLogin,
    githubLogin,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
