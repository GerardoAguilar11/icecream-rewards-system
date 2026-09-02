import {
  ChevronLeft,
  ChevronRight,
  Gift,
  House,
  LogOut,
  Menu,
  ReceiptText,
  TicketCheck,
  UserRound,
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

import {
  useNotification,
} from "../../context/useNotification";

import frioCoLogo
  from "../../assets/frio-co-logo-ui.png";

import frioCoMark
  from "../../assets/frio-co-mark.png";


function CustomerLayout() {
  const navigate =
    useNavigate();

  const {
    user,
    logout,
  } = useAuth();

  const {
    showSuccess,
    showError,
  } = useNotification();

  const [
    collapsed,
    setCollapsed,
  ] = useState(false);

  const [
    mobileOpen,
    setMobileOpen,
  ] = useState(false);

  const [
    loggingOut,
    setLoggingOut,
  ] = useState(false);


  const handleLogout =
    async () => {
      try {
        setLoggingOut(
          true
        );

        await logout();

        showSuccess(
          "Sesión cerrada correctamente."
        );

        navigate(
          "/login",
          {
            replace: true,
          }
        );
      } catch {
        showError(
          "No fue posible cerrar la sesión."
        );
      } finally {
        setLoggingOut(
          false
        );
      }
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
        `customer-layout ${
          collapsed
            ? "sidebar-collapsed"
            : ""
        }`
      }
    >

      {/* Mobile header */}

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

          <div className="mobile-brand-icon">

            <img
              src={frioCoMark}
              alt=""
              className="mobile-brand-mark"
            />

          </div>


          <div>

            <strong>
              Frio&Co
            </strong>

            <span>
              Cliente
            </span>

          </div>

        </div>

      </header>


      {/* Backdrop mobile */}

      {mobileOpen && (
        <button
          type="button"
          className="navigation-backdrop"
          onClick={
            closeMobileMenu
          }
          aria-label="Cerrar menú"
        />
      )}


      {/* Sidebar */}

      <aside
        className={
          `customer-sidebar ${
            mobileOpen
              ? "mobile-open"
              : ""
          }`
        }
      >

        <div className="sidebar-top">

          <div className="customer-sidebar-brand">

            <div className="sidebar-brand-expanded">

              <img
                src={frioCoLogo}
                alt="Frio&Co"
                className="sidebar-brand-logo"
              />

              <div className="sidebar-brand-caption">

                <span>
                  Mi cuenta
                </span>

              </div>

            </div>


            <div className="sidebar-brand-collapsed">

              <img
                src={frioCoMark}
                alt="Frio&Co"
                className="sidebar-brand-mark"
              />

            </div>


            <button
              type="button"
              className="mobile-menu-close"
              onClick={
                closeMobileMenu
              }
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
                size={19}
              />
            ) : (
              <ChevronLeft
                size={19}
              />
            )}

          </button>

        </div>


        {/* Customer navigation */}

        <nav className="customer-sidebar-nav">

          <NavLink
            to="/customer"
            end
            className={
              getNavClass
            }
            onClick={
              closeMobileMenu
            }
            title="Inicio"
          >

            <span className="nav-icon">
              <House size={20} />
            </span>

            <span className="nav-label">
              Inicio
            </span>

          </NavLink>


          <NavLink
            to="/customer/rewards"
            className={
              getNavClass
            }
            onClick={
              closeMobileMenu
            }
            title="Mis recompensas"
          >

            <span className="nav-icon">
              <Gift size={20} />
            </span>

            <span className="nav-label">
              Mis recompensas
            </span>

          </NavLink>


          <NavLink
            to="/customer/redemptions"
            className={
              getNavClass
            }
            onClick={
              closeMobileMenu
            }
            title="Mis canjes"
          >

            <span className="nav-icon">
              <TicketCheck
                size={20}
              />
            </span>

            <span className="nav-label">
              Mis canjes
            </span>

          </NavLink>


          <NavLink
            to="/customer/purchases"
            className={
              getNavClass
            }
            onClick={
              closeMobileMenu
            }
            title="Mis compras"
          >

            <span className="nav-icon">
              <ReceiptText
                size={20}
              />
            </span>

            <span className="nav-label">
              Mis compras
            </span>

          </NavLink>


          <NavLink
            to="/customer/profile"
            className={
              getNavClass
            }
            onClick={
              closeMobileMenu
            }
            title="Mi perfil"
          >

            <span className="nav-icon">
              <UserRound
                size={20}
              />
            </span>

            <span className="nav-label">
              Mi perfil
            </span>

          </NavLink>

        </nav>


        {/* Footer */}

        <div className="customer-sidebar-footer">

          <div className="sidebar-user-info">

            <p>
              {user?.email}
            </p>

            <span>
              Cliente
            </span>

          </div>


          <button
            type="button"
            className="sidebar-logout-button"
            onClick={
              handleLogout
            }
            disabled={
              loggingOut
            }
            title="Cerrar sesión"
          >

            <LogOut
              className="logout-icon"
              size={19}
            />

            <span className="logout-label">

              {loggingOut
                ? "Cerrando sesión..."
                : "Cerrar sesión"}

            </span>

          </button>

        </div>

      </aside>


      {/* Customer content */}

      <section className="customer-layout-content">

        <Outlet />

      </section>

    </div>
  );
}


export default CustomerLayout;