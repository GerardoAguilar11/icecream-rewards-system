import {
  useEffect,
  useState,
} from "react";

import {
  getCurrentUser,
  login as loginService,
  logout as logoutService,
} from "../services/authService";

import AuthContext from "./AuthContext";


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const accessToken =
        localStorage.getItem("access");

      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        const currentUser =
          await getCurrentUser();

        setUser(currentUser);
      } catch {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);


  const login = async (email, password) => {
    const data = await loginService(
      email,
      password
    );

    localStorage.setItem(
      "access",
      data.access
    );

    localStorage.setItem(
      "refresh",
      data.refresh
    );

    const currentUser =
      await getCurrentUser();

    setUser(currentUser);

    return currentUser;
  };


  const logout = async () => {
    const refreshToken =
      localStorage.getItem("refresh");

    try {
      if (refreshToken) {
        await logoutService(
          refreshToken
        );
      }
    } catch {
      // Aunque el backend falle al cerrar sesión,
      // limpiamos la sesión local.
    } finally {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      setUser(null);
    }
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}