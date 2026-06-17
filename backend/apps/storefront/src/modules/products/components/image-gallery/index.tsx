"use client"

import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { useState, useEffect } from "react"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  useEffect(() => {
    if (!lightbox) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false)
      if (e.key === "ArrowRight") setActive(i => Math.min(i + 1, images.length - 1))
      if (e.key === "ArrowLeft") setActive(i => Math.max(i - 1, 0))
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [lightbox, images.length])

  if (!images || images.length === 0) return null

  const main = images[active]

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

        {/* Imagem principal — clicável */}
        <div
          onClick={() => setLightbox(true)}
          style={{
            position: "relative", width: "100%", aspectRatio: "4/5",
            overflow: "hidden", backgroundColor: "#f5f5f5",
            cursor: "zoom-in",
          }}
        >
          {main?.url && (
            <Image
              src={main.url}
              alt={`Imagem ${active + 1}`}
              fill priority
              sizes="(max-width: 768px) 100vw, 600px"
              style={{ objectFit: "cover", transition: "transform .3s ease" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            />
          )}
          {/* Zoom hint */}
          <div style={{
            position: "absolute", bottom: 10, right: 10,
            background: "rgba(0,0,0,.45)", color: "#fff",
            fontSize: 10, padding: "4px 8px", borderRadius: 3,
            display: "flex", alignItems: "center", gap: 4, pointerEvents: "none",
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
            </svg>
            Ampliar
          </div>
        </div>

        {/* Miniaturas */}
        {images.length > 1 && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {images.map((img, i) => (
              <button
                key={img.id ?? i}
                onClick={() => setActive(i)}
                style={{
                  position: "relative", width: 72, height: 72, flexShrink: 0,
                  overflow: "hidden", background: "#f5f5f5",
                  border: i === active ? "2px solid #51c020" : "2px solid transparent",
                  cursor: "pointer", padding: 0, outline: "none", transition: "border-color .15s",
                }}
              >
                {img.url && (
                  <Image src={img.url} alt={`Miniatura ${i + 1}`} fill sizes="72px" style={{ objectFit: "cover" }} />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,.92)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          {/* Fechar */}
          <button onClick={() => setLightbox(false)} style={{
            position: "absolute", top: 20, right: 24,
            background: "none", border: "none", color: "#fff", fontSize: 32,
            cursor: "pointer", lineHeight: 1,
          }}>×</button>

          {/* Anterior */}
          {active > 0 && (
            <button
              onClick={e => { e.stopPropagation(); setActive(i => i - 1) }}
              style={{ position: "absolute", left: 20, background: "none", border: "none", color: "#fff", fontSize: 40, cursor: "pointer" }}
            >‹</button>
          )}

          {/* Imagem */}
          <div
            onClick={e => e.stopPropagation()}
            style={{ position: "relative", maxWidth: "90vw", maxHeight: "90vh", width: 800, aspectRatio: "4/5" }}
          >
            {main?.url && (
              <Image
                src={main.url}
                alt={`Imagem ${active + 1}`}
                fill
                sizes="90vw"
                style={{ objectFit: "contain" }}
              />
            )}
          </div>

          {/* Próximo */}
          {active < images.length - 1 && (
            <button
              onClick={e => { e.stopPropagation(); setActive(i => i + 1) }}
              style={{ position: "absolute", right: 20, background: "none", border: "none", color: "#fff", fontSize: 40, cursor: "pointer" }}
            >›</button>
          )}

          {/* Contador */}
          <div style={{ position: "absolute", bottom: 20, color: "#fff", fontSize: 13, opacity: .7 }}>
            {active + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  )
}

export default ImageGallery
