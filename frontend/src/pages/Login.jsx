import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  LogIn,
} from "lucide-react";

import {
  useAuth,
} from "../context/useAuth";

import {
  useNotification,
} from "../context/useNotification";

import frioCoLogo
  from "../assets/frio-co-logo-ui.png";


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
    <main className="auth-page">

      <section className="auth-card">

        <div className="auth-brand">

          <img
            src={frioCoLogo}
            alt="Frio&Co"
            className="auth-logo"
          />

          <p>
            Tu programa de recompensas
            para disfrutar más cada visita.
          </p>

        </div>


        <div className="auth-content">

          <div className="auth-header">

            <span className="auth-eyebrow">
              Bienvenido
            </span>

            <h1>
              Iniciar sesión
            </h1>

            <p>
              Ingresa tus datos para acceder
              a tu cuenta.
            </p>

          </div>


          <form
            onSubmit={
              handleSubmit
            }
            className="auth-form"
          >

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
                autoComplete="email"
                placeholder="correo@ejemplo.com"
                required
              />

            </div>


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
                autoComplete="current-password"
                placeholder="Tu contraseña"
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
              className="auth-submit-button"
              disabled={
                submitting
              }
            >

              <LogIn
                size={18}
              />

              <span>
                {submitting
                  ? "Iniciando sesión..."
                  : "Iniciar sesión"}
              </span>

            </button>

          </form>


          <div className="auth-footer">

            <span>
              ¿Aún no tienes cuenta?
            </span>

            <Link to="/register">
              Crear cuenta
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}


export default Login;