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
  useNotification,
} from "../context/useNotification";

import {
  getProducts,
} from "../services/productService";

import {
  createReward,
  getRewardById,
  updateReward,
} from "../services/rewardService";


const REWARD_TYPES = {
  FREE_PRODUCT: "FREE_PRODUCT",
  PERCENTAGE_DISCOUNT:
    "PERCENTAGE_DISCOUNT",
  FIXED_DISCOUNT:
    "FIXED_DISCOUNT",
};


function RewardForm() {
  const {
    id,
  } = useParams();

  const navigate =
    useNavigate();

  const {
    showSuccess,
    showError,
  } = useNotification();

  const isEditing =
    Boolean(id);


  /* ==========================
     FORM
  ========================== */

  const [
    form,
    setForm,
  ] = useState({
    name: "",
    description: "",
    points_required: "",
    reward_type:
      REWARD_TYPES.FREE_PRODUCT,
    discount_value: "",
    product: "",
    free_product_name: "",
    is_active: true,
  });


  /* ==========================
     PRODUCTS
  ========================== */

  const [
    products,
    setProducts,
  ] = useState([]);

  const [
    loadingProducts,
    setLoadingProducts,
  ] = useState(true);


  /* ==========================
     GENERAL STATE
  ========================== */

  const [
    loadingReward,
    setLoadingReward,
  ] = useState(
    isEditing
  );

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");


  const loading =
    loadingReward ||
    loadingProducts;


  /* ==========================
     LOAD PRODUCTS
  ========================== */

  useEffect(() => {
    let cancelled = false;


    getProducts()
      .then(
        (productData) => {
          if (cancelled) {
            return;
          }


          setProducts(
            productData.filter(
              (product) =>
                product.is_active
            )
          );
        }
      )
      .catch(() => {
        if (!cancelled) {
          setError(
            "No fue posible cargar los productos."
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingProducts(
            false
          );
        }
      });


    return () => {
      cancelled = true;
    };
  }, []);


  /* ==========================
     LOAD REWARD
  ========================== */

  useEffect(() => {
    if (!isEditing) {
      return;
    }


    let cancelled = false;


    getRewardById(
      id
    )
      .then(
        (reward) => {
          if (cancelled) {
            return;
          }


          setForm({
            name:
              reward.name ??
              "",

            description:
              reward.description ??
              "",

            points_required:
              reward.points_required ??
              "",

            reward_type:
              reward.reward_type ??
              REWARD_TYPES
                .FREE_PRODUCT,

            discount_value:
              reward.discount_value ??
              "",

            product:
              reward.product ??
              "",

            free_product_name:
              reward.free_product_name ??
              "",

            is_active:
              reward.is_active ??
              true,
          });
        }
      )
      .catch(() => {
        if (!cancelled) {
          setError(
            "No fue posible cargar la recompensa."
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingReward(
            false
          );
        }
      });


    return () => {
      cancelled = true;
    };
  }, [
    id,
    isEditing,
  ]);


  /* ==========================
     FORM HANDLER
  ========================== */

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;


    setError("");


    if (
      name ===
      "reward_type"
    ) {
      setForm(
        (
          currentForm
        ) => ({
          ...currentForm,

          reward_type:
            value,

          discount_value:
            "",

          product:
            "",

          free_product_name:
            "",
        })
      );

      return;
    }


    if (
      name ===
      "product"
    ) {
      setForm(
        (
          currentForm
        ) => ({
          ...currentForm,

          product:
            value,

          free_product_name:
            value
              ? ""
              : currentForm
                  .free_product_name,
        })
      );

      return;
    }


    if (
      name ===
      "free_product_name"
    ) {
      setForm(
        (
          currentForm
        ) => ({
          ...currentForm,

          free_product_name:
            value,

          product:
            value.trim()
              ? ""
              : currentForm.product,
        })
      );

      return;
    }


    setForm(
      (
        currentForm
      ) => ({
        ...currentForm,

        [name]:
          type ===
          "checkbox"
            ? checked
            : value,
      })
    );
  };


  /* ==========================
     SUBMIT
  ========================== */

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      setError("");


      if (
        !form.name.trim()
      ) {
        setError(
          "El nombre de la recompensa es obligatorio."
        );

        return;
      }


      const points =
        Number(
          form.points_required
        );


      if (
        !Number.isInteger(
          points
        ) ||
        points <= 0
      ) {
        setError(
          "Los puntos requeridos deben ser un número entero mayor a cero."
        );

        return;
      }


      /* ==========================
         FREE PRODUCT VALIDATION
      ========================== */

      if (
        form.reward_type ===
        REWARD_TYPES
          .FREE_PRODUCT
      ) {
        const hasProduct =
          Boolean(
            form.product
          );

        const hasCustomProduct =
          Boolean(
            form
              .free_product_name
              .trim()
          );


        if (
          !hasProduct &&
          !hasCustomProduct
        ) {
          setError(
            "Selecciona un producto del catálogo o indica el producto que se entregará."
          );

          return;
        }


        if (
          hasProduct &&
          hasCustomProduct
        ) {
          setError(
            "Utiliza un producto del catálogo o escribe un producto independiente, pero no ambos."
          );

          return;
        }
      }


      /* ==========================
         DISCOUNT VALIDATION
      ========================== */

      if (
        form.reward_type ===
          REWARD_TYPES
            .PERCENTAGE_DISCOUNT ||
        form.reward_type ===
          REWARD_TYPES
            .FIXED_DISCOUNT
      ) {
        const discount =
          Number(
            form.discount_value
          );


        if (
          !Number.isFinite(
            discount
          ) ||
          discount <= 0
        ) {
          setError(
            form.reward_type ===
              REWARD_TYPES
                .PERCENTAGE_DISCOUNT
              ? "El porcentaje debe ser mayor a 0."
              : "El descuento debe ser mayor a $0."
          );

          return;
        }


        if (
          form.reward_type ===
            REWARD_TYPES
              .PERCENTAGE_DISCOUNT &&
          discount > 100
        ) {
          setError(
            "El porcentaje no puede superar el 100%."
          );

          return;
        }
      }


      try {
        setSubmitting(
          true
        );


        const data = {
          name:
            form.name.trim(),

          description:
            form.description.trim(),

          points_required:
            points,

          reward_type:
            form.reward_type,

          discount_value:
            null,

          product:
            null,

          free_product_name:
            "",

          is_active:
            form.is_active,
        };


        /* ==========================
           FREE PRODUCT DATA
        ========================== */

        if (
          form.reward_type ===
          REWARD_TYPES
            .FREE_PRODUCT
        ) {
          if (
            form.product
          ) {
            data.product =
              Number(
                form.product
              );
          } else {
            data.free_product_name =
              form
                .free_product_name
                .trim();
          }
        }


        /* ==========================
           DISCOUNT DATA
        ========================== */

        if (
          form.reward_type ===
            REWARD_TYPES
              .PERCENTAGE_DISCOUNT ||
          form.reward_type ===
            REWARD_TYPES
              .FIXED_DISCOUNT
        ) {
          data.discount_value =
            Number(
              form.discount_value
            );
        }


        if (isEditing) {
          await updateReward(
            id,
            data
          );


          showSuccess(
            "Recompensa actualizada correctamente."
          );
        } else {
          await createReward(
            data
          );


          showSuccess(
            "Recompensa creada correctamente."
          );
        }


        navigate(
          "/rewards",
          {
            replace: true,
          }
        );
      } catch (
        requestError
      ) {
        const responseData =
          requestError
            .response
            ?.data;


        const fieldOrder = [
          "name",
          "points_required",
          "reward_type",
          "discount_value",
          "product",
          "free_product_name",
          "non_field_errors",
          "detail",
        ];


        for (
          const field
          of fieldOrder
        ) {
          if (
            responseData?.[
              field
            ]
          ) {
            const fieldError =
              responseData[
                field
              ];


            setError(
              Array.isArray(
                fieldError
              )
                ? fieldError[0]
                : fieldError
            );

            return;
          }
        }


        showError(
          isEditing
            ? "No fue posible actualizar la recompensa."
            : "No fue posible crear la recompensa."
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
      <main className="rewards-page">

        <p>
          Cargando información...
        </p>

      </main>
    );
  }


  return (
    <main className="rewards-page">

      <header className="page-header">

        <Link
          to="/rewards"
          className="back-link"
        >
          ← Volver a recompensas
        </Link>


        <h1>
          {isEditing
            ? "Editar recompensa"
            : "Nueva recompensa"}
        </h1>


        <p>
          {isEditing
            ? "Actualiza la información de la recompensa."
            : "Agrega una nueva recompensa al catálogo."}
        </p>

      </header>


      <section className="dashboard-section">

        <form
          onSubmit={
            handleSubmit
          }
          className="customer-form"
        >

          <div className="form-group">

            <label htmlFor="name">
              Nombre
            </label>


            <input
              id="name"
              name="name"
              type="text"
              value={
                form.name
              }
              onChange={
                handleChange
              }
              required
            />

          </div>


          <div className="form-group">

            <label htmlFor="description">
              Descripción
            </label>


            <textarea
              id="description"
              name="description"
              rows="4"
              value={
                form.description
              }
              onChange={
                handleChange
              }
            />

          </div>


          <div className="form-group">

            <label htmlFor="points_required">
              Puntos requeridos
            </label>


            <input
              id="points_required"
              name="points_required"
              type="number"
              min="1"
              step="1"
              value={
                form.points_required
              }
              onChange={
                handleChange
              }
              required
            />

          </div>


          <div className="form-group">

            <label htmlFor="reward_type">
              Tipo de recompensa
            </label>


            <select
              id="reward_type"
              name="reward_type"
              value={
                form.reward_type
              }
              onChange={
                handleChange
              }
              required
            >

              <option value="FREE_PRODUCT">
                Producto gratis
              </option>

              <option value="PERCENTAGE_DISCOUNT">
                Descuento porcentual
              </option>

              <option value="FIXED_DISCOUNT">
                Descuento fijo
              </option>

            </select>

          </div>


          {form.reward_type ===
            REWARD_TYPES
              .FREE_PRODUCT && (
            <>

              <div className="form-group">

                <label htmlFor="product">
                  Producto del catálogo
                </label>


                <select
                  id="product"
                  name="product"
                  value={
                    form.product
                  }
                  onChange={
                    handleChange
                  }
                  disabled={
                    Boolean(
                      form
                        .free_product_name
                        .trim()
                    )
                  }
                >

                  <option value="">
                    Selecciona un producto
                  </option>


                  {products.map(
                    (
                      product
                    ) => (
                      <option
                        key={
                          product.id
                        }
                        value={
                          product.id
                        }
                      >
                        {
                          product.name
                        }
                      </option>
                    )
                  )}

                </select>


                <small>
                  Selecciona un producto si la
                  recompensa corresponde a un
                  producto existente del catálogo.
                </small>

              </div>


              <div className="form-group">

                <label htmlFor="free_product_name">
                  Producto independiente
                </label>


                <input
                  id="free_product_name"
                  name="free_product_name"
                  type="text"
                  value={
                    form.free_product_name
                  }
                  onChange={
                    handleChange
                  }
                  disabled={
                    Boolean(
                      form.product
                    )
                  }
                  placeholder="Ej. Paleta"
                />


                <small>
                  Utiliza este campo solamente
                  cuando el producto gratuito no
                  exista en el catálogo.
                </small>

              </div>


              <p>
                Debes seleccionar un producto del
                catálogo o indicar un producto
                independiente. No es necesario
                utilizar ambos.
              </p>

            </>
          )}


          {form.reward_type ===
            REWARD_TYPES
              .PERCENTAGE_DISCOUNT && (
            <div className="form-group">

              <label htmlFor="discount_value">
                Porcentaje de descuento
              </label>


              <input
                id="discount_value"
                name="discount_value"
                type="number"
                min="0.01"
                max="100"
                step="0.01"
                value={
                  form.discount_value
                }
                onChange={
                  handleChange
                }
                placeholder="Ej. 10"
                required
              />


              <small>
                Escribe únicamente el porcentaje.
                Por ejemplo, para un descuento del
                10%, escribe 10.
              </small>

            </div>
          )}


          {form.reward_type ===
            REWARD_TYPES
              .FIXED_DISCOUNT && (
            <div className="form-group">

              <label htmlFor="discount_value">
                Monto de descuento
              </label>


              <input
                id="discount_value"
                name="discount_value"
                type="number"
                min="0.01"
                step="0.01"
                value={
                  form.discount_value
                }
                onChange={
                  handleChange
                }
                placeholder="Ej. 50"
                required
              />


              <small>
                Ingresa el monto en pesos que se
                descontará del total de la compra.
              </small>

            </div>
          )}


          <div className="checkbox-group">

            <input
              id="is_active"
              name="is_active"
              type="checkbox"
              checked={
                form.is_active
              }
              onChange={
                handleChange
              }
            />


            <label htmlFor="is_active">
              Recompensa activa
            </label>

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
              to="/rewards"
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
                ? "Guardando..."
                : "Guardar recompensa"}
            </button>

          </div>

        </form>

      </section>

    </main>
  );
}


export default RewardForm;