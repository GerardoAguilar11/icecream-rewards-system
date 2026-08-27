import {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  getPurchases,
} from "../services/purchaseService";


const getLocalDateString = () => {
  const now = new Date();

  const year =
    now.getFullYear();

  const month =
    String(
      now.getMonth() + 1
    ).padStart(
      2,
      "0"
    );

  const day =
    String(
      now.getDate()
    ).padStart(
      2,
      "0"
    );


  return (
    `${year}-${month}-${day}`
  );
};


function Purchases() {
  const today =
    getLocalDateString();


  const [
    filters,
    setFilters,
  ] = useState({
    dateFrom: today,
    dateTo: today,
  });


  const [purchases, setPurchases] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {
    let cancelled = false;


    getPurchases(filters)
      .then((data) => {
        if (!cancelled) {
          setPurchases(data);

          setError("");
        }
      })
      .catch((requestError) => {
        if (!cancelled) {
          const detail =
            requestError
              .response
              ?.data
              ?.detail;

          setError(
            detail ||
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
  }, [filters]);


  const handleDateChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;


    setLoading(true);

    setFilters(
      (currentFilters) => ({
        ...currentFilters,
        [name]: value,
      })
    );
  };


  const handleToday = () => {
    const currentToday =
      getLocalDateString();


    if (
      filters.dateFrom ===
        currentToday
      &&
      filters.dateTo ===
        currentToday
    ) {
      return;
    }


    setLoading(true);


    setFilters({
      dateFrom:
        currentToday,

      dateTo:
        currentToday,
    });
  };


  const formatFilterDate = (
    dateString
  ) => {
    if (!dateString) {
      return "";
    }


    const [
      year,
      month,
      day,
    ] = dateString.split(
      "-"
    );


    return (
      `${day}/${month}/${year}`
    );
  };


  const periodText = (
    filters.dateFrom &&
    filters.dateTo
  )
    ? filters.dateFrom ===
      filters.dateTo
      ? formatFilterDate(
          filters.dateFrom
        )
      : (
          `${formatFilterDate(
            filters.dateFrom
          )} al ${formatFilterDate(
            filters.dateTo
          )}`
        )
    : "Periodo seleccionado";


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

        <div className="purchase-filter-header">

          <div>

            <h2>
              Historial de compras
            </h2>

            <p>
              Mostrando:{" "}
              <strong>
                {periodText}
              </strong>
            </p>

          </div>


          <button
            type="button"
            className="secondary-action"
            onClick={
              handleToday
            }
          >
            Hoy
          </button>

        </div>


        <div className="purchase-date-filters">

          <div className="form-group">

            <label htmlFor="dateFrom">
              Desde
            </label>

            <input
              id="dateFrom"
              name="dateFrom"
              type="date"
              value={
                filters.dateFrom
              }
              onChange={
                handleDateChange
              }
            />

          </div>


          <div className="form-group">

            <label htmlFor="dateTo">
              Hasta
            </label>

            <input
              id="dateTo"
              name="dateTo"
              type="date"
              value={
                filters.dateTo
              }
              min={
                filters.dateFrom ||
                undefined
              }
              onChange={
                handleDateChange
              }
            />

          </div>

        </div>


        {loading ? (

          <p>
            Cargando compras...
          </p>

        ) : error ? (

          <p
            role="alert"
            className="form-error"
          >
            {error}
          </p>

        ) : purchases.length ===
          0 ? (

          <p>
            No hay compras registradas en este periodo.
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

                    <tr
                      key={
                        purchase.id
                      }
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
                        {
                          purchase.customer_name
                        }
                      </td>


                      <td>
                        {
                          purchase.customer_code
                        }
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
                        {purchase.status ===
                        "COMPLETED"
                          ? "Completada"
                          : "Cancelada"}
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