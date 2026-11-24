
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  obtenerProductosAPI,
  crearProductoAPI,
  actualizarProductoAPI,
  eliminarProductoAPI,
} from '../services/api';

import { useAuth } from './AuthContext';

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const { token, esAdmin } = useAuth();

  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Consultar productos almacenados en H2
  async function refrescarProductos() {
    try {
      setCargando(true);
      setError(null);

      const datos = await obtenerProductosAPI();
      setProductos(datos);

      return datos;
    } catch (err) {
      console.error('Error al cargar productos:', err);
      setError('No se pudieron cargar los productos.');
      throw err;
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    refrescarProductos().catch(() => {});
  }, []);

  // Crear producto en Spring Boot
  async function agregarProducto(producto) {
    if (!esAdmin) {
      throw new Error('No tienes permisos de administrador.');
    }

    const nuevo = await crearProductoAPI(producto, token);
    await refrescarProductos();

    return nuevo;
  }

  // Actualizar producto en Spring Boot
  async function editarProducto(id, cambios) {
    if (!esAdmin) {
      throw new Error('No tienes permisos de administrador.');
    }

    const actualizado = await actualizarProductoAPI(
      id,
      cambios,
      token
    );

    await refrescarProductos();

    return actualizado;
  }

  // Eliminar producto de Spring Boot
  async function borrarProducto(id) {
    if (!esAdmin) {
      throw new Error('No tienes permisos de administrador.');
    }

    await eliminarProductoAPI(id, token);
    await refrescarProductos();

    return true;
  }

  return (
    <ProductContext.Provider
      value={{
        productos,
        cargando,
        error,
        refrescarProductos,
        agregarProducto,
        editarProducto,
        borrarProducto,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductContext);
}
