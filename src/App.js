import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import AdminPage from "./pages/AdminPage";
import UserPage from "./pages/UserPage";
import LoginPage from "./pages/LoginPage";

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        {/* Ruta de login */}
        <Route path="/login" element={<LoginPage setUser={setUser} />} />

        {/* Rutas protegidas */}
        <Route
          path="/admin"
          element={user?.role === "admin" ? <AdminPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/user"
          element={user?.role === "user" ? <UserPage /> : <Navigate to="/login" replace />}
        />

        {/* Ruta raíz redirige al login si no hay usuario */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
