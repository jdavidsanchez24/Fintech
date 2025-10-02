import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css"; // ← Importamos CSS

export default function LoginPage({ setUser }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8082/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
        if (data.user.role === "admin") navigate("/admin");
        else if (data.user.role === "user") navigate("/user");
      } else {
        setUser(null);
        setMessage(data.message);
      }
    } catch (error) {
      console.error(error);
      setMessage("Error de conexión con la API");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>FinTech Login</h1>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Ingresar</button>
        </form>
      </div>
    </div>
  );
}
