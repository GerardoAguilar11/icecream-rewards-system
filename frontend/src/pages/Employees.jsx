import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  useNotification,
} from "../context/useNotification";

import {
  getEmployees,
  updateEmployee,
} from "../services/employeeService";


function Employees() {
  const {
    showSuccess,
    showError,
  } = useNotification();


  const [
    employees,
    setEmployees,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    updatingId,
    setUpdatingId,
  ] = useState(null);


  useEffect(() => {
    let cancelled = false;


    getEmployees()
      .then((data) => {
        if (!cancelled) {
          setEmployees(
            data
          );
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(
            "No fue posible cargar los empleados."
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(
            false
          );
        }
      });


    return () => {
      cancelled = true;
    };
  }, []);


  const reloadEmployees =
    async () => {
      const data =
        await getEmployees();


      setEmployees(
        data
      );
    };


  const handleToggleActive =
    async (employee) => {
      try {
        setUpdatingId(
          employee.id
        );

        setError("");


        const newStatus =
          !employee.is_active;


        await updateEmployee(
          employee.id,
          {
            is_active:
              newStatus,
          }
        );


        await reloadEmployees();


        const employeeName =
          `${employee.first_name} ${employee.last_name}`.trim();


        showSuccess(
          newStatus
            ? `${employeeName} fue activado correctamente.`
            : `${employeeName} fue desactivado correctamente.`
        );
      } catch {
        showError(
          "No fue posible actualizar el estado del empleado."
        );
      } finally {
        setUpdatingId(
          null
        );
      }
    };


  return (
    <main className="customers-page">

      <header className="page-header page-header-actions">

        <div>

          <h1>
            Empleados
          </h1>


          <p>
            Consulta y administra
            las cuentas de
            empleados.
          </p>

        </div>


        <Link
          to="/employees/new"
          className="primary-action"
        >
          Nuevo empleado
        </Link>

      </header>


      {error && (
        <p
          role="alert"
          className="form-error"
        >
          {error}
        </p>
      )}


      <section className="dashboard-section">

        <h2>
          Empleados registrados
        </h2>


        {loading ? (

          <p>
            Cargando empleados...
          </p>

        ) : employees.length ===
          0 ? (

          <p>
            No hay empleados
            registrados.
          </p>

        ) : (

          <div className="table-container">

            <table>

              <thead>

                <tr>

                  <th>
                    Nombre
                  </th>

                  <th>
                    Correo
                  </th>

                  <th>
                    Estado
                  </th>

                  <th>
                    Fecha de registro
                  </th>

                  <th>
                    Acciones
                  </th>

                </tr>

              </thead>


              <tbody>

                {employees.map(
                  (
                    employee
                  ) => (
                    <tr
                      key={
                        employee.id
                      }
                    >

                      <td>
                        {
                          employee.first_name
                        }{" "}
                        {
                          employee.last_name
                        }
                      </td>


                      <td>
                        {
                          employee.email
                        }
                      </td>


                      <td>
                        {employee.is_active
                          ? "Activo"
                          : "Inactivo"}
                      </td>


                      <td>
                        {new Date(
                          employee.date_joined
                        ).toLocaleString()}
                      </td>


                      <td>

                        <div className="table-actions">

                          <Link
                            to={`/employees/${employee.id}/edit`}
                            className="action-link"
                          >
                            Editar
                          </Link>


                          <button
                            type="button"
                            className="link-button"
                            disabled={
                              updatingId ===
                              employee.id
                            }
                            onClick={() =>
                              handleToggleActive(
                                employee
                              )
                            }
                          >
                            {updatingId ===
                            employee.id
                              ? "Actualizando..."
                              : employee.is_active
                                ? "Desactivar"
                                : "Activar"}
                          </button>

                        </div>

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </main>
  );
}


export default Employees;