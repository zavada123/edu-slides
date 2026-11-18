/**
 * Draws the objects of one slide with Konva. Text goes to canvas as plain strings, so nothing a student types can
 * become markup. Used by the editor, the thumbnails and the show.
 */
import type Konva from "konva"
import { Ellipse, Group, Image as KImage, Line, Rect, Text } from "react-konva"
import type { ImageElement, ShapeElement, Slide, SlideElement, TextElement, TextStyle } from "../core/model.ts"
import { pictureUrl, type ResolveAsset, usePicture } from "./pictures.ts"

const fontStyle = (s: TextStyle): string => [s.italic ? "italic" : "", s.bold ? "bold" : ""].join(" ").trim() || "normal"

const PLACEHOLDER: Readonly<Record<TextElement["role"], string>> = {
  title: "Клацніть двічі, щоб додати заголовок",
  body: "Клацніть двічі, щоб додати текст",
  caption: "Клацніть двічі, щоб додати напис"
}

/** Points of a polygon that fills a w×h box. */
const polygon = (shape: ShapeElement["shape"], w: number, h: number): ReadonlyArray<number> => {
  switch (shape) {
    case "triangle":
      return [w / 2, 0, w, h, 0, h]
    case "arrow":
      return [0, h * 0.3, w * 0.62, h * 0.3, w * 0.62, 0, w, h / 2, w * 0.62, h, w * 0.62, h * 0.7, 0, h * 0.7]
    case "callout":
      return [0, 0, w, 0, w, h * 0.72, w * 0.45, h * 0.72, w * 0.2, h, w * 0.25, h * 0.72, 0, h * 0.72]
    case "star": {
      const pts: number[] = []
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? 0.5 : 0.2
        const a = -Math.PI / 2 + (i * Math.PI) / 5
        pts.push(w / 2 + Math.cos(a) * r * w, h * 0.53 + Math.sin(a) * r * h * 1.05)
      }
      return pts
    }
    default:
      return []
  }
}

const TextBody = ({ el, text, editing, empty }: { readonly el: TextElement | ShapeElement; readonly text: string; readonly editing: boolean; readonly empty?: boolean }) => (
  <Text
    width={el.width}
    height={el.height}
    padding={8}
    text={editing ? "" : text}
    fontFamily={el.style.font}
    fontSize={el.style.size}
    fontStyle={fontStyle(el.style)}
    textDecoration={el.style.underline ? "underline" : ""}
    align={el.style.align}
    verticalAlign={el.kind === "shape" || (el.kind === "text" && el.role === "title") ? "middle" : "top"}
    fill={empty ? "#9ca3af" : el.style.color}
    wrap="word"
    ellipsis={false}
    listening={false}
  />
)

const TextNode = ({ el, editor, editing }: { readonly el: TextElement; readonly editor: boolean; readonly editing: boolean }) => {
  const empty = el.text.trim() === ""
  if (empty && !editor) return null
  return (
    <>
      <Rect
        width={el.width}
        height={el.height}
        {...(el.fill ? { fill: el.fill } : { fill: "rgba(0,0,0,0.001)" })}
        {...(empty && editor ? { stroke: "#9ca3af", dash: [6, 4], strokeWidth: 1.5, strokeScaleEnabled: false } : {})}
      />
      <TextBody el={empty && editor ? { ...el, style: { ...el.style, size: Math.min(el.style.size, 28), bold: false } } : el} text={empty ? PLACEHOLDER[el.role] : el.text} editing={editing} empty={empty} />
    </>
  )
}

const ShapeNode = ({ el, editing }: { readonly el: ShapeElement; readonly editing: boolean }) => {
  const common = { fill: el.fill, stroke: el.stroke, strokeWidth: 3 }
  return (
    <>
      {el.shape === "rect" && <Rect width={el.width} height={el.height} {...common} />}
      {el.shape === "roundRect" && <Rect width={el.width} height={el.height} cornerRadius={Math.min(el.width, el.height) * 0.18} {...common} />}
      {el.shape === "ellipse" && <Ellipse x={el.width / 2} y={el.height / 2} radiusX={el.width / 2} radiusY={el.height / 2} {...common} />}
      {(el.shape === "triangle" || el.shape === "arrow" || el.shape === "callout" || el.shape === "star") && (
        <Line points={[...polygon(el.shape, el.width, el.height)]} closed {...common} lineJoin="round" />
      )}
      {el.text !== "" && <TextBody el={el.shape === "callout" ? { ...el, height: el.height * 0.72 } : el} text={el.text} editing={editing} />}
    </>
  )
}

const ImageNode = ({ el, resolve }: { readonly el: ImageElement; readonly resolve: ResolveAsset | undefined }) => {
  const image = usePicture(pictureUrl(el.asset, resolve))
  return image ? <KImage image={image} width={el.width} height={el.height} /> : <Rect width={el.width} height={el.height} fill="#e5e7eb" />
}

export interface ElementHandlers {
  readonly onSelect?: (id: string) => void
  readonly onEdit?: (id: string) => void
  readonly onMoved?: (id: string, x: number, y: number) => void
  readonly onLinkClick?: (el: SlideElement) => void
}

interface Props extends ElementHandlers {
  readonly slide: Slide
  /** Editor mode: draggable objects and dashed empty placeholders. */
  readonly editor?: boolean
  readonly editingId?: string | null
  readonly resolveAsset?: ResolveAsset | undefined
  /** Konva nodes by element id, for the transformer and the show's animations. */
  readonly nodeRef?: (id: string, node: Konva.Group | null) => void
}

export const SlideElements = ({ slide, editor = false, editingId = null, resolveAsset, nodeRef, onSelect, onEdit, onMoved, onLinkClick }: Props) => (
  <>
    <Rect width={960} height={540} fill={slide.background} listening={editor} onMouseDown={() => onSelect?.("")} onTap={() => onSelect?.("")} />
    {slide.elements.map((el) => (
      <Group
        key={el.id}
        id={el.id}
        ref={(node) => nodeRef?.(el.id, node)}
        x={el.x}
        y={el.y}
        rotation={el.rotation}
        draggable={editor && editingId !== el.id}
        listening={editor || el.link !== undefined}
        onMouseDown={() => onSelect?.(el.id)}
        onTap={() => onSelect?.(el.id)}
        onDblClick={() => (el.kind === "text" || el.kind === "shape") && onEdit?.(el.id)}
        onDblTap={() => (el.kind === "text" || el.kind === "shape") && onEdit?.(el.id)}
        onDragEnd={(e) => onMoved?.(el.id, Math.round(e.target.x()), Math.round(e.target.y()))}
        onClick={() => onLinkClick?.(el)}
        {...(!editor && el.link ? { onMouseEnter: (e: Konva.KonvaEventObject<MouseEvent>) => setCursor(e, "pointer"), onMouseLeave: (e: Konva.KonvaEventObject<MouseEvent>) => setCursor(e, "") } : {})}
      >
        {el.kind === "text" && <TextNode el={el} editor={editor} editing={editingId === el.id} />}
        {el.kind === "shape" && <ShapeNode el={el} editing={editingId === el.id} />}
        {el.kind === "image" && <ImageNode el={el} resolve={resolveAsset} />}
      </Group>
    ))}
  </>
)

const setCursor = (e: Konva.KonvaEventObject<MouseEvent>, cursor: string) => {
  const stage = e.target.getStage()
  if (stage) stage.container().style.cursor = cursor
}
