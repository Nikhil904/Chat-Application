import React, { useEffect } from "react";
import Navbar from "./Components/Navbar";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Profile from "./Pages/Profile";
import Setting from "./Pages/Setting";
import HomePage from "./Pages/HomePage";
import { AuthStore } from "./Store/UseAuthStore";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { ThemeStore } from "./Store/UseTheneStore";

// ProtectedRoute Component
const ProtectedRoute = ({ authUser, children }) => {
  if (!authUser) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = AuthStore();
  const{theme} = ThemeStore()

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

    console.log(theme)

  return (
    <div data-theme={theme}>
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/settings" element={<Setting />} />
        {/* Protected Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute authUser={authUser}>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/home"
          element={
            <ProtectedRoute authUser={authUser}>
              <HomePage />
            </ProtectedRoute>
          }
        />

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
