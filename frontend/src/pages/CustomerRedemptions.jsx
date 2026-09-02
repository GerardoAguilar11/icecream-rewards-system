import {
  useEffect,
  useState,
} from "react";

import {
  getMyCustomerProfile,
} from "../services/customerService";

import {
  getCustomerRewardHistory,
} from "../services/rewardService";


function CustomerRedemptions() {
  const [redemptions, setRedemptions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {
    let cancelled = false;

    getMyCustomerProfile()
      .then(async (customerData) => {
        const historyData =
          await getCustomerRewardHistory(
            customerData.customer_code
          );

        if (cancelled) {
          return;
        }

        setRedemptions(
          historyData.redemptions ?? []
        );
      })
      .catch(() => {
        if (!cancelled) {
          setError(
            "No fue posible cargar tu historial de canjes."
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


  if (loading) {
    return (
      <main className="customer-section-page">
        <p>
          Cargando historial...
        </p>
      </main>
    );
  }


  return (
    <main className="customer-section-page">

      <header className="page-header">

        <h1>
          Mis canjes
        </h1>

        <p>
          Consulta las recompensas que has utilizado.
        </p>

      </header>


      {error && (
        <p
          role="alert"
          className="form-error"
        >
          {error}
        </p>
      )}


      <section className="dashboard-section">

        {redemptions.length === 0 ? (
          <p>
            Todavía no tienes canjes registrados.
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
                    Puntos
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
                      key={redemption.id}
                    >

                      <td>
                        {redemption.reward_name}
                      </td>

                      <td>
                        {redemption.points_used}
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

    </main>
  );
}


export default CustomerRedemptions;