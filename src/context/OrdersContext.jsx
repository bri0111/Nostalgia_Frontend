import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const OrdersContext = createContext();

export function OrdersProvider({ children }) {
  const { usuario } = useAuth();

  const [pedidos, setPedidos] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('nostalgiaPedidos')) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      'nostalgiaPedidos',
      JSON.stringify(pedidos)
    );
  }, [pedidos]);

  function registrarPedido(productos, total) {
    if (!usuario || productos.length === 0) return null;

    const nuevoPedido = {
      id: Date.now(),
      usuarioId: usuario.id,
      fecha: new Date().toISOString(),
      productos: productos.map((p) => ({ ...p })),
      total,
      estado: 'Compra exitosa'
    };

    setPedidos((actuales) => [
      nuevoPedido,
      ...actuales
    ]);

    return nuevoPedido;
  }

  const misPedidos = pedidos.filter(
    (pedido) => pedido.usuarioId === usuario?.id
  );

  return (
    <OrdersContext.Provider
      value={{
        misPedidos,
        registrarPedido
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  return useContext(OrdersContext);
}