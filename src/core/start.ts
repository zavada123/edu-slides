/** Builds the starting deck of a scenario from a short description. Ids are fixed (`s1`, `s1-t1`…) so tests can name them. */
import { libraryPicture } from "./library.ts"
import { type Color, type Deck, type Layout, type Slide, type SlideElement, type TextElement } from "./model.ts"
import { placeholders } from "./ops.ts"

export interface PictureSpec {
  readonly asset: string
  readonly x: number
  readonly y: number
  /** Height; the width follows the drawing's proportions. Default 200. */
  readonly height?: number
}

export interface SlideSpec {
  readonly layout: Layout
  readonly title?: string
  /** Text of the body (or subtitle) placeholder. */
  readonly body?: string
  readonly background?: Color
  readonly pictures?: ReadonlyArray<PictureSpec>
}

const fill = (box: TextElement, text: string | undefined): TextElement => (text === undefined ? box : { ...box, text })

export const buildSlide = (spec: SlideSpec, index: number): Slide => {
  const sid = `s${index + 1}`
  const boxes = placeholders(spec.layout).map((p, i) => ({
    ...fill(p, p.role === "title" ? spec.title : p.role === "body" && i === placeholders(spec.layout).findIndex((q) => q.role === "body") ? spec.body : undefined),
    id: `${sid}-t${i + 1}`
  }))
  const pictures: ReadonlyArray<SlideElement> = (spec.pictures ?? []).map((p, i) => {
    const height = p.height ?? 200
    return {
      id: `${sid}-p${i + 1}`,
      name: libraryPicture(p.asset)?.name ?? "Малюнок",
      kind: "image",
      asset: p.asset,
      x: p.x,
      y: p.y,
      width: Math.round(height * (libraryPicture(p.asset)?.ratio ?? 1)),
      height,
      rotation: 0
    }
  })
  return {
    id: sid,
    layout: spec.layout,
    background: spec.background ?? "#ffffff",
    elements: [...boxes, ...pictures],
    hidden: false,
    transition: { effect: "none", duration: 1 },
    notes: ""
  }
}

/** An empty list gives one title slide. */
export const buildDeck = (specs: ReadonlyArray<SlideSpec>): Deck => ({
  slides: (specs.length > 0 ? specs : [{ layout: "title" as const }]).map(buildSlide)
})
