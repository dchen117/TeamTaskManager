import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import RegistrationPage from "./pages/RegistrationPage.jsx";
import ProtectedRoute from "./pages/ProtectedRoute";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route element={<ProtectedRoute />}>
          {/* Protected routes go here */}
          <Route path="/" element={<Navigate to="/home" replace/>} />
          <Route path="/home/:workspaceId?/:projectId?" element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
