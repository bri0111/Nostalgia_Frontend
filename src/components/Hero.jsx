export default function Hero() {
  return (
    <header className="hero" id="inicio">
      <div
        className="hero-image"
        role="img"
        aria-label="Ilustración editorial de moda alternativa estilo manga"
      />
      <div className="hero-shade" />

      <div className="hero-copy">
        <p className="eyebrow">
          MODA ALTERNATIVA <span>·</span> COLECCIÓN 01
        </p>

        <h1 className="hero-japanese">ノスタルジー</h1>
        <p className="hero-english">N O S T A L G I A</p>

        <p className="hero-description">
          Prendas que evocan recuerdos,
          <br />
          pero viven en el presente.
        </p>

        <a href="#catalogo" className="hero-cta">
          EXPLORAR COLECCIÓN <span>→</span>
        </a>
      </div>

      <div className="hero-vertical-note">
        STYLE IS A MEMORY IN MOTION
      </div>

      <span className="hero-rose rose-one" aria-hidden="true">
        ✿
      </span>

      <div className="hero-bottom-line">
        <span>ESTILO　×　MÚSICA　×　LIBERTAD</span>
        <span className="hero-bottom-quote">
          La nostalgia también es una forma de avanzar.
        </span>
      </div>
    </header>
  );
}