import {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import { useAuth } from "../context/useAuth";

import {
  getRewards,
  updateReward,
} from "../services/rewardService";


function Rewards() {
  const { user } = useAuth();

  const [rewards, setRewards] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [updatingId, setUpdatingId] =
    useState(null);

  const [error, setError] =
    useState("");


  useEffect(() => {
    let cancelled = false;

    getRewards()
      .then((data) => {
        if (!cancelled) {
          setRewards(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(
            "No fue posible cargar las recompensas."
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


  const reloadRewards = async () => {
    const data =
      await getRewards();

    setRewards(data);
  };


  const handleToggleActive = async (
    reward
  ) => {
    try {
      setUpdatingId(
        reward.id
      );

      setError("");

      await updateReward(
        reward.id,
        {
          is_active:
            !reward.is_active,
        }
      );

      await reloadRewards();
    } catch {
      setError(
        "No fue posible actualizar la recompensa."
      );
    } finally {
      setUpdatingId(null);
    }
  };


  return (
    <main className="rewards-page">

      <header className="page-header page-header-actions">

        <div>

          <h1>
            Recompensas
          </h1>

          <p>
            Consulta y administra las recompensas disponibles para los clientes.
          </p>

        </div>


        {user?.role === "ADMIN" && (
          <Link
            to="/rewards/new"
            className="primary-action"
          >
            Nueva recompensa
          </Link>
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


      <section className="dashboard-section">

        <h2>
          Catálogo de recompensas
        </h2>


        {loading ? (
          <p>
            Cargando recompensas...
          </p>
        ) : rewards.length === 0 ? (
          <p>
            No hay recompensas registradas.
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
                    Descripción
                  </th>

                  <th>
                    Puntos requeridos
                  </th>

                  <th>
                    Estado
                  </th>

                  {user?.role ===
                    "ADMIN" && (
                    <th>
                      Acciones
                    </th>
                  )}

                </tr>
              </thead>


              <tbody>

                {rewards.map(
                  (reward) => (
                    <tr
                      key={
                        reward.id
                      }
                    >

                      <td>
                        <strong>
                          {
                            reward.name
                          }
                        </strong>
                      </td>


                      <td>
                        {
                          reward.description ||
                          "-"
                        }
                      </td>


                      <td>
                        {
                          reward.points_required
                        }{" "}
                        pts
                      </td>


                      <td>
                        {reward.is_active
                          ? "Activa"
                          : "Inactiva"}
                      </td>


                      {user?.role ===
                        "ADMIN" && (
                        <td>

                          <div className="table-actions">

                            <Link
                              to={`/rewards/${reward.id}/edit`}
                              className="action-link"
                            >
                              Editar
                            </Link>


                            <button
                              type="button"
                              className="link-button"
                              disabled={
                                updatingId ===
                                reward.id
                              }
                              onClick={() =>
                                handleToggleActive(
                                  reward
                                )
                              }
                            >
                              {updatingId ===
                              reward.id
                                ? "Actualizando..."
                                : reward.is_active
                                  ? "Desactivar"
                                  : "Activar"}
                            </button>

                          </div>

                        </td>
                      )}

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


export default Rewards;