import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  searchCustomers,
} from "../services/customerService";

import {
  getProducts,
} from "../services/productService";

import {
  createPurchase,
} from "../services/purchaseService";

import {
  getAvailableRewards,
} from "../services/rewardService";


function PurchaseCreate() {
  const navigate = useNavigate();

  const searchContainerRef =
    useRef(null);


  const [products, setProducts] =
    useState([]);

  const [
    customerSearch,
    setCustomerSearch,
  ] = useState("");

  const [
    customerSuggestions,
    setCustomerSuggestions,
  ] = useState([]);

  const [
    selectedCustomer,
    setSelectedCustomer,
  ] = useState(null);

  const [
    showSuggestions,
    setShowSuggestions,
  ] = useState(false);

  const [
    searchingCustomer,
    setSearchingCustomer,
  ] = useState(false);

  const [
    availableRewards,
    setAvailableRewards,
  ] = useState([]);

  const [
    useReward,
    setUseReward,
  ] = useState(false);

  const [
    selectedReward,
    setSelectedReward,
  ] = useState("");

  const [items, setItems] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [
    loadingRewards,
    setLoadingRewards,
  ] = useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");


  /*
   * Carga inicial de productos.
   */
  useEffect(() => {
    let cancelled = false;

    getProducts()
      .then((productData) => {
        if (cancelled) {
          return;
        }

        setProducts(
          productData.filter(
            (product) =>
              product.is_active
          )
        );
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


  /*
   * Búsqueda dinámica de clientes.
   *
   * Esperamos 300 ms después
   * de que el usuario deje de escribir.
   */
  useEffect(() => {
    const query =
      customerSearch.trim();

    /*
     * Si ya seleccionamos cliente,
     * no necesitamos seguir buscando.
     */
    if (selectedCustomer) {
      return;
    }

    /*
     * No mostramos todo el catálogo
     * cuando el campo está vacío.
     */
    if (!query) {
      return;
    }

    let cancelled = false;


    const timeoutId = setTimeout(
      () => {
        searchCustomers(query,5)
          .then((data) => {
            if (cancelled) {
              return;
            }

            /*
             * Máximo 5 resultados.
             */
            setCustomerSuggestions(
              data
            );

            setShowSuggestions(
              true
            );
          })
          .catch(() => {
            if (!cancelled) {
              setCustomerSuggestions(
                []
              );

              setError(
                "No fue posible buscar clientes."
              );
            }
          })
          .finally(() => {
            if (!cancelled) {
              setSearchingCustomer(
                false
              );
            }
          });
      },
      300
    );


    return () => {
      cancelled = true;

      clearTimeout(
        timeoutId
      );
    };
  }, [
    customerSearch,
    selectedCustomer,
  ]);


  /*
   * Cerrar las sugerencias cuando
   * se hace clic fuera del buscador.
   */
  useEffect(() => {
    const handleClickOutside = (
      event
    ) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(
          event.target
        )
      ) {
        setShowSuggestions(
          false
        );
      }
    };


    document.addEventListener(
      "mousedown",
      handleClickOutside
    );


    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);


  /*
   * Consulta las recompensas
   * disponibles del cliente.
   */
  useEffect(() => {
    if (!selectedCustomer) {
      return;
    }

    let cancelled = false;


    getAvailableRewards(
      selectedCustomer.id
    )
      .then((data) => {
        if (cancelled) {
          return;
        }

        setAvailableRewards(
          data.rewards ?? []
        );
      })
      .catch(() => {
        if (!cancelled) {
          setAvailableRewards(
            []
          );

          setError(
            "No fue posible consultar las recompensas disponibles."
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingRewards(
            false
          );
        }
      });


    return () => {
      cancelled = true;
    };
  }, [selectedCustomer]);


  const handleCustomerSearchChange = (
    event
  ) => {
    const value =
      event.target.value;


    setCustomerSearch(
      value
    );

    setError("");


    /*
     * Si había un cliente seleccionado
     * y el empleado modifica la barra,
     * eliminamos la selección anterior.
     */
    if (selectedCustomer) {
      setSelectedCustomer(
        null
      );

      setAvailableRewards([]);

      setUseReward(false);

      setSelectedReward("");

      setLoadingRewards(false);
    }


    if (!value.trim()) {
      setCustomerSuggestions(
        []
      );

      setShowSuggestions(
        false
      );

      setSearchingCustomer(
        false
      );

      return;
    }


    setSearchingCustomer(
      true
    );

    setShowSuggestions(
      true
    );
  };


  const handleSelectCustomer = (
    customer
  ) => {
    setSelectedCustomer(
      customer
    );

    setCustomerSearch(
      `${customer.customer_code} - ${customer.first_name} ${customer.last_name}`
    );

    setCustomerSuggestions(
      []
    );

    setShowSuggestions(
      false
    );

    setSearchingCustomer(
      false
    );

    setAvailableRewards([]);

    setUseReward(false);

    setSelectedReward("");

    setLoadingRewards(true);

    setError("");
  };


  const handleClearCustomer = () => {
    setSelectedCustomer(
      null
    );

    setCustomerSearch("");

    setCustomerSuggestions([]);

    setShowSuggestions(false);

    setAvailableRewards([]);

    setUseReward(false);

    setSelectedReward("");

    setLoadingRewards(false);

    setError("");
  };


  const handleSearchFocus = () => {
    if (
      !selectedCustomer &&
      customerSearch.trim() &&
      customerSuggestions.length > 0
    ) {
      setShowSuggestions(
        true
      );
    }
  };


  const handleAddProduct = (
    product
  ) => {
    setItems((currentItems) => {
      const existingItem =
        currentItems.find(
          (item) =>
            item.product.id ===
            product.id
        );


      if (existingItem) {
        return currentItems.map(
          (item) =>
            item.product.id ===
            product.id
              ? {
                  ...item,

                  quantity:
                    Number(
                      item.quantity ||
                        0
                    ) + 1,
                }
              : item
        );
      }


      return [
        ...currentItems,

        {
          product,
          quantity: 1,
        },
      ];
    });
  };


  const handleQuantityChange = (
    productId,
    value
  ) => {
    setItems((currentItems) =>
      currentItems.map(
        (item) =>
          item.product.id ===
          productId
            ? {
                ...item,

                quantity:
                  value === ""
                    ? ""
                    : Number(
                        value
                      ),
              }
            : item
      )
    );
  };


  const handleQuantityBlur = (
    productId
  ) => {
    setItems((currentItems) =>
      currentItems.map(
        (item) =>
          item.product.id ===
          productId
            ? {
                ...item,

                quantity:
                  !item.quantity ||
                  Number(
                    item.quantity
                  ) < 1
                    ? 1
                    : Number(
                        item.quantity
                      ),
              }
            : item
      )
    );
  };


  const handleRemoveItem = (
    productId
  ) => {
    setItems((currentItems) =>
      currentItems.filter(
        (item) =>
          item.product.id !==
          productId
      )
    );
  };


  const total = useMemo(() => {
    return items.reduce(
      (
        accumulator,
        item
      ) =>
        accumulator +
        Number(
          item.product.price
        ) *
          Number(
            item.quantity || 0
          ),
      0
    );
  }, [items]);


  const selectedRewardData =
    availableRewards.find(
      (reward) =>
        String(reward.id) ===
        String(selectedReward)
    );


  const estimatedPoints =
    useReward
      ? 0
      : Math.floor(
          total / 50
        );


  const currentPoints =
    Number(
      selectedCustomer?.points ??
        0
    );


  const rewardPointsUsed =
    Number(
      selectedRewardData
        ?.points_required ?? 0
    );


  const remainingPoints =
    useReward &&
    selectedRewardData
      ? currentPoints -
        rewardPointsUsed
      : currentPoints;


  const handleRewardToggle = (
    event
  ) => {
    const checked =
      event.target.checked;


    setUseReward(
      checked
    );


    if (!checked) {
      setSelectedReward("");
    }
  };


  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");


    if (!selectedCustomer) {
      setError(
        "Selecciona un cliente."
      );

      return;
    }


    if (items.length === 0) {
      setError(
        "Agrega al menos un producto."
      );

      return;
    }


    const invalidQuantity =
      items.some(
        (item) =>
          !item.quantity ||
          Number(
            item.quantity
          ) < 1
      );


    if (invalidQuantity) {
      setError(
        "Todas las cantidades deben ser mayores a cero."
      );

      return;
    }


    if (
      useReward &&
      !selectedReward
    ) {
      setError(
        "Selecciona una recompensa."
      );

      return;
    }


    try {
      setSubmitting(true);


      const payload = {
        customer:
          Number(
            selectedCustomer.id
          ),

        items: items.map(
          (item) => ({
            product:
              item.product.id,

            quantity:
              Number(
                item.quantity
              ),
          })
        ),
      };


      if (
        useReward &&
        selectedReward
      ) {
        payload.reward =
          Number(
            selectedReward
          );
      }


      const purchase =
        await createPurchase(
          payload
        );


      navigate(
        `/purchases/${purchase.id}`,
        {
          replace: true,
        }
      );

    } catch (requestError) {
      const responseData =
        requestError.response?.data;


      if (responseData?.detail) {
        setError(
          responseData.detail
        );

        return;
      }


      if (responseData?.items) {
        setError(
          "Revisa los productos de la compra."
        );

        return;
      }


      if (responseData?.customer) {
        setError(
          "El cliente seleccionado no es válido."
        );

        return;
      }


      if (responseData?.reward) {
        setError(
          "La recompensa seleccionada no es válida."
        );

        return;
      }


      setError(
        "No fue posible registrar la compra."
      );

    } finally {
      setSubmitting(false);
    }
  };


  if (loading) {
    return (
      <main className="purchases-page">

        <p>
          Cargando información...
        </p>

      </main>
    );
  }


  return (
    <main className="purchases-page">

      <header className="page-header">

        <Link
          to="/purchases"
          className="back-link"
        >
          ← Volver a compras
        </Link>

        <h1>
          Nueva compra
        </h1>

        <p>
          Registra los productos comprados por el cliente.
        </p>

      </header>


      {error && (
        <p
          role="alert"
          className="form-error"
        >
          {error}
        </p>
      )}


      <form
        onSubmit={handleSubmit}
      >

        <section className="dashboard-section">

          <h2>
            Cliente
          </h2>


          <div
            className="customer-autocomplete"
            ref={searchContainerRef}
          >

            <label
              htmlFor="customer-search"
              className="customer-search-label"
            >
              Buscar cliente
            </label>


            <div className="customer-autocomplete-input-wrapper">

              <input
                id="customer-search"
                type="text"
                autoComplete="off"
                placeholder="Nombre, correo, teléfono o código"
                value={
                  customerSearch
                }
                onChange={
                  handleCustomerSearchChange
                }
                onFocus={
                  handleSearchFocus
                }
              />


              {selectedCustomer && (
                <button
                  type="button"
                  className="customer-clear-button"
                  onClick={
                    handleClearCustomer
                  }
                  aria-label="Cambiar cliente"
                >
                  ×
                </button>
              )}

            </div>


            {showSuggestions &&
              !selectedCustomer && (
                <div className="customer-autocomplete-results">

                  {searchingCustomer ? (

                    <div className="customer-autocomplete-message">
                      Buscando clientes...
                    </div>

                  ) : customerSuggestions.length ===
                    0 ? (

                    <div className="customer-autocomplete-message">
                      No se encontraron clientes.
                    </div>

                  ) : (

                    customerSuggestions.map(
                      (customer) => (
                        <button
                          key={
                            customer.id
                          }
                          type="button"
                          className="customer-autocomplete-option"
                          onClick={() =>
                            handleSelectCustomer(
                              customer
                            )
                          }
                        >

                          <span className="customer-autocomplete-main">

                            <strong>
                              {
                                customer.customer_code
                              }
                            </strong>

                            <span>
                              {
                                customer.first_name
                              }{" "}
                              {
                                customer.last_name
                              }
                            </span>

                          </span>


                          <span className="customer-autocomplete-secondary">

                            <span>
                              {
                                customer.email
                              }
                            </span>

                            <span>
                              {
                                customer.points
                              }{" "}
                              puntos
                            </span>

                          </span>

                        </button>
                      )
                    )

                  )}

                </div>
              )}

          </div>


          {selectedCustomer && (

            <div className="purchase-customer-summary">

              <p>
                <strong>
                  Cliente:
                </strong>{" "}
                {
                  selectedCustomer.first_name
                }{" "}
                {
                  selectedCustomer.last_name
                }
              </p>


              <p>
                <strong>
                  Código:
                </strong>{" "}
                {
                  selectedCustomer.customer_code
                }
              </p>


              <p>
                <strong>
                  Puntos actuales:
                </strong>{" "}
                {
                  currentPoints
                }
              </p>


              <button
                type="button"
                className="secondary-action"
                onClick={
                  handleClearCustomer
                }
              >
                Cambiar cliente
              </button>

            </div>

          )}

        </section>


        <section className="dashboard-section">

          <h2>
            Recompensa
          </h2>


          {!selectedCustomer ? (

            <p>
              Selecciona primero un cliente para consultar sus recompensas.
            </p>

          ) : loadingRewards ? (

            <p>
              Consultando recompensas...
            </p>

          ) : (

            <>

              <div className="checkbox-group">

                <input
                  id="use_reward"
                  type="checkbox"
                  checked={
                    useReward
                  }
                  onChange={
                    handleRewardToggle
                  }
                  disabled={
                    availableRewards.length ===
                    0
                  }
                />

                <label htmlFor="use_reward">
                  Usar recompensa
                </label>

              </div>


              {availableRewards.length ===
              0 ? (

                <p>
                  Este cliente no tiene recompensas disponibles con sus puntos actuales.
                </p>

              ) : (

                <p>
                  Hay{" "}
                  {
                    availableRewards.length
                  }{" "}
                  recompensa(s) disponible(s).
                </p>

              )}


              {useReward && (

                <div className="reward-selection">

                  <div className="form-group">

                    <label htmlFor="reward">
                      Recompensa
                    </label>


                    <select
                      id="reward"
                      value={
                        selectedReward
                      }
                      onChange={(event) =>
                        setSelectedReward(
                          event.target.value
                        )
                      }
                      required={
                        useReward
                      }
                    >

                      <option value="">
                        Selecciona una recompensa
                      </option>


                      {availableRewards.map(
                        (reward) => (
                          <option
                            key={
                              reward.id
                            }
                            value={
                              reward.id
                            }
                          >
                            {
                              reward.name
                            }
                            {" — "}
                            {
                              reward.points_required
                            }
                            {" puntos"}
                          </option>
                        )
                      )}

                    </select>

                  </div>


                  {selectedRewardData && (

                    <div className="reward-points-summary">

                      <p>
                        <strong>
                          Puntos actuales:
                        </strong>{" "}
                        {
                          currentPoints
                        }
                      </p>

                      <p>
                        <strong>
                          Puntos a utilizar:
                        </strong>{" "}
                        -
                        {
                          rewardPointsUsed
                        }
                      </p>

                      <p>
                        <strong>
                          Puntos restantes:
                        </strong>{" "}
                        {
                          remainingPoints
                        }
                      </p>

                    </div>

                  )}

                </div>

              )}

            </>

          )}

        </section>


        <section className="dashboard-section">

          <h2>
            Productos
          </h2>


          {products.length === 0 ? (

            <p>
              No hay productos activos disponibles.
            </p>

          ) : (

            <div className="product-selection-grid">

              {products.map(
                (product) => (
                  <article
                    key={
                      product.id
                    }
                    className="product-selection-card"
                  >

                    {product.image && (
                      <img
                        src={
                          product.image
                        }
                        alt={
                          product.name
                        }
                      />
                    )}


                    <h3>
                      {
                        product.name
                      }
                    </h3>


                    <p>
                      $
                      {Number(
                        product.price
                      ).toFixed(2)}
                    </p>


                    <button
                      type="button"
                      onClick={() =>
                        handleAddProduct(
                          product
                        )
                      }
                    >
                      Agregar
                    </button>

                  </article>
                )
              )}

            </div>

          )}

        </section>


        <section className="dashboard-section">

          <h2>
            Resumen de compra
          </h2>


          {items.length === 0 ? (

            <p>
              No has agregado productos.
            </p>

          ) : (

            <div className="table-container">

              <table>

                <thead>

                  <tr>
                    <th>
                      Producto
                    </th>

                    <th>
                      Precio
                    </th>

                    <th>
                      Cantidad
                    </th>

                    <th>
                      Subtotal
                    </th>

                    <th>
                      Acción
                    </th>
                  </tr>

                </thead>


                <tbody>

                  {items.map(
                    (item) => (
                      <tr
                        key={
                          item.product.id
                        }
                      >

                        <td>
                          {
                            item.product.name
                          }
                        </td>


                        <td>
                          $
                          {Number(
                            item.product.price
                          ).toFixed(2)}
                        </td>


                        <td>

                          <input
                            type="number"
                            min="1"
                            step="1"
                            value={
                              item.quantity
                            }
                            onChange={
                              (event) =>
                                handleQuantityChange(
                                  item.product.id,
                                  event.target.value
                                )
                            }
                            onBlur={() =>
                              handleQuantityBlur(
                                item.product.id
                              )
                            }
                          />

                        </td>


                        <td>
                          $
                          {(
                            Number(
                              item.product.price
                            ) *
                            Number(
                              item.quantity ||
                                0
                            )
                          ).toFixed(2)}
                        </td>


                        <td>

                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveItem(
                                item.product.id
                              )
                            }
                          >
                            Quitar
                          </button>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

          )}


          <div className="purchase-total">

            <p>
              <strong>
                Total:
              </strong>{" "}
              ${total.toFixed(2)}
            </p>


            <p>
              <strong>
                Puntos generados:
              </strong>{" "}
              {
                estimatedPoints
              }
            </p>


            {useReward &&
              selectedRewardData && (

                <p>
                  Esta compra utiliza una recompensa y no generará puntos.
                </p>

              )}

          </div>


          <div className="form-actions">

            <Link
              to="/purchases"
              className="secondary-action"
            >
              Cancelar
            </Link>


            <button
              type="submit"
              disabled={
                submitting
              }
            >
              {submitting
                ? "Registrando..."
                : "Registrar compra"}
            </button>

          </div>

        </section>

      </form>

    </main>
  );
}


export default PurchaseCreate;