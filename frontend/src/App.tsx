import { useState } from 'react'
import Intro from './components/Intro'
import SakuraPetals from './components/SakuraPetals'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Manifesto from './components/Manifesto'
import FilmsCarousel from './components/FilmsCarousel'
import About from './components/About'
import Films from './components/Films'
import Destination from './components/Destination'
import Services from './components/Services'
import Contact from './components/Contact'
import CtaFinal from './components/CtaFinal'
import Footer from './components/Footer'
import CtaIntermediate from './components/CtaIntermediate'

export default function App() {
  const [ready, setReady] = useState(false)

  return (
    <>
      {!ready && <Intro onComplete={() => setReady(true)} />}
      <div
        style={{
          opacity: ready ? 1 : 0,
          transition: 'opacity 0.8s ease',
          minHeight: '100%',
        }}
      >
        <SakuraPetals />
        <Navbar />
        <main>
          <Hero />
          <Manifesto />
          <FilmsCarousel />
          <About />
          <Films />
          <Destination />
          <Services />
          <CtaIntermediate />
          <Contact />
          <CtaFinal />
        </main>
        <Footer />
      </div>
    </>
  )
}
