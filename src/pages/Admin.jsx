
import { useState } from 'react';
import { useProducts } from '../context/ProductContext';

const precioCLP = (precio) =>
  Number(precio).toLocaleString('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  });

const formularioVacio = {
  nombre: '',
  categoria: '',
  precio: '',
  imagen: '',
  descuento: '0'
};

export default function Admin() {
  const {
    productos,
    cargando,
    error,
    agregarProducto,
    editarProducto,
    borrarProducto
  } = useProducts();

  const [form, setForm] = useState(formularioVacio);
  const [editandoId, setEditandoId] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [errorAdmin, setErrorAdmin] = useState('');

  function manejarCambio(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function guardar(e) {
    e.preventDefault();

    setMensaje('');
    setErrorAdmin('');
    setGuardando(true);

    const datos = {
      ...form,
      precio: Number(form.precio),
      descuento: Number(form.descuento) || 0,
      emoji: '✦',
      color: 'product-stone',
      detalle: 'ADMIN / NUEVO'
    };

    try {
      if (editandoId !== null) {
        await editarProducto(editandoId, datos);
        setMensaje('Producto actualizado correctamente.');
      } else {
        await agregarProducto(datos);
        setMensaje('Producto creado correctamente.');
      }

      setForm(formularioVacio);
      setEditandoId(null);

    } catch (err) {
      setErrorAdmin(
        err.message || 'No se pudo guardar el producto.'
      );
    } finally {
      setGuardando(false);
    }
  }

  function editar(p) {
    setMensaje('');
    setErrorAdmin('');

    setForm({
      nombre: p.nombre,
      categoria: p.categoria,
      precio: String(p.precio),
      imagen: p.imagen || '',
      descuento: String(p.descuento || 0)
    });

    setEditandoId(p.id);
  }

  async function eliminar(id) {
    if (!window.confirm('¿Eliminar este producto?')) return;

    setMensaje('');
    setErrorAdmin('');
    setGuardando(true);

    try {
      await borrarProducto(id);
      setMensaje('Producto eliminado correctamente.');

      if (editandoId === id) {
        setEditandoId(null);
        setForm(formularioVacio);
      }

    } catch (err) {
      setErrorAdmin(
        err.message || 'No se pudo eliminar el producto.'
      );
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="container py-5">
      <h1>Panel Administrador</h1>
      <p>Gestión de productos</p>

      {mensaje && (
        <div className="alert alert-success" role="status">
          {mensaje}
        </div>
      )}

      {errorAdmin && (
        <div className="alert alert-danger" role="alert">
          {errorAdmin}
        </div>
      )}

      {error && (
        <div className="alert alert-warning" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={guardar} className="row g-2 mb-4">
        <div className="col-md-3">
          <input
            className="form-control"
            name="nombre"
            placeholder="Nombre"
            value={form.nombre}
            onChange={manejarCambio}
            disabled={guardando}
            required
          />
        </div>

        <div className="col-md-3">
          <input
            className="form-control"
            name="categoria"
            placeholder="Categoría"
            value={form.categoria}
            onChange={manejarCambio}
            disabled={guardando}
            required
          />
        </div>

        <div className="col-md-2">
          <input
            className="form-control"
            name="precio"
            type="number"
            min="1"
            placeholder="Precio"
            value={form.precio}
            onChange={manejarCambio}
            disabled={guardando}
            required
          />
        </div>

        <div className="col-md-2">
          <input
            className="form-control"
            name="imagen"
            placeholder="/ropa/imageX.png"
            value={form.imagen}
            onChange={manejarCambio}
            disabled={guardando}
          />
        </div>

        <div className="col-md-2">
          <label>Descuento (%)</label>
          <input
            className="form-control"
            name="descuento"
            type="number"
            min="0"
            max="100"
            value={form.descuento}
            onChange={manejarCambio}
            disabled={guardando}
            required
          />
        </div>

        <div className="col-md-2">
          <button
            type="submit"
            className="btn btn-success w-100"
            disabled={guardando}
          >
            {guardando
              ? 'Guardando...'
              : editandoId !== null
                ? 'Actualizar'
                : 'Crear'}
          </button>
        </div>

        {editandoId !== null && (
          <div className="col-md-2">
            <button
              type="button"
              className="btn btn-secondary w-100"
              disabled={guardando}
              onClick={() => {
                setEditandoId(null);
                setForm(formularioVacio);
                setErrorAdmin('');
              }}
            >
              Cancelar edición
            </button>
          </div>
        )}
      </form>

      {cargando && <p>Cargando productos...</p>}

      <table className="table">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Descuento</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td>
                {p.imagen && (
                  <img
                    src={p.imagen}
                    alt={p.nombre}
                    style={{
                      width: 50,
                      height: 50,
                      objectFit: 'cover'
                    }}
                  />
                )}
              </td>

              <td>{p.nombre}</td>
              <td>{p.categoria}</td>
              <td>{precioCLP(p.precio)}</td>
              <td>
                {Number(p.descuento) > 0 ? (
                  <span style={{ color: '#cb818d' }}>
                    -{p.descuento}%
                  </span>
                ) : (
                  'Sin oferta'
                )}
              </td>

              <td>
                <button
                  className="btn btn-sm btn-primary me-2"
                  onClick={() => editar(p)}
                  disabled={guardando}
                >
                  Editar
                </button>

                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => eliminar(p.id)}
                  disabled={guardando}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
