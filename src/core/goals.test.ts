import { describe, expect, test } from "vitest"
import { checkGoals, describeGoal, type Goal, nearColor } from "./goals.ts"
import { updateElement } from "./ops.ts"
import { buildDeck } from "./start.ts"

const ok = (deck: ReturnType<typeof buildDeck>, goal: Goal): boolean => checkGoals(deck, [goal])[0]?.ok ?? false

describe("goals", () => {
  const deck = buildDeck([
    { layout: "title", title: "Мій  Кіт ", body: "3-Б" },
    { layout: "titleOnly", title: "Фото", background: "#9ed8f5", pictures: [{ asset: "library:cat", x: 100, y: 100 }] },
    { layout: "blank", background: "#a0d9f4", pictures: [{ asset: "library:park", x: 900, y: 100 }] }
  ])

  test("text ignores case, extra spaces and the kind of apostrophe", () => {
    expect(ok(deck, { type: "text", slides: 1, role: "title", equals: "мій кіт" })).toBe(true)
    expect(ok(deck, { type: "text", slides: 1, role: "title", contains: "КІТ" })).toBe(true)
    const apostrophe = updateElement(deck, "s1", "s1-t1", { text: "Об’єкт" })
    expect(ok(apostrophe, { type: "text", slides: 1, equals: "Об'єкт" })).toBe(true)
    expect(ok(deck, { type: "text", slides: 2, role: "body" })).toBe(false)
  })

  test("slide ranges need every slide of the range, and the range must exist", () => {
    expect(ok(deck, { type: "picture", slides: { from: 2 } })).toBe(true)
    expect(ok(deck, { type: "picture", slides: "all" })).toBe(false)
    expect(ok(deck, { type: "picture", slides: { from: 4 } })).toBe(false)
    expect(ok(deck, { type: "picture", slides: 7 })).toBe(false)
  })

  test("background accepts near shades", () => {
    expect(nearColor("#9ed8f5", "#a0d9f4")).toBe(true)
    expect(nearColor("#9ed8f5", "#2563eb")).toBe(false)
    expect(ok(deck, { type: "background", slides: { from: 2 }, color: "#9ed8f5" })).toBe(true)
    expect(ok(deck, { type: "background" })).toBe(false)
  })

  test("inside finds an object off the slide but ignores empty placeholders", () => {
    expect(ok(deck, { type: "inside", slides: 2 })).toBe(true)
    expect(ok(deck, { type: "inside", slides: 3 })).toBe(false)
    const rotated = updateElement(deck, "s2", "s2-p1", { x: 850, y: 100, rotation: 45 })
    expect(ok(rotated, { type: "inside", slides: 2 })).toBe(false)
  })

  test("keepRatio catches a squashed picture", () => {
    const squashed = updateElement(deck, "s2", "s2-p1", { width: 400, height: 200 })
    expect(ok(deck, { type: "picture", slides: 2, keepRatio: true })).toBe(true)
    expect(ok(squashed, { type: "picture", slides: 2, keepRatio: true })).toBe(false)
  })

  test("slideOrder allows slides in between", () => {
    expect(ok(deck, { type: "slideOrder", titles: ["Мій кіт", "Фото"] })).toBe(true)
    expect(ok(deck, { type: "slideOrder", titles: ["Фото", "Мій кіт"] })).toBe(false)
    expect(ok(deck, { type: "slideOrder", titles: ["Мій кіт", "Немає"] })).toBe(false)
  })

  test("every goal has Ukrainian text and a hint", () => {
    const goals: ReadonlyArray<Goal> = [
      { type: "slideCount", min: 2 },
      { type: "slideCount", min: 3, max: 3 },
      { type: "slideOrder", titles: ["А"] },
      { type: "layout", slides: 1, layout: "title" },
      { type: "text", equals: "А" },
      { type: "textStyle", style: { bold: true, color: "#dc2626", minSize: 40 } },
      { type: "picture", album: "Екскурсія", minWidth: 10 },
      { type: "shape", shape: "star" },
      { type: "background", color: "#9ed8f5" },
      { type: "inside" },
      { type: "transition", effect: "fade" },
      { type: "animation", kind: "image", group: "entrance" }
    ]
    for (const r of checkGoals(deck, goals)) {
      expect(r.text.length).toBeGreaterThan(5)
      expect(r.hint.length).toBeGreaterThan(5)
    }
    expect(describeGoal({ type: "textStyle", style: { color: "#dc2626" } })).toContain("червоний")
    expect(describeGoal({ type: "text", text: "Свій текст" })).toBe("Свій текст")
  })
})
