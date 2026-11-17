import { describe, expect, test } from "vitest"
import { LIMITS } from "./model.ts"
import {
  addElement,
  addSlide,
  changeLayout,
  clearElementField,
  deleteElement,
  deleteSlide,
  duplicateSlide,
  moveSlide,
  newShape,
  newTextBox,
  reorderElement,
  slideTitle,
  updateElement
} from "./ops.ts"
import { buildDeck } from "./start.ts"

const three = () => buildDeck([{ layout: "title", title: "А" }, { layout: "titleOnly", title: "Б" }, { layout: "titleOnly", title: "В" }])
const titles = (d: ReturnType<typeof three>) => d.slides.map(slideTitle)

describe("ops", () => {
  test("never change the deck they get", () => {
    const deck = three()
    const frozen = JSON.stringify(deck)
    addSlide(deck, 0, "blank")
    moveSlide(deck, 0, 2)
    deleteSlide(deck, "s2")
    duplicateSlide(deck, "s1")
    updateElement(deck, "s1", "s1-t1", { text: "Х" })
    expect(JSON.stringify(deck)).toBe(frozen)
  })

  test("addSlide inserts after the index and takes the background before it", () => {
    const deck = buildDeck([{ layout: "title", background: "#9ed8f5" }])
    const { deck: next, slideId } = addSlide(deck, 0, "titleContent")
    expect(next.slides).toHaveLength(2)
    expect(next.slides[1]?.id).toBe(slideId)
    expect(next.slides[1]?.background).toBe("#9ed8f5")
    expect(next.slides[1]?.elements.map((e) => e.kind === "text" && e.role)).toEqual(["title", "body"])
  })

  test("addSlide stops at the limit", () => {
    let deck = buildDeck([{ layout: "blank" }])
    for (let i = 0; i < LIMITS.slides + 3; i++) deck = addSlide(deck, 0, "blank").deck
    expect(deck.slides).toHaveLength(LIMITS.slides)
  })

  test("moveSlide moves one slide and keeps the rest in order", () => {
    expect(titles(moveSlide(three(), 0, 2))).toEqual(["Б", "В", "А"])
    expect(titles(moveSlide(three(), 2, 0))).toEqual(["В", "А", "Б"])
    expect(titles(moveSlide(three(), 0, 9))).toEqual(["А", "Б", "В"])
  })

  test("deleteSlide keeps the last slide and drops links to the removed one", () => {
    const one = buildDeck([{ layout: "blank" }])
    expect(deleteSlide(one, "s1")).toBe(one)
    const linked = updateElement(three(), "s1", "s1-t1", { link: { slide: "s3" } })
    const after = deleteSlide(linked, "s3")
    expect(after.slides).toHaveLength(2)
    expect(after.slides[0]?.elements[0]?.link).toBeUndefined()
  })

  test("duplicateSlide gives the copy new ids", () => {
    const { deck, slideId } = duplicateSlide(three(), "s2")
    expect(titles(deck)).toEqual(["А", "Б", "Б", "В"])
    expect(slideId).not.toBe("s2")
    expect(deck.slides[2]?.elements[0]?.id).not.toBe(deck.slides[1]?.elements[0]?.id)
  })

  test("changeLayout adds missing placeholders and keeps the content", () => {
    const deck = changeLayout(three(), "s2", "titleContent")
    expect(slideTitle(deck.slides[1]!)).toBe("Б")
    expect(deck.slides[1]?.elements.filter((e) => e.kind === "text").length).toBe(2)
  })

  test("elements are added, reordered, cleared and deleted", () => {
    const box = newTextBox("Текст")
    const shape = newShape("star")
    let deck = addElement(addElement(three(), "s2", box), "s2", shape)
    deck = reorderElement(deck, "s2", shape.id, "back")
    expect(deck.slides[1]?.elements[0]?.id).toBe(shape.id)
    deck = updateElement(deck, "s2", box.id, { animation: { group: "entrance", effect: "fade", start: "click", duration: 1 } })
    deck = clearElementField(deck, "s2", box.id, "animation")
    expect(deck.slides[1]?.elements.find((e) => e.id === box.id)?.animation).toBeUndefined()
    deck = deleteElement(deck, "s2", box.id)
    expect(deck.slides[1]?.elements.some((e) => e.id === box.id)).toBe(false)
  })

  test("updateElement cannot change an element's id or kind", () => {
    const deck = updateElement(three(), "s1", "s1-t1", { id: "x", kind: "image" } as never)
    expect(deck.slides[0]?.elements[0]?.id).toBe("s1-t1")
    expect(deck.slides[0]?.elements[0]?.kind).toBe("text")
  })
})
