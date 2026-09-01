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
  Gift,
  Minus,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
} from "lucide-react";

import {
  useNotification,
} from "../context/useNotification";

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

import {
  getPointsSettings,
} from "../services/settingsService";


const PRODUCT_CATEGORY_LABELS = {
  ICE_CREAM: "Helados",
  DRINK: "Bebidas",
  TOPPING: "Complementos",
  OTHER: "Otros",
};


const formatCurrency = (value) =>
  Number(value ?? 0).toLocaleString(
    "es-MX",
    {
      style: "currency",
      currency: "MXN",
    }
  );


function PurchaseCreate() {
  const navigate = useNavigate();

  const searchContainerRef =
    useRef(null);

  const {
    showSuccess,
    showError,
  } = useNotification();

  /* ==========================
     PRODUCTS
  ========================== */

  const [
    products,
    setProducts,
  ] = useState([]);

  const [
    productSearch,
    setProductSearch,
  ] = useState("");

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("ALL");


  /* ==========================
     CUSTOMER
  ========================== */

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


  /* ==========================
     REWARDS
  ========================== */

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

  const [
    loadingRewards,
    setLoadingRewards,
  ] = useState(false);


  /* ==========================
     CART
  ========================== */

  const [
    items,
    setItems,
  ] = useState([]);


  /* ==========================
     GENERAL STATE
  ========================== */

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    pointsSettings,
    setPointsSettings,
  ] = useState(null);


  /* ==========================
     LOAD PRODUCTS
  ========================== */

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


  /* ==========================
     LOAD POINTS SETTINGS
  ========================== */

  useEffect(() => {
    let cancelled = false;

    getPointsSettings()
      .then((data) => {
        if (cancelled) {
          return;
        }

        setPointsSettings(
          data
        );
      })
      .catch(() => {
        if (!cancelled) {
          setError(
            "No fue posible cargar la configuración del programa de puntos."
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);


  /* ==========================
     CUSTOMER SEARCH
  ========================== */

  useEffect(() => {
    const query =
      customerSearch.trim();


    if (selectedCustomer) {
      return;
    }


    if (!query) {
      return;
    }


    let cancelled = false;


    const timeoutId =
      setTimeout(() => {
        searchCustomers(
          query,
          5
        )
          .then((data) => {
            if (cancelled) {
              return;
            }

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
      }, 300);


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


  /* ==========================
     CLOSE CUSTOMER RESULTS
  ========================== */

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


  /* ==========================
     AVAILABLE REWARDS
  ========================== */

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


  /* ==========================
     CUSTOMER HANDLERS
  ========================== */

  const handleCustomerSearchChange = (
    event
  ) => {
    const value =
      event.target.value;


    setCustomerSearch(
      value
    );

    setError("");


    if (selectedCustomer) {
      setSelectedCustomer(
        null
      );

      setAvailableRewards(
        []
      );

      setUseReward(false);

      setSelectedReward("");

      setLoadingRewards(
        false
      );
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

    setAvailableRewards(
      []
    );

    setUseReward(false);

    setSelectedReward("");

    setLoadingRewards(
      true
    );

    setError("");
  };


  const handleClearCustomer = () => {
    setSelectedCustomer(
      null
    );

    setCustomerSearch("");

    setCustomerSuggestions(
      []
    );

    setShowSuggestions(
      false
    );

    setAvailableRewards(
      []
    );

    setUseReward(false);

    setSelectedReward("");

    setLoadingRewards(
      false
    );

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


  /* ==========================
     PRODUCT FILTERS
  ========================== */

  const productCategories =
    useMemo(() => {
      const categories =
        new Set(
          products
            .map(
              (product) =>
                product.category
            )
            .filter(Boolean)
        );


      return Array.from(
        categories
      );
    }, [products]);


  const filteredProducts =
    useMemo(() => {
      const query =
        productSearch
          .trim()
          .toLowerCase();


      return products.filter(
        (product) => {
          const matchesCategory =
            selectedCategory ===
              "ALL" ||
            product.category ===
              selectedCategory;


          const searchableText =
            `${product.name ?? ""} ${product.description ?? ""}`
              .toLowerCase();


          const matchesSearch =
            !query ||
            searchableText.includes(
              query
            );


          return (
            matchesCategory &&
            matchesSearch
          );
        }
      );
    }, [
      products,
      productSearch,
      selectedCategory,
    ]);


  /* ==========================
     CART HANDLERS
  ========================== */

  const handleAddProduct = (
    product
  ) => {
    setItems(
      (currentItems) => {
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
      }
    );
  };


  const handleIncrementQuantity = (
    productId
  ) => {
    setItems(
      (currentItems) =>
        currentItems.map(
          (item) =>
            item.product.id ===
            productId
              ? {
                  ...item,

                  quantity:
                    Number(
                      item.quantity ||
                        0
                    ) + 1,
                }
              : item
        )
    );
  };


  const handleDecrementQuantity = (
    productId
  ) => {
    setItems(
      (currentItems) =>
        currentItems.map(
          (item) =>
            item.product.id ===
            productId
              ? {
                  ...item,

                  quantity:
                    Math.max(
                      1,
                      Number(
                        item.quantity ||
                          1
                      ) - 1
                    ),
                }
              : item
        )
    );
  };


  const handleQuantityChange = (
    productId,
    value
  ) => {
    setItems(
      (currentItems) =>
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
    setItems(
      (currentItems) =>
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
    setItems(
      (currentItems) =>
        currentItems.filter(
          (item) =>
            item.product.id !==
            productId
        )
    );
  };


  const getProductQuantity = (
    productId
  ) => {
    const item =
      items.find(
        (currentItem) =>
          currentItem.product.id ===
          productId
      );


    return Number(
      item?.quantity ?? 0
    );
  };


  /* ==========================
     CALCULATIONS
  ========================== */

  const total =
    useMemo(() => {
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


  const totalItems =
    useMemo(() => {
      return items.reduce(
        (
          accumulator,
          item
        ) =>
          accumulator +
          Number(
            item.quantity || 0
          ),
        0
      );
    }, [items]);


  const selectedRewardData =
    availableRewards.find(
      (reward) =>
        String(
          reward.id
        ) ===
        String(
          selectedReward
        )
    );


  const amountRequired =
    Number(
      pointsSettings
        ?.amount_required ?? 0
    );

  const pointsAwarded =
    Number(
      pointsSettings
        ?.points_awarded ?? 0
    );

  const estimatedPoints =
    useReward ||
    amountRequired <= 0 ||
    pointsAwarded <= 0
      ? 0
      : Math.floor(
          total /
            amountRequired
        ) *
        pointsAwarded;


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


  /* ==========================
     REWARD HANDLER
  ========================== */

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


  /* ==========================
     SUBMIT
  ========================== */

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
      setSubmitting(
        true
      );


      const payload = {
        customer:
          Number(
            selectedCustomer.id
          ),

        items:
          items.map(
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

      showSuccess(
        `Compra #${purchase.id} registrada correctamente.`
      );

      navigate(
        `/purchases/${purchase.id}`,
        {
          replace: true,
        }
      );
    } catch (
      requestError
    ) {
      const responseData =
        requestError
          .response?.data;


      if (
        responseData?.detail
      ) {
        showError(
          responseData.detail
        );

        return;
      }


      if (
        responseData?.items
      ) {
        showError(
          "Revisa los productos de la compra."
        );

        return;
      }


      if (
        responseData?.customer
      ) {
        showError(
          "El cliente seleccionado no es válido."
        );

        return;
      }


      if (
        responseData?.reward
      ) {
        showError(
          "La recompensa seleccionada no es válida."
        );

        return;
      }

      showError(
        "No fue posible registrar la compra."
      );
    } finally {
      setSubmitting(
        false
      );
    }
  };


  /* ==========================
     LOADING
  ========================== */

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
          Registra los productos comprados
          por el cliente.
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
        onSubmit={
          handleSubmit
        }
      >

        {/* ==========================
            CUSTOMER
        ========================== */}

        <section className="dashboard-section">

          <div className="purchase-section-title">

            <span className="purchase-step-label">
              Paso 1
            </span>


            <h2>
              Cliente
            </h2>


            <p>
              Busca al cliente que realizará
              la compra.
            </p>

          </div>


          <div
            className="customer-autocomplete"
            ref={
              searchContainerRef
            }
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
                      (
                        customer
                      ) => (
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


        {/* ==========================
            REWARD
        ========================== */}

        <section className="dashboard-section">

          <div className="purchase-section-title">

            <span className="purchase-optional-label">
              Opcional
            </span>


            <h2>
              Recompensa
            </h2>


            <p>
              Aplica una recompensa si el
              cliente tiene una disponible.
            </p>

          </div>


          {!selectedCustomer ? (

            <p>
              Selecciona primero un cliente
              para consultar sus recompensas.
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
                  Este cliente no tiene
                  recompensas disponibles con
                  sus puntos actuales.
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
                      onChange={(
                        event
                      ) =>
                        setSelectedReward(
                          event.target
                            .value
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
                        (
                          reward
                        ) => (
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


        {/* ==========================
            SALE WORKSPACE
        ========================== */}

        <div className="purchase-workspace">

          {/* ==========================
              PRODUCTS
          ========================== */}

          <section className="dashboard-section purchase-products-panel">

            <div className="purchase-section-header">

              <div>

                <span className="purchase-step-label">
                  Paso 2
                </span>


                <h2>
                  Productos
                </h2>


                <p>
                  Busca y agrega productos
                  a la compra.
                </p>

              </div>


              <div className="purchase-cart-counter">

                <ShoppingCart
                  size={18}
                />

                <span>
                  {totalItems} artículo
                  {totalItems === 1
                    ? ""
                    : "s"}
                </span>

              </div>

            </div>


            <div className="purchase-product-filters">

              <div className="purchase-product-search">

                <Search
                  size={18}
                />


                <input
                  type="search"
                  value={
                    productSearch
                  }
                  onChange={(
                    event
                  ) =>
                    setProductSearch(
                      event.target.value
                    )
                  }
                  placeholder="Buscar producto..."
                  aria-label="Buscar producto"
                />

              </div>


              <select
                value={
                  selectedCategory
                }
                onChange={(
                  event
                ) =>
                  setSelectedCategory(
                    event.target.value
                  )
                }
                aria-label="Filtrar productos por categoría"
              >

                <option value="ALL">
                  Todas las categorías
                </option>


                {productCategories.map(
                  (
                    category
                  ) => (
                    <option
                      key={
                        category
                      }
                      value={
                        category
                      }
                    >
                      {
                        PRODUCT_CATEGORY_LABELS[
                          category
                        ] ??
                        category
                      }
                    </option>
                  )
                )}

              </select>

            </div>


            <div className="purchase-products-toolbar">

              <p className="purchase-product-results-count">
                {filteredProducts.length}{" "}
                producto
                {filteredProducts.length ===
                1
                  ? ""
                  : "s"}{" "}
                encontrado
                {filteredProducts.length ===
                1
                  ? ""
                  : "s"}
              </p>


              {(productSearch ||
                selectedCategory !==
                  "ALL") && (
                <button
                  type="button"
                  className="purchase-clear-filters"
                  onClick={() => {
                    setProductSearch("");

                    setSelectedCategory(
                      "ALL"
                    );
                  }}
                >
                  Limpiar filtros
                </button>
              )}

            </div>


            {products.length ===
            0 ? (

              <div className="purchase-products-empty">

                <p>
                  No hay productos activos
                  disponibles.
                </p>

              </div>

            ) : filteredProducts.length ===
              0 ? (

              <div className="purchase-products-empty">

                <Search
                  size={28}
                />


                <strong>
                  No encontramos productos
                </strong>


                <p>
                  Prueba con otro nombre
                  o categoría.
                </p>


                <button
                  type="button"
                  className="secondary-action"
                  onClick={() => {
                    setProductSearch("");

                    setSelectedCategory(
                      "ALL"
                    );
                  }}
                >
                  Limpiar filtros
                </button>

              </div>

            ) : (

              <div className="product-selection-grid purchase-product-grid">

                {filteredProducts.map(
                  (
                    product
                  ) => {
                    const quantityInCart =
                      getProductQuantity(
                        product.id
                      );


                    return (
                      <article
                        key={
                          product.id
                        }
                        className={
                          `product-selection-card ${
                            quantityInCart >
                            0
                              ? "product-selection-card-added"
                              : ""
                          }`
                        }
                      >

                        {product.image ? (
                          <img
                            src={
                              product.image
                            }
                            alt={
                              product.name
                            }
                          />
                        ) : (
                          <div className="purchase-product-image-placeholder">
                            Sin imagen
                          </div>
                        )}


                        <div className="purchase-product-card-content">

                          <span className="purchase-product-category">
                            {
                              PRODUCT_CATEGORY_LABELS[
                                product.category
                              ] ??
                              product.category
                            }
                          </span>


                          <h3>
                            {
                              product.name
                            }
                          </h3>


                          <p className="purchase-product-price">
                            {formatCurrency(
                              product.price
                            )}
                          </p>


                          {quantityInCart >
                            0 && (
                            <span className="purchase-product-added-label">
                              {
                                quantityInCart
                              }{" "}
                              agregado
                              {quantityInCart ===
                              1
                                ? ""
                                : "s"}
                            </span>
                          )}

                        </div>


                        <button
                          type="button"
                          className="purchase-add-product-button"
                          onClick={() =>
                            handleAddProduct(
                              product
                            )
                          }
                        >
                          <Plus
                            size={17}
                          />

                          Agregar
                        </button>

                      </article>
                    );
                  }
                )}

              </div>

            )}

          </section>


          {/* ==========================
              PURCHASE SUMMARY
          ========================== */}

          <aside className="purchase-summary-column">

            <section className="dashboard-section purchase-summary-panel">

              <div className="purchase-section-header">

                <div>

                  <span className="purchase-step-label">
                    Paso 3
                  </span>


                  <h2>
                    Resumen
                  </h2>


                  <p>
                    Revisa la compra antes
                    de registrarla.
                  </p>

                </div>

              </div>


              {items.length ===
              0 ? (

                <div className="purchase-cart-empty">

                  <ShoppingCart
                    size={32}
                  />


                  <strong>
                    La compra está vacía
                  </strong>


                  <p>
                    Agrega productos desde
                    el catálogo.
                  </p>

                </div>

              ) : (

                <div className="purchase-summary-items">

                  {items.map(
                    (
                      item
                    ) => (
                      <article
                        key={
                          item.product.id
                        }
                        className="purchase-summary-item"
                      >

                        <div className="purchase-summary-item-header">

                          <div>

                            <strong>
                              {
                                item.product.name
                              }
                            </strong>


                            <span>
                              {formatCurrency(
                                item.product.price
                              )}{" "}
                              c/u
                            </span>

                          </div>


                          <button
                            type="button"
                            className="purchase-remove-item-icon"
                            onClick={() =>
                              handleRemoveItem(
                                item.product.id
                              )
                            }
                            aria-label={`Quitar ${item.product.name}`}
                          >
                            <Trash2
                              size={17}
                            />
                          </button>

                        </div>


                        <div className="purchase-summary-item-footer">

                          <div className="purchase-quantity-control">

                            <button
                              type="button"
                              onClick={() =>
                                handleDecrementQuantity(
                                  item.product.id
                                )
                              }
                              disabled={
                                Number(
                                  item.quantity
                                ) <= 1
                              }
                              aria-label={`Reducir cantidad de ${item.product.name}`}
                            >
                              <Minus
                                size={15}
                              />
                            </button>


                            <input
                              type="number"
                              min="1"
                              step="1"
                              value={
                                item.quantity
                              }
                              onChange={(
                                event
                              ) =>
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
                              aria-label={`Cantidad de ${item.product.name}`}
                            />


                            <button
                              type="button"
                              onClick={() =>
                                handleIncrementQuantity(
                                  item.product.id
                                )
                              }
                              aria-label={`Aumentar cantidad de ${item.product.name}`}
                            >
                              <Plus
                                size={15}
                              />
                            </button>

                          </div>


                          <strong className="purchase-summary-item-subtotal">
                            {formatCurrency(
                              Number(
                                item.product.price
                              ) *
                                Number(
                                  item.quantity ||
                                    0
                                )
                            )}
                          </strong>

                        </div>

                      </article>
                    )
                  )}

                </div>

              )}


              <div className="purchase-summary-totals">

                <div>

                  <span>
                    Artículos
                  </span>

                  <strong>
                    {
                      totalItems
                    }
                  </strong>

                </div>


                <div>

                  <span>
                    Productos distintos
                  </span>

                  <strong>
                    {
                      items.length
                    }
                  </strong>

                </div>


                <div>

                  <span>
                    Puntos a generar
                  </span>

                  <strong>
                    {
                      estimatedPoints
                    }
                  </strong>

                </div>


                {useReward &&
                  selectedRewardData && (
                    <div>

                      <span>
                        Puntos utilizados
                      </span>

                      <strong>
                        -
                        {
                          rewardPointsUsed
                        }
                      </strong>

                    </div>
                  )}

              </div>


              {useReward &&
                selectedRewardData && (
                  <div className="purchase-reward-notice">

                    <Gift
                      size={18}
                    />


                    <div>

                      <strong>
                        Recompensa aplicada
                      </strong>


                      <span>
                        Esta compra no generará
                        puntos.
                      </span>

                    </div>

                  </div>
                )}


              <div className="purchase-grand-total-card">

                <span>
                  Total a cobrar
                </span>


                <strong>
                  {formatCurrency(
                    total
                  )}
                </strong>

              </div>


              <div className="purchase-summary-actions">

                <Link
                  to="/purchases"
                  className="secondary-action"
                >
                  Cancelar
                </Link>


                <button
                  type="submit"
                  className="primary-action"
                  disabled={
                    submitting ||
                    !selectedCustomer ||
                    items.length === 0
                  }
                >
                  {submitting
                    ? "Registrando..."
                    : "Registrar compra"}
                </button>

              </div>

            </section>

          </aside>

        </div>

      </form>

    </main>
  );
}


export default PurchaseCreate;