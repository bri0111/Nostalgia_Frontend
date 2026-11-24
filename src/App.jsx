import { useMemo, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Gatito from "./Gatito";
import { useProducts } from './context/ProductContext';

import DetalleProducto from './pages/DetalleProducto';
import Checkout from './pages/Checkout';
import CompraExitosa from './pages/CompraExitosa';
import CompraError from './pages/CompraError';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Favoritos from './pages/Favoritos';
import Perfil from './pages/Perfil';
import MisCompras from './pages/MisCompras';
import Categoria from './pages/Categoria';
import Ofertas from './pages/Ofertas';
import ProductCard from './components/ProductCard';
import Navbar from './components/Navbar';
import './App.css';
import Hero from './components/Hero';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import { useCart } from './context/CartContext';
import { useFavorites } from './context/FavoritesContext';
import ProtectedRoute from './components/ProtectedRoute';

const categorias = [
  'Todas',
  'Poleras',
  'Pantalones',
  'Chaquetas',
  'Zapatos',
  'Calzado',
];

const precioCLP = (precio) =>
  precio.toLocaleString('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  });



function Tienda() {
  const navigate = useNavigate();
  const {
    carrito,
    setCarrito,
    carritoAbierto,
    setCarritoAbierto,
    totalCarrito,
    cantidadCarrito,
    agregarAlCarrito,
    cambiarCantidad,
    quitarDelCarrito,
    vaciarCarrito,
  } = useCart();
  const [busqueda, setBusqueda] = useState('');
  const { productos } = useProducts();
  const [categoria, setCategoria] = useState('Todas');
  const { favoritos, alternarFavorito } = useFavorites();


  const productosFiltrados = useMemo(() => {
    return productos.filter((producto) => {
      const coincideNombre = producto.nombre
        .toLowerCase()
        .includes(busqueda.toLowerCase().trim());

      const coincideCategoria =
        categoria === 'Todas' || producto.categoria === categoria;

      return coincideNombre && coincideCategoria;
    });
  }, [productos, busqueda, categoria]);






  return (
    <>
      <Navbar
        cantidadCarrito={cantidadCarrito}
        setCarritoAbierto={setCarritoAbierto}
      />

      <main>
        <Hero />

        <section className="collection-section" id="catalogo">
          <div className="container-fluid collection-layout">
            <div className="collection-main">
              <div className="collection-heading">
                <div>
                  <p className="eyebrow">SELECCIÓN EDITORIAL</p>
                  <h2>Nuestra Colección<span>.</span></h2>
                  <p className="collection-subtitle">
                    Descubre prendas únicas, inspiradas en la rebeldía, el arte y la nostalgia.
                  </p>
                </div>
                <p className="product-count">{productosFiltrados.length} productos</p>
              </div>

              <div className="catalog-controls">
                <div className="search-field">
                  <label className="visually-hidden" htmlFor="busqueda">Buscar prendas</label>
                  <input
                    id="busqueda"
                    type="search"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="⌕  Buscar prendas..."
                  />
                </div>

                <div className="category-field">
                  <label className="visually-hidden" htmlFor="categoria">Categoría</label>
                  <select
                    id="categoria"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                  >
                    {categorias.map((nombre) => (
                      <option key={nombre} value={nombre}>
                        {nombre === 'Todas' ? 'Todas las categorías' : nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="row g-3 g-lg-4">
                {productosFiltrados.map((producto) => (
                  <ProductCard
                    key={producto.id}
                    producto={producto}
                    favorito={favoritos.includes(producto.id)}
                    onFavorito={alternarFavorito}
                    onAgregar={agregarAlCarrito}
                  />
                ))}
              </div>

              {productosFiltrados.length === 0 && (
                <div className="no-results">
                  <span>✿</span>
                  <h3>No encontramos esa prenda.</h3>
                  <p>Prueba con otro nombre o categoría.</p>
                  <button
                    className="add-button reset-button"
                    onClick={() => {
                      setBusqueda('');
                      setCategoria('Todas');
                    }}
                  >
                    VER TODA LA COLECCIÓN
                  </button>
                </div>
              )}
            </div>

            <aside className="cart-preview">
              <h2>🛒 Tu carrito<span className="cart-count">{cantidadCarrito}</span></h2>

              {carrito.length === 0 ? (
                <div className="preview-empty">
                  <span>♡</span>
                  <p>Tu próxima pieza favorita te está esperando.</p>
                  <button onClick={() => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })}>
                    EXPLORAR TIENDA →
                  </button>
                </div>
              ) : (
                <>
                  <div className="preview-items">
                    {carrito.slice(0, 3).map((item) => (
                      <div className="preview-item" key={item.id}>
                        <div className={`preview-thumb ${item.color}`}>
                          {item.imagen ? (
                            <img
                              className="cart-thumb-photo"
                              src={item.imagen}
                              alt={item.nombre}
                              loading="lazy"
                            />
                          ) : (
                            <span aria-hidden="true">{item.emoji}</span>
                          )}
                        </div>
                        <div className="preview-item-info">
                          <strong>{item.nombre}</strong>
                          <span>{precioCLP(item.precio)}</span>
                          <div className="quantity-controls">
                            <button onClick={() => cambiarCantidad(item.id, -1)} aria-label={`Reducir ${item.nombre}`}>−</button>
                            <span>{item.cantidad}</span>
                            <button onClick={() => cambiarCantidad(item.id, 1)} aria-label={`Aumentar ${item.nombre}`}>＋</button>
                            <button className="remove-item" onClick={() => quitarDelCarrito(item.id)} aria-label={`Eliminar ${item.nombre}`}>♲</button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {carrito.length > 3 && (
                      <p className="more-items">Y {carrito.length - 3} artículos más...</p>
                    )}
                  </div>

                  <div className="preview-total">
                    <span>Total:</span>
                    <strong>{precioCLP(totalCarrito)}</strong>
                  </div>

                  <button className="checkout-button" onClick={() => setCarritoAbierto(true)}>
                    REVISAR CARRITO →
                  </button>
                  <button className="clear-cart" onClick={() => setCarrito([])}>
                    ♲ Vaciar carrito
                  </button>
                </>
              )}
            </aside>
          </div>
        </section>

        <section className="service-strip">
          <div className="container-fluid service-grid">
            <div className="service-item">
              <span className="service-icon">🛒</span>
              <div><strong>Envíos a todo Chile</strong><p>Información de envío por confirmar</p></div>
            </div>
            <div className="service-item">
              <span className="service-icon">♢</span>
              <div><strong>Compra protegida</strong><p>Pagos reales aún no habilitados</p></div>
            </div>
            <div className="service-item">
              <span className="service-icon">☆</span>
              <div><strong>Estilo original</strong><p>Encuentra tu identidad</p></div>
            </div>
            <div className="service-item">
              <span className="service-icon">☏</span>
              <div><strong>Atención personal</strong><p>Próximamente</p></div>
            </div>
          </div>
        </section>

        <section className="about-section" id="nosotros">
          <div className="container">
            <p className="eyebrow">NUESTRA FILOSOFÍA</p>
            <h2>El pasado también<br /><em>se viste.</em></h2>
            <p>
              ノスタルジー nace de la mezcla entre la moda alternativa,
              las historias dibujadas y la libertad de construir un estilo propio.
            </p>
            <a href="#catalogo">ENCUENTRA TU ESTILO ↗</a>
          </div>
        </section>
      </main>

      <Footer />


     <Gatito />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Tienda />} />
        <Route path="/producto/:id" element={<DetalleProducto />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/compra-exitosa" element={<CompraExitosa />} />
        <Route path="/compra-error" element={<CompraError />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/favoritos" element={<Favoritos />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/mis-compras" element={<MisCompras />} />
        <Route path="/categoria/:nombre" element={<Categoria />} />
        <Route path="/ofertas" element={<Ofertas />} />
      </Routes>
      <CartDrawer />
    </BrowserRouter>
  );
}