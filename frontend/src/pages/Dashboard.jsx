import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  BadgeDollarSign,
  BriefcaseBusiness,
  CalendarDays,
  Gift,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

import SalesChart from "../components/dashboard/SalesChart";

import {
  getDashboardSummary,
  getSalesTrend,
  getTopCustomers,
  getTopProducts,
  getTopRewards,
} from "../services/dashboardService";


const formatDateForApi = (date) => {
  const year =
    date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(
    2,
    "0"
  );

  const day = String(
    date.getDate()
  ).padStart(
    2,
    "0"
  );

  return `${year}-${month}-${day}`;
};


const getPresetRange = (period) => {
  const today =
    new Date();

  today.setHours(
    0,
    0,
    0,
    0
  );

  const endDate =
    new Date(today);

  const startDate =
    new Date(today);

  switch (period) {
    case "today":
      break;

    case "last30":
      startDate.setDate(
        today.getDate() - 29
      );
      break;

    case "month":
      startDate.setDate(1);
      break;

    case "last7":
    default:
      startDate.setDate(
        today.getDate() - 6
      );
      break;
  }

  return {
    from:
      formatDateForApi(
        startDate
      ),
    to:
      formatDateForApi(
        endDate
      ),
  };
};


const formatCurrency = (value) =>
  Number(
    value ?? 0
  ).toLocaleString(
    "es-MX",
    {
      style: "currency",
      currency: "MXN",
    }
  );


const formatDisplayDate = (value) => {
  if (!value) {
    return "";
  }

  const [
    year,
    month,
    day,
  ] = value.split("-");

  return `${day}/${month}/${year}`;
};


function Dashboard() {
  const initialRange =
    useMemo(
      () =>
        getPresetRange(
          "last7"
        ),
      []
    );

  const [
    selectedPeriod,
    setSelectedPeriod,
  ] = useState(
    "last7"
  );

  const [
    customFrom,
    setCustomFrom,
  ] = useState(
    initialRange.from
  );

  const [
    customTo,
    setCustomTo,
  ] = useState(
    initialRange.to
  );

  const [
    appliedRange,
    setAppliedRange,
  ] = useState(
    initialRange
  );

  const [
    summary,
    setSummary,
  ] = useState(null);

  const [
    salesTrend,
    setSalesTrend,
  ] = useState([]);

  const [
    topProducts,
    setTopProducts,
  ] = useState([]);

  const [
    topCustomers,
    setTopCustomers,
  ] = useState([]);

  const [
    topRewards,
    setTopRewards,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    filterError,
    setFilterError,
  ] = useState("");


  const loadDashboard =
    useCallback(
      async (
        fromDate,
        toDate
      ) => {
        try {
          setError("");

          const [
            summaryData,
            salesData,
            productsData,
            customersData,
            rewardsData,
          ] =
            await Promise.all([
              getDashboardSummary(
                fromDate,
                toDate
              ),
              getSalesTrend(
                fromDate,
                toDate
              ),
              getTopProducts(
                fromDate,
                toDate
              ),
              getTopCustomers(
                fromDate,
                toDate
              ),
              getTopRewards(
                fromDate,
                toDate
              ),
            ]);

          setSummary(
            summaryData
          );

          setSalesTrend(
            salesData
          );

          setTopProducts(
            productsData
          );

          setTopCustomers(
            customersData
          );

          setTopRewards(
            rewardsData
          );
        } catch (
          requestError
        ) {
          const message =
            requestError
              ?.response
              ?.data
              ?.detail;

          setError(
            message ||
              "No fue posible cargar la información del dashboard."
          );
        }
      },
      []
    );


  useEffect(() => {
    const loadInitialDashboard =
      async () => {
        try {
          setLoading(true);

          await loadDashboard(
            initialRange.from,
            initialRange.to
          );
        } finally {
          setLoading(false);
        }
      };

    loadInitialDashboard();
  }, [
    initialRange,
    loadDashboard,
  ]);


  const applyRange =
    async (
      fromDate,
      toDate
    ) => {
      try {
        setRefreshing(true);

        await loadDashboard(
          fromDate,
          toDate
        );

        setAppliedRange({
          from: fromDate,
          to: toDate,
        });
      } finally {
        setRefreshing(false);
      }
    };


  const handlePeriodChange =
    async (event) => {
      const newPeriod =
        event.target.value;

      setSelectedPeriod(
        newPeriod
      );

      setFilterError("");

      if (
        newPeriod ===
        "custom"
      ) {
        return;
      }

      const range =
        getPresetRange(
          newPeriod
        );

      setCustomFrom(
        range.from
      );

      setCustomTo(
        range.to
      );

      await applyRange(
        range.from,
        range.to
      );
    };


  const handleApplyCustomRange =
    async () => {
      setFilterError("");

      if (
        !customFrom ||
        !customTo
      ) {
        setFilterError(
          "Selecciona ambas fechas."
        );

        return;
      }

      if (
        customFrom >
        customTo
      ) {
        setFilterError(
          "La fecha inicial no puede ser posterior a la fecha final."
        );

        return;
      }

      const today =
        formatDateForApi(
          new Date()
        );

      if (
        customTo >
        today
      ) {
        setFilterError(
          "La fecha final no puede ser posterior al día actual."
        );

        return;
      }

      await applyRange(
        customFrom,
        customTo
      );
    };


  if (loading) {
    return (
      <main className="dashboard-page">

        <div className="dashboard-loading-state">

          <div className="dashboard-loading-indicator" />

          <p>
            Cargando dashboard...
          </p>

        </div>

      </main>
    );
  }


  return (
    <main className="dashboard-page">

      {/* ==========================
          HEADER
      ========================== */}

      <header className="dashboard-header">

        <div>

          <h1>
            Dashboard
          </h1>

          <p>
            Resumen y rendimiento
            general de la heladería.
          </p>

        </div>


        <div className="dashboard-current-period">

          <CalendarDays
            size={18}
          />

          <span>
            {formatDisplayDate(
              appliedRange.from
            )}
            {" — "}
            {formatDisplayDate(
              appliedRange.to
            )}
          </span>

        </div>

      </header>


      {/* ==========================
          FILTER
      ========================== */}

      <section className="dashboard-filter-card">

        <div className="dashboard-filter-main">

          <div>

            <span className="dashboard-filter-label">
              Periodo de análisis
            </span>

            <p>
              Selecciona el periodo
              que deseas consultar.
            </p>

          </div>


          <div className="dashboard-period-select">

            <label
              htmlFor="dashboard-period"
            >
              Periodo
            </label>

            <select
              id="dashboard-period"
              value={
                selectedPeriod
              }
              onChange={
                handlePeriodChange
              }
              disabled={
                refreshing
              }
            >

              <option value="today">
                Hoy
              </option>

              <option value="last7">
                Últimos 7 días
              </option>

              <option value="last30">
                Últimos 30 días
              </option>

              <option value="month">
                Este mes
              </option>

              <option value="custom">
                Personalizado
              </option>

            </select>

          </div>

        </div>


        {selectedPeriod ===
          "custom" && (
          <div className="dashboard-custom-range">

            <div className="form-group">

              <label htmlFor="dashboard-from">
                Desde
              </label>

              <input
                id="dashboard-from"
                type="date"
                value={
                  customFrom
                }
                onChange={(
                  event
                ) =>
                  setCustomFrom(
                    event
                      .target
                      .value
                  )
                }
                max={
                  customTo
                }
              />

            </div>


            <div className="form-group">

              <label htmlFor="dashboard-to">
                Hasta
              </label>

              <input
                id="dashboard-to"
                type="date"
                value={
                  customTo
                }
                onChange={(
                  event
                ) =>
                  setCustomTo(
                    event
                      .target
                      .value
                  )
                }
                min={
                  customFrom
                }
                max={
                  formatDateForApi(
                    new Date()
                  )
                }
              />

            </div>


            <button
              type="button"
              className="primary-action dashboard-apply-filter"
              onClick={
                handleApplyCustomRange
              }
              disabled={
                refreshing
              }
            >
              Aplicar
            </button>

          </div>
        )}


        {filterError && (
          <p
            className="form-error dashboard-filter-error"
            role="alert"
          >
            {filterError}
          </p>
        )}

      </section>


      {error && (
        <p
          className="form-error dashboard-error"
          role="alert"
        >
          {error}
        </p>
      )}


      {/* ==========================
          CONTENT
      ========================== */}

      <div
        className={
          `dashboard-content ${
            refreshing
              ? "dashboard-refreshing"
              : ""
          }`
        }
      >

        {refreshing && (
          <div className="dashboard-refresh-message">
            Actualizando información...
          </div>
        )}


        {/* ==========================
            PRIMARY METRICS
        ========================== */}

        <section className="dashboard-primary-grid">

          <article className="dashboard-primary-card">

            <div className="dashboard-card-icon">
              <TrendingUp
                size={24}
              />
            </div>


            <div>

              <span>
                Ventas del periodo
              </span>

              <strong>
                {formatCurrency(
                  summary
                    ?.sales_in_period
                )}
              </strong>

              <small>
                {
                  summary
                    ?.purchases_in_period ??
                  0
                }{" "}
                compras realizadas
              </small>

            </div>

          </article>


          <article className="dashboard-primary-card">

            <div className="dashboard-card-icon">
              <ShoppingCart
                size={24}
              />
            </div>


            <div>

              <span>
                Compras del periodo
              </span>

              <strong>
                {
                  summary
                    ?.purchases_in_period ??
                  0
                }
              </strong>

              <small>
                {formatDisplayDate(
                  appliedRange.from
                )}
                {" — "}
                {formatDisplayDate(
                  appliedRange.to
                )}
              </small>

            </div>

          </article>

        </section>


        {/* ==========================
            SECONDARY METRICS
        ========================== */}

        <section className="dashboard-metrics-grid">

          <article className="dashboard-metric-card">

            <div className="dashboard-metric-icon">
              <BadgeDollarSign
                size={20}
              />
            </div>

            <div>

              <span>
                Ventas de hoy
              </span>

              <strong>
                {formatCurrency(
                  summary
                    ?.sales_today
                )}
              </strong>

            </div>

          </article>


          <article className="dashboard-metric-card">

            <div className="dashboard-metric-icon">
              <ShoppingCart
                size={20}
              />
            </div>

            <div>

              <span>
                Compras de hoy
              </span>

              <strong>
                {
                  summary
                    ?.purchases_today ??
                  0
                }
              </strong>

            </div>

          </article>


          <article className="dashboard-metric-card">

            <div className="dashboard-metric-icon">
              <Users
                size={20}
              />
            </div>

            <div>

              <span>
                Clientes registrados
              </span>

              <strong>
                {
                  summary
                    ?.customers ??
                  0
                }
              </strong>

            </div>

          </article>


          <article className="dashboard-metric-card">

            <div className="dashboard-metric-icon">
              <BriefcaseBusiness
                size={20}
              />
            </div>

            <div>

              <span>
                Empleados activos
              </span>

              <strong>
                {
                  summary
                    ?.active_employees ??
                  0
                }
              </strong>

            </div>

          </article>


          <article className="dashboard-metric-card">

            <div className="dashboard-metric-icon">
              <Sparkles
                size={20}
              />
            </div>

            <div>

              <span>
                Puntos generados
              </span>

              <strong>
                {
                  summary
                    ?.points_issued ??
                  0
                }
              </strong>

            </div>

          </article>


          <article className="dashboard-metric-card">

            <div className="dashboard-metric-icon">
              <Gift
                size={20}
              />
            </div>

            <div>

              <span>
                Recompensas utilizadas
              </span>

              <strong>
                {
                  summary
                    ?.redemptions ??
                  0
                }
              </strong>

              <small>
                {
                  summary
                    ?.points_redeemed ??
                  0
                }{" "}
                puntos canjeados
              </small>

            </div>

          </article>

        </section>


        {/* ==========================
            SALES
        ========================== */}

        <section className="dashboard-section dashboard-chart-section">

          <div className="dashboard-section-header">

            <div>

              <h2>
                Ventas por día
              </h2>

              <p>
                Evolución de ventas
                y número de compras.
              </p>

            </div>


            <div className="dashboard-section-period">

              <CalendarDays
                size={16}
              />

              <span>
                {formatDisplayDate(
                  appliedRange.from
                )}
                {" — "}
                {formatDisplayDate(
                  appliedRange.to
                )}
              </span>

            </div>

          </div>


          <SalesChart
            data={
              salesTrend
            }
          />

        </section>


        {/* ==========================
            TWO COLUMNS
        ========================== */}

        <div className="dashboard-two-column">

          {/* TOP PRODUCTS */}

          <section className="dashboard-section">

            <div className="dashboard-section-header">

              <div>
                <h2>
                  Productos más vendidos
                </h2>

                <p>
                  Top 5 del periodo.
                </p>
              </div>

            </div>


            {topProducts.length ===
            0 ? (
              <div className="dashboard-empty-state">
                <p>
                  No hubo productos
                  vendidos durante este
                  periodo.
                </p>
              </div>
            ) : (
              <div className="table-container">

                <table className="dashboard-table">

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
                          key={
                            product
                              .product_id
                          }
                        >

                          <td>
                            {
                              product
                                .product_name
                            }
                          </td>

                          <td>
                            {
                              product
                                .quantity_sold
                            }
                          </td>

                          <td>
                            {formatCurrency(
                              product
                                .sales_amount
                            )}
                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>
            )}

          </section>


          {/* TOP REWARDS */}

          <section className="dashboard-section">

            <div className="dashboard-section-header">

              <div>
                <h2>
                  Recompensas más utilizadas
                </h2>

                <p>
                  Top 5 del periodo.
                </p>
              </div>

            </div>


            {topRewards.length ===
            0 ? (
              <div className="dashboard-empty-state">

                <p>
                  No hubo recompensas
                  canjeadas durante este
                  periodo.
                </p>

              </div>
            ) : (
              <div className="table-container">

                <table className="dashboard-table">

                  <thead>
                    <tr>

                      <th>
                        Recompensa
                      </th>

                      <th>
                        Canjes
                      </th>

                      <th>
                        Puntos
                      </th>

                    </tr>
                  </thead>


                  <tbody>

                    {topRewards.map(
                      (reward) => (
                        <tr
                          key={
                            reward
                              .reward_id
                          }
                        >

                          <td>
                            {
                              reward
                                .reward_name
                            }
                          </td>

                          <td>
                            {
                              reward
                                .redemptions
                            }
                          </td>

                          <td>
                            {
                              reward
                                .points_used
                            }
                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>
            )}

          </section>

        </div>


        {/* ==========================
            TOP CUSTOMERS
        ========================== */}

        <section className="dashboard-section">

          <div className="dashboard-section-header">

            <div>

              <h2>
                Clientes principales
              </h2>

              <p>
                Clientes con mayor gasto
                durante el periodo.
              </p>

            </div>

          </div>


          {topCustomers.length ===
          0 ? (
            <div className="dashboard-empty-state">

              <p>
                No hubo compras de
                clientes durante este
                periodo.
              </p>

            </div>
          ) : (
            <div className="table-container">

              <table className="dashboard-table">

                <thead>
                  <tr>

                    <th>
                      Código
                    </th>

                    <th>
                      Cliente
                    </th>

                    <th>
                      Compras
                    </th>

                    <th>
                      Gastado
                    </th>

                    <th>
                      Puntos
                    </th>

                  </tr>
                </thead>


                <tbody>

                  {topCustomers.map(
                    (customer) => (
                      <tr
                        key={
                          customer
                            .customer_id
                        }
                      >

                        <td>
                          <span className="dashboard-customer-code">
                            {
                              customer
                                .customer_code
                            }
                          </span>
                        </td>

                        <td>
                          {
                            customer
                              .name
                          }
                        </td>

                        <td>
                          {
                            customer
                              .purchases
                          }
                        </td>

                        <td>
                          {formatCurrency(
                            customer
                              .amount_spent
                          )}
                        </td>

                        <td>
                          {
                            customer
                              .current_points
                          }
                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

        </section>

      </div>

    </main>
  );
}


export default Dashboard; 