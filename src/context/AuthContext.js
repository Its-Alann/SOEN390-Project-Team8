//https://stackoverflow.com/questions/68104551/react-firebase-authentication-and-usecontext

import React, { createContext, useContext, useEffect, useState } from "react";

import PropTypes from "prop-types";
import { auth } from "../Firebase/firebase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  }

  function signOut() {
    return auth.signOut();
  }

  function signUp(email, password) {
    return auth.createUserWithEmailAndPassword(email, password);
  }

  function getUser() {
    return auth.currentUser;
  }

  function isAdmin() {
    return auth.currentUser.getIdTokenResult().then((idTokenResult) => {
      if (idTokenResult.claims.admin) {
        return true;
      }
      return false;
    });
  }

  function isEditor() {}

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const value = {
    currentUser,
    getUser,
    login,
    signOut,
    signUp,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};
