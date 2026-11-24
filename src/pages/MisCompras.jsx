import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrdersContext';
import './MisCompras.css';

const precioCLP = (precio) =>
  precio.toLocaleString('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  });

export default function MisCompras() {
  const { autenticado } = useAuth();
  const { misPedidos } = useOrders();
  const navigate = useNavigate();

  if (!autenticado) {
    return <Navigate to="/login" replace />;
  }

  function volver() {
    if (window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate('/perfil');
    }
  }

  return (
    <main className="orders-page">

      <button className="orders-return" onClick={volver}>
        ← Volver atrás
      </button>

      <h1>Mis compras</h1>

      <p className="orders-subtitle">
        Pequeños recuerdos de tu universo Nostalgia.
      </p>

      {misPedidos.length === 0 ? (
        <div className="orders-empty">

          <span>✧</span>

          <h2>Aún no tienes compras</h2>

          <p>
            Descubre las prendas que esperan por ti.
          </p>

          <Link to="/" className="hero-cta">
            EXPLORAR TIENDA →
          </Link>

        </div>
      ) : (
        <div className="orders-list">

          {misPedidos.map((pedido) => (
            <article className="order-card" key={pedido.id}>

              <div className="order-header">

                <div>
                  <h3>Pedido #{pedido.id}</h3>

                  <p>
                    {new Date(pedido.fecha)
                      .toLocaleDateString('es-CL')}
                  </p>
                </div>

                <span className="order-status">
                  ✓ {pedido.estado}
                </span>

              </div>

              {pedido.productos.map((producto) => (
                <div className="order-product" key={producto.id}>

                  <img
                    src={producto.imagen}
                    alt={producto.nombre}
                  />

                  <div className="order-product-info">
                    <h4>{producto.nombre}</h4>
                    <p>Cantidad: {producto.cantidad}</p>
                  </div>

                  <span>
                    {precioCLP(
                      producto.precio * producto.cantidad
                    )}
                  </span>

                </div>
              ))}

              <div className="order-total">
                <strong>Total</strong>
                <strong>{precioCLP(pedido.total)}</strong>
              </div>

            </article>
          ))}

        </div>
      )}

    </main>
  );
}