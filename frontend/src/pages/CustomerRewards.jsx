import {
  useEffect,
  useState,
} from "react";

import {
  getMyRewardCatalog,
} from "../services/rewardService";


function CustomerRewards() {
  const [points, setPoints] =
    useState(0);

  const [rewards, setRewards] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {
    let cancelled = false;

    getMyRewardCatalog()
      .then((data) => {
        if (cancelled) {
          return;
        }

        setPoints(
          data.customer?.points ?? 0
        );

        setRewards(
          data.rewards ?? []
        );
      })
      .catch(() => {
        if (!cancelled) {
          setError(
            "No fue posible cargar tus recompensas."
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


  if (loading) {
    return (
      <main className="customer-section-page">
        <p>
          Cargando recompensas...
        </p>
      </main>
    );
  }


  return (
    <main className="customer-section-page">

      <header className="page-header">

        <h1>
          Mis recompensas
        </h1>

        <p>
          Consulta las recompensas que puedes obtener con tus puntos.
        </p>

      </header>


      {error && (
        <p
          role="alert"
          className="form-error"
        >
          {error}
        </p>
      )}


      <section className="summary-grid">

        <article className="summary-card">

          <h3>
            Mis puntos
          </h3>

          <p>
            {points}
          </p>

        </article>

      </section>


      <section className="dashboard-section">

        <h2>
          Catálogo de recompensas
        </h2>


        {rewards.length === 0 ? (
          <p>
            Actualmente no hay recompensas activas.
          </p>
        ) : (
          <div className="customer-reward-grid">

            {rewards.map(
              (reward) => (
                <article
                  key={reward.id}
                  className={
                    reward.can_redeem
                      ? "customer-reward-card"
                      : "customer-reward-card customer-reward-card-locked"
                  }
                >

                  <h3>
                    {reward.name}
                  </h3>

                  <p>
                    {reward.description ||
                      "Sin descripción"}
                  </p>

                  <p>
                    <strong>
                      {
                        reward.points_required
                      }{" "}
                      puntos
                    </strong>
                  </p>


                  {reward.can_redeem ? (
                    <span className="reward-status reward-status-available">
                      Disponible
                    </span>
                  ) : (
                    <span className="reward-status">
                      Te faltan{" "}
                      {
                        reward.points_missing
                      }{" "}
                      puntos
                    </span>
                  )}

                </article>
              )
            )}

          </div>
        )}


        <p className="reward-help-text">
          Las recompensas se utilizan al realizar una compra en la heladería.
        </p>

      </section>

    </main>
  );
}


export default CustomerRewards;