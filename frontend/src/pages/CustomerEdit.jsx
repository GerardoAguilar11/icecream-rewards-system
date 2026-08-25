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
  getCustomerById,
  updateCustomer,
} from "../services/customerService";


function CustomerEdit() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");


  useEffect(() => {
    const loadCustomer = async () => {
      try {
        const customer =
          await getCustomerById(id);

        setForm({
          first_name:
            customer.first_name ?? "",
          last_name:
            customer.last_name ?? "",
          email:
            customer.email ?? "",
          phone:
            customer.phone ?? "",
        });
      } catch {
        setError(
          "No fue posible cargar el cliente."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCustomer();
  }, [id]);


  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      await updateCustomer(
        id,
        form
      );

      navigate(
        `/customers/${id}`,
        { replace: true }
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

      setError(
        "No fue posible actualizar el cliente."
      );
    } finally {
      setSubmitting(false);
    }
  };


  if (loading) {
    return (
      <main className="customers-page">
        <p>
          Cargando cliente...
        </p>
      </main>
    );
  }


  return (
    <main className="customers-page">

      <header className="page-header">
        <div>
          <Link
            to={`/customers/${id}`}
            className="back-link"
          >
            ← Volver al cliente
          </Link>

          <h1>
            Editar cliente
          </h1>

          <p>
            Actualiza los datos del cliente.
          </p>
        </div>
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
              to={`/customers/${id}`}
              className="secondary-action"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              disabled={submitting}
            >
              {submitting
                ? "Guardando..."
                : "Guardar cambios"}
            </button>

          </div>

        </form>

      </section>

    </main>
  );
}


export default CustomerEdit;