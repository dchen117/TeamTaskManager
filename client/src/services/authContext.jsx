import { createContext, useState, useEffect, useCallback } from "react";
import api from "./api.js";
import { registerLogoutHandler, setAccessToken, getAccessToken } from "./tokenService.js";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getAccessToken());
  const [loading, setLoading] = useState(true);
  // const [user, setUser] = useState(null);
  
  async function login(email, password) {
    try {
      const res = await api.post('/auth/login', { email, password });
        const accessToken = res.data.accessToken;
        setAccessToken(accessToken);
        setIsAuthenticated(true);
      } catch (error) {
        const message = error.response?.data?.error || error.message || 'Something went wrong';
        throw new Error(message);
    }
  }

  // useCallback is used to prevent registering logout handler on every render
  const logout = useCallback(async () => {
    try {
        await api.post('/auth/logout');
    } catch (error) {
        console.error('Error occurred while logging out:', error);
    }
    setAccessToken(null);
    setIsAuthenticated(false);
  }, []);
  
  useEffect(() => {
    registerLogoutHandler(logout);
  }, [logout]);

  async function register(displayname, username, email, password, confirmPassword) {
    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    } else if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }
    try {
      const res = await api.post('/auth/register', { displayname, username, email, password });
      const accessToken = res.data.accessToken;
      setAccessToken(accessToken);
      setIsAuthenticated(true);
    } catch (error) {
      const message = error.response?.data?.error || error.message || 'Something went wrong';
      throw new Error(message);
    }
  }
    
  useEffect(() => {
    async function initializeAuth() {
      try {
        const res = await api.post('/auth/refresh-token');
        setAccessToken(res.data.accessToken);
        setIsAuthenticated(true);
      } catch {
        setAccessToken(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }
    initializeAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a spinner or skeleton screen
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };