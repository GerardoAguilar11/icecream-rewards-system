import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  getMyPurchaseById,
} from "../services/purchaseService";


function CustomerPurchaseDetail() {
  const { id } = useParams();

  const [purchase, setPurchase] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {
    let cancelled = false;

    getMyPurchaseById(id)
      .then((data) => {
        if (!cancelled) {
          setPurchase(data);
        }
      })
      .catch((requestError) => {
        if (!cancelled) {
          if (
            requestError.response?.status ===
            404
          ) {
            setError(
              "La compra no existe o no pertenece a tu cuenta."
            );

            return;
          }

          setError(
            "No fue posible cargar la compra."
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
  }, [id]);


  if (loading) {
    return (
      <main className="customer-section-page">
        <p>
          Cargando compra...
        </p>
      </main>
    );
  }


  if (
    error ||
    !purchase
  ) {
    return (
      <main className="customer-section-page">

        <p
          role="alert"
          className="form-error"
        >
          {error ||
            "No fue posible cargar la compra."}
        </p>

        <Link
          to="/customer/purchases"
          className="back-link"
        >
          ← Volver a mis compras
        </Link>

      </main>
    );
  }


  return (
    <main className="customer-section-page">

      <header className="page-header">

        <Link
          to="/customer/purchases"
          className="back-link"
        >
          ← Volver a mis compras
        </Link>

        <h1>
          Compra #{purchase.id}
        </h1>

        <p>
          Consulta el detalle de tu compra.
        </p>

      </header>


      <section className="customer-info-grid">

        <article className="summary-card">

          <h3>
            Total
          </h3>

          <p>
            $
            {Number(
              purchase.total_amount
            ).toFixed(2)}
          </p>

        </article>


        <article className="summary-card">

          <h3>
            Puntos generados
          </h3>

          <p>
            {purchase.points_earned}
          </p>

        </article>


        <article className="summary-card">

          <h3>
            Estado
          </h3>

          <p className="customer-info-text">
            {purchase.status ===
            "COMPLETED"
              ? "Completada"
              : "Cancelada"}
          </p>

        </article>

      </section>


      <section className="dashboard-section">

        <h2>
          Información de la compra
        </h2>

        <p>
          <strong>
            Fecha:
          </strong>{" "}
          {new Date(
            purchase.created_at
          ).toLocaleString()}
        </p>

        <p>
          <strong>
            Atendido por:
          </strong>{" "}
          {purchase.employee_name ||
            "Sin nombre"}
        </p>

        <p>
          <strong>
            Utilizó recompensa:
          </strong>{" "}
          {purchase.used_reward
            ? "Sí"
            : "No"}
        </p>


        {purchase.used_reward && (
          <>
            <p>
              <strong>
                Recompensa:
              </strong>{" "}
              {purchase.reward_name}
            </p>

            <p>
              <strong>
                Puntos utilizados:
              </strong>{" "}
              {
                purchase.reward_points_used
              }
            </p>
          </>
        )}

      </section>


      <section className="dashboard-section">

        <h2>
          Productos
        </h2>


        <div className="table-container">

          <table>

            <thead>
              <tr>
                <th>
                  Producto
                </th>

                <th>
                  Precio unitario
                </th>

                <th>
                  Cantidad
                </th>

                <th>
                  Subtotal
                </th>
              </tr>
            </thead>


            <tbody>

              {purchase.items.map(
                (item) => (
                  <tr
                    key={item.id}
                  >

                    <td>
                      {
                        item.product_name
                      }
                    </td>

                    <td>
                      $
                      {Number(
                        item.unit_price
                      ).toFixed(2)}
                    </td>

                    <td>
                      {
                        item.quantity
                      }
                    </td>

                    <td>
                      $
                      {Number(
                        item.subtotal
                      ).toFixed(2)}
                    </td>

                  </tr>
                )
              )}


              {purchase.used_reward &&
                purchase.reward_name && (
                  <tr className="reward-product-row">

                    <td>
                      <strong>
                        {
                          purchase.reward_name
                        }
                      </strong>

                      <span className="reward-badge">
                        Recompensa
                      </span>
                    </td>

                    <td>
                      $0.00
                    </td>

                    <td>
                      1
                    </td>

                    <td>
                      $0.00
                    </td>

                  </tr>
                )}

            </tbody>

          </table>

        </div>

      </section>

    </main>
  );
}


export default CustomerPurchaseDetail;