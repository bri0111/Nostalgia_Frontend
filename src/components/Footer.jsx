export default function Footer() {
  return (
    <footer className="footer">
      <div className="container-fluid footer-main">
        <a href="#inicio" className="footer-brand">
          <span>ノスタルジー</span>
          <small>N O S T A L G I A</small>
        </a>

        <div className="footer-links">
          <a href="#nosotros">Nosotros</a>
          <a href="#catalogo">Tienda</a>
          <a href="#inicio">Volver arriba ↑</a>
        </div>

        <div className="footer-social">
          <span>✧</span>
          <span>♡</span>
          <span>✿</span>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} ノスタルジー — NOSTALGIA
        <span>MODA · IDENTIDAD · LIBERTAD</span>
      </div>
    </footer>
  );
}