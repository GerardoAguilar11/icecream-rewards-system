import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/useAuth";


function Customers() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();

    navigate("/login");
  };

  return (
    <main>
      <h1>Clientes</h1>

      <p>
        Sesión de empleado correcta.
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

export default Customers;