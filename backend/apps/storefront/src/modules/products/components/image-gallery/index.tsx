"use client"

import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { useState } from "react"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [active, setActive] = useState(0)

  if (!images || images.length === 0) return null

  const main = images[active]

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

      {/* ── Imagem principal ── */}
      <div style={{
        position: "relative",
        width: "100%",
        aspectRatio: "4/5",
        overflow: "hidden",
        backgroundColor: "#f5f5f5",
      }}>
        {main?.url && (
          <Image
            src={main.url}
            alt={`Imagem ${active + 1}`}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 600px"
            style={{ objectFit: "cover" }}
          />
        )}
      </div>

      {/* ── Miniaturas ── */}
      {images.length > 1 && (
        <div style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
        }}>
          {images.map((img, i) => (
            <button
              key={img.id ?? i}
              onClick={() => setActive(i)}
              style={{
                position: "relative",
                width: 72,
                height: 72,
                flexShrink: 0,
                overflow: "hidden",
                background: "#f5f5f5",
                border: i === active ? "2px solid #51c020" : "2px solid transparent",
                cursor: "pointer",
                padding: 0,
                outline: "none",
                transition: "border-color 0.15s",
              }}
            >
              {img.url && (
                <Image
                  src={img.url}
                  alt={`Miniatura ${i + 1}`}
                  fill
                  sizes="72px"
                  style={{ objectFit: "cover" }}
                />
              )}
            </button>
          ))}
        </div>
      )}

    </div>
  )
}

export default ImageGallery
