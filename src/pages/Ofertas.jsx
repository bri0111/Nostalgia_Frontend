import { Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import './Ofertas.css';

export default function Ofertas() {
  const navigate = useNavigate();

  const { productos } = useProducts();
  const { favoritos, alternarFavorito } = useFavorites();
  const { agregarAlCarrito } = useCart();

  const productosEnOferta = productos.filter(
    (producto) =>
      Number(producto.descuento) > 0 &&
      Number(producto.descuento) <= 100
  );

  function volver() {
    if (window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate('/');
    }
  }

  return (
    <main className="ofertas-page container py-5">

      <button
        className="favorites-return"
        onClick={volver}
      >
        ← Volver atrás
      </button>

      <header className="ofertas-banner">

        <span className="ofertas-decoration">
          ✧
        </span>

        <p className="ofertas-eyebrow">
          NOSTALGIA / SPECIAL SALE
        </p>

        <h1>Ofertas exclusivas.</h1>

        <p className="ofertas-subtitle">
          El estilo no tiene precio, pero sí descuentos.
        </p>

        <span className="ofertas-signature">
          FASHION × FREEDOM × NOSTALGIA
        </span>

      </header>

      <p className="ofertas-count">
        {productosEnOferta.length} productos en oferta
      </p>

      {productosEnOferta.length === 0 ? (
        <div className="favorites-empty">

          <span>✧</span>

          <h2>Próximamente nuevas ofertas</h2>

          <p>
            Descubre nuestra colección mientras tanto.
          </p>

          <Link to="/" className="hero-cta">
            EXPLORAR TIENDA →
          </Link>

        </div>
      ) : (
        <div className="row g-3">

          {productosEnOferta.map((producto) => (
            <ProductCard
              key={producto.id}
              producto={producto}
              favorito={favoritos.includes(producto.id)}
              onFavorito={alternarFavorito}
              onAgregar={agregarAlCarrito}
            />
          ))}

        </div>
      )}

    </main>
  );
}