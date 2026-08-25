import {
  useEffect,
  useState,
} from "react";

import SalesChart from "../components/dashboard/SalesChart";

import {
  getDashboardSummary,
  getTopProducts,
  getSalesLast7Days,
} from "../services/dashboardService";


function Dashboard() {
  const [summary, setSummary] = useState(null);

  const [topProducts, setTopProducts] =
    useState([]);

  const [salesLast7Days, setSalesLast7Days] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          summaryData,
          topProductsData,
          salesData,
        ] = await Promise.all([
          getDashboardSummary(),
          getTopProducts(),
          getSalesLast7Days(),
        ]);

        setSummary(summaryData);

        setTopProducts(
          topProductsData
        );

        setSalesLast7Days(
          salesData
        );
      } catch {
        setError(
          "No fue posible cargar la información del dashboard."
        );
      } finally {
        setLoading(false);
      }
    };


    loadDashboard();
  }, []);


  if (loading) {
    return (
      <main className="dashboard-page">
        <p>
          Cargando dashboard...
        </p>
      </main>
    );
  }


  if (error) {
    return (
      <main className="dashboard-page">
        <h1>Dashboard</h1>

        <p role="alert">
          {error}
        </p>
      </main>
    );
  }


  return (
    <main className="dashboard-page">

      <header className="page-header">
        <div>
          <h1>
            Dashboard
          </h1>

          <p>
            Resumen general de la heladería.
          </p>
        </div>
      </header>


      <section className="summary-grid">

        <article className="summary-card">
          <h3>
            Ventas del día
          </h3>

          <p>
            $
            {Number(
              summary?.sales_today ?? 0
            ).toFixed(2)}
          </p>
        </article>


        <article className="summary-card">
          <h3>
            Compras del día
          </h3>

          <p>
            {summary?.purchases_today ?? 0}
          </p>
        </article>


        <article className="summary-card">
          <h3>
            Clientes registrados
          </h3>

          <p>
            {summary?.customers ?? 0}
          </p>
        </article>


        <article className="summary-card">
          <h3>
            Puntos otorgados
          </h3>

          <p>
            {summary?.points_issued_today ?? 0}
          </p>
        </article>


        <article className="summary-card">
          <h3>
            Recompensas canjeadas
          </h3>

          <p>
            {summary?.redemptions_today ?? 0}
          </p>
        </article>

      </section>


      <section className="dashboard-section">

        <h2>
          Ventas de los últimos 7 días
        </h2>

        <SalesChart
          data={salesLast7Days}
        />

      </section>


      <section className="dashboard-section">

        <h2>
          Productos más vendidos
        </h2>

        {topProducts.length === 0 ? (
          <p>
            No hay productos vendidos todavía.
          </p>
        ) : (
          <div className="table-container">

            <table>
              <thead>
                <tr>
                  <th>
                    Producto
                  </th>

                  <th>
                    Unidades
                  </th>

                  <th>
                    Ventas
                  </th>
                </tr>
              </thead>

              <tbody>
                {topProducts.map(
                  (product) => (
                    <tr
                      key={product.product_id}
                    >
                      <td>
                        {product.product_name}
                      </td>

                      <td>
                        {product.quantity_sold}
                      </td>

                      <td>
                        $
                        {Number(
                          product.sales_amount
                        ).toFixed(2)}
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


export default Dashboard;