import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import ConfirmModal from "../components/common/ConfirmModal";

import {
  cancelPurchase,
  getPurchaseById,
} from "../services/purchaseService";


function PurchaseDetail() {
  const { id } = useParams();

  const [purchase, setPurchase] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [cancelling, setCancelling] =
    useState(false);

  const [
    showCancelModal,
    setShowCancelModal,
  ] = useState(false);

  const [error, setError] =
    useState("");


  useEffect(() => {
    let cancelled = false;

    getPurchaseById(id)
      .then((data) => {
        if (!cancelled) {
          setPurchase(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
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


  const handleCancelPurchase =
    async () => {
      try {
        setCancelling(true);
        setError("");

        const updatedPurchase =
          await cancelPurchase(id);

        setPurchase(
          updatedPurchase
        );

        setShowCancelModal(false);
      } catch (requestError) {
        const detail =
          requestError.response
            ?.data?.detail;

        setError(
          detail ||
          "No fue posible cancelar la compra."
        );
      } finally {
        setCancelling(false);
      }
    };


  if (loading) {
    return (
      <main className="purchases-page">
        <p>
          Cargando compra...
        </p>
      </main>
    );
  }


  if (
    error &&
    !purchase
  ) {
    return (
      <main className="purchases-page">

        <p role="alert">
          {error}
        </p>

        <Link
          to="/purchases"
          className="back-link"
        >
          ← Volver a compras
        </Link>

      </main>
    );
  }


  return (
    <main className="purchases-page">

      <header className="page-header page-header-actions">

        <div>

          <Link
            to="/purchases"
            className="back-link"
          >
            ← Volver a compras
          </Link>

          <h1>
            Compra #{purchase.id}
          </h1>

          <p>
            Detalle de la compra registrada.
          </p>

        </div>


        {purchase.status ===
          "COMPLETED" && (
          <button
            type="button"
            className="danger-action"
            onClick={() =>
              setShowCancelModal(
                true
              )
            }
            disabled={
              cancelling
            }
          >
            Cancelar compra
          </button>
        )}

      </header>


      {error && (
        <p
          role="alert"
          className="form-error"
        >
          {error}
        </p>
      )}


      <section className="customer-info-grid">

        <article className="summary-card">

          <h3>
            Cliente
          </h3>

          <p className="customer-info-text">
            {
              purchase.customer_name
            }
          </p>

        </article>


        <article className="summary-card">

          <h3>
            Código
          </h3>

          <p className="customer-info-text">
            {
              purchase.customer_code
            }
          </p>

        </article>


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
            {
              purchase.points_earned
            }
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
            Empleado:
          </strong>{" "}
          {
            purchase.employee_name ||
            "Sin nombre"
          }
        </p>

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
              {
                purchase.reward_name
              }
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
                    key={
                      item.id
                    }
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


      <ConfirmModal
        isOpen={
          showCancelModal
        }
        title="Cancelar compra"
        message="¿Seguro que deseas cancelar esta compra? Los puntos asociados serán ajustados automáticamente."
        confirmText="Cancelar compra"
        loading={
          cancelling
        }
        onConfirm={
          handleCancelPurchase
        }
        onCancel={() =>
          setShowCancelModal(
            false
          )
        }
      />

    </main>
  );
}


export default PurchaseDetail;