import { useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useSettings } from '../hooks/useSettings'

const COVERAGE_OPTIONS = [
  'Wedding Film completo',
  'Trailer',
  'Highlights',
  'Fotografía',
  'Fotografía + Film',
  'Destination Wedding',
  'Content Creation',
]

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default function Contact() {
  const [form, setForm] = useState({
    nombre: '',
    pareja: '',
    email: '',
    whatsapp: '',
    fecha: '',
    lugar: '',
    cobertura: '',
    mensaje: '',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const settings = useSettings()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('request failed')
      setStatus('sent')
      setForm({ nombre: '', pareja: '', email: '', whatsapp: '', fecha: '', lugar: '', cobertura: '', mensaje: '' })
    } catch {
      setStatus('error')
    }
  }

  const titleRef = useScrollReveal<HTMLDivElement>()
  const formRef = useScrollReveal<HTMLDivElement>()

  // Redes: las carga el cliente desde el panel admin. Las vacías no se muestran.
  const whatsappHref = settings.whatsapp
    ? `https://wa.me/${settings.whatsapp}${
        settings.whatsappMessage ? `?text=${encodeURIComponent(settings.whatsappMessage)}` : ''
      }`
    : ''

  const socialLinks = [
    { label: 'WhatsApp', href: whatsappHref },
    { label: 'Instagram', href: settings.instagram },
    { label: 'Facebook', href: settings.facebook },
    { label: 'TikTok', href: settings.tiktok },
    { label: 'YouTube', href: settings.youtube },
    { label: 'Vimeo', href: settings.vimeo },
    { label: 'Email', href: 'mailto:hola@sakufilms.com' },
  ].filter((s) => s.href)

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 0',
    border: 'none',
    borderBottom: '1px solid #C98F8760',
    backgroundColor: 'transparent',
    fontFamily: "'Manrope', sans-serif",
    fontWeight: 300,
    fontSize: '0.88rem',
    color: '#69483F',
    outline: 'none',
    letterSpacing: '0.02em',
    transition: 'border-color 0.3s ease',
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: "'Manrope', sans-serif",
    fontSize: '0.58rem',
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color: '#B8756B',
    display: 'block',
    marginBottom: '6px',
  }

  return (
    <section
      id="contacto"
      style={{
        backgroundColor: '#E8D4CE',
        padding: 'clamp(70px, 10vw, 130px) clamp(24px, 8vw, 100px)',
        scrollMarginTop: '72px',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'clamp(40px, 8vw, 100px)',
          maxWidth: '1100px',
          margin: '0 auto',
        }}
      >
        {/* Left: intro text */}
        <div ref={titleRef} className="reveal">
          <div
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: '0.58rem',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: '#B8756B',
              marginBottom: '20px',
            }}
          >
            Reservá tu fecha
          </div>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 400,
              fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)',
              color: '#69483F',
              lineHeight: 1.2,
              marginBottom: '24px',
            }}
          >
            Tu historia<br />
            <em style={{ fontStyle: 'italic' }}>empieza aquí.</em>
          </h2>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: '1.1rem',
              color: '#69483F',
              opacity: 0.75,
              lineHeight: 1.65,
              marginBottom: '48px',
            }}
          >
            Contanos sobre tu boda. Te responderemos en menos de 24 horas para confirmar disponibilidad y enviarte los detalles de tu paquete.
          </p>

          {/* Social links (desde el backend) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {socialLinks.map((s) => {
              const external = s.href.startsWith('http')
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid #C98F8740',
                    paddingBottom: '14px',
                    textDecoration: 'none',
                    color: '#69483F',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Manrope', sans-serif",
                      fontWeight: 500,
                      fontSize: '0.78rem',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {s.label}
                  </span>
                  <span style={{ color: '#B8756B' }}>→</span>
                </a>
              )
            })}
          </div>
        </div>

        {/* Right: form */}
        <div ref={formRef} className="reveal reveal-d2">
          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Nombre</label>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderBottomColor = '#69483F' }}
                  onBlur={(e) => { e.currentTarget.style.borderBottomColor = '#C98F8760' }}
                />
              </div>
              <div>
                <label style={labelStyle}>Pareja</label>
                <input
                  type="text"
                  placeholder="Nombre de la pareja"
                  value={form.pareja}
                  onChange={(e) => setForm({ ...form, pareja: e.target.value })}
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderBottomColor = '#69483F' }}
                  onBlur={(e) => { e.currentTarget.style.borderBottomColor = '#C98F8760' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderBottomColor = '#69483F' }}
                  onBlur={(e) => { e.currentTarget.style.borderBottomColor = '#C98F8760' }}
                />
              </div>
              <div>
                <label style={labelStyle}>WhatsApp</label>
                <input
                  type="tel"
                  placeholder="+54 9 11 ..."
                  value={form.whatsapp}
                  onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderBottomColor = '#69483F' }}
                  onBlur={(e) => { e.currentTarget.style.borderBottomColor = '#C98F8760' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Fecha de boda</label>
                <input
                  type="text"
                  placeholder="DD / MM / AAAA"
                  value={form.fecha}
                  onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderBottomColor = '#69483F' }}
                  onBlur={(e) => { e.currentTarget.style.borderBottomColor = '#C98F8760' }}
                />
              </div>
              <div>
                <label style={labelStyle}>Lugar</label>
                <input
                  type="text"
                  placeholder="Ciudad o destino"
                  value={form.lugar}
                  onChange={(e) => setForm({ ...form, lugar: e.target.value })}
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderBottomColor = '#69483F' }}
                  onBlur={(e) => { e.currentTarget.style.borderBottomColor = '#C98F8760' }}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Tipo de cobertura</label>
              <select
                value={form.cobertura}
                onChange={(e) => setForm({ ...form, cobertura: e.target.value })}
                style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
              >
                <option value="">Seleccioná una opción</option>
                {COVERAGE_OPTIONS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Mensaje</label>
              <textarea
                placeholder="Contanos su historia..."
                value={form.mensaje}
                onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                rows={4}
                style={{
                  ...inputStyle,
                  resize: 'none',
                  paddingTop: '10px',
                }}
                onFocus={(e) => { e.currentTarget.style.borderBottomColor = '#69483F' }}
                onBlur={(e) => { e.currentTarget.style.borderBottomColor = '#C98F8760' }}
              />
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 500,
                fontSize: '0.68rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                padding: '16px 40px',
                backgroundColor: '#69483F',
                color: '#F0E1DA',
                border: 'none',
                cursor: status === 'sending' ? 'default' : 'pointer',
                opacity: status === 'sending' ? 0.7 : 1,
                alignSelf: 'flex-start',
                transition: 'background-color 0.35s ease, transform 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#B8756B'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#69483F'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              {status === 'sending' ? 'Enviando...' : 'Enviar consulta'}
            </button>
            {status === 'sent' && (
              <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.8rem', color: '#69483F' }}>
                Gracias, recibimos tu consulta. Te vamos a contactar pronto.
              </p>
            )}
            {status === 'error' && (
              <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: '0.8rem', color: '#b33' }}>
                No pudimos enviar tu consulta. Probá de nuevo en unos minutos.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}