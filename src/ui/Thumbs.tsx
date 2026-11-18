import { memo, useState } from "react"
import { Layer, Stage } from "react-konva"
import type { Slide } from "../core/model.ts"
import type { ResolveAsset } from "./pictures.ts"
import { SlideElements } from "./SlideElements.tsx"

const THUMB_WIDTH = 150

const Thumb = memo(({ slide, resolveAsset }: { readonly slide: Slide; readonly resolveAsset: ResolveAsset | undefined }) => (
  <Stage width={THUMB_WIDTH} height={(THUMB_WIDTH * 9) / 16} scaleX={THUMB_WIDTH / 960} scaleY={THUMB_WIDTH / 960} listening={false}>
    <Layer listening={false}>
      <SlideElements slide={slide} resolveAsset={resolveAsset} />
    </Layer>
  </Stage>
))

interface Props {
  readonly slides: ReadonlyArray<Slide>
  readonly current: string
  readonly resolveAsset: ResolveAsset | undefined
  readonly onPick: (id: string) => void
  readonly onMove: (from: number, to: number) => void
}

/** The slide list: click to open a slide, drag a thumbnail (or use the arrows) to change the order. */
export const Thumbs = ({ slides, current, resolveAsset, onPick, onMove }: Props) => {
  const [dragging, setDragging] = useState<number | null>(null)
  const [over, setOver] = useState<number | null>(null)
  const currentIndex = slides.findIndex((s) => s.id === current)
  return (
    <div className="esl-thumbs" role="listbox" aria-label="Слайди" data-target="thumbs">
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          role="option"
          aria-selected={slide.id === current}
          tabIndex={slide.id === current ? 0 : -1}
          className={`esl-thumb ${slide.id === current ? "is-current" : ""} ${over === i && dragging !== null && dragging !== i ? "is-over" : ""}`}
          draggable
          onDragStart={(e) => {
            setDragging(i)
            e.dataTransfer.effectAllowed = "move"
            e.dataTransfer.setData("text/plain", String(i))
          }}
          onDragOver={(e) => {
            e.preventDefault()
            setOver(i)
          }}
          onDragLeave={() => setOver((o) => (o === i ? null : o))}
          onDrop={(e) => {
            e.preventDefault()
            if (dragging !== null && dragging !== i) onMove(dragging, i)
            setDragging(null)
            setOver(null)
          }}
          onDragEnd={() => {
            setDragging(null)
            setOver(null)
          }}
          onClick={() => onPick(slide.id)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown" || e.key === "ArrowRight") {
              e.preventDefault()
              const next = slides[i + 1]
              if (e.ctrlKey && next) onMove(i, i + 1)
              else if (next) onPick(next.id)
            }
            if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
              e.preventDefault()
              const prev = slides[i - 1]
              if (e.ctrlKey && prev) onMove(i, i - 1)
              else if (prev) onPick(prev.id)
            }
          }}
        >
          <span className="esl-thumb-no">{i + 1}</span>
          <div className={`esl-thumb-img ${slide.hidden ? "is-hidden" : ""}`}>
            <Thumb slide={slide} resolveAsset={resolveAsset} />
          </div>
        </div>
      ))}
      {currentIndex >= 0 && slides.length > 1 && (
        <div className="esl-thumb-move" aria-label="Перемістити поточний слайд">
          <button type="button" data-command="slide.moveUp" disabled={currentIndex === 0} onClick={() => onMove(currentIndex, currentIndex - 1)} title="Перемістити слайд вище">
            ▲
          </button>
          <button type="button" data-command="slide.moveDown" disabled={currentIndex === slides.length - 1} onClick={() => onMove(currentIndex, currentIndex + 1)} title="Перемістити слайд нижче">
            ▼
          </button>
        </div>
      )}
    </div>
  )
}
