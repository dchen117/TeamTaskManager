import { createContext, useState } from "react";
import api, { setAccessToken } from "./api";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("accessToken")
  );

  async function login(email, password) {
    try {
        const res = await api.post('/auth/login', { email, password });
        const accessToken = res.data.accessToken;
        localStorage.setItem("accessToken", accessToken);
        setAccessToken(accessToken);
        setIsAuthenticated(true);
    } catch (error) {
        const message = error.response?.data?.error || error.message || 'Something went wrong';
        throw new Error(message);
    }
  }

  async function logout() {
    try {
        await api.post('/auth/logout');
    } catch (error) {
        console.error('Error occurred while logging out:', error);
    }
    localStorage.removeItem("accessToken");
    setAccessToken(null);
    setIsAuthenticated(false);
  }

  async function register(displayname, username, email, password, confirmPassword) {
    if (password !== confirmPassword) {
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

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };