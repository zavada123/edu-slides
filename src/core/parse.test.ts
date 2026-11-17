import { describe, expect, test } from "vitest"
import { LIMITS } from "./model.ts"
import { parseDeck, safeUrl } from "./parse.ts"
import { buildDeck } from "./start.ts"

const raw = (): Record<string, unknown> =>
  JSON.parse(JSON.stringify(buildDeck([{ layout: "title", title: "Привіт" }, { layout: "blank", pictures: [{ asset: "library:cat", x: 10, y: 10 }] }])))

const slidesOf = (d: Record<string, unknown>) => d.slides as Array<Record<string, unknown>>
const elementsOf = (d: Record<string, unknown>, i: number) => slidesOf(d)[i]?.elements as Array<Record<string, unknown>>

describe("parseDeck", () => {
  test("reads back a deck it was given", () => {
    const deck = buildDeck([{ layout: "title", title: "Привіт" }])
    expect(parseDeck(JSON.parse(JSON.stringify(deck)))).toEqual(deck)
  })

  test("keeps markup in text as plain text, never drops or runs it", () => {
    const d = raw()
    const title = elementsOf(d, 0)[0] as Record<string, unknown>
    title.text = '<img src=x onerror="alert(1)">'
    const deck = parseDeck(d)
    const first = deck?.slides[0]?.elements[0]
    expect(first?.kind === "text" && first.text).toBe('<img src=x onerror="alert(1)">')
  })

  test("drops fields it does not know", () => {
    const d = raw()
    ;(elementsOf(d, 0)[0] as Record<string, unknown>).onclick = "alert(1)"
    d.html = "<script>"
    const deck = parseDeck(d)
    expect(deck).not.toBeNull()
    expect(JSON.stringify(deck)).not.toContain("alert")
    expect(JSON.stringify(deck)).not.toContain("script")
  })

  test.each(["javascript:alert(1)", "data:text/html,<script>alert(1)</script>", "http://example.com", "https://user:pw@example.com", " JAVASCRIPT:alert(1)"])(
    "refuses a deck with the link %s",
    (url) => {
      const d = raw()
      ;(elementsOf(d, 0)[0] as Record<string, unknown>).link = { url }
      expect(parseDeck(d)).toBeNull()
    }
  )

  test("accepts https links and links to its own slides", () => {
    const d = raw()
    ;(elementsOf(d, 0)[0] as Record<string, unknown>).link = { url: "https://eduprostir.com/a" }
    ;(elementsOf(d, 1)[0] as Record<string, unknown>).link = { slide: "s1" }
    const deck = parseDeck(d)
    expect(deck?.slides[0]?.elements[0]?.link).toEqual({ url: "https://eduprostir.com/a" })
    expect(deck?.slides[1]?.elements[0]?.link).toEqual({ slide: "s1" })
  })

  test("drops a link to a slide that is not in the deck", () => {
    const d = raw()
    ;(elementsOf(d, 1)[0] as Record<string, unknown>).link = { slide: "nope" }
    expect(parseDeck(d)?.slides[1]?.elements[0]?.link).toBeUndefined()
  })

  test.each(["https://evil.example/x.png", "javascript:alert(1)", "data:image/svg+xml,<svg onload=alert(1)>", "library:../../etc", "upload:a/b"])(
    "refuses the picture %s",
    (asset) => {
      const d = raw()
      ;(elementsOf(d, 1)[0] as Record<string, unknown>).asset = asset
      expect(parseDeck(d)).toBeNull()
    }
  )

  test("accepts a stored upload id", () => {
    const d = raw()
    ;(elementsOf(d, 1)[0] as Record<string, unknown>).asset = "upload:3f2a-11"
    expect(parseDeck(d)).not.toBeNull()
  })

  test("refuses bad colours, fonts and ids", () => {
    const bad: Array<(d: Record<string, unknown>) => void> = [
      (d) => void (slidesOf(d)[0]!.background = "red; background:url(x)"),
      (d) => void ((elementsOf(d, 0)[0]!.style as Record<string, unknown>).font = "Arial; x"),
      (d) => void (elementsOf(d, 0)[0]!.id = "<b>")
    ]
    for (const spoil of bad) {
      const d = raw()
      spoil(d)
      expect(parseDeck(d)).toBeNull()
    }
  })

  test("refuses decks over the limits and cuts long text", () => {
    const many = raw()
    many.slides = Array.from({ length: LIMITS.slides + 1 }, (_, i) => ({ ...slidesOf(raw())[0], id: `x${i}` }))
    expect(parseDeck(many)).toBeNull()

    const long = raw()
    ;(elementsOf(long, 0)[0] as Record<string, unknown>).text = "а".repeat(LIMITS.textLength + 50)
    const t = parseDeck(long)?.slides[0]?.elements[0]
    expect(t?.kind === "text" && t.text.length).toBe(LIMITS.textLength)
  })

  test("refuses duplicate slide ids and non-objects", () => {
    const d = raw()
    slidesOf(d)[1]!.id = "s1"
    expect(parseDeck(d)).toBeNull()
    expect(parseDeck(null)).toBeNull()
    expect(parseDeck("deck")).toBeNull()
    expect(parseDeck({ slides: [] })).toBeNull()
  })
})

describe("safeUrl", () => {
  test("returns a normalised https address or null", () => {
    expect(safeUrl("https://eduprostir.com")).toBe("https://eduprostir.com/")
    expect(safeUrl("ftp://x")).toBeNull()
    expect(safeUrl("not a url")).toBeNull()
  })
})
