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
  useNotification,
} from "../context/useNotification";

import {
  createReward,
  getRewardById,
  updateReward,
} from "../services/rewardService";


function RewardForm() {
  const {
    id,
  } = useParams();

  const navigate =
    useNavigate();

  const {
    showSuccess,
    showError,
  } = useNotification();

  const isEditing =
    Boolean(id);


  const [
    form,
    setForm,
  ] = useState({
    name: "",
    description: "",
    points_required: "",
    is_active: true,
  });

  const [
    loading,
    setLoading,
  ] = useState(
    isEditing
  );

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");


  /* ==========================
     LOAD REWARD
  ========================== */

  useEffect(() => {
    if (!isEditing) {
      return;
    }


    let cancelled = false;


    getRewardById(
      id
    )
      .then(
        (reward) => {
          if (cancelled) {
            return;
          }


          setForm({
            name:
              reward.name ??
              "",

            description:
              reward.description ??
              "",

            points_required:
              reward.points_required ??
              "",

            is_active:
              reward.is_active ??
              true,
          });
        }
      )
      .catch(() => {
        if (
          !cancelled
        ) {
          setError(
            "No fue posible cargar la recompensa."
          );
        }
      })
      .finally(() => {
        if (
          !cancelled
        ) {
          setLoading(
            false
          );
        }
      });


    return () => {
      cancelled = true;
    };
  }, [
    id,
    isEditing,
  ]);


  /* ==========================
     FORM HANDLER
  ========================== */

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;


    setForm(
      (
        currentForm
      ) => ({
        ...currentForm,

        [name]:
          type ===
          "checkbox"
            ? checked
            : value,
      })
    );
  };


  /* ==========================
     SUBMIT
  ========================== */

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      setError("");


      if (
        !form.name.trim()
      ) {
        setError(
          "El nombre de la recompensa es obligatorio."
        );

        return;
      }


      const points =
        Number(
          form.points_required
        );


      if (
        !Number.isInteger(
          points
        ) ||
        points <= 0
      ) {
        setError(
          "Los puntos requeridos deben ser un número entero mayor a cero."
        );

        return;
      }


      try {
        setSubmitting(
          true
        );


        const data = {
          name:
            form.name.trim(),

          description:
            form.description.trim(),

          points_required:
            points,

          is_active:
            form.is_active,
        };


        if (isEditing) {
          await updateReward(
            id,
            data
          );


          showSuccess(
            "Recompensa actualizada correctamente."
          );
        } else {
          await createReward(
            data
          );


          showSuccess(
            "Recompensa creada correctamente."
          );
        }


        navigate(
          "/rewards",
          {
            replace: true,
          }
        );
      } catch (
        requestError
      ) {
        const responseData =
          requestError
            .response
            ?.data;


        if (
          responseData
            ?.name
        ) {
          setError(
            Array.isArray(
              responseData.name
            )
              ? responseData
                  .name[0]
              : responseData
                  .name
          );

          return;
        }


        if (
          responseData
            ?.points_required
        ) {
          setError(
            Array.isArray(
              responseData
                .points_required
            )
              ? responseData
                  .points_required[0]
              : responseData
                  .points_required
          );

          return;
        }


        showError(
          isEditing
            ? "No fue posible actualizar la recompensa."
            : "No fue posible crear la recompensa."
        );
      } finally {
        setSubmitting(
          false
        );
      }
    };


  /* ==========================
     LOADING
  ========================== */

  if (loading) {
    return (
      <main className="rewards-page">

        <p>
          Cargando recompensa...
        </p>

      </main>
    );
  }


  return (
    <main className="rewards-page">

      <header className="page-header">

        <Link
          to="/rewards"
          className="back-link"
        >
          ← Volver a recompensas
        </Link>


        <h1>
          {isEditing
            ? "Editar recompensa"
            : "Nueva recompensa"}
        </h1>


        <p>
          {isEditing
            ? "Actualiza la información de la recompensa."
            : "Agrega una nueva recompensa al catálogo."}
        </p>

      </header>


      <section className="dashboard-section">

        <form
          onSubmit={
            handleSubmit
          }
          className="customer-form"
        >

          <div className="form-group">

            <label htmlFor="name">
              Nombre
            </label>


            <input
              id="name"
              name="name"
              type="text"
              value={
                form.name
              }
              onChange={
                handleChange
              }
              required
            />

          </div>


          <div className="form-group">

            <label htmlFor="description">
              Descripción
            </label>


            <textarea
              id="description"
              name="description"
              rows="4"
              value={
                form.description
              }
              onChange={
                handleChange
              }
            />

          </div>


          <div className="form-group">

            <label htmlFor="points_required">
              Puntos requeridos
            </label>


            <input
              id="points_required"
              name="points_required"
              type="number"
              min="1"
              step="1"
              value={
                form.points_required
              }
              onChange={
                handleChange
              }
              required
            />

          </div>


          <div className="checkbox-group">

            <input
              id="is_active"
              name="is_active"
              type="checkbox"
              checked={
                form.is_active
              }
              onChange={
                handleChange
              }
            />


            <label htmlFor="is_active">
              Recompensa activa
            </label>

          </div>


          {error && (
            <p
              role="alert"
              className="form-error"
            >
              {error}
            </p>
          )}


          <div className="form-actions">

            <Link
              to="/rewards"
              className="secondary-action"
            >
              Cancelar
            </Link>


            <button
              type="submit"
              disabled={
                submitting
              }
            >
              {submitting
                ? "Guardando..."
                : "Guardar recompensa"}
            </button>

          </div>

        </form>

      </section>

    </main>
  );
}


export default RewardForm;