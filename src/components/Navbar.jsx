import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { useProducts } from '../context/ProductContext';

export default function Navbar({ cantidadCarrito, setCarritoAbierto }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [menuUsuario, setMenuUsuario] = useState(false);
  const [menuCategorias, setMenuCategorias] = useState(false);

  const { productos } = useProducts();

  const categorias = [...new Set(
    productos.map((producto) => producto.categoria)
  )];

  const { usuario, autenticado, esAdmin, cerrarSesion } = useAuth();
  const navigate = useNavigate();
  const { favoritos } = useFavorites();

  function salir() {
    cerrarSesion();
    setMenuUsuario(false);
    navigate('/');
  }

  return (
    <nav className="topbar">
      <div className="container-fluid shop-nav">

        <button
          className="mobile-menu"
          onClick={() => setMenuAbierto(!menuAbierto)}
          aria-label="Abrir menú"
          aria-expanded={menuAbierto}
        >
          ☰
        </button>

        <a href="#inicio" className="brand">
          <span className="brand-japanese">ノスタルジー</span>
          <span className="brand-roman">N O S T A L G I A</span>
        </a>

        <div className={`nav-links ${menuAbierto ? 'nav-open' : ''}`}>
          <a href="#inicio">Inicio</a>
          <a href="#catalogo">Tienda</a>
          <div className="category-menu-container">

            <button
                className="category-menu-button"
                onClick={() => setMenuCategorias(!menuCategorias)}
                aria-expanded={menuCategorias}
            >
                Categorías ⌄
            </button>

            {menuCategorias && (
                <div className="category-dropdown">

                {categorias.map((categoria) => (
                    <Link
                    key={categoria}
                    to={`/categoria/${encodeURIComponent(categoria)}`}
                    onClick={() => {
                        setMenuCategorias(false);
                        setMenuAbierto(false);
                    }}
                    >
                    {categoria}
                    </Link>
                ))}

                </div>
            )}

            </div>
          <Link
            to="/ofertas"
            className="ofertas-link"
            onClick={() => setMenuAbierto(false)}
            >
            Ofertas ✧
            </Link>

          <a href="#nosotros">Nosotros</a>
        </div>

        <div className="nav-actions">

          <button
            onClick={() => {
              document.getElementById('busqueda')?.focus();
              document.getElementById('catalogo')?.scrollIntoView({
                behavior: 'smooth'
              });
            }}
            aria-label="Buscar productos"
          >
            ⌕
          </button>

          <div className="user-menu-container">

            <button
              className="user-icon"
              onClick={() => setMenuUsuario(!menuUsuario)}
              aria-label="Mi cuenta"
              aria-expanded={menuUsuario}
            >
              <svg
                width="23"
                height="23"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="12" cy="7" r="4" />
                <path d="M4 22v-3a8 8 0 0 1 16 0v3" />
              </svg>
            </button>

            {menuUsuario && (
              <div className="user-dropdown">

                {!autenticado ? (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMenuUsuario(false)}
                    >
                      Iniciar sesión
                    </Link>

                    <Link
                      to="/registro"
                      onClick={() => setMenuUsuario(false)}
                    >
                      Crear cuenta
                    </Link>
                  </>
                ) : (
                  <>
                    <p className="user-greeting">
                      Hola, {usuario.nombre} ♡
                    </p>

                    <Link
                        to="/perfil"
                        onClick={() => setMenuUsuario(false)}
                    >
                        Mi perfil
                    </Link>

                    <Link
                    to="/mis-compras"
                    onClick={() => setMenuUsuario(false)}
                    >
                    Mis compras
                    </Link>

                    {esAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setMenuUsuario(false)}
                      >
                        Panel administrativo
                      </Link>
                    )}

                    <button onClick={salir}>
                      Cerrar sesión
                    </button>
                  </>
                )}

              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => navigate('/favoritos')}
            className="nav-cart nav-favorites"
            aria-label="Ver mis favoritos"
            >
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
            </svg>

            <span className="cart-count">{favoritos.length}</span>
            </button>

          <button
            onClick={() => setCarritoAbierto(true)}
            aria-label="Abrir carrito"
            className="nav-cart"
          >
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>

            <span className="cart-count">{cantidadCarrito}</span>
          </button>

        </div>
      </div>
    </nav>
  );
}