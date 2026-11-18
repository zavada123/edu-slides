import type Konva from "konva"
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import { Layer, Stage, Transformer } from "react-konva"
import { type Slide, SLIDE_HEIGHT, SLIDE_WIDTH, type SlideElement } from "../core/model.ts"
import type { ResolveAsset } from "./pictures.ts"
import { SlideElements } from "./SlideElements.tsx"

interface Props {
  readonly slide: Slide
  readonly selectedId: string | null
  readonly editingId: string | null
  readonly resolveAsset: ResolveAsset | undefined
  readonly onSelect: (id: string | null) => void
  readonly onEdit: (id: string | null) => void
  readonly onChange: (id: string, patch: Partial<SlideElement>) => void
}

/** Size of the slide on screen: as large as the workspace allows, 16:9. */
const useFit = (box: React.RefObject<HTMLDivElement | null>): number => {
  const [width, setWidth] = useState(640)
  useLayoutEffect(() => {
    const el = box.current
    if (!el) return undefined
    const measure = () => {
      const w = el.clientWidth - 24
      const h = el.clientHeight - 24
      setWidth(Math.max(240, Math.floor(Math.min(w, h > 120 ? (h * SLIDE_WIDTH) / SLIDE_HEIGHT : w))))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [box])
  return width
}

/** The slide being edited: drag, resize and rotate objects, double-click to type. */
export const SlideCanvas = ({ slide, selectedId, editingId, resolveAsset, onSelect, onEdit, onChange }: Props) => {
  const box = useRef<HTMLDivElement>(null)
  const width = useFit(box)
  const scale = width / SLIDE_WIDTH
  const nodes = useRef(new Map<string, Konva.Group>())
  const transformer = useRef<Konva.Transformer>(null)
  const selected = slide.elements.find((e) => e.id === selectedId)
  const editing = slide.elements.find((e) => e.id === editingId)

  const nodeRef = useCallback((id: string, node: Konva.Group | null) => {
    if (node) nodes.current.set(id, node)
    else nodes.current.delete(id)
  }, [])

  useEffect(() => {
    const tr = transformer.current
    if (!tr) return
    const node = selectedId && !editingId ? nodes.current.get(selectedId) : undefined
    tr.nodes(node ? [node] : [])
    tr.getLayer()?.batchDraw()
  }, [selectedId, editingId, slide])

  const onTransformEnd = () => {
    const node = selectedId ? nodes.current.get(selectedId) : undefined
    if (!node || !selected) return
    const sx = node.scaleX()
    const sy = node.scaleY()
    node.scale({ x: 1, y: 1 })
    onChange(selected.id, {
      x: Math.round(node.x()),
      y: Math.round(node.y()),
      rotation: Math.round(node.rotation()),
      width: Math.max(10, Math.round(selected.width * sx)),
      height: Math.max(10, Math.round(selected.height * sy))
    })
  }

  return (
    <div className="esl-workspace" ref={box}>
      <div className="esl-stage" style={{ width, height: width * (SLIDE_HEIGHT / SLIDE_WIDTH) }} data-target="slide">
        <Stage width={width} height={width * (SLIDE_HEIGHT / SLIDE_WIDTH)} scaleX={scale} scaleY={scale}>
          <Layer>
            <SlideElements
              slide={slide}
              editor
              editingId={editingId}
              resolveAsset={resolveAsset}
              nodeRef={nodeRef}
              onSelect={(id) => {
                if (editingId && id !== editingId) onEdit(null)
                onSelect(id === "" ? null : id)
              }}
              onEdit={(id) => {
                onSelect(id)
                onEdit(id)
              }}
              onMoved={(id, x, y) => onChange(id, { x, y })}
            />
            <Transformer
              ref={transformer}
              rotateEnabled
              // Corner handles keep the proportions of a picture, as in PowerPoint; side handles stretch it.
              keepRatio={selected?.kind === "image"}
              rotationSnaps={[0, 90, 180, 270]}
              anchorSize={12}
              anchorCornerRadius={6}
              borderStroke="#2563eb"
              anchorStroke="#2563eb"
              boundBoxFunc={(oldBox, newBox) => (newBox.width < 10 || newBox.height < 10 ? oldBox : newBox)}
              onTransformEnd={onTransformEnd}
            />
          </Layer>
        </Stage>
        {editing && (editing.kind === "text" || editing.kind === "shape") && (
          <TextEditor
            key={editing.id}
            el={editing}
            scale={scale}
            onCommit={(text) => text !== editing.text && onChange(editing.id, { text })}
            onClose={() => onEdit(null)}
          />
        )}
      </div>
    </div>
  )
}

/**
 * Typing happens in a plain `<textarea>` over the slide: real browser text input (Cyrillic, IME, the phone keyboard),
 * and its value is only ever plain text.
 */
const TextEditor = ({ el, scale, onCommit, onClose }: {
  readonly el: Extract<SlideElement, { kind: "text" | "shape" }>
  readonly scale: number
  readonly onCommit: (text: string) => void
  readonly onClose: () => void
}) => {
  const [value, setValue] = useState(el.text)
  const ref = useRef<HTMLTextAreaElement>(null)
  // The editor can disappear without a blur (a click on the slide closes it first): the text is kept then too.
  const latest = useRef({ value, onCommit })
  latest.current = { value, onCommit }
  useEffect(() => {
    const t = ref.current
    if (t) {
      t.focus()
      t.setSelectionRange(t.value.length, t.value.length)
    }
    return () => latest.current.onCommit(latest.current.value)
  }, [])
  const onDone = () => onClose()
  return (
    <textarea
      ref={ref}
      className="esl-text-editor"
      aria-label="Текст напису"
      value={value}
      maxLength={2000}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onDone}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.preventDefault()
          e.stopPropagation()
          onDone()
        }
      }}
      style={{
        left: el.x * scale,
        top: el.y * scale,
        width: el.width * scale,
        height: el.height * scale,
        transform: `rotate(${el.rotation}deg)`,
        fontFamily: el.style.font,
        fontSize: el.style.size * scale,
        fontWeight: el.style.bold ? 700 : 400,
        fontStyle: el.style.italic ? "italic" : "normal",
        textDecoration: el.style.underline ? "underline" : "none",
        textAlign: el.style.align,
        color: el.style.color,
        padding: 8 * scale
      }}
    />
  )
}
