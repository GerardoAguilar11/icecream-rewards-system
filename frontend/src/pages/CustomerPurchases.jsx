import {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  getMyPurchases,
} from "../services/purchaseService";


function CustomerPurchases() {
  const [purchases, setPurchases] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {
    let cancelled = false;

    getMyPurchases()
      .then((data) => {
        if (!cancelled) {
          setPurchases(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(
            "No fue posible cargar tus compras."
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
          Cargando compras...
        </p>
      </main>
    );
  }


  return (
    <main className="customer-section-page">

      <header className="page-header">

        <h1>
          Mis compras
        </h1>

        <p>
          Consulta el historial de compras realizadas con tu cuenta.
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

        {purchases.length === 0 ? (
          <p>
            Todavía no tienes compras registradas.
          </p>
        ) : (
          <div className="table-container">

            <table>

              <thead>
                <tr>
                  <th>
                    Compra
                  </th>

                  <th>
                    Fecha
                  </th>

                  <th>
                    Total
                  </th>

                  <th>
                    Puntos
                  </th>

                  <th>
                    Recompensa
                  </th>

                  <th>
                    Estado
                  </th>

                  <th>
                    Detalle
                  </th>
                </tr>
              </thead>


              <tbody>

                {purchases.map(
                  (purchase) => (
                    <tr
                      key={purchase.id}
                      className={
                        purchase.status ===
                        "CANCELLED"
                          ? "purchase-row-cancelled"
                          : ""
                      }
                    >

                      <td>
                        #{purchase.id}
                      </td>

                      <td>
                        {new Date(
                          purchase.created_at
                        ).toLocaleString()}
                      </td>

                      <td>
                        $
                        {Number(
                          purchase.total_amount
                        ).toFixed(2)}
                      </td>

                      <td>
                        {
                          purchase.points_earned
                        }
                      </td>

                      <td>
                        {purchase.used_reward
                          ? purchase.reward_name
                          : "No"}
                      </td>

                      <td>
                        {purchase.status ===
                        "COMPLETED"
                          ? "Completada"
                          : "Cancelada"}
                      </td>

                      <td>
                        <Link
                          to={`/customer/purchases/${purchase.id}`}
                          className="action-link"
                        >
                          Ver detalle
                        </Link>
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


export default CustomerPurchases;