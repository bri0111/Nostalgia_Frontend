
import { Link } from 'react-router-dom';

export default function CompraExitosa() {
  return (
    <div className="container py-5 text-center">
      <h1 className="text-success">
        ✓ Pedido registrado correctamente
      </h1>

      <p>
        Tu pedido de demostración fue registrado en Nostalgia.
      </p>

      <p>
        Esta es una simulación académica.
        No se ha realizado ningún cobro real.
      </p>

      <Link
        to="/mis-compras"
        className="btn btn-dark mt-3 me-2"
      >
        Ver mis pedidos
      </Link>

      <Link
        to="/"
        className="btn btn-outline-secondary mt-3"
      >
        Volver a la tienda
      </Link>
    </div>
  );
}
