import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from "react";
import axios from "axios";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const defaultContext: AuthContextType = {
  user: null,
  token: null,
  login: async () => { throw new Error("Not implemented"); },
  register: async () => { throw new Error("Not implemented"); },
  logout: () => {},
  isLoading: true
};

const AuthContext = createContext<AuthContextType>(defaultContext);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          // Set up axios defaults
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          
          // Fetch user data
          const response = await axios.get("http://localhost:3001/api/users/me");
          setUser(response.data);
        } catch (error) {
          // If token is invalid, clear everything
          console.error("Failed to fetch user data:", error);
          setToken(null);
          localStorage.removeItem("token");
          delete axios.defaults.headers.common["Authorization"];
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, [token]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post("http://localhost:3001/api/auth/login", {
        email,
        password,
      });
      setToken(response.data.token);
    } catch (error) {
      throw new Error("Invalid credentials");
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await axios.post("http://localhost:3001/api/auth/register", {
        email,
        password,
        name,
      });
      setToken(response.data.token);
    } catch (error) {
      throw new Error("Registration failed");
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 