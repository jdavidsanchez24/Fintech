import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // <- Import necesario para navegación
import "../styles/AdminPage.css";

export default function AdminPage() {
  const [loans, setLoans] = useState([]);
  const navigate = useNavigate(); // <- Hook para redirigir

  // ===== Función logout =====
  const handleLogout = () => {
    // Si estás usando localStorage para JWT
    localStorage.removeItem("token"); // o el nombre de tu token
    // Redirigir al login
    navigate("/login");
  };

  // ===== Traer todos los préstamos =====
  const fetchLoans = async () => {
    try {
      const res = await fetch("http://localhost:8082/api/loans");
      const data = await res.json();
      setLoans(data);
    } catch (error) {
      console.error("Error cargando préstamos:", error);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  // ===== Actualizar estado del préstamo =====
  const updateLoanStatus = async (id, status) => {
    try {
      const backendStatus =
        status === "APPROVED"
          ? "APROBADO"
          : status === "REJECTED"
          ? "RECHAZADO"
          : status;

      await fetch(`http://localhost:8082/api/loans/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: backendStatus }),
      });
      fetchLoans();
    } catch (error) {
      console.error("Error actualizando estado:", error);
      alert("No se pudo actualizar el estado del préstamo.");
    }
  };

  // ===== Eliminar todos los préstamos =====
  const deleteAllLoans = async () => {
    if (!window.confirm("¿Estás seguro que quieres eliminar todos los préstamos?")) return;

    try {
      const res = await fetch("http://localhost:8082/api/loans", {
        method: "DELETE",
      });
      const result = await res.json();

      if (result.success) {
        alert(result.message);
        fetchLoans();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error eliminando préstamos:", error);
      alert("No se pudieron eliminar los préstamos");
    }
  };

  const pending = loans.filter((l) => l.status === "PENDIENTE");
  const approved = loans.filter((l) => l.status === "APROBADO");
  const rejected = loans.filter((l) => l.status === "RECHAZADO");

  return (
    <div className="admin-container">
      <h1>Página de Admin</h1>
      <p>Solo accesible para usuarios con rol "admin"</p>

      {/* Botón logout */}
      <div style={{ marginBottom: "20px" }}>
        <button className="button-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Botón eliminar todos */}
      <div style={{ marginBottom: "20px" }}>
        <button className="button-reject" onClick={deleteAllLoans}>
          Eliminar todos los préstamos
        </button>
      </div>

      {/* Pendientes */}
      <h2>Préstamos Pendientes</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Monto</th>
            <th>Plazo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pending.map((loan) => (
            <tr key={loan.id}>
              <td>{loan.id}</td>
              <td>{loan.user_id}</td>
              <td>{loan.amount}</td>
              <td>{loan.term}</td>
              <td>
                <button
                  className="button-approve"
                  onClick={() => updateLoanStatus(loan.id, "APPROVED")}
                >
                  Aprobar
                </button>
                <button
                  className="button-reject"
                  onClick={() => updateLoanStatus(loan.id, "REJECTED")}
                >
                  Rechazar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Aprobados */}
      <h2 style={{ color: "green" }}>Préstamos Aprobados</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Monto</th>
            <th>Plazo</th>
          </tr>
        </thead>
        <tbody>
          {approved.map((loan) => (
            <tr key={loan.id} className="row-approved">
              <td>{loan.id}</td>
              <td>{loan.user_id}</td>
              <td>{loan.amount}</td>
              <td>{loan.term}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Rechazados */}
      <h2 style={{ color: "red" }}>Préstamos Rechazados</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Monto</th>
            <th>Plazo</th>
          </tr>
        </thead>
        <tbody>
          {rejected.map((loan) => (
            <tr key={loan.id} className="row-rejected">
              <td>{loan.id}</td>
              <td>{loan.user_id}</td>
              <td>{loan.amount}</td>
              <td>{loan.term}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
