import { createContext, useContext, useState, useEffect } from 'react';
import { calcularPrecioFinal } from '../utils/precio';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [carrito, setCarrito] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('carrito')) || [];
    } catch {
      return [];
    }
  });

  const [carritoAbierto, setCarritoAbierto] = useState(false);

  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);

  const totalCarrito = carrito.reduce(
    (total, item) => total + item.precio * item.cantidad,
    0
  );

  const cantidadCarrito = carrito.reduce(
    (total, item) => total + item.cantidad,
    0
  );

  function agregarAlCarrito(producto) {
  const precioFinal = calcularPrecioFinal(producto);

  setCarrito((actual) => {
    const existe = actual.find(
      (item) => item.id === producto.id
    );

    const productoCarrito = {
      ...producto,
      precioOriginal: producto.precio,
      precio: precioFinal
    };

    if (existe) {
      return actual.map((item) =>
        item.id === producto.id
          ? {
              ...productoCarrito,
              cantidad: item.cantidad + 1
            }
          : item
      );
    }

    return [
      ...actual,
      { ...productoCarrito, cantidad: 1 }
    ];
  });

  setCarritoAbierto(true);
}

  function cambiarCantidad(id, cambio) {
    setCarrito((actual) =>
      actual
        .map((item) =>
          item.id === id
            ? { ...item, cantidad: item.cantidad + cambio }
            : item
        )
        .filter((item) => item.cantidad > 0)
    );
  }

  function quitarDelCarrito(id) {
    setCarrito((actual) =>
      actual.filter((item) => item.id !== id)
    );
  }

  function vaciarCarrito() {
    setCarrito([]);
  }

  return (
    <CartContext.Provider
      value={{
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}