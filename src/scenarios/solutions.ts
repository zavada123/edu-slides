/** Reference solutions: what a student does, through the same operations as the editor. Used by the tests. */
import type { Deck, TextElement } from "../core/model.ts"
import {
  addElement,
  addSlide,
  moveSlide,
  newPicture,
  newTextBox,
  setBackgroundAll,
  setTransitionAll,
  updateElement
} from "../core/ops.ts"

const titleOf = (deck: Deck, index: number): TextElement => {
  const t = deck.slides[index]?.elements.find((e): e is TextElement => e.kind === "text" && e.role === "title")
  if (!t) throw new Error(`slide ${index + 1} has no title`)
  return t
}

const bodyOf = (deck: Deck, index: number): TextElement => {
  const t = deck.slides[index]?.elements.find((e): e is TextElement => e.kind === "text" && e.role === "body")
  if (!t) throw new Error(`slide ${index + 1} has no body`)
  return t
}

const slideId = (deck: Deck, index: number): string => deck.slides[index]?.id ?? ""

export const solutions: Readonly<Record<string, (start: Deck) => Deck>> = {
  "g3-autumn-slide": (start) => {
    const { deck } = addSlide(start, 0, "titleContent")
    const s = slideId(deck, 1)
    const withTitle = updateElement(deck, s, titleOf(deck, 1).id, { text: "осінь " })
    return updateElement(withTitle, s, bodyOf(withTitle, 1).id, { text: "Падає листя." })
  },
  "g3-seasons-order": (start) => {
    // Літо, Зима, Осінь, Весна → Зима, Весна, Літо, Осінь
    const a = moveSlide(start, 2, 1) // Зима, Літо, Осінь, Весна
    const b = moveSlide(a, 4, 2) // Зима, Весна, Літо, Осінь
    return b
  },
  "g3-big-snowman": (start) => {
    const s = slideId(start, 0)
    const pic = start.slides[0]?.elements.find((e) => e.kind === "image")
    if (!pic) throw new Error("no snowman")
    return updateElement(start, s, pic.id, { x: 300, y: 120, width: pic.width * 3, height: pic.height * 3 })
  },
  "g3-photo-album": (start) => {
    let deck = start
    for (const [i, asset] of ["library:museum", "library:castle", "library:park"].entries()) {
      deck = addSlide(deck, i, "blank").deck
      const s = slideId(deck, i + 1)
      deck = addElement(deck, s, { ...newPicture(asset), y: 60 })
      deck = addElement(deck, s, { ...newTextBox("Ми тут були"), y: 420 })
    }
    return deck
  },
  "g4-sky-background": (start) => setBackgroundAll(start, "#a5dcf7"),
  "g4-fair-title": (start) => {
    const t = titleOf(start, 0)
    return updateElement(start, slideId(start, 0), t.id, { style: { ...t.style, bold: true, color: "#dc2626", size: 60 } })
  },
  "g4-fish-animation": (start) => {
    const fish = start.slides[1]?.elements.find((e) => e.kind === "image")
    if (!fish) throw new Error("no fish")
    const animated = updateElement(start, slideId(start, 1), fish.id, { animation: { group: "entrance", effect: "flyIn", start: "click", duration: 1 } })
    return setTransitionAll(animated, { effect: "fade", duration: 1 })
  }
}
