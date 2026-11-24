import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { precioCLP } from '../utils/precio';

export default function CartDrawer() {
  const navigate = useNavigate();

  const {
    carrito,
    carritoAbierto,
    setCarritoAbierto,
    totalCarrito,
    cambiarCantidad,
    quitarDelCarrito,
    vaciarCarrito
  } = useCart();

  if (!carritoAbierto) return null;

  return (
    <div
      className="drawer-backdrop"
      onClick={() => setCarritoAbierto(false)}
    >
      <aside
        className="cart-drawer"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Tu carrito"
      >

        <div className="drawer-header">
          <div>
            <p className="eyebrow">TU SELECCIÓN</p>
            <h2>Tu carrito<span>.</span></h2>
          </div>

          <button
            onClick={() => setCarritoAbierto(false)}
            aria-label="Cerrar carrito"
          >
            ×
          </button>
        </div>

        {carrito.length === 0 ? (
          <div className="drawer-empty">

            <span>♡</span>
            <p>Tu carrito está vacío.</p>

            <button
              className="checkout-button"
              onClick={() => setCarritoAbierto(false)}
            >
              SEGUIR EXPLORANDO
            </button>

          </div>
        ) : (
          <>
            <div className="drawer-items">

              {carrito.map((item) => (
                <div className="drawer-item" key={item.id}>

                  <div className={`drawer-thumb ${item.color}`}>
                    {item.imagen ? (
                      <img
                        className="cart-thumb-photo"
                        src={item.imagen}
                        alt={item.nombre}
                        loading="lazy"
                      />
                    ) : (
                      <span aria-hidden="true">
                        {item.emoji}
                      </span>
                    )}
                  </div>

                  <div className="drawer-item-content">

                    <strong>{item.nombre}</strong>

                    {item.precioOriginal > item.precio && (
                      <span className="original-price">
                        {precioCLP(item.precioOriginal)}
                      </span>
                    )}

                    <span>{precioCLP(item.precio)}</span>

                    <div className="quantity-controls">

                      <button
                        onClick={() => cambiarCantidad(item.id, -1)}
                        aria-label="Reducir cantidad"
                      >
                        −
                      </button>

                      <span>{item.cantidad}</span>

                      <button
                        onClick={() => cambiarCantidad(item.id, 1)}
                        aria-label="Aumentar cantidad"
                      >
                        ＋
                      </button>

                      <button
                        className="remove-item"
                        onClick={() => quitarDelCarrito(item.id)}
                      >
                        Eliminar
                      </button>

                    </div>
                  </div>
                </div>
              ))}

            </div>

            <div className="drawer-footer">

              <div className="preview-total">
                <span>Total</span>
                <strong>{precioCLP(totalCarrito)}</strong>
              </div>

              <p>
                Demostración académica. No se realizará ningún cobro.
              </p>

              <button
                className="checkout-button"
                onClick={() => {
                  setCarritoAbierto(false);
                  navigate('/checkout');
                }}
              >
                CONTINUAR →
              </button>

              <button
                className="clear-cart"
                onClick={vaciarCarrito}
              >
                Vaciar carrito
              </button>

            </div>
          </>
        )}

      </aside>
    </div>
  );
}