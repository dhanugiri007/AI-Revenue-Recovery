import { createContext, useState, useEffect } from "react";
import { loginApi, registerApi, logoutApi, getMeApi } from "./services/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while checking existing session

  // On app load, check if a valid session/cookie already exists
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await getMeApi();
        setUser(data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (credentials) => {
    const data = await loginApi(credentials);
    setUser(data);
    return data;
  };

  const register = async (formData) => {
    const data = await registerApi(formData);
    setUser(data);
    return data;
  };

  const logout = async () => {
    await logoutApi();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};