/* eslint-disable no-useless-catch */
/* eslint-disable react/prop-types */
import React, { createContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  updatePassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import app from "../firebase/firebase.config";
import axios from "axios";
export const AuthContext = createContext();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const apiKeyFirebase = import.meta.env.VITE_APIKEY;

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // create an account
  const createUserWithoutLogin = async (email, password) => {
    try {
      const response = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKeyFirebase}`,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // signup with gmail
  const signUpWithGmail = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  // login using email & password
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // logout
  const logOut = () => {
    return signOut(auth);
  };

  const updateUserProfile = (name, photoURL) => {
    const user = auth.currentUser;
    if (user) {
      return updateProfile(user, {
        displayName: name,
        photoURL: photoURL,
      });
    } else {
      // Handle the case when user is not authenticated
      console.error("User is not authenticated");
      return Promise.reject("User is not authenticated");
    }
  };
  const changePassword = async (newPassword) => {
    const user = auth.currentUser;

    if (!user) {
      console.error("User is not authenticated");
      return Promise.reject("User is not authenticated");
    }

    try {
      await updatePassword(user, newPassword);
      console.log("Password updated successfully");
    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
    }
  };
  const forgetPassword = async (password) => {
    try {
      await sendPasswordResetEmail(auth, password);
    } catch (error) {
      throw error;
    }
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userInfo = { email: currentUser.email };
        axios.post("http://localhost:3000/jwt", userInfo).then((response) => {
          if (response.data.token) {
            localStorage.setItem("access-token", response.data.token);
          }
        });
      } else {
        localStorage.removeItem("access-token");
      }
      setLoading(false);
    });

    return () => {
      return unsubscribe();
    };
  }, []);

  const authInfo = {
    user,
    createUser,
    createUserWithoutLogin,
    signUpWithGmail,
    login,
    logOut,
    updateUserProfile,
    loading,
    changePassword,
    forgetPassword,
    isVerified,
    setIsVerified,
  };
  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
