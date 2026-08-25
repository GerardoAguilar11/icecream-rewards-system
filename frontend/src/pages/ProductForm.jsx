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
  createProduct,
  getProductById,
  updateProduct,
} from "../services/productService";


function ProductForm() {
  const { id } = useParams();

  const navigate = useNavigate();

  const isEditing = Boolean(id);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "ICE_CREAM",
    price: "",
    is_active: true,
  });

  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] =
    useState(null);

  const [loading, setLoading] =
    useState(isEditing);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");


  useEffect(() => {
    if (!isEditing) {
      return;
    }

    const loadProduct = async () => {
      try {
        const product =
          await getProductById(id);

        setForm({
          name:
            product.name ?? "",
          description:
            product.description ?? "",
          category:
            product.category ?? "ICE_CREAM",
          price:
            product.price ?? "",
          is_active:
            product.is_active ?? true,
        });

        setCurrentImage(
          product.image ?? null
        );
      } catch {
        setError(
          "No fue posible cargar el producto."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, isEditing]);


  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };


  const handleImageChange = (event) => {
    const file =
      event.target.files?.[0];

    setImage(
      file ?? null
    );
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      const formData =
        new FormData();

      formData.append(
        "name",
        form.name
      );

      formData.append(
        "description",
        form.description
      );

      formData.append(
        "category",
        form.category
      );

      formData.append(
        "price",
        form.price
      );

      formData.append(
        "is_active",
        form.is_active
      );

      if (image) {
        formData.append(
          "image",
          image
        );
      }

      if (isEditing) {
        await updateProduct(
          id,
          formData
        );
      } else {
        await createProduct(
          formData
        );
      }

      navigate(
        "/products",
        {
          replace: true,
        }
      );
    } catch (requestError) {
      const responseData =
        requestError.response?.data;

      if (responseData?.image) {
        setError(
          Array.isArray(responseData.image)
            ? responseData.image[0]
            : responseData.image
        );

        return;
      }

      if (responseData?.price) {
        setError(
          Array.isArray(responseData.price)
            ? responseData.price[0]
            : responseData.price
        );

        return;
      }

      setError(
        isEditing
          ? "No fue posible actualizar el producto."
          : "No fue posible crear el producto."
      );
    } finally {
      setSubmitting(false);
    }
  };


  if (loading) {
    return (
      <main className="products-page">
        <p>
          Cargando producto...
        </p>
      </main>
    );
  }


  return (
    <main className="products-page">

      <header className="page-header">

        <Link
          to="/products"
          className="back-link"
        >
          ← Volver a productos
        </Link>

        <h1>
          {isEditing
            ? "Editar producto"
            : "Nuevo producto"}
        </h1>

        <p>
          {isEditing
            ? "Actualiza la información del producto."
            : "Agrega un producto al catálogo."}
        </p>

      </header>


      <section className="dashboard-section">

        <form
          onSubmit={handleSubmit}
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
              value={form.name}
              onChange={handleChange}
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
              value={form.description}
              onChange={handleChange}
              rows="4"
            />
          </div>


          <div className="form-group">
            <label htmlFor="category">
              Categoría
            </label>

            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option value="ICE_CREAM">
                Helado
              </option>

              <option value="DRINK">
                Bebida
              </option>

              <option value="TOPPING">
                Complemento
              </option>

              <option value="OTHER">
                Otro
              </option>
            </select>
          </div>


          <div className="form-group">
            <label htmlFor="price">
              Precio
            </label>

            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>


          <div className="form-group">
            <label htmlFor="image">
              Imagen
            </label>

            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>


          {currentImage && (
            <div className="product-current-image">

              <p>
                Imagen actual
              </p>

              <img
                src={currentImage}
                alt={form.name}
              />

            </div>
          )}


          <div className="checkbox-group">

            <input
              id="is_active"
              name="is_active"
              type="checkbox"
              checked={form.is_active}
              onChange={handleChange}
            />

            <label htmlFor="is_active">
              Producto activo
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
              to="/products"
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
                : "Guardar producto"}
            </button>

          </div>

        </form>

      </section>

    </main>
  );
}


export default ProductForm;