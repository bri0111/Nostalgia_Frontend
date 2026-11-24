import { Link } from 'react-router-dom';
import { precioCLP, calcularPrecioFinal } from '../utils/precio';



export default function ProductCard({
  producto,
  favorito,
  onFavorito,
  onAgregar
}) {
  const descuento = Number(producto.descuento) || 0;

  const tieneOferta = descuento > 0 && descuento <= 100;

  const precioFinal = calcularPrecioFinal(producto);

  return (
    <article className="col-6 col-md-4 col-xl-3">
      <div className="product-card h-100">
        <div className={`product-visual ${producto.color}`}>
            {tieneOferta && (
            <span className="offer-badge">
                -{descuento}%
            </span>
            )}
          <Link to={`/producto/${producto.id}`}>
            {producto.imagen && (
              <img
                className="product-photo"
                src={producto.imagen}
                alt={producto.nombre}
                loading="lazy"
              />
            )}
          </Link>

          <span className="product-edition">
            {producto.detalle}
          </span>

          <button
            className={`favorite-button ${favorito ? 'is-favorite' : ''}`}
            onClick={() => onFavorito(producto.id)}
            aria-label={favorito ? 'Quitar de favoritos' : 'Añadir a favoritos'}
            aria-pressed={favorito}
          >
            {favorito ? '♥' : '♡'}
          </button>

          <span className="product-symbol" aria-hidden="true">
            {producto.emoji}
          </span>

          <span className="product-image-caption">
            NOSTALGIE ARCHIVE
          </span>
        </div>

        <div className="product-info">
          <p className="product-category">{producto.categoria}</p>
          <h3>{producto.nombre}</h3>
          <div className="product-prices">

            {tieneOferta && (
                <span className="original-price">
                {precioCLP(producto.precio)}
                </span>
            )}

            <p className={`product-price ${tieneOferta ? 'sale-price' : ''}`}>
                {precioCLP(precioFinal)}
            </p>

            </div>
          <button className="add-button" onClick={() => onAgregar(producto)}>
            <span>＋</span> AÑADIR AL CARRITO
          </button>
        </div>
      </div>
    </article>
  );
}