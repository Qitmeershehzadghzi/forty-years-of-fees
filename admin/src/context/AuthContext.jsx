import React, {createContext, useContext, useState, useEffect} from "react";
import {request} from "../services/api";
const Auth = createContext(null);
export function AuthProvider({children}) {
  const [authenticated, setAuthenticated] = useState(false);
  useEffect(() => {request("/auth/me").then(() => setAuthenticated(true)).catch(() => {});}, []);
  return <Auth.Provider value={{authenticated, setAuthenticated}}>{children}</Auth.Provider>;
}
export const useAuth = () => useContext(Auth);
