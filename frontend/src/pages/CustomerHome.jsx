import {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/useAuth";

import {
  getMyCustomerProfile,
} from "../services/customerService";

import {
  getAvailableRewards,
  getCustomerRewardHistory,
} from "../services/rewardService";


function CustomerHome() {
  const navigate = useNavigate();

  const {
    logout,
  } = useAuth();

  const [customer, setCustomer] =
    useState(null);

  const [
    availableRewards,
    setAvailableRewards,
  ] = useState([]);

  const [
    redemptions,
    setRedemptions,
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {
    let cancelled = false;

    getMyCustomerProfile()
      .then(async (customerData) => {
        if (cancelled) {
          return;
        }

        setCustomer(
          customerData
        );

        const [
          rewardsData,
          historyData,
        ] = await Promise.all([
          getAvailableRewards(
            customerData.id
          ),

          getCustomerRewardHistory(
            customerData.customer_code
          ),
        ]);

        if (cancelled) {
          return;
        }

        setAvailableRewards(
          rewardsData.rewards ?? []
        );

        setRedemptions(
          historyData.redemptions ?? []
        );
      })
      .catch(() => {
        if (!cancelled) {
          setError(
            "No fue posible cargar tu información."
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
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


  if (
    error ||
    !customer
  ) {
    return (
      <main className="customer-home-page">

        <p role="alert">
          {error ||
            "No fue posible cargar tu cuenta."}
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
          Recompensas disponibles
        </h2>


        {availableRewards.length === 0 ? (
          <p>
            Aún no tienes puntos suficientes para canjear una recompensa.
          </p>
        ) : (
          <div className="customer-reward-grid">

            {availableRewards.map(
              (reward) => (
                <article
                  key={
                    reward.id
                  }
                  className="customer-reward-card"
                >

                  <h3>
                    {reward.name}
                  </h3>

                  <p>
                    {reward.description ||
                      "Sin descripción"}
                  </p>

                  <strong>
                    {
                      reward.points_required
                    }{" "}
                    puntos
                  </strong>

                </article>
              )
            )}

          </div>
        )}


        <p className="reward-help-text">
          Las recompensas se canjean al realizar una compra en la heladería.
        </p>

      </section>


      <section className="dashboard-section">

        <h2>
          Historial de canjes
        </h2>


        {redemptions.length === 0 ? (
          <p>
            Todavía no has utilizado recompensas.
          </p>
        ) : (
          <div className="table-container">

            <table>

              <thead>
                <tr>
                  <th>
                    Recompensa
                  </th>

                  <th>
                    Puntos utilizados
                  </th>

                  <th>
                    Estado
                  </th>

                  <th>
                    Fecha
                  </th>
                </tr>
              </thead>


              <tbody>

                {redemptions.map(
                  (redemption) => (
                    <tr
                      key={
                        redemption.id
                      }
                    >

                      <td>
                        {
                          redemption.reward_name
                        }
                      </td>

                      <td>
                        {
                          redemption.points_used
                        }
                      </td>

                      <td>
                        {redemption.status ===
                        "COMPLETED"
                          ? "Completado"
                          : "Cancelado"}
                      </td>

                      <td>
                        {new Date(
                          redemption.created_at
                        ).toLocaleString()}
                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        )}

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
            {customer.phone ||
              "Sin teléfono registrado"}
          </p>

        </div>

      </section>

    </main>
  );
}


export default CustomerHome;