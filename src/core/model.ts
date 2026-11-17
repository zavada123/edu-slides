/**
 * The presentation model. It holds plain text, numbers and ids only: no HTML, no URLs of pictures, no scripts.
 * Everything the student makes is shown through Konva (canvas) or React text nodes, so text can never become markup.
 */

/** Slide size in model units, 16:9. */
export const SLIDE_WIDTH = 960
export const SLIDE_HEIGHT = 540

/** A colour as `#rrggbb`. */
export type Color = string

/** Fonts with Cyrillic that every device has or that the page loads. A student cannot type another name. */
export const FONTS = ["Arial", "Georgia", "Verdana", "Trebuchet MS", "Courier New", "Comic Sans MS"] as const
export type Font = (typeof FONTS)[number]

export type Align = "left" | "center" | "right"

export interface TextStyle {
  readonly font: Font
  /** Points as on the ribbon: 8…96. */
  readonly size: number
  readonly color: Color
  readonly bold: boolean
  readonly italic: boolean
  readonly underline: boolean
  readonly align: Align
}

export const DEFAULT_TEXT_STYLE: TextStyle = {
  font: "Arial",
  size: 28,
  color: "#1f2937",
  bold: false,
  italic: false,
  underline: false,
  align: "left"
}

/** What a text box is for: a layout puts a title or body placeholder; a caption is a box the student adds. */
export type TextRole = "title" | "body" | "caption"

export const SHAPES = ["rect", "roundRect", "ellipse", "triangle", "star", "arrow", "callout"] as const
export type ShapeKind = (typeof SHAPES)[number]

/** Animation effects, grouped as in the textbooks: entrance, emphasis and exit. */
export const EFFECTS = {
  entrance: ["appear", "fade", "flyIn", "zoomIn"],
  emphasis: ["pulse", "spin"],
  exit: ["disappear", "fadeOut", "flyOut"]
} as const
export type EffectGroup = keyof typeof EFFECTS
export type Effect = (typeof EFFECTS)[EffectGroup][number]
export type AnimationStart = "click" | "with" | "after"

export interface Animation {
  readonly group: EffectGroup
  readonly effect: Effect
  readonly start: AnimationStart
  /** Seconds, 0.25…10. */
  readonly duration: number
}

export const TRANSITIONS = ["none", "fade", "push", "wipe", "zoom"] as const
export type TransitionEffect = (typeof TRANSITIONS)[number]

export interface Transition {
  readonly effect: TransitionEffect
  readonly duration: number
}

/** Where a click on an element leads during the show: another slide of this deck, or a web page by `https:`. */
export type Link = { readonly slide: string } | { readonly url: string }

interface ElementBase {
  readonly id: string
  /** The name in the selection pane; triggers in grade 7 refer to objects by it. */
  readonly name: string
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
  /** Degrees. */
  readonly rotation: number
  readonly animation?: Animation
  readonly link?: Link
}

export interface TextElement extends ElementBase {
  readonly kind: "text"
  readonly role: TextRole
  readonly text: string
  readonly style: TextStyle
  /** Background of the box; none when absent. */
  readonly fill?: Color
}

export interface ShapeElement extends ElementBase {
  readonly kind: "shape"
  readonly shape: ShapeKind
  readonly fill: Color
  readonly stroke: Color
  readonly text: string
  readonly style: TextStyle
}

export interface ImageElement extends ElementBase {
  readonly kind: "image"
  /** An id from the picture library (`library:cat`) or of a file the site stored (`upload:<id>`). Never a URL. */
  readonly asset: string
}

export type SlideElement = TextElement | ShapeElement | ImageElement

export const LAYOUTS = ["title", "titleContent", "twoContent", "titleOnly", "blank"] as const
export type Layout = (typeof LAYOUTS)[number]

export interface Slide {
  readonly id: string
  readonly layout: Layout
  readonly background: Color
  readonly elements: ReadonlyArray<SlideElement>
  readonly hidden: boolean
  readonly transition: Transition
  readonly notes: string
}

export interface Deck {
  readonly slides: ReadonlyArray<Slide>
}

/** Limits for one deck: the page and the server refuse anything larger. */
export const LIMITS = {
  slides: 40,
  elementsPerSlide: 60,
  textLength: 2000,
  notesLength: 4000,
  nameLength: 60,
  idLength: 40
} as const

export const LAYOUT_NAMES: Readonly<Record<Layout, string>> = {
  title: "Титульний слайд",
  titleContent: "Заголовок і об'єкт",
  twoContent: "Два об'єкти",
  titleOnly: "Лише заголовок",
  blank: "Пустий слайд"
}

export const SHAPE_NAMES: Readonly<Record<ShapeKind, string>> = {
  rect: "Прямокутник",
  roundRect: "Заокруглений прямокутник",
  ellipse: "Овал",
  triangle: "Трикутник",
  star: "Зірка",
  arrow: "Стрілка",
  callout: "Виноска"
}

export const EFFECT_NAMES: Readonly<Record<Effect, string>> = {
  appear: "Поява",
  fade: "Вицвітання",
  flyIn: "Виліт",
  zoomIn: "Масштабування",
  pulse: "Пульсація",
  spin: "Обертання",
  disappear: "Зникнення",
  fadeOut: "Вицвітання (вихід)",
  flyOut: "Виліт за край"
}

export const GROUP_NAMES: Readonly<Record<EffectGroup, string>> = {
  entrance: "Вхід",
  emphasis: "Виділення",
  exit: "Вихід"
}

export const TRANSITION_NAMES: Readonly<Record<TransitionEffect, string>> = {
  none: "Немає",
  fade: "Вицвітання",
  push: "Виштовхування",
  wipe: "Витирання",
  zoom: "Масштаб"
}

/** Colours on the palette, with names a teacher can use in a task («зроби тло блакитним»). */
export const PALETTE: ReadonlyArray<{ readonly color: Color; readonly name: string }> = [
  { color: "#ffffff", name: "білий" },
  { color: "#1f2937", name: "чорний" },
  { color: "#9ca3af", name: "сірий" },
  { color: "#dc2626", name: "червоний" },
  { color: "#f97316", name: "помаранчевий" },
  { color: "#facc15", name: "жовтий" },
  { color: "#16a34a", name: "зелений" },
  { color: "#9ed8f5", name: "блакитний" },
  { color: "#2563eb", name: "синій" },
  { color: "#7c3aed", name: "фіолетовий" },
  { color: "#ec4899", name: "рожевий" },
  { color: "#8b5a2b", name: "коричневий" },
  { color: "#fef3c7", name: "кремовий" },
  { color: "#dcfce7", name: "м'ятний" }
]

export const isElementOf = <K extends SlideElement["kind"]>(kind: K) =>
  (element: SlideElement): element is Extract<SlideElement, { kind: K }> => element.kind === kind
