import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/useAuth";


function AdminLayout() {
  const navigate = useNavigate();

  const {
    user,
    logout,
  } = useAuth();


  const handleLogout = async () => {
    await logout();

    navigate(
      "/login",
      { replace: true }
    );
  };


  return (
    <div className="admin-layout">

      <aside className="sidebar">

        <div className="sidebar-brand">
          <h2>Frio&Co</h2>

          <p>
            Rewards System
          </p>
        </div>


        <nav className="sidebar-nav">

          {user?.role === "ADMIN" && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              Dashboard
            </NavLink>
          )}


          <NavLink
            to="/customers"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            Clientes
          </NavLink>


          <NavLink
            to="/products"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            Productos
          </NavLink>


          <NavLink
            to="/purchases"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            Compras
          </NavLink>


          <NavLink
            to="/rewards"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            Recompensas
          </NavLink>

        </nav>


        <div className="sidebar-footer">

          <p>
            {user?.email}
          </p>

          <span>
            {user?.role === "ADMIN"
              ? "Administrador"
              : "Empleado"}
          </span>

          <button
            type="button"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>

        </div>

      </aside>


      <div className="admin-content">
        <Outlet />
      </div>

    </div>
  );
}


export default AdminLayout;