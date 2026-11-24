import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Perfil.css';

export default function Perfil() {
  const { usuario, autenticado, cerrarSesion } = useAuth();
  const navigate = useNavigate();

  if (!autenticado) {
    return <Navigate to="/login" replace />;
  }

  function salir() {
    cerrarSesion();
    navigate('/');
  }

  return (
    <main className="perfil-page">
      <div className="perfil-card">

        <Link to="/" className="perfil-return">
          ← Volver a la tienda
        </Link>

        <h1>ノスタルジー</h1>
        <p className="login-brand">N O S T A L G I A</p>

        <div className="perfil-avatar">
          <svg
            width="45"
            height="45"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="12" cy="7" r="4" />
            <path d="M4 22v-3a8 8 0 0 1 16 0v3" />
          </svg>
        </div>

        <h2>Mi perfil</h2>

        <p className="perfil-subtitle">
          Tu pequeño universo Nostalgia.
        </p>

        <div className="perfil-datos">

          <label>Nombre</label>
          <p>{usuario.nombre}</p>

          <label>Correo electrónico</label>
          <p>{usuario.email}</p>

          <label>Tipo de cuenta</label>
          <p>
            {usuario.rol === 'admin'
              ? 'Administrador'
              : 'Cliente'}
          </p>

        </div>

        <div className="perfil-actions">

          <Link to="/favoritos">
            ♡ Mis favoritos
          </Link>

          <Link to="/mis-compras">
            Mis compras
          </Link>

          <button onClick={salir}>
            Cerrar sesión
          </button>

        </div>

      </div>
    </main>
  );
}