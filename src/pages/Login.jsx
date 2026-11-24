
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const { iniciarSesion } = useAuth();
  const navigate = useNavigate();

  async function ingresar(e) {
    e.preventDefault();

    setError('');
    setCargando(true);

    try {
      // Iniciar sesión mediante Spring Boot y JWT
      const usuario = await iniciarSesion(email, password);

      if (usuario) {
        if (usuario.rol === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      } else {
        setError('Correo o contraseña incorrectos.');
      }
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      setError('No se pudo iniciar sesión. Intenta nuevamente.');
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="admin-login">
      <div className="login-card">

        <span className="login-decoration">✧</span>

        <h1>ノスタルジー</h1>
        <p className="login-brand">N O S T A L G I A</p>

        <div className="login-divider" />

        <h2>Bienvenido a Nostalgia</h2>

        <p className="login-subtitle">
          Encuentra tu propia identidad.
        </p>

        <form onSubmit={ingresar}>
          <label htmlFor="email">
            Correo electrónico
          </label>

          <input
            id="email"
            type="email"
            placeholder="usuario@correo.cl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={cargando}
            required
          />

          <label htmlFor="password">
            Contraseña
          </label>

          <input
            id="password"
            type="password"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={cargando}
            required
          />

          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={cargando}
          >
            {cargando ? 'INGRESANDO...' : 'INICIAR SESIÓN'}
          </button>
        </form>

        <Link to="/registro" className="login-return">
          ¿No tienes una cuenta? Regístrate aquí
        </Link>

        <br />

        <Link to="/" className="login-return">
          ← Volver a la tienda
        </Link>

        <p className="login-signature">
          STYLE IS A MEMORY IN MOTION
        </p>

      </div>
    </div>
  );
}
