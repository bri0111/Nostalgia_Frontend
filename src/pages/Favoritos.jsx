import { Link, useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

export default function Favoritos() {
  const navigate = useNavigate();
  const { favoritos, alternarFavorito } = useFavorites();
  const { productos } = useProducts();
  const { agregarAlCarrito } = useCart();

  const productosFavoritos = productos.filter(
    (producto) => favoritos.includes(producto.id)
  );

  return (
    <main className="favorites-page container py-5">

      <button
        className="favorites-return"
        onClick={() => {
            if (window.history.state?.idx > 0) {
            navigate(-1);
            } else {
            navigate('/');
            }
        }}
        >
        ← Volver atrás
      </button>

      <h1>♡ Mis favoritos.</h1>

      <p className="favorites-subtitle">
        Las prendas que conquistaron tu corazón.
      </p>

      <p>{productosFavoritos.length} productos</p>

      {productosFavoritos.length === 0 ? (
        <div className="favorites-empty">
          <span>♡</span>
          <h2>Aún no tienes favoritos</h2>
          <p>Guarda las prendas que más te gusten.</p>

          <Link to="/" className="hero-cta">
            EXPLORAR TIENDA →
          </Link>
        </div>
      ) : (
        <div className="row g-3">
          {productosFavoritos.map((producto) => (
            <ProductCard
              key={producto.id}
              producto={producto}
              favorito={true}
              onFavorito={alternarFavorito}
              onAgregar={agregarAlCarrito}
            />
          ))}
        </div>
      )}

    </main>
  );
}