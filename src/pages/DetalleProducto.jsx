import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import { precioCLP, calcularPrecioFinal } from '../utils/precio';

export default function DetalleProducto() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { productos } = useProducts();
  const { favoritos, alternarFavorito } = useFavorites();
  const { agregarAlCarrito } = useCart();

  const producto = productos.find(
    (p) => String(p.id) === id
  );

  function volver() {
    if (window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate('/');
    }
  }

  if (!producto) {
    return (
      <div className="container py-5 text-center">
        <h2>Producto no encontrado</h2>

        <Link to="/" className="btn btn-dark mt-3">
          Volver al inicio
        </Link>
      </div>
    );
  }

  const esFavorito = favoritos.includes(producto.id);

  const descuento = Number(producto.descuento) || 0;
  const tieneOferta = descuento > 0 && descuento <= 100;
  const precioFinal = calcularPrecioFinal(producto);

  return (
    <main className="container py-5 detalle-page">

      <button
        className="favorites-return mb-4"
        onClick={volver}
      >
        ← Volver atrás
      </button>

      <div className="row g-4">

        <div className="col-md-6">

          <div
            className={`product-visual ${producto.color}`}
            style={{ aspectRatio: '1 / 1' }}
          >

            {producto.imagen && (
              <img
                className="product-photo"
                src={producto.imagen}
                alt={producto.nombre}
              />
            )}

            {tieneOferta && (
              <span className="offer-badge">
                -{descuento}%
              </span>
            )}

            <button
              className={`favorite-button ${esFavorito ? 'is-favorite' : ''}`}
              onClick={() => alternarFavorito(producto.id)}
              aria-label={esFavorito ? 'Quitar de favoritos' : 'Añadir a favoritos'}
              aria-pressed={esFavorito}
            >
              {esFavorito ? '♥' : '♡'}
            </button>

          </div>

        </div>

        <div className="col-md-6">

          <p className="product-category">
            {producto.categoria}
          </p>

          <h1>{producto.nombre}</h1>

          <p className="detalle-edicion">
            {producto.detalle}
          </p>

          <div className="product-prices">

            {tieneOferta && (
              <span className="original-price">
                {precioCLP(producto.precio)}
              </span>
            )}

            <p className={`product-price fs-3 ${tieneOferta ? 'sale-price' : ''}`}>
              {precioCLP(precioFinal)}
            </p>

            {tieneOferta && (
              <p className="detalle-ahorro">
                Ahorras {precioCLP(producto.precio - precioFinal)}
              </p>
            )}

          </div>

          <button
            className="add-button mt-3"
            onClick={() => agregarAlCarrito(producto)}
          >
            <span>＋</span> AÑADIR AL CARRITO
          </button>

        </div>

      </div>

    </main>
  );
}