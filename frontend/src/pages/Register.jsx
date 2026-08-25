import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import { register } from "../services/authService";


function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] =
    useState(false);


  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (
      form.password !==
      form.confirmPassword
    ) {
      setError(
        "Las contraseñas no coinciden."
      );

      return;
    }

    if (form.password.length < 8) {
      setError(
        "La contraseña debe tener al menos 8 caracteres."
      );

      return;
    }

    try {
      setSubmitting(true);

      await register({
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });

      navigate(
        "/login",
        {
          replace: true,
          state: {
            registrationSuccess: true,
          },
        }
      );
    } catch (requestError) {
      const responseData =
        requestError.response?.data;

      if (responseData?.email) {
        setError(
          Array.isArray(responseData.email)
            ? responseData.email[0]
            : responseData.email
        );

        return;
      }

      if (responseData?.password) {
        setError(
          Array.isArray(responseData.password)
            ? responseData.password[0]
            : responseData.password
        );

        return;
      }

      setError(
        "No fue posible crear la cuenta."
      );
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <main className="customers-page">

      <header className="page-header">
        <h1>Crear cuenta</h1>

        <p>
          Regístrate para comenzar a acumular puntos.
        </p>
      </header>


      <section className="dashboard-section">

        <form
          onSubmit={handleSubmit}
          className="customer-form"
        >

          <div className="form-group">
            <label htmlFor="first_name">
              Nombre
            </label>

            <input
              id="first_name"
              name="first_name"
              type="text"
              value={form.first_name}
              onChange={handleChange}
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
              value={form.last_name}
              onChange={handleChange}
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
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
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
              value={form.phone}
              onChange={handleChange}
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
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
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
              value={form.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              minLength="8"
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


          <div className="form-actions">
            <Link
              to="/login"
              className="secondary-action"
            >
              Ya tengo cuenta
            </Link>

            <button
              type="submit"
              disabled={submitting}
            >
              {submitting
                ? "Creando cuenta..."
                : "Crear cuenta"}
            </button>
          </div>

        </form>

      </section>

    </main>
  );
}


export default Register;