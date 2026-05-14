import { createContext, useContext, useState } from "react";
import api from "../api/Client";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const email = localStorage.getItem("email");
    const fullName = localStorage.getItem("fullName");
    return email ? { email, fullName } : null;
  });

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("email", data.email);
    localStorage.setItem("fullName", data.fullName);
    setUser({ email: data.email, fullName: data.fullName });
  };

  const register = async (email, password, fullName) => {
    const { data } = await api.post("/auth/register", { email, password, fullName });
    localStorage.setItem("token", data.token);
    localStorage.setItem("email", data.email);
    localStorage.setItem("fullName", data.fullName);
    setUser({ email: data.email, fullName: data.fullName });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
