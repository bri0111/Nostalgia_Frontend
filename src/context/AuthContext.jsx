
import {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';

import {
  iniciarSesionAPI,
  registrarUsuarioAPI,
  renovarTokenAPI
} from '../services/api';

const AuthContext = createContext();

// Leer la fecha de vencimiento del JWT
function obtenerExpiracion(token) {
  if (!token) return 0;

  try {
    const parte = token.split('.')[1];
    const base64 = parte
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const datos = JSON.parse(atob(base64));

    return typeof datos.exp === 'number'
      ? datos.exp * 1000
      : 0;
  } catch {
    return 0;
  }
}

// Comprobar que el JWT no haya vencido
function tokenVigente(token) {
  return obtenerExpiracion(token) > Date.now();
}

// Recuperar la sesión al actualizar la página
function recuperarSesion() {
  try {
    const token = sessionStorage.getItem('nostalgiaToken');
    const guardado = sessionStorage.getItem('nostalgiaUsuario');

    if (!tokenVigente(token) || !guardado) {
      sessionStorage.removeItem('nostalgiaToken');
      sessionStorage.removeItem('nostalgiaUsuario');
      return null;
    }

    const usuario = JSON.parse(guardado);

    if (!usuario?.email || !usuario?.rol) {
      sessionStorage.removeItem('nostalgiaToken');
      sessionStorage.removeItem('nostalgiaUsuario');
      return null;
    }

    return { usuario, token };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {

  const [sesion, setSesion] = useState(recuperarSesion);

  const usuario = sesion?.usuario ?? null;
  const token = sesion?.token ?? null;

  // Guardar una sesión válida
  function guardarSesion(respuesta) {
    if (!respuesta.token || !tokenVigente(respuesta.token)) {
      throw new Error('El token recibido no es válido.');
    }

    const usuarioActual = {
      id: respuesta.id,
      nombre: respuesta.nombre,
      email: respuesta.email,
      rol: respuesta.rol.toLowerCase()
    };

    const nuevaSesion = {
      usuario: usuarioActual,
      token: respuesta.token
    };

    sessionStorage.setItem(
      'nostalgiaUsuario',
      JSON.stringify(usuarioActual)
    );

    sessionStorage.setItem(
      'nostalgiaToken',
      respuesta.token
    );

    setSesion(nuevaSesion);

    return usuarioActual;
  }

  // Cerrar sesión
  function cerrarSesion() {
    setSesion(null);

    sessionStorage.removeItem('nostalgiaUsuario');
    sessionStorage.removeItem('nostalgiaToken');
  }

  // Registrar clientes en Spring Boot
  async function registrarUsuario(nombre, email, password) {
    try {
      if (!nombre?.trim() || !email?.trim() || !password) {
        return {
          ok: false,
          mensaje: 'Completa todos los campos.'
        };
      }

      await registrarUsuarioAPI({
        nombre: nombre.trim(),
        email: email.trim().toLowerCase(),
        password
      });

      return {
        ok: true,
        mensaje: 'Cuenta creada correctamente.'
      };
    } catch (error) {
      return {
        ok: false,
        mensaje: error.message || 'No se pudo crear la cuenta.'
      };
    }
  }

  // Iniciar sesión mediante JWT
  async function iniciarSesion(email, password) {
    try {
      const respuesta = await iniciarSesionAPI(
        email.trim().toLowerCase(),
        password
      );

      return guardarSesion(respuesta);
    } catch (error) {
      console.error('Error al iniciar sesión:', error.message);
      return null;
    }
  }

  // Renovación automática antes del vencimiento
  useEffect(() => {
    if (!token) return;

    let cancelado = false;
    let temporizador;

    const expiracion = obtenerExpiracion(token);
    const tiempoRestante = expiracion - Date.now();

    if (tiempoRestante <= 0) {
      cerrarSesion();
      return;
    }

    // Renovar 2 minutos antes del vencimiento
    const tiempoRenovacion = Math.max(
      0,
      tiempoRestante - 2 * 60 * 1000
    );

    temporizador = setTimeout(async () => {
      try {
        // No renovar si el token ya expiró
        if (!tokenVigente(token)) {
          throw new Error('La sesión expiró.');
        }

        const respuesta = await renovarTokenAPI(token);

        if (!cancelado) {
          guardarSesion(respuesta);
        }
      } catch (error) {
        if (!cancelado) {
          console.error('Error al renovar JWT:', error.message);
          cerrarSesion();
        }
      }
    }, tiempoRenovacion);

    return () => {
      cancelado = true;
      clearTimeout(temporizador);
    };
  }, [token]);

  const autenticado =
    usuario !== null && tokenVigente(token);

  const esAdmin =
    autenticado && usuario?.rol === 'admin';

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        autenticado,
        esAdmin,
        iniciarSesion,
        cerrarSesion,
        registrarUsuario
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
