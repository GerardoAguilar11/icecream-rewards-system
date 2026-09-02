import {
  ArrowLeft,
  Home,
  Snowflake,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/useAuth";
import getDefaultRouteByRole
  from "../routes/getDefaultRouteByRole";

function NotFound() {
  const navigate = useNavigate();

  const {
    user,
    isAuthenticated,
  } = useAuth();

  const handleGoBack = () => {
    if (
      isAuthenticated &&
      user?.role
    ) {
      navigate(
        getDefaultRouteByRole(user.role),
        {
          replace: true,
        },
      );

      return;
    }

    navigate(
      "/login",
      {
        replace: true,
      },
    );
  };

  return (
    <main className="not-found-page">
      <section className="not-found-card">
        <div className="not-found-icon">
          <Snowflake size={42} />
        </div>

        <p className="not-found-code">
          404
        </p>

        <h1 className="not-found-title">
          Página no encontrada
        </h1>

        <p className="not-found-description">
          La página que estás buscando no existe,
          fue movida o la dirección ingresada no es
          correcta.
        </p>

        <button
          type="button"
          className="not-found-button"
          onClick={handleGoBack}
        >
          {isAuthenticated ? (
            <>
              <Home size={18} />
              Volver al inicio
            </>
          ) : (
            <>
              <ArrowLeft size={18} />
              Ir al inicio de sesión
            </>
          )}
        </button>

        <div className="not-found-brand">
          <span>Frio&Co</span>
          <small>
            Refresh Your Day.
          </small>
        </div>
      </section>
    </main>
  );
}

export default NotFound;