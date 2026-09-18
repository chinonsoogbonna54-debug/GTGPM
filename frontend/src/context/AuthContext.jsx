import { createContext, useContext, useState, useEffect } from "react";
import { api, getToken } from "../api/client";

// This context is the single source of truth for "is an admin logged in
// right now, and who are they". Any component can call useAuth() to read
// or change that, instead of passing login state down through props.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getToken());
  const [loading, setLoading] = useState(false);

  const isLoggedIn = Boolean(token);

  function login(newToken) {
    localStorage.setItem("gtgpm_admin_token", newToken);
    setToken(newToken);
  }

  function logout() {
    localStorage.removeItem("gtgpm_admin_token");
    setToken(null);
  }

  const value = { token, isLoggedIn, loading, setLoading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside an AuthProvider");
  return ctx;
}
