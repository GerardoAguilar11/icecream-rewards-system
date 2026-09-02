import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import getDefaultRouteByRole from "./getDefaultRouteByRole";

function PublicRoute({ children }) {
  const {
    user,
    loading,
    isAuthenticated,
  } = useAuth();

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!isAuthenticated) {
    return children;
  }

  return (
    <Navigate
      to={getDefaultRouteByRole(user?.role)}
      replace
    />
  );
}

export default PublicRoute;