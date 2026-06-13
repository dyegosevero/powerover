"use client"

import { useState, useEffect, useRef } from "react"
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
    bg: "#888",
    dark: false,
    titleColor: "#111",
    descColor: "#333",
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
  { id: "chevette", title: "Chevette", img: "/chevette-png.png", saiba: "/br/store?q=chevette", produtos: "/br/store?q=chevette" },
  { id: "bmw",      title: "BMW E36",  img: "/bmw-nova-2.png",      saiba: "/br/store?q=bmw",      produtos: "/br/store?q=bmw"      },
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

      // 2–4 random horizontal slices shifted left or right
      const count = 2 + Math.floor(Math.random() * 3)
      const newSlices: GlitchSlice[] = Array.from({ length: count }, () => ({
        top: rnd(5, 80),
        height: rnd(4, 18),
        dx: (Math.random() < 0.5 ? -1 : 1) * rnd(8, 28),
      }))
      setSlices(newSlices)

      // hold for 50–90ms then clear
      setTimeout(() => {
        if (cancelled) return
        setSlices([])
        // next burst after a random pause — shorter early, longer later
        const gap = rnd(180, 600)
        setTimeout(doGlitch, gap)
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
  const bmwSlices = useGlitch(hovered === "bmw")
  const chevShake = useShake(hovered === "chevette")
  const bmwShake = useShake(hovered === "bmw")

  return (
    <div style={{ fontFamily: "var(--font-hanken), sans-serif", backgroundColor: "#fff" }}>
      <style>{`
        @keyframes slideLeftFadeIn {
          from { opacity: 0; transform: translateX(-40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideRightFadeIn {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideTopFadeIn {
          from { opacity: 0; transform: translateX(calc(-50% + 20px)) translateY(-30px); }
          to   { opacity: 1; transform: translateX(calc(-50% + 20px)) translateY(0); }
        }
        .hero-chevette-wrap {
          animation: slideLeftFadeIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .hero-lucio-wrap {
          animation: slideTopFadeIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both;
        }
        .hero-bmw-wrap {
          animation: slideRightFadeIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.05s both;
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
          font-family: ${font};
          font-size: clamp(2.4rem, 3.8vw, 3.8rem);
          font-weight: 400;
          line-height: 1;
          margin: 0 0 10px;
          letter-spacing: 0.01em;
          display: block;
          text-align: center;
        }
        .car-title.active { color: #51c020; }
        .car-link {
          font-size: 13px; color: #555; text-decoration: none;
          margin: 0 10px; letter-spacing: 0.02em;
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
      <section style={{
        backgroundColor: "#fff",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        minHeight: "calc(95vh - 50px)",
      }}>
        {/* H1 — uppercase, 2 linhas */}
        <h1 style={{
          fontFamily: font,
          fontSize: "clamp(2rem, 4vw, 3.8rem)",
          fontWeight: 400,
          color: "#111",
          textAlign: "center",
          margin: "114px auto 0",
          lineHeight: 1.05,
          maxWidth: "90%",
          letterSpacing: "-1pt",
          textTransform: "uppercase",
          padding: "0 24px",
        } as React.CSSProperties}>
          <span style={{ color: "#51c020" }}>Peças</span> de alta performance<br />desenvolvidas <span style={{ color: "#51c020" }}>para vencer!</span>
        </h1>

        {/* Espaço flexível entre título e área dos carros */}
        <div style={{ flexGrow: 1 }} />

        {/* Área das imagens + labels juntos no bottom */}
        <div style={{ width: "100%", position: "relative", height: "52vh", minHeight: 360 }}>
          {/* Barra preta no rodapé */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 160, backgroundColor: "#232323", zIndex: 0 }} />

          {/* Labels posicionados acima dos carros */}
          <div style={{ position: "absolute", bottom: "calc(28vh + 82px)", left: "15%", right: "15%", display: "flex", zIndex: 4 }}>
            {cars.map((car) => (
              <div key={car.id} className="car-group"
                style={{ paddingTop: 12, paddingBottom: 10 }}
                onMouseEnter={() => setHovered(car.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <span className={`car-title${hovered === car.id ? " active" : ""}`}>{car.title}</span>
                <div>
                  <Link href={car.saiba} className="car-link">Saiba mais</Link>
                  <Link href={car.produtos} className="car-link">Produtos</Link>
                </div>
              </div>
            ))}
          </div>

          {/* Lucio — centro, atrás dos carros */}
          <div className="hero-lucio-wrap" style={{
            position: "absolute", bottom: 160, left: "50%",
            zIndex: 1, pointerEvents: "none",
            display: "flex", alignItems: "flex-end",
          }}>
            <Image src="/lucio-png-2.png" alt="Lucio Turossi" width={340} height={520}
              style={{ height: "clamp(280px, calc(40.5vh + 25px), 490px)", width: "auto", display: "block" }}
              priority unoptimized />
          </div>

          {/* Chevette — esquerda */}
          <div className="hero-chevette-wrap" style={{ position: "absolute", bottom: 10, left: "2%", right: "50%", display: "flex", justifyContent: "flex-end", zIndex: hovered === "chevette" ? 3 : 1 }}
            onMouseEnter={() => setHovered("chevette")} onMouseLeave={() => setHovered(null)}>
            <div className={`car-glow${hovered === "chevette" ? " active" : ""}`} />
            <div style={{ position: "relative", zIndex: 1, height: "clamp(190px, calc(28vh + 10px), 290px)", flexShrink: 0 }}>
              <Image src="/chevette-novo-2.png" alt="Chevette Drift" width={480} height={260}
                className={`car-img${hovered === "chevette" ? " active" : ""}`}
                style={{ width: "auto", height: "100%", display: "block", transform: hovered === "chevette" ? `translateX(${chevShake}px) scale(1.06)` : undefined }}
                priority unoptimized />
              {chevSlices.map((s, i) => (
                <div key={i} style={{
                  position: "absolute", inset: 0, pointerEvents: "none",
                  backgroundImage: "url(/chevette-novo-2.png)",
                  backgroundSize: "auto 100%", backgroundRepeat: "no-repeat", backgroundPosition: "right bottom",
                  clipPath: `inset(${s.top}% 0 ${Math.max(0, 100 - s.top - s.height)}% 0)`,
                  transform: `translateX(${s.dx}px)`,
                }} />
              ))}
            </div>
          </div>

          {/* BMW direita */}
          <div className="hero-bmw-wrap" style={{ position: "absolute", bottom: 9, left: "calc(50% - 40px)", right: "2%", display: "flex", justifyContent: "flex-start", zIndex: hovered === "bmw" ? 3 : 2 }}
            onMouseEnter={() => setHovered("bmw")} onMouseLeave={() => setHovered(null)}>
            <div className={`car-glow${hovered === "bmw" ? " active" : ""}`} />
            <div style={{ position: "relative", zIndex: 1, height: "clamp(180px, 28vh, 280px)", flexShrink: 0 }}>
              <Image src="/bmw-nova-2.png" alt="BMW E36 Direita" width={480} height={260}
                className={`car-img${hovered === "bmw" ? " active" : ""}`}
                style={{ width: "auto", height: "100%", display: "block", transform: hovered === "bmw" ? `translateX(${bmwShake}px) scale(1.06)` : undefined }}
                priority unoptimized />
              {bmwSlices.map((s, i) => (
                <div key={i} style={{
                  position: "absolute", inset: 0, pointerEvents: "none",
                  backgroundImage: "url(/bmw-nova-2.png)",
                  backgroundSize: "auto 100%", backgroundRepeat: "no-repeat", backgroundPosition: "left bottom",
                  clipPath: `inset(${s.top}% 0 ${Math.max(0, 100 - s.top - s.height)}% 0)`,
                  transform: `translateX(${s.dx}px)`,
                }} />
              ))}
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
            font-family: var(--font-anton), 'Anton', sans-serif;
            font-size: 22px;
            letter-spacing: 0.12em;
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
        <section key={s.num} style={{ backgroundColor: s.bg, display: "flex", height: 850, maxHeight: 850 }}>
          <div style={{ width: "50%", order: 0, position: "relative", overflow: "hidden", padding: s.imgPadding, boxSizing: "border-box" }}>
            <span style={{
              position: "absolute", left: 16, top: "50%",
              transform: "translateY(-50%) rotate(-90deg)",
              fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase",
              color: s.dark ? "#666" : "#aaa", whiteSpace: "nowrap", zIndex: 2,
            }}>{s.label}</span>
            <img src={s.img} alt={s.label} style={{ width: "100%", height: "100%", objectFit: (s as any).imgFit ?? "cover", objectPosition: (s as any).imgPos ?? "left bottom", display: "block" }} />
          </div>

          <div style={{ width: "50%", order: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 72px", position: "relative" }}>
            <div style={{ maxWidth: 380 }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#51c020", marginBottom: 14 }}>
                {s.tag}
              </p>
              <h2 style={{ fontSize: 42, fontWeight: 700, lineHeight: 1.15, color: (s as any).titleColor ?? (s.dark ? "#fff" : "#111"), marginBottom: 24, fontFamily: font, textWrap: "balance" } as React.CSSProperties}>
                {s.title}
              </h2>
              <Link href={s.href} className="po-btn" style={{
                display: "inline-block", background: "#51c020", color: "#fff",
                fontWeight: 700, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase",
                padding: "12px 22px", marginBottom: 24, textDecoration: "none",
              }}>{s.cta}</Link>
              <p style={{ fontSize: 14, fontWeight: 400, lineHeight: 1.8, color: (s as any).descColor ?? (s.dark ? "#aaa" : "#777") }}>{s.desc}</p>
            </div>
            <span style={{
              position: "absolute", bottom: 20, right: 40,
              fontSize: "clamp(4rem, 7vw, 7rem)", fontWeight: 900, fontStyle: "italic", lineHeight: 1,
              color: s.dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
              userSelect: "none", pointerEvents: "none", fontFamily: font,
              textTransform: "uppercase", letterSpacing: "-0.02em",
            }}>{s.tag}</span>
          </div>
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
        background: "linear-gradient(160deg, #111111 0%, #1a1a1a 50%, #0f0f0f 100%)",
        padding: "96px 40px",
        display: "flex", justifyContent: "center", alignItems: "center",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(122,193,66,0.08) 0%, transparent 70%)",
          top: "50%", left: "50%", transform: "translate(-50%, -50%)", pointerEvents: "none",
        }} />
        <div style={{ textAlign: "center", maxWidth: 560, width: "100%", position: "relative", zIndex: 1 }}>
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
