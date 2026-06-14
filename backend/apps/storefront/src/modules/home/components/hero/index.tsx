"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

const font = "var(--font-anton), 'Anton', sans-serif"

// ── Seções originais (restauradas do commit) ──────────────
const sections = [
  {
    num: "01",
    tag: "Kit Ângulo",
    title: "Ângulo extremo nos kits dianteiros. Máximo controle lateral.",
    cta: "Ver Kits",
    href: "/br/store",
    desc: "Desenvolvemos kits de ângulo para drift há mais de 10 anos. Testado em pista. BMW E36 e Chevette.",
    label: "Kit Ângulo Powerover",
    img: "/kitnagulo-png.png",
    imgMobile: "/kitnagulo-mobile.png",
    bg: "#d8d8d8",
    dark: false,
    imgFit: "contain" as const,
    imgPos: "left bottom",
    imgPadding: "0",
  },
  {
    num: "02",
    tag: "Suspensão",
    title: "Regulagem precisa. Desempenho extremo em qualquer pista.",
    cta: "Ver Suspensões",
    href: "/br/store",
    desc: "Coilovers com regulagem independente de altura e amortecimento. Desenvolvidos para drift e track. BMW E36 e Chevette.",
    label: "Suspensão Coilover Powerover",
    img: "/susp-png.png",
    imgMobile: "/susp-mobile.png",
    bg: "#888",
    dark: false,
    titleColor: "#fff",
    descColor: "#ddd",
    imgPadding: "0",
  },
  {
    num: "03",
    tag: "Câmbio",
    title: "Câmbios forjados para suportar as exigências da competição.",
    cta: "Ver Câmbios",
    href: "/br/store",
    desc: "Freio de mão hidráulico, embreagem de cerâmica, regulador de cambagem. Para Track Day e competição.",
    label: "Câmbio Clark 260F",
    img: "/cambio-png.png",
    imgMobile: "/cambio-mobile.png",
    imgFit: "contain" as const,
    imgPos: "left bottom",
    bg: "#2a2a2a",
    dark: true,
    imgPadding: "0",
  },
  {
    num: "04",
    tag: "Peças",
    title: "Peças avulsas para montar sua própria preparação.",
    cta: "Ver Peças",
    href: "/br/store",
    desc: "Componentes avulsos para você montar do seu jeito. Buchas, terminais, reguladores e muito mais.",
    label: "Peças Avulsas Powerover",
    img: "/pecas-png.png",
    imgMobile: "/pecas-mobile.png",
    bg: "#111111",
    dark: true,
    imgFit: "contain" as const,
    imgPos: "center center",
    imgPadding: "0",
  },
  {
    num: "05",
    tag: "Vestuário",
    title: "Vista a marca. Equipe completa em pista.",
    cta: "Ver Vestuário",
    href: "/br/store",
    desc: "Camisetas, moletons e acessórios Powerover Motorsports. Represente a marca dentro e fora da pista.",
    label: "Vestuário Powerover",
    img: "/vestuario-png.png",
    imgFit: "contain" as const,
    imgPos: "center center",
    bg: "#ffffff",
    dark: false,
    imgPadding: "60px 0",
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

const cars = [
  { id: "chevette", title: "Chevette", img: "/chevette-png.png", saiba: "/br/store?car=chevette", produtos: "/br/store?car=chevette" },
  { id: "bmw",      title: "BMW E36",  img: "/bmw-nova-2.png",      saiba: "/br/store?car=bmw",      produtos: "/br/store?car=bmw"      },
]

type GlitchSlice = { top: number; height: number; dx: number }

function useShake(active: boolean) {
  const [dx, setDx] = useState(0)
  useEffect(() => {
    if (!active) { setDx(0); return }
    let cancelled = false
    const rnd = (min: number, max: number) => min + Math.random() * (max - min)
    const tick = () => {
      if (cancelled) return
      setDx((Math.random() < 0.5 ? -1 : 1) * rnd(0, 3))
      setTimeout(tick, rnd(60, 140))
    }
    tick()
    return () => { cancelled = true; setDx(0) }
  }, [active])
  return dx
}

function useGlitch(active: boolean) {
  const [slices, setSlices] = useState<GlitchSlice[]>([])
  useEffect(() => {
    if (!active) { setSlices([]); return }
    let cancelled = false
    const rnd = (min: number, max: number) => min + Math.random() * (max - min)
    const doGlitch = () => {
      if (cancelled) return
      const count = 2 + Math.floor(Math.random() * 3)
      const newSlices: GlitchSlice[] = Array.from({ length: count }, () => ({
        top: rnd(5, 80), height: rnd(4, 18),
        dx: (Math.random() < 0.5 ? -1 : 1) * rnd(8, 28),
      }))
      setSlices(newSlices)
      setTimeout(() => {
        if (cancelled) return
        setSlices([])
        setTimeout(doGlitch, rnd(180, 600))
      }, rnd(50, 90))
    }
    doGlitch()
    return () => { cancelled = true; setSlices([]) }
  }, [active])
  return slices
}

export default function Hero() {
  const [hovered, setHovered] = useState<string | null>(null)
  const chevSlices = useGlitch(hovered === "chevette")
  const bmwSlices  = useGlitch(hovered === "bmw")
  const chevShake  = useShake(hovered === "chevette")
  const bmwShake   = useShake(hovered === "bmw")

  return (
    <div style={{ fontFamily: "var(--font-hanken), sans-serif", backgroundColor: "#fff" }}>
      <style>{`
        @keyframes heroFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .hero-chevette-wrap {
          animation: heroFadeIn 1.2s ease 0.3s both;
        }
        .hero-lucio-wrap {
          animation: heroFadeIn 1.2s ease 0.5s both;
        }
        .hero-bmw-wrap {
          animation: heroFadeIn 1.2s ease 0.3s both;
        }
        .hero-h1 {
          animation: heroFadeIn 0.9s ease 0.1s both;
        }
        .hero-labels {
          animation: heroFadeIn 0.9s ease 0.7s both;
        }

        /* ── RESPONSIVO ────────────────────────────────────────── */

        /* Tablet — 640px–1023px */
        @media (max-width: 1023px) {
          .hero-section { min-height: calc(80vh - 50px) !important; }
          .hero-h1 { font-size: clamp(1.6rem, 4vw, 2.8rem) !important; top: clamp(40px, 7vh, 80px) !important; }
          .hero-labels { bottom: 240px !important; }
          .hero-lucio-wrap { bottom: 30px !important; }
        }

        /* Mobile — até 639px */
        @media (max-width: 639px) {
          .hero-section { min-height: 88vw !important; height: auto !important; }

          /* H1 mobile */
          .hero-h1 {
            font-size: clamp(1.9rem, 8vw, 2.6rem) !important;
            top: 14vw !important;
            padding: 0 12px !important;
            letter-spacing: -0.5pt !important;
          }

          /* BGs ocupam 100% da largura do seu lado */
          .hero-bg-esq { width: 50% !important; }
          .hero-bg-dir { width: 50% !important; }

          /* Lúcio menor no mobile */
          .hero-lucio-wrap { bottom: 40px !important; }
          .hero-lucio-wrap img { height: clamp(180px, 45vw, 280px) !important; }

          /* Labels — próximas aos carros, mais baixas */
          .hero-labels {
            bottom: 38% !important;
          }
          .hero-labels .car-title { font-size: clamp(1.5rem, 6.5vw, 2rem) !important; }
          .car-group { align-items: center !important; }
          .hero-labels-inner { max-width: 100% !important; padding: 0 8px !important; }
          .hero-spacer { flex: 0 0 120px !important; }
          .car-link { font-size: 0.7rem !important; padding: 0 4px !important; margin: 0 !important; }
        }

        .car-img {
          filter: grayscale(1) saturate(0.5);
          transform: scale(1);
          transition: filter 0.4s ease, transform 0.4s ease;
          transform-origin: bottom center;
          object-fit: contain;
          cursor: pointer;
        }
        .car-img.active {
          filter: grayscale(0) saturate(1.2);
        }
        .car-title {
          color: #111;
          transition: color 0.3s ease;
          cursor: pointer;
          text-decoration: none !important;
          font-family: ${font};
          font-size: clamp(2.4rem, 3.8vw, 3.8rem);
          font-weight: 400;
          line-height: 1;
          margin: 0 0 2px;
          letter-spacing: 0.01em;
          display: block;
          text-align: center;
        }
        a.car-title, .car-title, .car-title:hover, .car-title:focus, .car-title:visited { text-decoration: none !important; }
        .car-title.active { color: #51c020; }
        .car-link {
          font-size: 13px; color: #555; text-decoration: none;
          margin: 0 5px; letter-spacing: 0.02em;
          border-bottom: 1px solid transparent;
          transition: color 0.2s, border-color 0.2s;
        }
        .car-link:hover { color: #51c020 !important; border-bottom-color: #51c020; text-decoration: none !important; }
        .car-group { display: flex; flex-direction: column; align-items: center; flex: 1; cursor: pointer; }
        .car-glow {
          position: absolute; inset: -60px;
          opacity: 0;
          transition: opacity 0.5s ease;
          pointer-events: none;
          z-index: 0;
        }
        .car-glow::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 50% 88%, rgba(80,210,10,0.55) 0%, rgba(60,180,0,0.2) 45%, transparent 68%);
          filter: blur(36px);
        }
        .car-glow::after {
          content: '';
          position: absolute; inset: 20px 0;
          background: radial-gradient(ellipse at 50% 92%, rgba(255,255,255,0.35) 0%, rgba(140,255,60,0.18) 30%, transparent 58%);
          filter: blur(22px);
        }
        .car-glow.active { opacity: 1; }
        /* ── PRODUCT SECTIONS ──────────────────────────────────── */
        .po-section {
          display: flex;
          height: 850px;
          max-height: 850px;
          position: relative;
        }
        .po-section-img { width: 50%; }
        .po-section-text { width: 50%; padding: 60px 72px; }
        .po-section-text h2 { font-size: 42px; }
        .po-section-watermark { font-size: clamp(4rem, 7vw, 7rem); }

        @media (max-width: 639px) {
          .po-section {
            flex-direction: column-reverse;
            height: auto;
            max-height: none;
          }
          .po-section-img { width: 100%; height: auto; min-height: 220px; }
          .po-section-img img { height: auto !important; min-height: 220px; object-fit: cover; }
          .po-section-text { width: 100%; padding: 32px 20px 40px; text-align: center; align-items: center; }
          .po-section-text > div { max-width: 280px !important; display: flex; flex-direction: column; align-items: center; margin: 0 auto; }
          .po-section-text h2 { font-size: 28px !important; }
          .po-section-watermark { font-size: 3rem !important; right: 16px !important; bottom: 10px !important; }
          .po-section-label {
            position: absolute !important;
            left: 12px !important;
            bottom: 10px !important;
            top: auto !important;
            transform: none !important;
            font-size: 9px !important;
          }
        }

        @media (min-width: 640px) and (max-width: 1023px) {
          .po-section { height: auto; max-height: none; }
          .po-section-img { height: 500px; }
          .po-section-text { padding: 40px 32px; }
          .po-section-text h2 { font-size: 32px !important; }
        }

        .testimonial-img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          filter: grayscale(100%);
          transition: filter 0.5s ease, transform 0.5s ease;
        }
        .testimonial-card:hover .testimonial-img { filter: grayscale(0%); transform: scale(1.06); }
        .testimonial-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.3) 55%, transparent 100%);
          display: flex; flex-direction: column; justify-content: flex-end;
          padding: 20px; opacity: 0; transition: opacity 0.4s ease;
        }
        .testimonial-card:hover .testimonial-overlay { opacity: 1; }
        .testimonial-overlay-quote {
          font-size: 13px; line-height: 1.55; color: rgba(255,255,255,0.92);
          margin: 0 0 10px; font-style: italic;
          transform: translateY(8px); transition: transform 0.4s ease;
        }
        .testimonial-overlay-name {
          font-size: 11px; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; color: #51c020; margin: 0;
          transform: translateY(8px); transition: transform 0.4s ease 0.05s;
        }
        .testimonial-card:hover .testimonial-overlay-quote,
        .testimonial-card:hover .testimonial-overlay-name { transform: translateY(0); }
      `}</style>

      {/* ── HERO com carros ───────────────────────────────────── */}
      <section className="hero-section" style={{
        backgroundColor: "#fff",
        position: "relative",
        overflow: "hidden",
        minHeight: "calc(95vh - 50px)",
      }}>
        {/* H1 — absoluto, overlaid no topo da section */}
        <h1 className="hero-h1" style={{
          fontFamily: font,
          fontSize: "clamp(2.16rem, 4.32vw, 4.08rem)",
          fontWeight: 400,
          color: "#111",
          textAlign: "center",
          position: "absolute",
          top: "clamp(60px, 10vh, 110px)",
          left: 0,
          right: 0,
          zIndex: 6,
          lineHeight: 1.05,
          letterSpacing: "-1pt",
          textTransform: "uppercase",
          padding: "0 24px",
          pointerEvents: "none",
        } as React.CSSProperties}>
          <span style={{ color: "#51c020" }}>Peças</span> de alta performance<br />desenvolvidas <span style={{ color: "#51c020" }}>para vencer!</span>
        </h1>

        {/* Área das imagens — preenche toda a section */}
        <div style={{ position: "absolute", inset: 0 }}>

          {/* z:1 — Fundo preto rodapé */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 160, backgroundColor: "#232323", zIndex: 1 }} />

          {/* z:2 — BG esquerdo */}
          <img src="/bg-esq.png" alt="" fetchPriority="high" decoding="async" className="hero-bg-esq"
            style={{ position: "absolute", bottom: 0, left: 0, width: "50%", height: "auto", display: "block", zIndex: 2, filter: "grayscale(1)" }} />

          {/* z:2 — BG direito */}
          <img src="/bg-dir.png" alt="" fetchPriority="high" decoding="async" className="hero-bg-dir"
            style={{ position: "absolute", bottom: 0, right: 0, width: "50%", height: "auto", display: "block", zIndex: 2, filter: "grayscale(1)" }} />

          {/* z:3 — Lucio entre bg e png-carros */}
          <div className="hero-lucio-wrap" style={{
            position: "absolute", bottom: 140, left: "50%",
            transform: "translateX(-50%)",
            zIndex: 3, pointerEvents: "none",
            display: "flex", alignItems: "flex-end",
          }}>
            <img src="/lucio-piloto.png" alt="Lucio Turossi" fetchPriority="high" decoding="async"
              style={{ height: "clamp(293px, calc(49vh), 546px)", width: "auto", display: "block" }} />
          </div>

          {/* z:4 — PNG esquerdo com glitch+shake no hover */}
          <div className="hero-bmw-wrap" style={{
            position: "absolute", top: 0, bottom: 0, left: 0, width: "50%",
            margin: 0, padding: 0, zIndex: hovered === "chevette" ? 5 : 4, overflow: "hidden",
          }}
            onClick={() => window.location.href = "/br/store?car=chevette"}>
            <img src="/png-esq.png" alt="Chevette Drift" fetchPriority="high" decoding="async"
              onMouseEnter={() => setHovered("chevette")} onMouseLeave={() => setHovered(null)}
              style={{
                position: "absolute", bottom: 0, right: 0, width: "100%", height: "auto", display: "block",
                cursor: "pointer",
                transform: hovered === "chevette" ? `translateX(${chevShake}px)` : undefined,
              }} />
            {chevSlices.map((s, i) => (
              <div key={i} style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                backgroundImage: "url(/png-esq.png)",
                backgroundSize: "100% auto", backgroundRepeat: "no-repeat", backgroundPosition: "right bottom",
                clipPath: `inset(${s.top}% 0 ${Math.max(0, 100 - s.top - s.height)}% 0)`,
                transform: `translateX(${s.dx}px)`,
              }} />
            ))}
          </div>

          {/* z:4 — PNG direito com glitch+shake no hover */}
          <div className="hero-chevette-wrap" style={{
            position: "absolute", top: 0, bottom: 0, right: 0, width: "50%",
            margin: 0, padding: 0, zIndex: hovered === "bmw" ? 5 : 4, overflow: "hidden",
          }}
            onClick={() => window.location.href = "/br/store?car=bmw"}>
            <img src="/png-dir.png" alt="BMW E36" fetchPriority="high" decoding="async"
              onMouseEnter={() => setHovered("bmw")} onMouseLeave={() => setHovered(null)}
              style={{
                position: "absolute", bottom: 0, left: 0, width: "100%", height: "auto", display: "block",
                cursor: "pointer",
                transform: hovered === "bmw" ? `translateX(${bmwShake}px)` : undefined,
              }} />
            {bmwSlices.map((s, i) => (
              <div key={i} style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                backgroundImage: "url(/png-dir.png)",
                backgroundSize: "100% auto", backgroundRepeat: "no-repeat", backgroundPosition: "left bottom",
                clipPath: `inset(${s.top}% 0 ${Math.max(0, 100 - s.top - s.height)}% 0)`,
                transform: `translateX(${s.dx}px)`,
              }} />
            ))}
          </div>

          {/* Labels Chevette / BMW — dentro do mesmo container do H1 */}
          <div className="hero-labels" style={{ position: "absolute", bottom: 418, left: 0, right: 0, zIndex: 6, pointerEvents: "none", display: "flex", justifyContent: "center" }}>
            <div className="hero-labels-inner" style={{ width: "100%", maxWidth: 900, display: "flex", padding: "0 24px" }}>
              <div className="car-group" style={{ flex: 1, pointerEvents: "auto", alignItems: "flex-start" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Link href="/br/store?car=chevette" className={`car-title${hovered === "chevette" ? " active" : ""}`} style={{ textDecoration: "none", textUnderlineOffset: 0 } as React.CSSProperties}
                    onMouseEnter={() => setHovered("chevette")} onMouseLeave={() => setHovered(null)}>Chevette</Link>
                  <div style={{ display: "flex" }}>
                    <Link href="/br/store?car=chevette" className="car-link">Saiba mais</Link>
                    <Link href="/br/store?car=chevette" className="car-link">Produtos</Link>
                  </div>
                </div>
              </div>
              <div className="hero-spacer" style={{ flex: "0 0 200px" }} />
              <div className="car-group" style={{ flex: 1, pointerEvents: "auto", alignItems: "flex-end" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Link href="/br/store?car=bmw" className={`car-title${hovered === "bmw" ? " active" : ""}`} style={{ textDecoration: "none", textUnderlineOffset: 0 } as React.CSSProperties}
                    onMouseEnter={() => setHovered("bmw")} onMouseLeave={() => setHovered(null)}>BMW E36</Link>
                  <div style={{ display: "flex" }}>
                    <Link href="/br/store?car=bmw" className="car-link">Saiba mais</Link>
                    <Link href="/br/store?car=bmw" className="car-link">Produtos</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── MARQUEE ──────────────────────────────────────────── */}
      <div style={{ backgroundColor: "#51c020", overflow: "hidden", padding: "14px 0", display: "flex" }}>
        <style>{`
          @keyframes marquee {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .marquee-track {
            display: flex;
            align-items: center;
            white-space: nowrap;
            animation: marquee 22s linear infinite;
            width: max-content;
          }
          .marquee-item {
            font-family: var(--font-hanken), 'Hanken Grotesk', sans-serif;
            font-size: 22px;
            font-weight: 400;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: #fff;
            padding: 0 32px;
          }
          .marquee-dot {
            width: 6px; height: 6px;
            background: rgba(255,255,255,0.5);
            border-radius: 50%;
            display: inline-block;
            flex-shrink: 0;
          }
          @media (max-width: 639px) {
            .marquee-item { padding: 0 12px !important; font-size: 11px !important; }
          }
          @media (max-width: 639px) {
            .hero-bmw-wrap { width: 100% !important; overflow: visible !important; }
            .hero-bmw-wrap img { right: 50% !important; left: auto !important; width: 60% !important; }
            .hero-chevette-wrap { width: 100% !important; overflow: visible !important; }
            .hero-chevette-wrap img { left: 50% !important; right: auto !important; width: 60% !important; }
            .hero-bg-esq { right: 50% !important; left: auto !important; width: 60% !important; }
            .hero-bg-dir { left: 50% !important; right: auto !important; width: 60% !important; }
          }
        `}</style>
        <div className="marquee-track">
          {[...Array(2)].map((_, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center" }}>
              <span className="marquee-item">Suspensão</span><span className="marquee-dot"/>
              <span className="marquee-item">Câmbio</span><span className="marquee-dot"/>
              <span className="marquee-item">Kit Ângulo BMW E36</span><span className="marquee-dot"/>
              <span className="marquee-item">Kit Ângulo Chevette</span><span className="marquee-dot"/>
              <span className="marquee-item">Freio de Mão Hidráulico</span><span className="marquee-dot"/>
              <span className="marquee-item">Coilover Powerover</span><span className="marquee-dot"/>
              <span className="marquee-item">Embreagem Cerâmica</span><span className="marquee-dot"/>
              <span className="marquee-item">Kit Ângulo</span><span className="marquee-dot"/>
              <span className="marquee-item">Powerover Motorsports</span><span className="marquee-dot"/>
            </span>
          ))}
        </div>
      </div>

      {/* ── NUMBERED SECTIONS (originais) ────────────────────── */}
      {sections.map((s) => (
        <section key={s.num} className="po-section" style={{ backgroundColor: s.bg, position: "relative" }}>
          <div className="po-section-img" style={{ position: "relative", overflow: "hidden", padding: s.imgPadding, boxSizing: "border-box" }}>
            <span className="po-section-label" style={{
              position: "absolute", left: 16, top: "50%",
              transform: "translateY(-50%) rotate(-90deg)",
              fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase",
              color: s.dark ? "#666" : "#aaa", whiteSpace: "nowrap", zIndex: 2,
            }}>{s.label}</span>
            <picture style={{ width: "100%", height: "100%", display: "block" }}>
              {(s as any).imgMobile && (
                <source media="(max-width: 639px)" srcSet={(s as any).imgMobile} />
              )}
              <img src={s.img} alt={s.label} style={{ width: "100%", height: "100%", objectFit: (s as any).imgFit ?? "cover", objectPosition: (s as any).imgPos ?? "left bottom", display: "block" }} />
            </picture>
          </div>

          <div className="po-section-text" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ maxWidth: 380 }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#51c020", marginBottom: 14 }}>
                {s.tag}
              </p>
              <h2 style={{ fontFamily: font, fontWeight: 700, lineHeight: 1.15, color: (s as any).titleColor ?? (s.dark ? "#fff" : "#111"), marginBottom: 24, textWrap: "balance" } as React.CSSProperties}>
                {s.title}
              </h2>
              <Link href={s.href} className="po-btn" style={{
                display: "inline-block", background: "#51c020", color: "#fff",
                fontWeight: 700, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase",
                padding: "12px 22px", marginBottom: 24, textDecoration: "none",
              }}>{s.cta}</Link>
              <p style={{ fontSize: 14, fontWeight: 400, lineHeight: 1.4, color: (s as any).descColor ?? (s.dark ? "#aaa" : "#777") }}>{s.desc}</p>
            </div>
          </div>
          <span className="po-section-watermark" style={{
            position: "absolute", bottom: 20, right: 32,
            fontWeight: 900, fontStyle: "italic", lineHeight: 1,
            color: s.dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
            userSelect: "none", pointerEvents: "none", fontFamily: font,
            textTransform: "uppercase", letterSpacing: "-0.02em",
          }}>{s.tag}</span>
        </section>
      ))}

      {/* ── TESTIMONIALS (originais) ──────────────────────────── */}
      <section style={{ backgroundColor: "#f0f0f0", padding: "80px 0 0" }}>
        <div style={{ textAlign: "center", padding: "0 40px 60px" }}>
          <h2 style={{ fontSize: 42, fontWeight: 800, color: "#111", marginBottom: 12, fontFamily: font }}>
            Depoimentos de mais de 10 anos de sucesso
          </h2>
          <p style={{ fontSize: 14, color: "#666", marginBottom: 48 }}>Quem usou nossas peças e aprovou em pista.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
          {testimonials.map((t) => (
            <div key={t.name} className="testimonial-card">
              <div style={{ overflow: "hidden", aspectRatio: "1/1", position: "relative" }}>
                <img src={t.img} alt={t.name} className="testimonial-img"
                  onError={(e) => { (e.target as HTMLImageElement).style.background = "#ccc" }} />
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
        padding: "96px 40px",
        display: "flex", justifyContent: "center", alignItems: "center",
        position: "relative", overflow: "hidden",
        backgroundColor: "#0f0f0f",
      }}>
        {/* Vimeo background — mudo, loop, sem controles */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden",
        }}>
          <iframe
            src="https://player.vimeo.com/video/1201088427?background=1&autoplay=1&loop=1&muted=1&controls=0&title=0&byline=0&portrait=0"
            style={{
              position: "absolute",
              top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              width: "177.78vh",
              minWidth: "100%",
              height: "56.25vw",
              minHeight: "100%",
              border: "none",
              opacity: 0.18,
            }}
            allow="autoplay; fullscreen"
            allowFullScreen
            loading="lazy"
          />
        </div>
        {/* overlay escuro para garantir legibilidade */}
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1, pointerEvents: "none" }} />
        <div style={{ textAlign: "center", maxWidth: 560, width: "100%", position: "relative", zIndex: 2 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "#51c020", marginBottom: 20 }}>
            PowerOver Motorsports Factory
          </p>
          <div style={{ width: 40, height: 2, backgroundColor: "#51c020", margin: "0 auto 24px" }} />
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 400, color: "#fff", marginBottom: 20, fontFamily: font, lineHeight: 1.1, textTransform: "uppercase" }}>
            Pronto para andar<br /><span style={{ color: "#51c020" }}>NO LIMITE?</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.8, maxWidth: 380, margin: "0 auto 40px" }}>
            Fabricação nacional. Peças para drift e track desenvolvidas em pista. Frete para todo o Brasil.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/br/store" className="po-btn" style={{
              display: "inline-block", background: "#51c020", color: "#fff",
              fontWeight: 700, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase",
              padding: "15px 44px", textDecoration: "none",
            }}>Ver Catálogo Completo →</Link>
            <Link href="/br/contato" className="po-btn" style={{
              display: "inline-block", backgroundColor: "transparent", color: "rgba(255,255,255,0.7)",
              fontWeight: 700, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase",
              padding: "15px 36px", textDecoration: "none", border: "1px solid rgba(255,255,255,0.2)",
            }}>Falar com a equipe</Link>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 40, marginTop: 56, paddingTop: 40, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            {[{ num: "17+", label: "Produtos" }, { num: "100%", label: "Nacional" }, { num: "12x", label: "Sem juros" }].map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#51c020", fontFamily: font }}>{s.num}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
