import {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  getCustomers,
  searchCustomers,
} from "../services/customerService";


function Customers() {
  const [customers, setCustomers] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {
    let cancelled = false;

    const timeoutId = setTimeout(
      async () => {
        try {
          const query =
            search.trim();

          const data = query
            ? await searchCustomers(
                query
              )
            : await getCustomers();

          if (!cancelled) {
            setCustomers(data);
          }
        } catch {
          if (!cancelled) {
            setError(
              "No fue posible realizar la búsqueda."
            );
          }
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      },
      300
    );


    return () => {
      cancelled = true;

      clearTimeout(
        timeoutId
      );
    };
  }, [search]);


  const handleSearchChange = (
    event
  ) => {
    setSearch(
      event.target.value
    );

    setLoading(true);

    setError("");
  };


  return (
    <main className="customers-page">

      <header className="page-header">

        <div>

          <h1>
            Clientes
          </h1>

          <p>
            Consulta los clientes registrados.
          </p>

        </div>

      </header>


      <section className="dashboard-section">

        <div className="customer-search">

          <input
            type="text"
            placeholder="Buscar por nombre, correo, teléfono o código"
            value={search}
            onChange={
              handleSearchChange
            }
          />

        </div>

      </section>


      <section className="dashboard-section">

        <h2>
          Clientes registrados
        </h2>


        {loading ? (
          <p>
            Buscando clientes...
          </p>
        ) : error ? (
          <p role="alert">
            {error}
          </p>
        ) : customers.length === 0 ? (
          <p>
            No se encontraron clientes.
          </p>
        ) : (
          <div className="table-container">

            <table>

              <thead>
                <tr>
                  <th>
                    Código
                  </th>

                  <th>
                    Nombre
                  </th>

                  <th>
                    Correo
                  </th>

                  <th>
                    Teléfono
                  </th>

                  <th>
                    Puntos
                  </th>

                  <th>
                    Acciones
                  </th>
                </tr>
              </thead>


              <tbody>

                {customers.map(
                  (customer) => (
                    <tr
                      key={
                        customer.id
                      }
                    >

                      <td>
                        {
                          customer.customer_code
                        }
                      </td>

                      <td>
                        {
                          customer.first_name
                        }{" "}
                        {
                          customer.last_name
                        }
                      </td>

                      <td>
                        {
                          customer.email
                        }
                      </td>

                      <td>
                        {
                          customer.phone ||
                          "-"
                        }
                      </td>

                      <td>
                        {
                          customer.points
                        }
                      </td>

                      <td>

                        <Link
                          to={`/customers/${customer.id}`}
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


export default Customers;