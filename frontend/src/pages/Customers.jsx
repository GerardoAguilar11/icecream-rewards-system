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
    const loadCustomers = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getCustomers();

        setCustomers(data);
      } catch {
        setError(
          "No fue posible cargar los clientes."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);


  const handleSearch = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      if (!search.trim()) {
        const data =
          await getCustomers();

        setCustomers(data);

        return;
      }

      const data =
        await searchCustomers(
          search.trim()
        );

      setCustomers(data);
    } catch {
      setError(
        "No fue posible realizar la búsqueda."
      );
    } finally {
      setLoading(false);
    }
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

        <form
          onSubmit={handleSearch}
          className="customer-search"
        >
          <input
            type="text"
            placeholder="Buscar por nombre, correo, teléfono o código"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />

          <button type="submit">
            Buscar
          </button>
        </form>

      </section>


      <section className="dashboard-section">

        <h2>
          Clientes registrados
        </h2>

        {loading ? (
          <p>
            Cargando clientes...
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
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Teléfono</th>
                  <th>Puntos</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {customers.map(
                  (customer) => (
                    <tr key={customer.id}>

                      <td>
                        {customer.customer_code}
                      </td>

                      <td>
                        {customer.first_name}{" "}
                        {customer.last_name}
                      </td>

                      <td>
                        {customer.email}
                      </td>

                      <td>
                        {customer.phone || "-"}
                      </td>

                      <td>
                        {customer.points}
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