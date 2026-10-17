import { useEffect, useRef } from "react";
import "./About.css";

const disenio = "/disenio.png";
const disenio2 = "/disenio_2.jpg";

const carouselUrls = [
  "https://res.cloudinary.com/ex91suxd/image/upload/v1791647172/Vietnam_3.jpg",
  "https://res.cloudinary.com/ex91suxd/image/upload/v1791647171/Vietnam_2.jpg",
  "https://res.cloudinary.com/ex91suxd/image/upload/v1791647171/SAKURA_1.jpg",
  "https://res.cloudinary.com/ex91suxd/image/upload/v1791647171/SAKURA_2.jpg",
  "https://res.cloudinary.com/ex91suxd/image/upload/v1791647171/Tailandia.jpg",
  "https://res.cloudinary.com/ex91suxd/image/upload/v1791647170/Laos.jpg",
  "https://res.cloudinary.com/ex91suxd/image/upload/v1791647170/Japon_14.jpg",
  "https://res.cloudinary.com/ex91suxd/image/upload/v1791647170/Japon_12.jpg",
  "https://res.cloudinary.com/ex91suxd/image/upload/v1791647169/Irlanda_3.jpg",
  "https://res.cloudinary.com/ex91suxd/image/upload/v1791647169/Japon_15.jpg",
  "https://res.cloudinary.com/ex91suxd/image/upload/v1791647169/indonesia_4.jpg",
  "https://res.cloudinary.com/ex91suxd/image/upload/v1791647169/Japon_1.jpg",
  "https://res.cloudinary.com/ex91suxd/image/upload/v1791647169/Irlanda_2.jpg",
  "https://res.cloudinary.com/ex91suxd/image/upload/v1791647169/Japon_9.jpg",
  "https://res.cloudinary.com/ex91suxd/image/upload/v1791647168/indonesia_2.jpg",
  "https://res.cloudinary.com/ex91suxd/image/upload/v1791647168/Irlanda_1.jpg",
  "https://res.cloudinary.com/ex91suxd/image/upload/v1791647168/indonesia_1.jpg",
  "https://res.cloudinary.com/ex91suxd/image/upload/v1791647167/Bulgaria.jpg",
  "https://res.cloudinary.com/ex91suxd/image/upload/v1791647167/Grecia.jpg",
  "https://res.cloudinary.com/ex91suxd/image/upload/v1791647166/Camboya_1.jpg",
  "https://res.cloudinary.com/ex91suxd/image/upload/v1791646624/Japon_7.jpg",
  "https://res.cloudinary.com/ex91suxd/image/upload/v1791646620/China_3.jpg",
  "https://res.cloudinary.com/ex91suxd/image/upload/v1791646616/Japon_3.jpg",
  "https://res.cloudinary.com/ex91suxd/image/upload/v1791646616/Japon_6.jpg",
  "https://res.cloudinary.com/ex91suxd/image/upload/v1791646615/indonesia_3.jpg",
  "https://res.cloudinary.com/ex91suxd/image/upload/v1791646615/Japon_2.jpg",
  "https://res.cloudinary.com/ex91suxd/image/upload/v1791646614/Japon_5.jpg",
  "https://res.cloudinary.com/ex91suxd/image/upload/v1791646613/Colombia_1.jpg",
  "https://res.cloudinary.com/ex91suxd/image/upload/v1791646612/Australia.jpg",
  "https://res.cloudinary.com/ex91suxd/image/upload/v1791646610/Japon_11.jpg",
  "https://res.cloudinary.com/ex91suxd/image/upload/v1791646609/China_1.jpg",
  "https://res.cloudinary.com/ex91suxd/image/upload/v1791646609/Camboya_2.jpg",
  "https://res.cloudinary.com/ex91suxd/image/upload/v1791646607/Tailandia_2.jpg",
  "https://res.cloudinary.com/ex91suxd/image/upload/v1791646604/Londres_1.jpg",
  "https://res.cloudinary.com/ex91suxd/image/upload/v1791646601/Londres_2.jpg",
  "https://res.cloudinary.com/ex91suxd/image/upload/v1791646595/China_4.jpg",
  "https://res.cloudinary.com/ex91suxd/image/upload/v1791646594/Vietnam_1.jpg",
  "https://res.cloudinary.com/ex91suxd/image/upload/v1791646593/Japon_13.jpg",
  "https://res.cloudinary.com/ex91suxd/image/upload/v1791646593/Colombia_2.jpg",
];

// Cloudinary: formato y calidad automáticos + ancho máximo para que carguen livianas
const optimize = (url: string) =>
  url.replace("/upload/", "/upload/f_auto,q_auto,w_800,c_limit/");

// "Japon_14.jpg" -> "Japon"
const altFromUrl = (url: string) => {
  const file = url.split("/").pop() ?? "";
  const name = file.replace(/\.[a-z]+$/i, "").replace(/_\d+$/, "");
  return `Detrás de cámara: ${name}`;
};

const carouselPhotos = carouselUrls.map((url) => ({
  src: optimize(url),
  alt: altFromUrl(url),
}));

function useVisible<T extends HTMLElement>(threshold: number) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useVisible<HTMLDivElement>(0.14);
  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="eyebrow">
      <span />
      {children}
    </div>
  );
}

function WordReveal({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  const ref = useVisible<HTMLDivElement>(0.25);
  return (
    <div ref={ref} className={`word-reveal ${className}`}>
      {children.split(" ").map((word, index) => (
        <span
          className="word"
          key={`${word}-${index}`}
          style={{ transitionDelay: `${index * 38}ms` }}
        >
          {word}&nbsp;
        </span>
      ))}
    </div>
  );
}

/**
 * Carrusel infinito con scroll nativo:
 * - Avanza solo (se pausa al tocar / pasar el mouse y retoma luego).
 * - Se desliza con el dedo en celular/tablet y se arrastra con el mouse.
 * - 3 copias de la lista para poder loopear en ambos sentidos sin saltos.
 */
function Carousel() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const SPEED = 0.45; // px por frame

    let raf = 0;
    let paused = false;
    let resumeTimer: number | undefined;
    let pos = 0;

    const third = () => el.scrollWidth / 3;

    // Arranca en la copia del medio para poder ir hacia atrás
    el.scrollLeft = third();
    pos = el.scrollLeft;

    const normalize = () => {
      const t = third();
      if (!t) return;
      if (el.scrollLeft >= t * 2) el.scrollLeft -= t;
      else if (el.scrollLeft < t) el.scrollLeft += t;
    };

    const pause = () => {
      paused = true;
      window.clearTimeout(resumeTimer);
    };

    const resumeLater = (ms: number) => {
      window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => {
        pos = el.scrollLeft;
        paused = false;
      }, ms);
    };

    const tick = () => {
      if (!paused) {
        const t = third();
        pos += SPEED;
        if (pos >= t * 2) pos -= t;
        el.scrollLeft = pos;
      }
      raf = requestAnimationFrame(tick);
    };

    if (!reduceMotion) raf = requestAnimationFrame(tick);

    // Táctil: scroll nativo; solo pausamos el auto-avance
    const onTouchStart = () => pause();
    const onTouchEnd = () => resumeLater(2500); // espera la inercia del swipe

    // Trackpad / rueda horizontal
    const onWheel = () => {
      pause();
      resumeLater(1500);
    };

    // Mouse: hover pausa + arrastre
    let dragging = false;
    let startX = 0;
    let startLeft = 0;

    const onPointerEnter = (e: PointerEvent) => {
      if (e.pointerType === "mouse") pause();
    };
    const onPointerLeave = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && !dragging) resumeLater(600);
    };
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      dragging = true;
      startX = e.clientX;
      startLeft = el.scrollLeft;
      el.classList.add("is-dragging");
      el.setPointerCapture(e.pointerId);
      pause();
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      el.scrollLeft = startLeft - (e.clientX - startX);
    };
    const onPointerUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      el.classList.remove("is-dragging");
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
      resumeLater(1200);
    };

    el.addEventListener("scroll", normalize, { passive: true });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    el.addEventListener("touchcancel", onTouchEnd, { passive: true });
    el.addEventListener("wheel", onWheel, { passive: true });
    el.addEventListener("pointerenter", onPointerEnter);
    el.addEventListener("pointerleave", onPointerLeave);
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resumeTimer);
      el.removeEventListener("scroll", normalize);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("pointerenter", onPointerEnter);
      el.removeEventListener("pointerleave", onPointerLeave);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
    };
  }, []);

  const total = carouselPhotos.length;
  const loop = [...carouselPhotos, ...carouselPhotos, ...carouselPhotos];

  return (
    <div className="carousel" ref={ref} aria-label="Galería detrás de escena">
      <div className="carousel-track">
        {loop.map((photo, index) => (
          <figure className="carousel-card" key={`${photo.src}-${index}`}>
            <img
              src={photo.src}
              alt={index < total ? photo.alt : ""}
              loading="lazy"
              decoding="async"
              draggable={false}
            />
            <figcaption>{String((index % total) + 1).padStart(2, "0")}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

export default function About() {
  useEffect(() => {
    const updateParallax = () =>
      document.documentElement.style.setProperty(
        "--page-scroll",
        `${Math.min(window.scrollY, window.innerHeight)}`,
      );
    updateParallax();
    window.addEventListener("scroll", updateParallax, { passive: true });
    return () => window.removeEventListener("scroll", updateParallax);
  }, []);

  return (
    <div className="about" id="nosotros">
      <section className="manifesto">
        <div className="sakura-bg" aria-hidden="true">
          <img src={disenio} alt="" />
        </div>
        <div className="grain" />
        <div className="sparkle sparkle-one">✦</div>
        <div className="sparkle sparkle-two">✧</div>
        <svg className="mobile-blossom" viewBox="0 0 64 64" aria-hidden="true">
          <path d="M32 29C24 18 28 8 32 5C37 9 40 19 32 29Z" />
          <path d="M29 32C18 24 8 28 5 32C9 37 19 40 29 32Z" />
          <path d="M35 32C46 24 56 28 59 32C55 37 45 40 35 32Z" />
          <path d="M32 35C24 46 28 56 32 59C37 55 40 45 32 35Z" />
          <circle cx="32" cy="32" r="3" />
          <path className="blossom-stem" d="M34 36C41 44 46 50 54 54" />
        </svg>
        <svg className="botanical-line" viewBox="0 0 180 260" aria-hidden="true">
          <path d="M18 252C56 201 57 136 104 78C125 52 146 29 169 9" />
          <path d="M73 144C50 134 38 112 40 87C62 94 76 112 73 144Z" />
          <path d="M108 73C107 48 122 27 146 18C147 42 134 62 108 73Z" />
        </svg>
        <div className="manifesto-content">
          <Reveal>
            <Eyebrow>Nosotros</Eyebrow>
          </Reveal>
          <Reveal delay={90}>
            <h1 className="display-title">Lo efímero se vuelve eterno</h1>
          </Reveal>
          <div className="manifesto-narrative">
            <WordReveal>
              Saku nace de la belleza efímera del Sakura. No es solo una inspiración estética. Es un símbolo, un concepto que atraviesa nuestra manera de mirar: lo efímero se vuelve eterno.
            </WordReveal>
            <WordReveal>
              Contamos historias desde adentro. Nos acercamos a cada pareja para descubrir sus gestos, sus vínculos y esos pequeños momentos que hacen que su historia sea verdaderamente propia.
            </WordReveal>
            <WordReveal>
              No hacemos films en serie. Creamos relatos audiovisuales sensibles, personalizados y con identidad, para que cada película sea tan única y auténtica como la historia que cuenta.
            </WordReveal>
            <WordReveal className="narrative-closing">
              Porque hay momentos que suceden una sola vez. Y merecen volver a sentirse.
            </WordReveal>
          </div>
        </div>
      </section>

      <section className="founders">
        <div className="founders-layout">
          <div className="founders-main">
            <Reveal>
              <Eyebrow>Los Fundadores</Eyebrow>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="section-title">Una dupla creativa</h2>
            </Reveal>
            <div className="body-copy founders-body">
              <Reveal delay={180}>
                <p>
                  Somos Erica y Matías, una dupla creativa especializada en
                  bodas. Trabajamos juntos en cada proyecto, desde la mirada
                  inicial hasta la edición final, construyendo una narrativa
                  propia.
                </p>
              </Reveal>
              <Reveal delay={280}>
                <p>
                  Nuestra experiencia trabajando en edición de bodas para
                  clientes internacionales nos permitió desarrollar una mirada
                  narrativa y un criterio audiovisual que llevamos a cada
                  historia.
                </p>
              </Reveal>
              <Reveal delay={380}>
                <p className="emphasis-line">
                  No pensamos la boda solo desde el registro. <em>Pensamos cómo contarla.</em>
                </p>
              </Reveal>
              <Reveal delay={480}>
                <p>
                  Observamos los vínculos, los gestos, las emociones y esos
                  momentos que muchas veces suceden lejos de la mirada de una
                  cámara. Cada elección —una imagen, un corte, un sonido, un
                  silencio— tiene un sentido dentro del relato.
                </p>
              </Reveal>
            </div>
          </div>
          <div className="founders-aside">
            <Reveal delay={160} className="portrait-wrap">
              <img
                className="portrait"
                src={disenio2}
                alt="Erica y Matías, dupla creativa de Saku"
              />
              <div className="portrait-caption">
                <span>Erica &amp; Matías</span>
              </div>
            </Reveal>
            <Reveal delay={300} className="quote-wrap">
              <div className="quote-mark">“</div>
              <blockquote>
                Porque no queremos hacer una película sobre una boda. Queremos
                contar la historia de quienes la están viviendo.
              </blockquote>
              <div className="quote-rule" />
            </Reveal>
          </div>
        </div>

        <div className="carousel-heading">
          <span>Detrás de cada historia</span>
          <span className="carousel-line" />
          <span>Desliza</span>
        </div>
        <Carousel />
      </section>
    </div>
  );
}