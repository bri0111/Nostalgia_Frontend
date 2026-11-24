
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Registro() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const { registrarUsuario } = useAuth();
  const navigate = useNavigate();

  async function registrar(e) {
    e.preventDefault();
    setError('');

    if (password !== confirmar) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    setCargando(true);

    try {
      // Registrar cliente en Spring Boot y H2
      const resultado = await registrarUsuario(
        nombre,
        email,
        password
      );

      if (resultado.ok) {
        navigate('/login');
      } else {
        setError(resultado.mensaje);
      }

    } catch (err) {
      console.error('Error al registrar usuario:', err);
      setError('No se pudo crear la cuenta. Intenta nuevamente.');
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

        <h2>Crea tu cuenta</h2>

        <p className="login-subtitle">
          Sé parte del universo Nostalgia.
        </p>

        <form onSubmit={registrar}>

          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            type="text"
            placeholder="Ingresa tu nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            disabled={cargando}
            required
          />

          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            type="email"
            placeholder="usuario@correo.cl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={cargando}
            required
          />

          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            placeholder="Crea una contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            disabled={cargando}
            required
          />

          <label htmlFor="confirmar">
            Confirmar contraseña
          </label>
          <input
            id="confirmar"
            type="password"
            placeholder="Repite tu contraseña"
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
            minLength={8}
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
            {cargando ? 'CREANDO CUENTA...' : 'CREAR CUENTA'}
          </button>

        </form>

        <Link to="/login" className="login-return">
          ¿Ya tienes una cuenta? Inicia sesión
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
