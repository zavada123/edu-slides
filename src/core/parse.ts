/**
 * Reads a deck from untrusted JSON (a saved answer, a request body). Every field is checked and copied, unknown fields
 * are dropped, strings are cut to the limits. Returns `null` for anything that is not a deck or is too large.
 */
import { isAssetId } from "./library.ts"
import {
  type Align,
  type Animation,
  type Color,
  type Deck,
  DEFAULT_TEXT_STYLE,
  EFFECTS,
  type EffectGroup,
  FONTS,
  LAYOUTS,
  LIMITS,
  type Link,
  SHAPES,
  type Slide,
  type SlideElement,
  type TextRole,
  type TextStyle,
  type Transition,
  TRANSITIONS
} from "./model.ts"

type Obj = Readonly<Record<string, unknown>>

class Invalid extends Error {}

const fail = (): never => {
  throw new Invalid()
}

const obj = (v: unknown): Obj => (typeof v === "object" && v !== null && !Array.isArray(v) ? (v as Obj) : fail())

const num = (v: unknown, min: number, max: number): number =>
  typeof v === "number" && Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : fail()

const bool = (v: unknown): boolean => (typeof v === "boolean" ? v : fail())

/** Text without control characters except line breaks and tabs, cut to `max`. */
const text = (v: unknown, max: number): string =>
  typeof v === "string" ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").slice(0, max) : fail()

const oneOf = <T extends string>(v: unknown, list: ReadonlyArray<T>): T => (list.includes(v as T) ? (v as T) : fail())

const id = (v: unknown): string => (typeof v === "string" && /^[A-Za-z0-9_-]{1,40}$/.test(v) ? v : fail())

const color = (v: unknown): Color => (typeof v === "string" && /^#[0-9a-f]{6}$/i.test(v) ? v.toLowerCase() : fail())

const COORD = 4 * 960

const style = (v: unknown): TextStyle => {
  const o = obj(v)
  return {
    font: oneOf(o.font ?? DEFAULT_TEXT_STYLE.font, FONTS),
    size: num(o.size ?? DEFAULT_TEXT_STYLE.size, 8, 96),
    color: color(o.color ?? DEFAULT_TEXT_STYLE.color),
    bold: bool(o.bold ?? false),
    italic: bool(o.italic ?? false),
    underline: bool(o.underline ?? false),
    align: oneOf<Align>(o.align ?? "left", ["left", "center", "right"])
  }
}

const animation = (v: unknown): Animation => {
  const o = obj(v)
  const group = oneOf<EffectGroup>(o.group, ["entrance", "emphasis", "exit"])
  return {
    group,
    effect: oneOf(o.effect, EFFECTS[group]),
    start: oneOf(o.start, ["click", "with", "after"] as const),
    duration: num(o.duration, 0.25, 10)
  }
}

/** Only links to a slide of this deck or to a `https:` page: `javascript:`, `data:` and the rest are refused. */
const link = (v: unknown, slideIds: ReadonlySet<string>): Link | undefined => {
  const o = obj(v)
  if (o.slide !== undefined) {
    const target = id(o.slide)
    return slideIds.has(target) ? { slide: target } : undefined
  }
  return { url: safeUrl(o.url) ?? fail() }
}

/** A web address a student may link to: `https:` only, no user name or password inside. */
export const safeUrl = (v: unknown): string | null => {
  if (typeof v !== "string" || v.length > 500) return null
  let url: URL
  try {
    url = new URL(v.trim())
  } catch {
    return null
  }
  if (url.protocol !== "https:" || url.username !== "" || url.password !== "") return null
  return url.href
}

const element = (v: unknown, slideIds: ReadonlySet<string>): SlideElement => {
  const o = obj(v)
  const base = {
    id: id(o.id),
    name: text(o.name ?? "", LIMITS.nameLength),
    x: num(o.x, -COORD, COORD),
    y: num(o.y, -COORD, COORD),
    width: num(o.width, 1, COORD),
    height: num(o.height, 1, COORD),
    rotation: num(o.rotation ?? 0, -360, 360)
  }
  const extra = {
    ...(o.animation === undefined ? {} : { animation: animation(o.animation) }),
    ...(o.link === undefined ? {} : (() => {
      const l = link(o.link, slideIds)
      return l === undefined ? {} : { link: l }
    })())
  }
  switch (o.kind) {
    case "text":
      return {
        ...base,
        ...extra,
        kind: "text",
        role: oneOf<TextRole>(o.role ?? "caption", ["title", "body", "caption"]),
        text: text(o.text, LIMITS.textLength),
        style: style(o.style ?? {}),
        ...(o.fill === undefined ? {} : { fill: color(o.fill) })
      }
    case "shape":
      return {
        ...base,
        ...extra,
        kind: "shape",
        shape: oneOf(o.shape, SHAPES),
        fill: color(o.fill),
        stroke: color(o.stroke),
        text: text(o.text ?? "", LIMITS.textLength),
        style: style(o.style ?? {})
      }
    case "image": {
      const asset = typeof o.asset === "string" && isAssetId(o.asset) ? o.asset : fail()
      return { ...base, ...extra, kind: "image", asset }
    }
    default:
      return fail()
  }
}

const transition = (v: unknown): Transition => {
  const o = obj(v)
  return { effect: oneOf(o.effect, TRANSITIONS), duration: num(o.duration, 0.25, 5) }
}

const slide = (v: unknown, slideIds: ReadonlySet<string>): Slide => {
  const o = obj(v)
  const elements = Array.isArray(o.elements) && o.elements.length <= LIMITS.elementsPerSlide ? o.elements : fail()
  const parsed = elements.map((e) => element(e, slideIds))
  if (new Set(parsed.map((e) => e.id)).size !== parsed.length) fail()
  return {
    id: id(o.id),
    layout: oneOf(o.layout, LAYOUTS),
    background: color(o.background),
    elements: parsed,
    hidden: bool(o.hidden ?? false),
    transition: transition(o.transition ?? { effect: "none", duration: 1 }),
    notes: text(o.notes ?? "", LIMITS.notesLength)
  }
}

export const parseDeck = (input: unknown): Deck | null => {
  try {
    const o = obj(input)
    const slides = Array.isArray(o.slides) && o.slides.length >= 1 && o.slides.length <= LIMITS.slides ? o.slides : fail()
    const ids = new Set(slides.map((s) => id(obj(s).id)))
    if (ids.size !== slides.length) fail()
    return { slides: slides.map((s) => slide(s, ids)) }
  } catch (e) {
    if (e instanceof Invalid) return null
    throw e
  }
}
