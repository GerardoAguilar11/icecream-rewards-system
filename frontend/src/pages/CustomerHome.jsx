import {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/useAuth";

import {
  getMyCustomerProfile,
} from "../services/customerService";


function CustomerHome() {
  const navigate = useNavigate();

  const {
    logout,
  } = useAuth();

  const [customer, setCustomer] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {
    const loadCustomerProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getMyCustomerProfile();

        setCustomer(data);
      } catch {
        setError(
          "No fue posible cargar tu información."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCustomerProfile();
  }, []);


  const handleLogout = async () => {
    await logout();

    navigate(
      "/login",
      {
        replace: true,
      }
    );
  };


  if (loading) {
    return (
      <main className="customer-home-page">
        <p>
          Cargando tu cuenta...
        </p>
      </main>
    );
  }


  if (error || !customer) {
    return (
      <main className="customer-home-page">

        <p role="alert">
          {error || "No fue posible cargar tu cuenta."}
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


  return (
    <main className="customer-home-page">

      <header className="customer-home-header">

        <div>
          <h1>
            Hola, {customer.first_name}
          </h1>

          <p>
            Bienvenido a tu cuenta de recompensas.
          </p>
        </div>


        <button
          type="button"
          onClick={handleLogout}
        >
          Cerrar sesión
        </button>

      </header>


      <section className="customer-home-grid">

        <article className="summary-card">

          <h3>
            Mis puntos
          </h3>

          <p>
            {customer.points}
          </p>

        </article>


        <article className="summary-card">

          <h3>
            Mi código
          </h3>

          <p>
            {customer.customer_code}
          </p>

        </article>

      </section>


      <section className="dashboard-section">

        <h2>
          Mi identificación
        </h2>

        <div className="customer-code-card">

          <span>
            Código de cliente
          </span>

          <strong>
            {customer.customer_code}
          </strong>

          <div className="qr-placeholder">

            <p>
              Código QR
            </p>

            <small>
              Se habilitará próximamente.
            </small>

          </div>

          <p>
            Muestra este código al empleado para identificar tu cuenta.
          </p>

        </div>

      </section>


      <section className="dashboard-section">

        <h2>
          Mi información
        </h2>

        <div className="customer-profile-details">

          <p>
            <strong>
              Nombre:
            </strong>{" "}
            {customer.first_name}{" "}
            {customer.last_name}
          </p>

          <p>
            <strong>
              Correo:
            </strong>{" "}
            {customer.email}
          </p>

          <p>
            <strong>
              Teléfono:
            </strong>{" "}
            {customer.phone || "Sin teléfono registrado"}
          </p>

        </div>

      </section>

    </main>
  );
}


export default CustomerHome;