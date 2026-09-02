import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  useAuth,
} from "../context/useAuth";

import {
  useNotification,
} from "../context/useNotification";

import {
  deleteProduct,
  getProducts,
  updateProduct,
} from "../services/productService";


function Products() {
  const {
    user,
  } = useAuth();

  const {
    showSuccess,
    showError,
  } = useNotification();


  const [
    products,
    setProducts,
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
    productToDelete,
    setProductToDelete,
  ] = useState(null);

  const [
    deleting,
    setDeleting,
  ] = useState(false);

  const [
    updatingId,
    setUpdatingId,
  ] = useState(null);


  /* ==========================
     LOAD PRODUCTS
  ========================== */

  useEffect(() => {
    let cancelled = false;


    getProducts()
      .then((data) => {
        if (!cancelled) {
          setProducts(
            data
          );
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
          setLoading(
            false
          );
        }
      });


    return () => {
      cancelled = true;
    };
  }, []);


  /* ==========================
     RELOAD PRODUCTS
  ========================== */

  const reloadProducts =
    async () => {
      const data =
        await getProducts();

      setProducts(
        data
      );
    };


  /* ==========================
     TOGGLE ACTIVE
  ========================== */

  const handleToggleActive =
    async (product) => {
      try {
        setUpdatingId(
          product.id
        );

        setError("");


        const newStatus =
          !product.is_active;


        await updateProduct(
          product.id,
          {
            is_active:
              newStatus,
          }
        );


        await reloadProducts();


        showSuccess(
          newStatus
            ? `${product.name} fue activado correctamente.`
            : `${product.name} fue desactivado correctamente.`
        );
      } catch {
        showError(
          "No fue posible actualizar el estado del producto."
        );
      } finally {
        setUpdatingId(
          null
        );
      }
    };


  /* ==========================
     DELETE PRODUCT
  ========================== */

  const handleDeleteClick = (
    product
  ) => {
    setError("");

    setProductToDelete(
      product
    );
  };


  const handleCloseDeleteModal =
    () => {
      if (deleting) {
        return;
      }


      setProductToDelete(
        null
      );
    };


  const handleConfirmDelete =
    async () => {
      if (
        !productToDelete
      ) {
        return;
      }


      const productName =
        productToDelete.name;


      try {
        setDeleting(
          true
        );


        await deleteProduct(
          productToDelete.id
        );


        await reloadProducts();


        setProductToDelete(
          null
        );


        showSuccess(
          `${productName} fue eliminado correctamente.`
        );
      } catch (
        requestError
      ) {
        const detail =
          requestError
            .response
            ?.data
            ?.detail;


        showError(
          detail ||
          "No fue posible eliminar el producto."
        );
      } finally {
        setDeleting(
          false
        );
      }
    };


  /* ==========================
     CATEGORY LABEL
  ========================== */

  const getCategoryLabel = (
    category
  ) => {
    const categories = {
      ICE_CREAM:
        "Helado",

      DRINK:
        "Bebida",

      TOPPING:
        "Complemento",

      OTHER:
        "Otro",
    };


    return (
      categories[
        category
      ] ||
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
            Consulta y administra
            el catálogo de productos.
          </p>

        </div>


        {user?.role ===
          "ADMIN" && (
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

        ) : products.length ===
          0 ? (

          <p>
            No hay productos
            registrados.
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


                  {user?.role ===
                    "ADMIN" && (
                    <th>
                      Acciones
                    </th>
                  )}

                </tr>

              </thead>


              <tbody>

                {products.map(
                  (
                    product
                  ) => (
                    <tr
                      key={
                        product.id
                      }
                    >

                      <td>

                        {product.image ? (
                          <img
                            src={
                              product.image
                            }
                            alt={
                              product.name
                            }
                            className="product-thumbnail"
                          />
                        ) : (
                          <span>
                            Sin imagen
                          </span>
                        )}

                      </td>


                      <td>
                        {
                          product.name
                        }
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
                        ).toFixed(
                          2
                        )}
                      </td>


                      <td>
                        {product.is_active
                          ? "Activo"
                          : "Inactivo"}
                      </td>


                      {user?.role ===
                        "ADMIN" && (
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
                              disabled={
                                updatingId ===
                                product.id
                              }
                              onClick={() =>
                                handleToggleActive(
                                  product
                                )
                              }
                            >
                              {updatingId ===
                              product.id
                                ? "Actualizando..."
                                : product.is_active
                                  ? "Desactivar"
                                  : "Activar"}
                            </button>


                            <button
                              type="button"
                              className="link-button danger-link"
                              disabled={
                                updatingId ===
                                product.id
                              }
                              onClick={() =>
                                handleDeleteClick(
                                  product
                                )
                              }
                            >
                              Eliminar
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


      {/* ==========================
          DELETE MODAL
      ========================== */}

      {productToDelete && (
        <div
          className="modal-overlay"
          role="presentation"
        >

          <div
            className="modal-container"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-product-title"
          >

            <h2
              id="delete-product-title"
            >
              Eliminar producto
            </h2>


            <p>
              ¿Estás seguro de que
              deseas eliminar{" "}
              <strong>
                {
                  productToDelete.name
                }
              </strong>
              ?
            </p>


            <p>
              Esta acción solo será
              posible si el producto
              nunca ha sido utilizado
              en una compra.
            </p>


            <div className="modal-actions">

              <button
                type="button"
                className="secondary-action"
                onClick={
                  handleCloseDeleteModal
                }
                disabled={
                  deleting
                }
              >
                Cancelar
              </button>


              <button
                type="button"
                className="danger-action"
                onClick={
                  handleConfirmDelete
                }
                disabled={
                  deleting
                }
              >
                {deleting
                  ? "Eliminando..."
                  : "Eliminar producto"}
              </button>

            </div>

          </div>

        </div>
      )}

    </main>
  );
}


export default Products;