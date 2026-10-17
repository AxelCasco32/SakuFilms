function PetalMark() {
  return (
    <svg
      className="petal-mark"
      viewBox="0 0 96 96"
      aria-hidden="true"
    >
      <path d="M48 48C31 43 22 31 23 15c16 1 28 10 33 27" />
      <path d="M48 48c17-5 26-17 25-33-16 1-28 10-33 27" />
      <path d="M48 48c-5 17-17 26-33 25 1-16 10-28 27-33" />
      <path d="M48 48c5 17 17 26 33 25-1-16-10-28-27-33" />
      <circle cx="48" cy="48" r="3" />
    </svg>
  )
}

function CornerFlourish() {
  return (
    <svg
      className="corner-flourish"
      viewBox="0 0 250 250"
      aria-hidden="true"
    >
      <circle cx="250" cy="0" r="180" />
      <circle cx="250" cy="0" r="132" />
      <path d="M250 158c-42-1-75-15-98-43-22-28-31-66-26-115" />
    </svg>
  )
}

export default function App() {
  return (
    <main>
      <section className="manifesto" aria-labelledby="manifesto-title">
        <CornerFlourish />

        <div className="manifesto__frame">
          <div className="manifesto__eyebrow" aria-hidden="true">
            <span />
            <PetalMark />
            <span />
          </div>

          <div className="manifesto__content">
            <div className="manifesto__heading-wrap">
              <span className="manifesto__quote" aria-hidden="true">
                “
              </span>
              <h2 id="manifesto-title">
                Hay momentos que solo suceden una vez.
                <em>Y merecen durar para siempre.</em>
              </h2>
            </div>

            <div className="manifesto__body">
              <span className="manifesto__rule" aria-hidden="true" />
              <p>
                Acompañamos a parejas que buscan algo más que registrar su boda.
                <br />
                Capturamos aquello que hace única a cada historia, para volver a
                ese instante,
                <br />
                una y otra vez.
              </p>
            </div>
          </div>

          <div className="manifesto__footer-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>
      </section>
    </main>
  )
}
