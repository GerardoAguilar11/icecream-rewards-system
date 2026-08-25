import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/useAuth";


function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] =
    useState(false);


  const handleChange = (event) => {
    const { name, value } =
      event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      const user = await login(
        form.email,
        form.password
      );

      if (user.role === "ADMIN") {
        navigate(
          "/dashboard",
          { replace: true }
        );

        return;
      }

      if (user.role === "EMPLOYEE") {
        navigate(
          "/customers",
          { replace: true }
        );

        return;
      }

      navigate(
        "/",
        { replace: true }
      );
    } catch {
      setError(
        "Correo electrónico o contraseña incorrectos."
      );
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <main>
      <h1>Iniciar sesión</h1>

      <form onSubmit={handleSubmit}>
        <div>
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

        <div>
          <label htmlFor="password">
            Contraseña
          </label>

          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />
        </div>

        {error && (
          <p role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
        >
          {submitting
            ? "Iniciando sesión..."
            : "Iniciar sesión"}
        </button>
      </form>
    </main>
  );
}


export default Login;