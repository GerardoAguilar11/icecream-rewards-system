import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../../context/useAuth";


function CustomerLayout() {
  const navigate =
    useNavigate();

  const {
    user,
    logout,
  } = useAuth();


  const handleLogout = async () => {
    await logout();

    navigate(
      "/login",
      {
        replace: true,
      }
    );
  };


  return (
    <div className="customer-layout">

      <aside className="customer-sidebar">

        <div className="customer-sidebar-brand">

          <h2>
            Mi cuenta
          </h2>

          <p>
            Recompensas
          </p>

        </div>


        <nav className="customer-sidebar-nav">

          <NavLink
            to="/customer"
            end
            className={({
              isActive,
            }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            Inicio
          </NavLink>


          <NavLink
            to="/customer/rewards"
            className={({
              isActive,
            }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            Mis recompensas
          </NavLink>


          <NavLink
            to="/customer/redemptions"
            className={({
              isActive,
            }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            Mis canjes
          </NavLink>


          <NavLink
            to="/customer/purchases"
            className={({
              isActive,
            }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            Mis compras
          </NavLink>


          <NavLink
            to="/customer/profile"
            className={({
              isActive,
            }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            Mi perfil
          </NavLink>

        </nav>


        <div className="customer-sidebar-footer">

          <span>
            {user?.email}
          </span>

          <button
            type="button"
            onClick={
              handleLogout
            }
          >
            Cerrar sesión
          </button>

        </div>

      </aside>


      <section className="customer-layout-content">

        <Outlet />

      </section>

    </div>
  );
}


export default CustomerLayout;