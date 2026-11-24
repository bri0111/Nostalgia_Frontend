export function precioCLP(precio) {
  return Number(precio).toLocaleString('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  });
}

export function calcularPrecioFinal(producto) {
  const precio = Number(producto.precio);
  const descuento = Number(producto.descuento) || 0;

  if (descuento > 0 && descuento <= 100) {
    return Math.round(precio * (1 - descuento / 100));
  }

  return precio;
}