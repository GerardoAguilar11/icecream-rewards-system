import {
  useEffect,
  useState,
} from "react";

import {
  getMyCustomerProfile,
  updateMyCustomerProfile,
} from "../services/customerService";


function CustomerProfile() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  const [customerCode, setCustomerCode] =
    useState("");

  const [points, setPoints] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  useEffect(() => {
    let cancelled = false;

    getMyCustomerProfile()
      .then((data) => {
        if (cancelled) {
          return;
        }

        setForm({
          first_name:
            data.first_name ?? "",
          last_name:
            data.last_name ?? "",
          email:
            data.email ?? "",
          phone:
            data.phone ?? "",
        });

        setCustomerCode(
          data.customer_code ?? ""
        );

        setPoints(
          data.points ?? 0
        );
      })
      .catch(() => {
        if (!cancelled) {
          setError(
            "No fue posible cargar tu perfil."
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


  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setForm(
      (currentForm) => ({
        ...currentForm,
        [name]: value,
      })
    );

    setSuccess("");
  };


  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");


    if (!form.first_name.trim()) {
      setError(
        "El nombre es obligatorio."
      );

      return;
    }


    if (!form.last_name.trim()) {
      setError(
        "Los apellidos son obligatorios."
      );

      return;
    }


    if (!form.email.trim()) {
      setError(
        "El correo electrónico es obligatorio."
      );

      return;
    }


    try {
      setSubmitting(true);

      const updatedCustomer =
        await updateMyCustomerProfile({
          first_name:
            form.first_name.trim(),

          last_name:
            form.last_name.trim(),

          email:
            form.email.trim(),

          phone:
            form.phone.trim(),
        });


      setForm({
        first_name:
          updatedCustomer.first_name ?? "",

        last_name:
          updatedCustomer.last_name ?? "",

        email:
          updatedCustomer.email ?? "",

        phone:
          updatedCustomer.phone ?? "",
      });


      setCustomerCode(
        updatedCustomer.customer_code
      );

      setPoints(
        updatedCustomer.points
      );


      setSuccess(
        "Tu perfil se actualizó correctamente."
      );
    } catch (requestError) {
      const responseData =
        requestError.response?.data;


      if (responseData?.email) {
        setError(
          Array.isArray(
            responseData.email
          )
            ? responseData.email[0]
            : responseData.email
        );

        return;
      }


      if (responseData?.first_name) {
        setError(
          Array.isArray(
            responseData.first_name
          )
            ? responseData.first_name[0]
            : responseData.first_name
        );

        return;
      }


      if (responseData?.last_name) {
        setError(
          Array.isArray(
            responseData.last_name
          )
            ? responseData.last_name[0]
            : responseData.last_name
        );

        return;
      }


      setError(
        "No fue posible actualizar tu perfil."
      );
    } finally {
      setSubmitting(false);
    }
  };


  if (loading) {
    return (
      <main className="customer-section-page">
        <p>
          Cargando perfil...
        </p>
      </main>
    );
  }


  return (
    <main className="customer-section-page">

      <header className="page-header">

        <h1>
          Mi perfil
        </h1>

        <p>
          Consulta y actualiza tu información personal.
        </p>

      </header>


      <section className="dashboard-section">

        <h2>
          Información personal
        </h2>


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


          {success && (
            <p
              role="status"
              className="form-success"
            >
              {success}
            </p>
          )}


          <div className="form-actions">

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


      <section className="dashboard-section">

        <h2>
          Información de la cuenta
        </h2>


        <div className="customer-profile-readonly">

          <div>
            <span>
              Código de cliente
            </span>

            <strong>
              {customerCode}
            </strong>
          </div>


          <div>
            <span>
              Puntos disponibles
            </span>

            <strong>
              {points}
            </strong>
          </div>

        </div>

      </section>

    </main>
  );
}


export default CustomerProfile;