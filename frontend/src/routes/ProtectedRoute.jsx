import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import getDefaultRouteByRole from "./getDefaultRouteByRole";

function ProtectedRoute({
  children,
  allowedRoles,
}) {
  const {
    user,
    loading,
    isAuthenticated,
  } = useAuth();

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  const userRole = user?.role;

  if (
    allowedRoles &&
    !allowedRoles.includes(userRole)
  ) {
    return (
      <Navigate
        to={getDefaultRouteByRole(userRole)}
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;