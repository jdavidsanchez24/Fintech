import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // <- Import necesario
import "../styles/AdminPage.css"; // Puedes crear otro CSS si quieres

export default function UserPage() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [term, setTerm] = useState("");
  const userId = 1; // Reemplaza con el ID del usuario logueado
  const navigate = useNavigate();

  // ===== Logout =====
  const handleLogout = () => {
    localStorage.removeItem("token"); // Limpiar token
    navigate("/login"); // Redirigir al login
  };

  // ===== Traer préstamos =====
  const fetchLoans = async () => {
    try {
      const response = await fetch("http://localhost:8082/api/loans");
      const data = await response.json();
      setLoans(data);
    } catch (error) {
      console.error("Error al cargar préstamos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  // ===== Crear nuevo préstamo =====
  const handleCreateLoan = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        userId: Number(userId),
        amount: Number(amount),
        term: Number(term),
      };

      const response = await fetch("http://localhost:8082/api/loans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        alert(result.message);
        setAmount("");
        setTerm("");
        fetchLoans();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error al crear préstamo:", error);
      alert("Error al crear el préstamo");
    }
  };

  if (loading) return <p>Cargando préstamos...</p>;

  return (
    <div className="admin-container">
      <h1>Préstamos</h1>

      {/* Botón logout */}
      <div style={{ marginBottom: "20px" }}>
        <button className="button-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* ===== Formulario ===== */}
      <form onSubmit={handleCreateLoan} style={{ marginBottom: "30px" }}>
        <div style={{ marginBottom: "10px" }}>
          <label>Monto:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{
              marginLeft: "10px",
              padding: "6px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
            required
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Plazo (meses):</label>
          <input
            type="number"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            min="1"
            max="36"
            style={{
              marginLeft: "10px",
              padding: "6px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
            required
          />
        </div>
        <button
          type="submit"
          className="button-approve"
          style={{ marginTop: "5px" }}
        >
          Guardar
        </button>
      </form>

      {/* ===== Tabla de préstamos ===== */}
      {loans.length === 0 ? (
        <p>No tienes préstamos registrados.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Monto</th>
              <th>Plazo</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => {
              const rowClass =
                loan.status === "APROBADO"
                  ? "row-approved"
                  : loan.status === "RECHAZADO"
                  ? "row-rejected"
                  : "";

              return (
                <tr key={loan.id} className={rowClass}>
                  <td>{loan.id}</td>
                  <td>{loan.amount}</td>
                  <td>{loan.term}</td>
                  <td>{loan.status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
