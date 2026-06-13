"use client"
import Link from "next/link"

const font = "var(--font-montserrat), 'Montserrat', sans-serif"

const sections = [
  {
    num: "01",
    tag: "Drift",
    title: "Ângulo extremo nos kits dianteiros. Máximo controle lateral e traseiro.",
    cta: "Peças de Drift",
    href: "/br/store",
    desc: "Desenvolvemos kits de ângulo e suspensão para drift há mais de 10 anos. Testado em pista. BMW E36 e Chevette.",
    label: "Kit Ângulo BMW E36",
    img: "https://www.wisefab.com/media/amasty/webp/wysiwyg/drift_opt-min-4_png.webp",
    bg: "#d8d8d8",
    dark: false,
    imgPadding: "60px 0",
  },
  {
    num: "02",
    tag: "Track",
    title: "Projetado para corrida com leveza e ampla faixa de ajuste.",
    cta: "Peças de Track",
    href: "/br/store",
    desc: "Freio de mão hidráulico, embreagem de cerâmica, regulador de cambagem. Para Track Day e competição.",
    label: "Freio de Mão Hidráulico",
    img: "https://www.wisefab.com/media/amasty/webp/wysiwyg/circuit_1-min1_png.webp",
    bg: "#888",
    dark: true,
    imgPadding: "0",
  },
  {
    num: "03",
    tag: "Preparação",
    title: "Design robusto para suportar as exigências da competição.",
    cta: "Ver Produtos",
    href: "/br/store",
    desc: "Câmbios forjados, coilover com regulagem independente, reforços estruturais. Cada peça montada por encomenda.",
    label: "Câmbio Clark 260F",
    img: "https://www.wisefab.com/media/wysiwyg/rally-min1.png",
    bg: "#2a2a2a",
    dark: true,
    imgPadding: "60px 0",
  },
  {
    num: "04",
    tag: "Peças Avulsas",
    title: "Cada erro que você comete, cada peça que você quebra...",
    cta: "Ver Catálogo",
    href: "/br/store",
    desc: "Peças avulsas disponíveis para todos os nossos kits, até o menor parafuso. Entregamos em todo Brasil.",
    label: "Acessórios Powerover",
    img: "/kit-angulo-bmw.jpg",
    bg: "#ffffff",
    dark: false,
    imgPadding: "0",
  },
]

const testimonials = [
  {
    name: "Rodrigo M.",
    role: "Piloto de Drift — BMW E36",
    text: "O kit de ângulo da Powerover transformou meu carro. Ângulo insano, peça bem acabada, suporte técnico de verdade.",
    img: "https://images.unsplash.com/photo-1547245324-d777c6f05e80?w=600&h=600&fit=crop",
  },
  {
    name: "Carlos T.",
    role: "Track Day — Chevette",
    text: "Comprei a suspensão coilover e a diferença em pista foi imediata. Regulagem independente de altura, sem igual.",
    img: "https://images.unsplash.com/photo-1612544448445-b8232cff3b6c?w=600&h=600&fit=crop",
  },
  {
    name: "Felipe S.",
    role: "Formula Drift BR",
    text: "Câmbio Clark forjado aguentou uma temporada inteira sem falha. Qualidade de competição, fabricação nacional.",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop",
  },
  {
    name: "Lucas R.",
    role: "Rally — Mitsubishi",
    text: "Produto com acabamento de nível internacional. Instalei sozinho em 2 horas, encaixou perfeito no meu Evo.",
    img: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&h=600&fit=crop",
  },
]

export default function Hero() {
  return (
    <div style={{ fontFamily: font, backgroundColor: "#fff" }}>
      <style>{`
        .testimonial-img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          filter: grayscale(100%);
          transition: filter 0.5s ease, transform 0.5s ease;
        }
        .testimonial-card:hover .testimonial-img {
          filter: grayscale(0%);
          transform: scale(1.06);
        }
        .testimonial-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.3) 55%, transparent 100%);
          display: flex; flex-direction: column; justify-content: flex-end;
          padding: 20px;
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .testimonial-card:hover .testimonial-overlay {
          opacity: 1;
        }
        .testimonial-overlay-quote {
          font-size: 13px; line-height: 1.55; color: rgba(255,255,255,0.92);
          margin: 0 0 10px; font-style: italic;
          transform: translateY(8px);
          transition: transform 0.4s ease;
        }
        .testimonial-overlay-name {
          font-size: 11px; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; color: #7ac142; margin: 0;
          transform: translateY(8px);
          transition: transform 0.4s ease 0.05s;
        }
        .testimonial-card:hover .testimonial-overlay-quote,
        .testimonial-card:hover .testimonial-overlay-name {
          transform: translateY(0);
        }
      `}</style>

      {/* ── HERO (Wisefab layout exato) ──────────────────────── */}
      <section style={{ width: "100%", textAlign: "center", backgroundColor: "#fff", height: 950, overflow: "hidden", position: "relative" }}>

        {/* Title */}
        <h1 style={{
          fontSize: 50,
          fontWeight: 800,
          color: "#111",
          lineHeight: 1.15,
          padding: "150px 20px 40px",
          margin: 0,
          fontFamily: font,
        }}>
          Peças de alta performance desenvolvidas para vencer!
        </h1>

        {/* Category links — exato como Wisefab: margin 80px top/bottom, padding lateral */}
        <div style={{
          width: "100%",
          margin: "50px 0 45px",
          padding: "0 170px",
          boxSizing: "border-box",
          display: "flex",
        }}>
          {[
            { name: "Drift", href: "/br/store" },
            { name: "Track", href: "/br/store" },
            { name: "Preparação", href: "/br/store" },
          ].map((cat) => (
            <div key={cat.name} style={{ flex: "1", textAlign: "center" }}>
              <span data-hover="true" style={{
                fontSize: 50,
                display: "block",
                fontWeight: 800,
                color: "#111",
                marginBottom: 8,
                fontFamily: font,
                lineHeight: 1.1,
                transition: "color 0.2s",
              }}
                onMouseEnter={e => (e.currentTarget.style.color = "#7ac142")}
                onMouseLeave={e => (e.currentTarget.style.color = "#111")}
              >
                {cat.name}
              </span>
              {["Saiba mais", "Produtos"].map((label) => (
                <a
                  key={label}
                  href={cat.href}
                  style={{ margin: "0 10px", fontSize: 13, color: "#333", textDecoration: "none", textUnderlineOffset: 3 }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#7ac142"; e.currentTarget.style.textDecoration = "underline" }}
                  onMouseLeave={e => { e.currentTarget.style.color = "#333"; e.currentTarget.style.textDecoration = "none" }}
                >
                  {label}
                </a>
              ))}
            </div>
          ))}
        </div>

        {/* Images — ancoradas no bottom da section */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: 550,
          overflow: "hidden",
        }}>
          {/* Drift — esquerda, z-index 1 (na frente) */}
          <div style={{ position: "absolute", width: "100%", bottom: 0, minHeight: 700, left: 0, maxWidth: "70%", zIndex: 1 }}>
            <img
              src="https://www.wisefab.com/media/wysiwyg/1-min.png"
              alt="Drift"
              style={{ position: "absolute", bottom: 0, left: "20%", maxHeight: 450 }}
            />
          </div>
          {/* Track — centro */}
          <div style={{ position: "absolute", width: "100%", bottom: 0, minHeight: 700 }}>
            <img
              src="https://www.wisefab.com/media/wysiwyg/2-min.png"
              alt="Track"
              style={{ position: "absolute", bottom: 0, left: "50%", marginLeft: -350, maxHeight: 450 }}
            />
          </div>
          {/* Rally/Preparação — direita */}
          <div style={{ position: "absolute", width: "100%", bottom: 0, minHeight: 700, right: 0, maxWidth: "70%" }}>
            <img
              src="https://www.wisefab.com/media/wysiwyg/3-min.png"
              alt="Preparação"
              style={{ position: "absolute", bottom: 0, right: "-5%", maxHeight: 450 }}
            />
          </div>
        </div>
      </section>

      {/* ── NUMBERED SECTIONS ────────────────────────────────── */}
      {sections.map((s, i) => {
        const imgLeft = true
        return (
          <section key={s.num} style={{
            backgroundColor: s.bg,
            display: "flex",
            height: 850,
            maxHeight: 850,
          }}>
            {/* Imagem — 50% */}
            <div style={{ width: "50%", order: imgLeft ? 0 : 1, position: "relative", overflow: "hidden", padding: s.imgPadding, boxSizing: "border-box" }}>
              <span style={{
                position: "absolute", left: 16, top: "50%",
                transform: "translateY(-50%) rotate(-90deg)",
                fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase",
                color: s.dark ? "#666" : "#aaa", whiteSpace: "nowrap", zIndex: 2,
              }}>
                {s.label}
              </span>
              <img src={s.img} alt={s.label} style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "left center", display: "block" }} />
            </div>

            {/* Texto — 50%, conteúdo em max-width ~350px */}
            <div style={{
              width: "50%",
              order: imgLeft ? 1 : 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "60px 72px",
              position: "relative",
            }}>
              <div style={{ maxWidth: 380 }}>
                <p style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.15em",
                  textTransform: "uppercase", color: "#7ac142", marginBottom: 14,
                }}>
                  {s.tag}
                </p>
                <h2 style={{
                  fontSize: 42,
                  fontWeight: 700,
                  lineHeight: 1.15,
                  color: s.dark ? "#fff" : "#111",
                  marginBottom: 24,
                  fontFamily: font,
                  textWrap: "balance",
                } as React.CSSProperties}>
                  {s.title}
                </h2>
                <Link href={s.href} style={{
                  display: "inline-block", backgroundColor: "#7ac142", color: "#fff",
                  fontWeight: 700, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase",
                  padding: "12px 22px", marginBottom: 24, textDecoration: "none",
                }}>
                  {s.cta}
                </Link>
                <p style={{
                  fontSize: 14, fontWeight: 400, lineHeight: 1.8,
                  color: s.dark ? "#aaa" : "#777",
                }}>
                  {s.desc}
                </p>
              </div>

              {/* Número — itálico, posicionado no canto inferior direito */}
              <span style={{
                position: "absolute", bottom: 20, right: 60,
                fontSize: "clamp(7rem, 12vw, 11rem)",
                fontWeight: 900,
                fontStyle: "italic",
                lineHeight: 1,
                color: s.dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                userSelect: "none",
                pointerEvents: "none",
                fontFamily: font,
              }}>
                {s.num}
              </span>
            </div>
          </section>
        )
      })}

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section style={{ backgroundColor: "#f0f0f0", padding: "80px 0 0" }}>
        <div style={{ textAlign: "center", padding: "0 40px 60px" }}>
          <h2 style={{ fontSize: 42, fontWeight: 800, color: "#111", marginBottom: 12, fontFamily: font }}>
            Depoimentos de mais de 10 anos de sucesso
          </h2>
          <p style={{ fontSize: 14, color: "#666", marginBottom: 48 }}>
            Quem usou nossas peças e aprovou em pista.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 48 }}>
            {["Drift", "Track", "Preparação"].map((cat) => (
              <span key={cat} data-hover="true" style={{
                fontSize: 28, fontWeight: 800, fontFamily: font,
                color: "#111", transition: "color 0.2s",
              }}
                onMouseEnter={e => (e.currentTarget.style.color = "#7ac142")}
                onMouseLeave={e => (e.currentTarget.style.color = "#111")}
              >{cat}</span>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
          {testimonials.map((t) => (
            <div key={t.name} className="testimonial-card">
              <div style={{ overflow: "hidden", aspectRatio: "1/1", position: "relative" }}>
                <img src={t.img} alt={t.name}
                  className="testimonial-img"
                  onError={(e) => { (e.target as HTMLImageElement).style.background = "#ccc" }}
                />
                <div className="testimonial-overlay">
                  <p className="testimonial-overlay-quote">"{t.text}"</p>
                  <p className="testimonial-overlay-name">{t.name} · {t.role}</p>
                </div>
              </div>
              <div style={{ padding: "20px 24px", backgroundColor: "#f0f0f0" }}>
                <p style={{ fontWeight: 700, fontSize: 16, color: "#111", marginBottom: 4, fontFamily: font }}>{t.name}</p>
                <p style={{ fontSize: 13, color: "#666" }}>{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────── */}
      <section style={{
        backgroundColor: "#7ac142",
        padding: "72px 40px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
        {/* Card preto centralizado */}
        <div style={{
          backgroundColor: "#0d0d0d",
          padding: "52px 72px",
          textAlign: "center",
          maxWidth: 640,
          width: "100%",
          boxShadow: "0 24px 64px rgba(0,0,0,0.35)",
        }}>
          {/* Eyebrow */}
          <p style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.22em",
            textTransform: "uppercase", color: "#7ac142", marginBottom: 16,
          }}>
            PowerOver Motorsports Factory
          </p>

          <h2 style={{
            fontSize: "clamp(1.6rem, 3vw, 2.6rem)",
            fontWeight: 800, color: "#fff",
            marginBottom: 14, fontFamily: font, lineHeight: 1.15,
          }}>
            Pronto para andar no limite?
          </h2>

          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, marginBottom: 36, lineHeight: 1.6 }}>
            17 produtos disponíveis. Fabricação nacional.<br />Frete para todo o Brasil.
          </p>

          <Link href="/br/store" style={{
            display: "inline-block", backgroundColor: "#7ac142", color: "#fff",
            fontWeight: 800, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase",
            padding: "14px 44px", textDecoration: "none",
            transition: "background 0.2s",
          }}
            onMouseEnter={e => ((e.target as HTMLElement).style.backgroundColor = "#69aa38")}
            onMouseLeave={e => ((e.target as HTMLElement).style.backgroundColor = "#7ac142")}
          >
            Ver Catálogo Completo →
          </Link>
        </div>
      </section>
    </div>
  )
}
