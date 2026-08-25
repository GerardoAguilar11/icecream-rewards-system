import {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  getPurchases,
} from "../services/purchaseService";


function Purchases() {
  const [purchases, setPurchases] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {
    let cancelled = false;

    getPurchases()
      .then((data) => {
        if (!cancelled) {
          setPurchases(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(
            "No fue posible cargar las compras."
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


  return (
    <main className="purchases-page">

      <header className="page-header page-header-actions">

        <div>
          <h1>
            Compras
          </h1>

          <p>
            Consulta y registra las compras de los clientes.
          </p>
        </div>


        <Link
          to="/purchases/new"
          className="primary-action"
        >
          Nueva compra
        </Link>

      </header>


      <section className="dashboard-section">

        <h2>
          Historial de compras
        </h2>


        {loading ? (
          <p>
            Cargando compras...
          </p>
        ) : error ? (
          <p role="alert">
            {error}
          </p>
        ) : purchases.length === 0 ? (
          <p>
            No hay compras registradas.
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
                    Cliente
                  </th>

                  <th>
                    Código
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

                  <th>
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody>
                {purchases.map(
                  (purchase) => (
                    <tr key={purchase.id}>

                      <td>
                        #{purchase.id}
                      </td>

                      <td>
                        {purchase.customer_name}
                      </td>

                      <td>
                        {purchase.customer_code}
                      </td>

                      <td>
                        $
                        {Number(
                          purchase.total_amount
                        ).toFixed(2)}
                      </td>

                      <td>
                        {purchase.points_earned}
                      </td>

                      <td>
                        {purchase.status}
                      </td>

                      <td>
                        {new Date(
                          purchase.created_at
                        ).toLocaleString()}
                      </td>

                      <td>
                        <Link
                          to={`/purchases/${purchase.id}`}
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


export default Purchases;