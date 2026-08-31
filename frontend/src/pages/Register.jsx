import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  UserPlus,
} from "lucide-react";

import {
  useNotification,
} from "../context/useNotification";

import {
  register,
} from "../services/authService";

import frioCoLogo
  from "../assets/frio-co-logo-ui.png";


function Register() {
  const navigate =
    useNavigate();

  const {
    showSuccess,
    showError,
  } = useNotification();

  const [
    form,
    setForm,
  ] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
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
        form.password !==
        form.confirmPassword
      ) {
        setError(
          "Las contraseñas no coinciden."
        );

        return;
      }


      if (
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


        await register({
          first_name:
            form.first_name.trim(),
          last_name:
            form.last_name.trim(),
          email:
            form.email.trim(),
          phone:
            form.phone.trim(),
          password:
            form.password,
        });


        showSuccess(
          "Cuenta creada correctamente. Ya puedes iniciar sesión."
        );


        navigate(
          "/login",
          {
            replace: true,
          }
        );
      } catch (
        requestError
      ) {
        const responseData =
          requestError.response
            ?.data;


        if (
          responseData?.email
        ) {
          setError(
            Array.isArray(
              responseData.email
            )
              ? responseData.email[0]
              : responseData.email
          );

          return;
        }


        if (
          responseData?.password
        ) {
          setError(
            Array.isArray(
              responseData.password
            )
              ? responseData.password[0]
              : responseData.password
          );

          return;
        }


        if (
          responseData?.first_name
        ) {
          setError(
            Array.isArray(
              responseData.first_name
            )
              ? responseData.first_name[0]
              : responseData.first_name
          );

          return;
        }


        if (
          responseData?.last_name
        ) {
          setError(
            Array.isArray(
              responseData.last_name
            )
              ? responseData.last_name[0]
              : responseData.last_name
          );

          return;
        }


        if (
          responseData?.phone
        ) {
          setError(
            Array.isArray(
              responseData.phone
            )
              ? responseData.phone[0]
              : responseData.phone
          );

          return;
        }


        showError(
          "No fue posible crear la cuenta."
        );
      } finally {
        setSubmitting(
          false
        );
      }
    };


  return (
    <main className="auth-page auth-register-page">

      <section className="auth-card auth-register-card">

        <div className="auth-brand">

          <img
            src={frioCoLogo}
            alt="Frio&Co"
            className="auth-logo"
          />

          <p>
            Regístrate y comienza a
            acumular puntos en cada compra.
          </p>

        </div>


        <div className="auth-content">

          <div className="auth-header">

            <span className="auth-eyebrow">
              Únete a Frio&Co
            </span>

            <h1>
              Crear cuenta
            </h1>

            <p>
              Completa tus datos para formar
              parte del programa de recompensas.
            </p>

          </div>


          <form
            onSubmit={
              handleSubmit
            }
            className="auth-form"
          >

            <div className="auth-form-grid">

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
                  placeholder="Tu nombre"
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
                  placeholder="Tus apellidos"
                  required
                />

              </div>

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
                autoComplete="email"
                placeholder="correo@ejemplo.com"
                required
              />

            </div>


            <div className="form-group">

              <label htmlFor="phone">
                Teléfono
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                value={
                  form.phone
                }
                onChange={
                  handleChange
                }
                placeholder="Tu teléfono"
              />

            </div>


            <div className="auth-form-grid">

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
                  autoComplete="new-password"
                  placeholder="Mínimo 8 caracteres"
                  minLength="8"
                  required
                />

              </div>


              <div className="form-group">

                <label htmlFor="confirmPassword">
                  Confirmar contraseña
                </label>

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={
                    form.confirmPassword
                  }
                  onChange={
                    handleChange
                  }
                  autoComplete="new-password"
                  placeholder="Repite tu contraseña"
                  minLength="8"
                  required
                />

              </div>

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

              <UserPlus
                size={18}
              />

              <span>
                {submitting
                  ? "Creando cuenta..."
                  : "Crear cuenta"}
              </span>

            </button>

          </form>


          <div className="auth-footer">

            <span>
              ¿Ya tienes cuenta?
            </span>

            <Link to="/login">
              Iniciar sesión
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}


export default Register;