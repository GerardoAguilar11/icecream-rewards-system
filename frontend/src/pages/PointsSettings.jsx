import {
  BadgeDollarSign,
  Save,
  Sparkles,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  getPointsSettings,
  updatePointsSettings,
} from "../services/settingsService";

import {
  useNotification,
} from "../context/useNotification";


function PointsSettings() {
  const {
    showSuccess,
    showError,
  } = useNotification();

  const [
    amountRequired,
    setAmountRequired,
  ] = useState("");

  const [
    pointsAwarded,
    setPointsAwarded,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    formError,
    setFormError,
  ] = useState("");


  useEffect(() => {
    const loadSettings =
      async () => {
        try {
          setLoading(true);

          const data =
            await getPointsSettings();

          setAmountRequired(
            data.amount_required
          );

          setPointsAwarded(
            String(
              data.points_awarded
            )
          );
        } catch {
          showError(
            "No fue posible cargar "
            + "la configuración de puntos."
          );
        } finally {
          setLoading(false);
        }
      };

    loadSettings();
  }, [
    showError,
  ]);


  const handleSubmit =
    async (event) => {
      event.preventDefault();

      setFormError("");

      const amount =
        Number(
          amountRequired
        );

      const points =
        Number(
          pointsAwarded
        );

      if (
        !Number.isFinite(amount)
        || amount <= 0
      ) {
        setFormError(
          "El monto requerido debe "
          + "ser mayor a cero."
        );

        return;
      }

      if (
        !Number.isInteger(points)
        || points <= 0
      ) {
        setFormError(
          "Los puntos otorgados deben "
          + "ser un número entero mayor "
          + "a cero."
        );

        return;
      }

      try {
        setSaving(true);

        const updated =
          await updatePointsSettings({
            amount_required:
              amount.toFixed(2),

            points_awarded:
              points,
          });

        setAmountRequired(
          updated.amount_required
        );

        setPointsAwarded(
          String(
            updated.points_awarded
          )
        );

        showSuccess(
          "Configuración de puntos "
          + "actualizada correctamente."
        );
      } catch (
        requestError
      ) {
        const responseData =
          requestError
            ?.response
            ?.data;

        const message =
          responseData
            ?.amount_required
            ?.[0]
          || responseData
            ?.points_awarded
            ?.[0]
          || responseData
            ?.detail
          || (
            "No fue posible guardar "
            + "la configuración."
          );

        setFormError(
          message
        );
      } finally {
        setSaving(false);
      }
    };


  if (loading) {
    return (
      <main className="settings-page">
        <div className="dashboard-loading-state">
          <div
            className="dashboard-loading-indicator"
          />

          <p>
            Cargando configuración...
          </p>
        </div>
      </main>
    );
  }


  const amountPreview =
    Number(
      amountRequired
    ) || 0;

  const pointsPreview =
    Number(
      pointsAwarded
    ) || 0;


  return (
    <main className="settings-page">
      <header className="page-header">
        <h1>
          Configuración
        </h1>

        <p>
          Administra las reglas generales
          del programa de recompensas.
        </p>
      </header>


      <section className="points-settings-card">
        <div className="points-settings-header">
          <div className="points-settings-icon">
            <Sparkles
              size={24}
            />
          </div>

          <div>
            <h2>
              Programa de puntos
            </h2>

            <p>
              Define cuántos puntos recibe
              un cliente de acuerdo con el
              monto de su compra.
            </p>
          </div>
        </div>


        <form
          onSubmit={
            handleSubmit
          }
        >
          <div className="points-settings-grid">
            <div className="form-group">
              <label
                htmlFor="amount-required"
              >
                Monto requerido
              </label>

              <div className="settings-input-icon">
                <BadgeDollarSign
                  size={18}
                />

                <input
                  id="amount-required"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={
                    amountRequired
                  }
                  onChange={(
                    event
                  ) =>
                    setAmountRequired(
                      event.target.value
                    )
                  }
                />
              </div>

              <small>
                Monto que debe gastarse
                para completar un bloque
                de puntos.
              </small>
            </div>


            <div className="form-group">
              <label
                htmlFor="points-awarded"
              >
                Puntos otorgados
              </label>

              <div className="settings-input-icon">
                <Sparkles
                  size={18}
                />

                <input
                  id="points-awarded"
                  type="number"
                  min="1"
                  step="1"
                  value={
                    pointsAwarded
                  }
                  onChange={(
                    event
                  ) =>
                    setPointsAwarded(
                      event.target.value
                    )
                  }
                />
              </div>

              <small>
                Cantidad de puntos que
                recibe el cliente por
                cada bloque completado.
              </small>
            </div>
          </div>


          <div className="points-rule-preview">
            <span>
              Regla actual
            </span>

            <strong>
              {pointsPreview}{" "}
              {pointsPreview === 1
                ? "punto"
                : "puntos"}{" "}
              por cada{" "}
              {amountPreview.toLocaleString(
                "es-MX",
                {
                  style: "currency",
                  currency: "MXN",
                },
              )}{" "}
              gastados
            </strong>

            <p>
              Los cambios se aplicarán
              únicamente a nuevas compras.
              Las compras anteriores
              conservarán los puntos que
              obtuvieron originalmente.
            </p>
          </div>


          {formError && (
            <p
              className="form-error"
              role="alert"
            >
              {formError}
            </p>
          )}


          <div className="form-actions">
            <button
              type="submit"
              className="primary-action settings-save-button"
              disabled={
                saving
              }
            >
              <Save
                size={18}
              />

              {saving
                ? "Guardando..."
                : "Guardar cambios"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}


export default PointsSettings;