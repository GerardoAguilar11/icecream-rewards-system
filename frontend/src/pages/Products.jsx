import {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import { useAuth } from "../context/useAuth";

import {
  getProducts,
  updateProduct,
} from "../services/productService";


function Products() {
  const { user } = useAuth();

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {
    let cancelled = false;

    getProducts()
      .then((data) => {
        if (!cancelled) {
          setProducts(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(
            "No fue posible cargar los productos."
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


  const reloadProducts = async () => {
    const data = await getProducts();

    setProducts(data);
  };


  const handleToggleActive = async (
    product
  ) => {
    try {
      setError("");

      await updateProduct(
        product.id,
        {
          is_active: !product.is_active,
        }
      );

      await reloadProducts();
    } catch {
      setError(
        "No fue posible actualizar el producto."
      );
    }
  };


  const getCategoryLabel = (
    category
  ) => {
    const categories = {
      ICE_CREAM: "Helado",
      DRINK: "Bebida",
      TOPPING: "Complemento",
      OTHER: "Otro",
    };

    return (
      categories[category] ||
      category
    );
  };


  return (
    <main className="products-page">

      <header className="page-header page-header-actions">

        <div>
          <h1>
            Productos
          </h1>

          <p>
            Consulta y administra el catálogo de productos.
          </p>
        </div>


        {user?.role === "ADMIN" && (
          <Link
            to="/products/new"
            className="primary-action"
          >
            Nuevo producto
          </Link>
        )}

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
          Catálogo
        </h2>


        {loading ? (
          <p>
            Cargando productos...
          </p>
        ) : products.length === 0 ? (
          <p>
            No hay productos registrados.
          </p>
        ) : (
          <div className="table-container">

            <table>

              <thead>
                <tr>
                  <th>
                    Imagen
                  </th>

                  <th>
                    Producto
                  </th>

                  <th>
                    Categoría
                  </th>

                  <th>
                    Precio
                  </th>

                  <th>
                    Estado
                  </th>

                  {user?.role === "ADMIN" && (
                    <th>
                      Acciones
                    </th>
                  )}
                </tr>
              </thead>


              <tbody>

                {products.map(
                  (product) => (
                    <tr key={product.id}>

                      <td>
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="product-thumbnail"
                          />
                        ) : (
                          <span>
                            Sin imagen
                          </span>
                        )}
                      </td>


                      <td>
                        {product.name}
                      </td>


                      <td>
                        {getCategoryLabel(
                          product.category
                        )}
                      </td>


                      <td>
                        $
                        {Number(
                          product.price
                        ).toFixed(2)}
                      </td>


                      <td>
                        {product.is_active
                          ? "Activo"
                          : "Inactivo"}
                      </td>


                      {user?.role === "ADMIN" && (
                        <td>

                          <div className="table-actions">

                            <Link
                              to={`/products/${product.id}/edit`}
                              className="action-link"
                            >
                              Editar
                            </Link>


                            <button
                              type="button"
                              className="link-button"
                              onClick={() =>
                                handleToggleActive(
                                  product
                                )
                              }
                            >
                              {product.is_active
                                ? "Desactivar"
                                : "Activar"}
                            </button>

                          </div>

                        </td>
                      )}

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


export default Products;