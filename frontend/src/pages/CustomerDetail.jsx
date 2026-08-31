import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useAuth,
} from "../context/useAuth";

import {
  useNotification,
} from "../context/useNotification";

import ConfirmModal
  from "../components/common/ConfirmModal";

import {
  getCustomerById,
  getCustomerPurchases,
  getCustomerRewardHistory,
} from "../services/customerService";

import api
  from "../api/axios";


function CustomerDetail() {
  const {
    id,
  } = useParams();

  const navigate =
    useNavigate();

  const {
    user,
  } = useAuth();

  const {
    showSuccess,
    showError,
  } = useNotification();


  const [
    customer,
    setCustomer,
  ] = useState(null);

  const [
    purchases,
    setPurchases,
  ] = useState([]);

  const [
    redemptions,
    setRedemptions,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    deleting,
    setDeleting,
  ] = useState(false);

  const [
    showDeleteModal,
    setShowDeleteModal,
  ] = useState(false);


  /* ==========================
     LOAD CUSTOMER
  ========================== */

  useEffect(() => {
    const loadCustomer =
      async () => {
        try {
          setLoading(
            true
          );

          setError("");


          const customerData =
            await getCustomerById(
              id
            );


          setCustomer(
            customerData
          );


          const [
            purchaseData,
            rewardData,
          ] = await Promise.all([
            getCustomerPurchases(
              customerData.customer_code
            ),

            getCustomerRewardHistory(
              customerData.customer_code
            ),
          ]);


          setPurchases(
            purchaseData.purchases ??
            []
          );


          setRedemptions(
            rewardData.redemptions ??
            []
          );
        } catch {
          setError(
            "No fue posible cargar la información del cliente."
          );
        } finally {
          setLoading(
            false
          );
        }
      };


    loadCustomer();
  }, [
    id,
  ]);


  /* ==========================
     DELETE CUSTOMER
  ========================== */

  const handleDelete =
    async () => {
      if (!customer) {
        return;
      }


      const customerName =
        `${customer.first_name} ${customer.last_name}`.trim();


      try {
        setDeleting(
          true
        );

        setError("");


        await api.delete(
          `/customers/${id}/`
        );


        setShowDeleteModal(
          false
        );


        showSuccess(
          customerName
            ? `${customerName} fue eliminado correctamente.`
            : "Cliente eliminado correctamente."
        );


        navigate(
          "/customers",
          {
            replace: true,
          }
        );
      } catch (
        requestError
      ) {
        const detail =
          requestError
            .response
            ?.data
            ?.detail;


        setShowDeleteModal(
          false
        );


        showError(
          detail ||
          "No fue posible eliminar el cliente."
        );
      } finally {
        setDeleting(
          false
        );
      }
    };


  if (loading) {
    return (
      <main className="customers-page">

        <p>
          Cargando cliente...
        </p>

      </main>
    );
  }


  if (
    error &&
    !customer
  ) {
    return (
      <main className="customers-page">

        <p
          role="alert"
          className="form-error"
        >
          {error}
        </p>


        <Link
          to="/customers"
        >
          Volver a clientes
        </Link>

      </main>
    );
  }


  return (
    <main className="customers-page">

      <header className="page-header page-header-actions">

        <div>

          <Link
            to="/customers"
            className="back-link"
          >
            ← Volver a clientes
          </Link>


          <h1>
            {
              customer.first_name
            }{" "}
            {
              customer.last_name
            }
          </h1>


          <p>
            Información general
            del cliente.
          </p>

        </div>


        {user?.role ===
          "ADMIN" && (
          <div className="customer-actions">

            <Link
              to={`/customers/${id}/edit`}
              className="primary-action"
            >
              Editar
            </Link>


            <button
              type="button"
              className="danger-action"
              onClick={() =>
                setShowDeleteModal(
                  true
                )
              }
              disabled={
                deleting
              }
            >
              Eliminar
            </button>

          </div>
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
            Código
          </h3>


          <p>
            {
              customer.customer_code
            }
          </p>

        </article>


        <article className="summary-card">

          <h3>
            Puntos disponibles
          </h3>


          <p>
            {
              customer.points
            }
          </p>

        </article>


        <article className="summary-card">

          <h3>
            Correo
          </h3>


          <p className="customer-info-text">
            {
              customer.email
            }
          </p>

        </article>


        <article className="summary-card">

          <h3>
            Teléfono
          </h3>


          <p className="customer-info-text">
            {
              customer.phone ||
              "Sin teléfono"
            }
          </p>

        </article>

      </section>


      <section className="dashboard-section">

        <h2>
          Historial de compras
        </h2>


        {purchases.length ===
          0 ? (

          <p>
            El cliente todavía
            no tiene compras.
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
                    Total
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

                {purchases.map(
                  (
                    purchase
                  ) => (
                    <tr
                      key={
                        purchase.id
                      }
                    >

                      <td>
                        #
                        {
                          purchase.id
                        }
                      </td>


                      <td>
                        $
                        {Number(
                          purchase.total_amount
                        ).toFixed(
                          2
                        )}
                      </td>


                      <td>
                        {
                          purchase.points_earned
                        }
                      </td>


                      <td>
                        {
                          purchase.status
                        }
                      </td>


                      <td>
                        {new Date(
                          purchase.created_at
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
          Historial de recompensas
        </h2>


        {redemptions.length ===
          0 ? (

          <p>
            El cliente todavía
            no ha canjeado
            recompensas.
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
                  (
                    redemption
                  ) => (
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
                        {
                          redemption.status
                        }
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


      <ConfirmModal
        isOpen={
          showDeleteModal
        }
        title="Eliminar cliente"
        message="¿Seguro que deseas eliminar este cliente? Esta acción no se puede deshacer."
        confirmText="Eliminar cliente"
        loading={
          deleting
        }
        onConfirm={
          handleDelete
        }
        onCancel={() =>
          setShowDeleteModal(
            false
          )
        }
      />

    </main>
  );
}


export default CustomerDetail;