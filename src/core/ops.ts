/** Editing operations. Each one returns a new deck and never changes the one it got. */
import { libraryPicture } from "./library.ts"
import {
  type Deck,
  DEFAULT_TEXT_STYLE,
  type ImageElement,
  type Layout,
  LIMITS,
  SLIDE_HEIGHT,
  SLIDE_WIDTH,
  type ShapeElement,
  type ShapeKind,
  SHAPE_NAMES,
  type Slide,
  type SlideElement,
  type TextElement,
  type TextRole,
  type TextStyle,
  type Transition
} from "./model.ts"

let counter = 0

/** A short id, unique within a page. */
export const newId = (prefix: string): string => {
  counter += 1
  return `${prefix}${Date.now().toString(36)}${counter.toString(36)}${Math.floor(Math.random() * 1296).toString(36)}`
}

const textBox = (role: TextRole, name: string, x: number, y: number, width: number, height: number, style: Partial<TextStyle>): TextElement => ({
  id: newId("t"),
  name,
  kind: "text",
  role,
  text: "",
  x,
  y,
  width,
  height,
  rotation: 0,
  style: { ...DEFAULT_TEXT_STYLE, ...style }
})

/** The placeholders a layout puts on a new slide, all empty. */
export const placeholders = (layout: Layout): ReadonlyArray<TextElement> => {
  const title = (y: number, h: number, size: number) => textBox("title", "Заголовок", 60, y, SLIDE_WIDTH - 120, h, { size, align: "center" })
  switch (layout) {
    case "title":
      return [
        title(150, 130, 48),
        textBox("body", "Підзаголовок", 160, 300, SLIDE_WIDTH - 320, 80, { size: 28, align: "center", color: "#4b5563" })
      ]
    case "titleContent":
      return [title(30, 90, 40), textBox("body", "Текст", 60, 140, SLIDE_WIDTH - 120, 360, { size: 28 })]
    case "twoContent":
      return [
        title(30, 90, 40),
        textBox("body", "Текст ліворуч", 60, 140, 400, 360, { size: 24 }),
        textBox("body", "Текст праворуч", 500, 140, 400, 360, { size: 24 })
      ]
    case "titleOnly":
      return [title(30, 90, 40)]
    case "blank":
      return []
  }
}

const NO_TRANSITION: Transition = { effect: "none", duration: 1 }

export const newSlide = (layout: Layout, background = "#ffffff"): Slide => ({
  id: newId("s"),
  layout,
  background,
  elements: placeholders(layout),
  hidden: false,
  transition: NO_TRANSITION,
  notes: ""
})

export const newDeck = (layout: Layout = "title"): Deck => ({ slides: [newSlide(layout)] })

const replaceSlide = (deck: Deck, slideId: string, f: (s: Slide) => Slide): Deck => ({
  slides: deck.slides.map((s) => (s.id === slideId ? f(s) : s))
})

/** Inserts a slide after `index` (-1 puts it first). A new slide takes the background of the one before it. */
export const addSlide = (deck: Deck, index: number, layout: Layout): { readonly deck: Deck; readonly slideId: string } => {
  if (deck.slides.length >= LIMITS.slides) return { deck, slideId: deck.slides[index]?.id ?? "" }
  const before = deck.slides[index]
  const slide = newSlide(layout, before?.background ?? "#ffffff")
  const withTransition = before ? { ...slide, transition: before.transition } : slide
  const slides = [...deck.slides.slice(0, index + 1), withTransition, ...deck.slides.slice(index + 1)]
  return { deck: { slides }, slideId: slide.id }
}

export const duplicateSlide = (deck: Deck, slideId: string): { readonly deck: Deck; readonly slideId: string } => {
  const index = deck.slides.findIndex((s) => s.id === slideId)
  const source = deck.slides[index]
  if (!source || deck.slides.length >= LIMITS.slides) return { deck, slideId }
  const copy: Slide = { ...source, id: newId("s"), elements: source.elements.map((e) => ({ ...e, id: newId(e.kind[0] ?? "e") })) }
  return { deck: { slides: [...deck.slides.slice(0, index + 1), copy, ...deck.slides.slice(index + 1)] }, slideId: copy.id }
}

/** Removes a slide; the last slide stays (a deck has at least one). Links to it are dropped. */
export const deleteSlide = (deck: Deck, slideId: string): Deck => {
  if (deck.slides.length <= 1) return deck
  return {
    slides: deck.slides
      .filter((s) => s.id !== slideId)
      .map((s) => ({
        ...s,
        elements: s.elements.map((e) => {
          if (e.link && "slide" in e.link && e.link.slide === slideId) {
            const { link: _dropped, ...rest } = e
            return rest as SlideElement
          }
          return e
        })
      }))
  }
}

export const moveSlide = (deck: Deck, from: number, to: number): Deck => {
  const moving = deck.slides[from]
  if (!moving || to < 0 || to >= deck.slides.length || from === to) return deck
  const rest = deck.slides.filter((_, i) => i !== from)
  return { slides: [...rest.slice(0, to), moving, ...rest.slice(to)] }
}

export const updateSlide = (deck: Deck, slideId: string, patch: Partial<Omit<Slide, "id" | "elements">>): Deck =>
  replaceSlide(deck, slideId, (s) => ({ ...s, ...patch }))

/** Changes the layout and adds the placeholders the slide lacks; what the student made stays. */
export const changeLayout = (deck: Deck, slideId: string, layout: Layout): Deck =>
  replaceSlide(deck, slideId, (s) => {
    const hasTitle = s.elements.some((e) => e.kind === "text" && e.role === "title")
    const hasBody = s.elements.some((e) => e.kind === "text" && e.role === "body")
    const added = placeholders(layout).filter((p) => (p.role === "title" ? !hasTitle : !hasBody))
    return { ...s, layout, elements: [...s.elements, ...added].slice(0, LIMITS.elementsPerSlide) }
  })

export const setBackgroundAll = (deck: Deck, background: string): Deck => ({ slides: deck.slides.map((s) => ({ ...s, background })) })

export const setTransitionAll = (deck: Deck, transition: Transition): Deck => ({ slides: deck.slides.map((s) => ({ ...s, transition })) })

export const addElement = (deck: Deck, slideId: string, element: SlideElement): Deck =>
  replaceSlide(deck, slideId, (s) => (s.elements.length >= LIMITS.elementsPerSlide ? s : { ...s, elements: [...s.elements, element] }))

export const updateElement = (deck: Deck, slideId: string, elementId: string, patch: Partial<SlideElement>): Deck =>
  replaceSlide(deck, slideId, (s) => ({
    ...s,
    elements: s.elements.map((e) => (e.id === elementId ? ({ ...e, ...patch, id: e.id, kind: e.kind } as SlideElement) : e))
  }))

/** Drops a field the patch type cannot unset (animation, link, fill). */
export const clearElementField = (deck: Deck, slideId: string, elementId: string, field: "animation" | "link" | "fill"): Deck =>
  replaceSlide(deck, slideId, (s) => ({
    ...s,
    elements: s.elements.map((e) => {
      if (e.id !== elementId) return e
      const copy: Record<string, unknown> = { ...e }
      delete copy[field]
      return copy as unknown as SlideElement
    })
  }))

export const deleteElement = (deck: Deck, slideId: string, elementId: string): Deck =>
  replaceSlide(deck, slideId, (s) => ({ ...s, elements: s.elements.filter((e) => e.id !== elementId) }))

/** Moves an element to the top (`front`) or the bottom of the slide. */
export const reorderElement = (deck: Deck, slideId: string, elementId: string, where: "front" | "back"): Deck =>
  replaceSlide(deck, slideId, (s) => {
    const el = s.elements.find((e) => e.id === elementId)
    if (!el) return s
    const rest = s.elements.filter((e) => e.id !== elementId)
    return { ...s, elements: where === "front" ? [...rest, el] : [el, ...rest] }
  })

/** A new text box in the middle of the slide. */
export const newTextBox = (text = ""): TextElement => ({
  ...textBox("caption", "Напис", SLIDE_WIDTH / 2 - 200, SLIDE_HEIGHT / 2 - 40, 400, 80, { size: 28, align: "center" }),
  text
})

export const newShape = (shape: ShapeKind): ShapeElement => {
  const wide = shape === "arrow" || shape === "callout" || shape === "rect" || shape === "roundRect"
  const width = wide ? 260 : 180
  const height = shape === "arrow" ? 110 : 180
  return {
    id: newId("f"),
    name: SHAPE_NAMES[shape],
    kind: "shape",
    shape,
    x: SLIDE_WIDTH / 2 - width / 2,
    y: SLIDE_HEIGHT / 2 - height / 2,
    width,
    height,
    rotation: 0,
    fill: shape === "callout" ? "#ffffff" : "#9ed8f5",
    stroke: "#2563eb",
    text: "",
    style: { ...DEFAULT_TEXT_STYLE, size: 24, align: "center" }
  }
}

/** A library picture, about a third of the slide high, in the middle. */
export const newPicture = (asset: string, ratio = libraryPicture(asset)?.ratio ?? 1): ImageElement => {
  const height = 200
  const width = Math.round(height * ratio)
  return {
    id: newId("p"),
    name: libraryPicture(asset)?.name ?? "Малюнок",
    kind: "image",
    asset,
    x: SLIDE_WIDTH / 2 - width / 2,
    y: SLIDE_HEIGHT / 2 - height / 2,
    width,
    height,
    rotation: 0
  }
}

export const findSlide = (deck: Deck, slideId: string): Slide | undefined => deck.slides.find((s) => s.id === slideId)

/** The text of a slide's title placeholder, trimmed; "" when it has none. */
export const slideTitle = (slide: Slide): string =>
  (slide.elements.find((e): e is TextElement => e.kind === "text" && e.role === "title")?.text ?? "").trim()
