
const API_URL = "http://localhost:8080/api";

// Función general para comunicarse con Spring Boot
export async function apiRequest(ruta, opciones = {}) {
  const respuesta = await fetch(`${API_URL}${ruta}`, {
    ...opciones,
    headers: {
      "Content-Type": "application/json",
      ...opciones.headers,
    },
  });

  if (!respuesta.ok) {
    const mensaje = await respuesta.text();

    throw new Error(
      mensaje || `Error del servidor: ${respuesta.status}`
    );
  }

  if (respuesta.status === 204) {
    return null;
  }

  return respuesta.json();
}

// GET: obtener todos los productos
export async function obtenerProductosAPI() {
  return apiRequest("/productos");
}

// GET: obtener un producto por ID
export async function obtenerProductoPorIdAPI(id) {
  return apiRequest(`/productos/${id}`);
}

// POST: crear un producto (solo ADMIN)
export async function crearProductoAPI(producto, token) {
  if (!token) {
    throw new Error("Debes iniciar sesión como administrador.");
  }

  return apiRequest("/productos", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(producto),
  });
}

// PUT: actualizar un producto (solo ADMIN)
export async function actualizarProductoAPI(id, producto, token) {
  if (!token) {
    throw new Error("Debes iniciar sesión como administrador.");
  }

  return apiRequest(`/productos/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(producto),
  });
}

// DELETE: eliminar un producto (solo ADMIN)
export async function eliminarProductoAPI(id, token) {
  if (!token) {
    throw new Error("Debes iniciar sesión como administrador.");
  }

  return apiRequest(`/productos/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// POST: iniciar sesión
export async function iniciarSesionAPI(email, password) {
  return apiRequest("/usuarios/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// POST: registrar un nuevo cliente
export async function registrarUsuarioAPI(datos) {
  return apiRequest("/usuarios/registro", {
    method: "POST",
    body: JSON.stringify(datos),
  });
}


export async function renovarTokenAPI(token) {
  if (!token) {
    throw new Error('No hay una sesión activa.');
  }

  return apiRequest('/usuarios/renovar', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
