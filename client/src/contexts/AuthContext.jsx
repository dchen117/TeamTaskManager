import { createContext, useState, useEffect, useCallback } from "react";
import api from "../services/api.js";
import { registerLogoutHandler, setAccessToken, getAccessToken } from "../services/tokenService.js";
import { Spinner } from "@/components/ui/spinner.jsx"

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getAccessToken());
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  async function getUserInfo() {
    try {
      const res = await api.get('/auth/userInfo');
      setUser(res.data);
    } catch (error) {
      console.error(error.message);
    }
  }
  
  async function login(email, password) {
    try {
      const res = await api.post('/auth/login', { email, password });
      const accessToken = res.data.accessToken;
      setAccessToken(accessToken);
      setIsAuthenticated(true);
      getUserInfo();
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
    setUser(null);
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
      getUserInfo();
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
        getUserInfo();
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
    return <div className={"flex h-screen justify-center items-center"}><Spinner className={"size-8"}/></div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, register, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };