import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

export default function Categoria() {
  const { nombre } = useParams();
  const navigate = useNavigate();

  const { productos } = useProducts();
  const { favoritos, alternarFavorito } = useFavorites();
  const { agregarAlCarrito } = useCart();

  const productosCategoria = productos.filter(
    (producto) =>
      producto.categoria.toLowerCase() === nombre.toLowerCase()
  );

  return (
    <main className="category-page container py-5">

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

      <p className="category-eyebrow">
        NOSTALGIA / COLLECTION
      </p>

      <h1 className="category-title">{nombre}</h1>

      <p className="category-subtitle">
        Encuentra prendas que reflejen tu identidad.
      </p>

      <p>{productosCategoria.length} productos</p>

      {productosCategoria.length === 0 ? (
        <div className="favorites-empty">
          <span>✧</span>
          <h2>No hay productos en esta categoría</h2>

          <Link to="/" className="hero-cta">
            EXPLORAR TIENDA →
          </Link>
        </div>
      ) : (
        <div className="row g-3">
          {productosCategoria.map((producto) => (
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