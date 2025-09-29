import { createContext, useContext, useEffect, useState } from "react";
import {
  checkAuthStatus,
  login,
  logout,
  updateUser,
} from "../hooks/authContext";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus(setUser, setIsAuthenticated, setLoading);
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated,
    login: (userData, token) =>
      login(userData, token, setUser, setIsAuthenticated),
    logout: () => logout(setUser, setIsAuthenticated),
    updateUser: (updatedUserData) => updateUser(updatedUserData, user, setUser),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
