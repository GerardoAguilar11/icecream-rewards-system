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
  createEmployee,
  getEmployeeById,
  updateEmployee,
} from "../services/employeeService";


function EmployeeForm() {
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
    first_name: "",
    last_name: "",
    email: "",
    password: "",
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


  useEffect(() => {
    if (!isEditing) {
      return;
    }


    let cancelled = false;


    getEmployeeById(
      id
    )
      .then(
        (employee) => {
          if (cancelled) {
            return;
          }


          setForm({
            first_name:
              employee.first_name ??
              "",

            last_name:
              employee.last_name ??
              "",

            email:
              employee.email ??
              "",

            password:
              "",

            is_active:
              employee.is_active ??
              true,
          });
        }
      )
      .catch(() => {
        if (
          !cancelled
        ) {
          setError(
            "No fue posible cargar el empleado."
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


    setError("");
  };


  const handleSubmit =
    async (event) => {
      event.preventDefault();

      setError("");


      if (
        !form.first_name.trim()
      ) {
        setError(
          "El nombre es obligatorio."
        );

        return;
      }


      if (
        !form.last_name.trim()
      ) {
        setError(
          "Los apellidos son obligatorios."
        );

        return;
      }


      if (
        !form.email.trim()
      ) {
        setError(
          "El correo electrónico es obligatorio."
        );

        return;
      }


      if (
        !isEditing &&
        form.password.length <
          8
      ) {
        setError(
          "La contraseña debe tener al menos 8 caracteres."
        );

        return;
      }


      try {
        setSubmitting(
          true
        );


        const payload = {
          first_name:
            form.first_name.trim(),

          last_name:
            form.last_name.trim(),

          email:
            form.email.trim(),

          is_active:
            form.is_active,
        };


        if (!isEditing) {
          payload.password =
            form.password;
        }


        if (isEditing) {
          await updateEmployee(
            id,
            payload
          );


          showSuccess(
            "Empleado actualizado correctamente."
          );
        } else {
          await createEmployee(
            payload
          );


          showSuccess(
            "Empleado creado correctamente."
          );
        }


        navigate(
          "/employees",
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
            ?.email
        ) {
          setError(
            Array.isArray(
              responseData.email
            )
              ? responseData
                  .email[0]
              : responseData
                  .email
          );

          return;
        }


        if (
          responseData
            ?.first_name
        ) {
          setError(
            Array.isArray(
              responseData.first_name
            )
              ? responseData
                  .first_name[0]
              : responseData
                  .first_name
          );

          return;
        }


        if (
          responseData
            ?.last_name
        ) {
          setError(
            Array.isArray(
              responseData.last_name
            )
              ? responseData
                  .last_name[0]
              : responseData
                  .last_name
          );

          return;
        }


        if (
          responseData
            ?.password
        ) {
          setError(
            Array.isArray(
              responseData.password
            )
              ? responseData
                  .password[0]
              : responseData
                  .password
          );

          return;
        }


        showError(
          isEditing
            ? "No fue posible actualizar el empleado."
            : "No fue posible crear el empleado."
        );
      } finally {
        setSubmitting(
          false
        );
      }
    };


  if (loading) {
    return (
      <main className="customers-page">

        <p>
          Cargando empleado...
        </p>

      </main>
    );
  }


  return (
    <main className="customers-page">

      <header className="page-header">

        <Link
          to="/employees"
          className="back-link"
        >
          ← Volver a empleados
        </Link>


        <h1>
          {isEditing
            ? "Editar empleado"
            : "Nuevo empleado"}
        </h1>


        <p>
          {isEditing
            ? "Actualiza la información del empleado."
            : "Registra una nueva cuenta de empleado."}
        </p>

      </header>


      <section className="dashboard-section">

        <form
          className="customer-form"
          onSubmit={
            handleSubmit
          }
        >

          <div className="form-group">

            <label htmlFor="first_name">
              Nombre
            </label>


            <input
              id="first_name"
              name="first_name"
              type="text"
              value={
                form.first_name
              }
              onChange={
                handleChange
              }
              required
            />

          </div>


          <div className="form-group">

            <label htmlFor="last_name">
              Apellidos
            </label>


            <input
              id="last_name"
              name="last_name"
              type="text"
              value={
                form.last_name
              }
              onChange={
                handleChange
              }
              required
            />

          </div>


          <div className="form-group">

            <label htmlFor="email">
              Correo electrónico
            </label>


            <input
              id="email"
              name="email"
              type="email"
              value={
                form.email
              }
              onChange={
                handleChange
              }
              required
            />

          </div>


          {!isEditing && (
            <div className="form-group">

              <label htmlFor="password">
                Contraseña
              </label>


              <input
                id="password"
                name="password"
                type="password"
                value={
                  form.password
                }
                onChange={
                  handleChange
                }
                minLength="8"
                required
              />


              <small>
                Mínimo 8 caracteres.
              </small>

            </div>
          )}


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
              Empleado activo
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
              to="/employees"
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
                : isEditing
                  ? "Guardar cambios"
                  : "Crear empleado"}
            </button>

          </div>

        </form>

      </section>

    </main>
  );
}


export default EmployeeForm;