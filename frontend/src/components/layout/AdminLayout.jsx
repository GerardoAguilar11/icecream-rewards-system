import {
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  Gift,
  IceCreamBowl,
  LayoutDashboard,
  LogOut,
  Menu,
  ShoppingCart,
  Users,
  X,
} from "lucide-react";

import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import {
  useState,
} from "react";

import {
  useAuth,
} from "../../context/useAuth";


function AdminLayout() {
  const navigate =
    useNavigate();

  const {
    user,
    logout,
  } = useAuth();

  const [
    collapsed,
    setCollapsed,
  ] = useState(false);

  const [
    mobileOpen,
    setMobileOpen,
  ] = useState(false);


  const handleLogout = async () => {
    await logout();

    navigate(
      "/login",
      {
        replace: true,
      }
    );
  };


  const closeMobileMenu = () => {
    setMobileOpen(false);
  };


  const getNavClass = ({
    isActive,
  }) =>
    isActive
      ? "nav-link active"
      : "nav-link";


  return (
    <div
      className={
        `admin-layout ${
          collapsed
            ? "sidebar-collapsed"
            : ""
        }`
      }
    >

      {/* Mobile Header */}

      <header className="mobile-navigation-header">

        <button
          type="button"
          className="mobile-menu-button"
          onClick={() =>
            setMobileOpen(true)
          }
          aria-label="Abrir menú"
        >
          <Menu size={22} />
        </button>


        <div className="mobile-navigation-brand">

          <strong>
            Frio&Co
          </strong>

          <span>
            {user?.role === "ADMIN"
              ? "Administrador"
              : "Empleado"}
          </span>

        </div>

      </header>


      {/* Mobile Backdrop */}

      {mobileOpen && (
        <button
          type="button"
          className="navigation-backdrop"
          onClick={closeMobileMenu}
          aria-label="Cerrar menú"
        />
      )}


      {/* Sidebar */}

      <aside
        className={
          `sidebar ${
            mobileOpen
              ? "mobile-open"
              : ""
          }`
        }
      >

        <div className="sidebar-top">

          <div className="sidebar-brand">

            <div className="sidebar-brand-text">

              <h2>
                Frio&Co
              </h2>

              <p>
                Rewards System
              </p>

            </div>


            <button
              type="button"
              className="mobile-menu-close"
              onClick={closeMobileMenu}
              aria-label="Cerrar menú"
            >
              <X size={22} />
            </button>

          </div>


          <button
            type="button"
            className="sidebar-collapse-button"
            onClick={() =>
              setCollapsed(
                (current) =>
                  !current
              )
            }
            aria-label={
              collapsed
                ? "Expandir menú"
                : "Contraer menú"
            }
            title={
              collapsed
                ? "Expandir menú"
                : "Contraer menú"
            }
          >
            {collapsed ? (
              <ChevronRight
                size={20}
              />
            ) : (
              <ChevronLeft
                size={20}
              />
            )}
          </button>

        </div>


        {/* Navigation */}

        <nav className="sidebar-nav">

          {user?.role === "ADMIN" && (
            <NavLink
              to="/dashboard"
              className={
                getNavClass
              }
              onClick={
                closeMobileMenu
              }
              title="Dashboard"
            >

              <span className="nav-icon">
                <LayoutDashboard
                  size={20}
                />
              </span>

              <span className="nav-label">
                Dashboard
              </span>

            </NavLink>
          )}


          <NavLink
            to="/customers"
            className={
              getNavClass
            }
            onClick={
              closeMobileMenu
            }
            title="Clientes"
          >

            <span className="nav-icon">
              <Users size={20} />
            </span>

            <span className="nav-label">
              Clientes
            </span>

          </NavLink>


          {user?.role === "ADMIN" && (
            <NavLink
              to="/employees"
              className={
                getNavClass
              }
              onClick={
                closeMobileMenu
              }
              title="Empleados"
            >

              <span className="nav-icon">
                <BriefcaseBusiness
                  size={20}
                />
              </span>

              <span className="nav-label">
                Empleados
              </span>

            </NavLink>
          )}


          <NavLink
            to="/products"
            className={
              getNavClass
            }
            onClick={
              closeMobileMenu
            }
            title="Productos"
          >

            <span className="nav-icon">
              <IceCreamBowl
                size={20}
              />
            </span>

            <span className="nav-label">
              Productos
            </span>

          </NavLink>


          <NavLink
            to="/purchases"
            className={
              getNavClass
            }
            onClick={
              closeMobileMenu
            }
            title="Compras"
          >

            <span className="nav-icon">
              <ShoppingCart
                size={20}
              />
            </span>

            <span className="nav-label">
              Compras
            </span>

          </NavLink>


          <NavLink
            to="/rewards"
            className={
              getNavClass
            }
            onClick={
              closeMobileMenu
            }
            title="Recompensas"
          >

            <span className="nav-icon">
              <Gift size={20} />
            </span>

            <span className="nav-label">
              Recompensas
            </span>

          </NavLink>

        </nav>


        {/* Footer */}

        <div className="sidebar-footer">

          <div className="sidebar-user-info">

            <p>
              {user?.email}
            </p>

            <span>
              {user?.role === "ADMIN"
                ? "Administrador"
                : "Empleado"}
            </span>

          </div>


          <button
            type="button"
            className="sidebar-logout-button"
            onClick={
              handleLogout
            }
            title="Cerrar sesión"
          >

            <LogOut
              className="logout-icon"
              size={19}
            />

            <span className="logout-label">
              Cerrar sesión
            </span>

          </button>

        </div>

      </aside>


      {/* Content */}

      <div className="admin-content">

        <Outlet />

      </div>

    </div>
  );
}


export default AdminLayout;