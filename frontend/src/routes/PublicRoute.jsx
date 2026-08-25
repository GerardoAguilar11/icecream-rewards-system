import { Navigate } from "react-router-dom";

import { useAuth } from "../context/useAuth";


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


  if (user?.role === "ADMIN") {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }


  if (user?.role === "EMPLOYEE") {
    return (
      <Navigate
        to="/customers"
        replace
      />
    );
  }


  if (user?.role === "CUSTOMER") {
    return (
      <Navigate
        to="/customer"
        replace
      />
    );
  }


  return (
    <Navigate
      to="/"
      replace
    />
  );
}


export default PublicRoute;