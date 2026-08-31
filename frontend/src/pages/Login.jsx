import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../context/useAuth";

import {
  useNotification,
} from "../context/useNotification";


function Login() {
  const navigate =
    useNavigate();

  const {
    login,
  } = useAuth();

  const {
    showSuccess,
  } = useNotification();

  const [
    form,
    setForm,
  ] = useState({
    email: "",
    password: "",
  });

  const [
    error,
    setError,
  ] = useState("");

  const [
    submitting,
    setSubmitting,
  ] = useState(false);


  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setForm(
      (
        currentForm
      ) => ({
        ...currentForm,
        [name]: value,
      })
    );

    setError("");
  };


  const handleSubmit =
    async (event) => {
      event.preventDefault();

      setError("");

      try {
        setSubmitting(
          true
        );

        const user =
          await login(
            form.email.trim(),
            form.password
          );

        showSuccess(
          "Sesión iniciada correctamente."
        );

        if (
          user.role ===
          "ADMIN"
        ) {
          navigate(
            "/dashboard",
            {
              replace: true,
            }
          );

          return;
        }

        if (
          user.role ===
          "EMPLOYEE"
        ) {
          navigate(
            "/customers",
            {
              replace: true,
            }
          );

          return;
        }

        if (
          user.role ===
          "CUSTOMER"
        ) {
          navigate(
            "/customer",
            {
              replace: true,
            }
          );

          return;
        }

        navigate(
          "/",
          {
            replace: true,
          }
        );
      } catch {
        setError(
          "Correo electrónico o contraseña incorrectos."
        );
      } finally {
        setSubmitting(
          false
        );
      }
    };


  return (
    <main>

      <h1>
        Iniciar sesión
      </h1>


      <form
        onSubmit={
          handleSubmit
        }
      >

        <div>

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
            autoComplete="email"
            required
          />

        </div>


        <div>

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
            autoComplete="current-password"
            required
          />

        </div>


        {error && (
          <p
            role="alert"
            className="form-error"
          >
            {error}
          </p>
        )}


        <button
          type="submit"
          disabled={
            submitting
          }
        >
          {submitting
            ? "Iniciando sesión..."
            : "Iniciar sesión"}
        </button>

      </form>


      <p>
        ¿Aún no tienes cuenta?{" "}

        <Link to="/register">
          Crear cuenta
        </Link>
      </p>

    </main>
  );
}


export default Login;