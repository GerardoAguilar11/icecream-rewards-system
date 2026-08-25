import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/useAuth";


function Dashboard() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();

    navigate("/login");
  };

  return (
    <main>
      <h1>Dashboard</h1>

      <p>
        Sesión de administrador correcta.
      </p>

      <p>
        Usuario: {user?.email}
      </p>

      <button
        type="button"
        onClick={handleLogout}
      >
        Cerrar sesión
      </button>
    </main>
  );
}

export default Dashboard;