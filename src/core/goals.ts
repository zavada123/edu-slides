import { libraryPicture } from "./library.ts"
import {
  type Align,
  type Color,
  type Deck,
  type Effect,
  type EffectGroup,
  type Font,
  type Layout,
  LAYOUT_NAMES,
  PALETTE,
  SLIDE_HEIGHT,
  SLIDE_WIDTH,
  type ShapeKind,
  SHAPE_NAMES,
  type Slide,
  type SlideElement,
  type TextElement,
  type TextRole,
  TRANSITION_NAMES,
  type TransitionEffect
} from "./model.ts"
import { slideTitle } from "./ops.ts"

/**
 * Which slides a goal looks at, numbered from 1 as the student sees them:
 * a number is that slide; `"any"` is met when some slide fits; `"all"` needs every slide;
 * `{ from, to }` needs every slide of the range (and the range must exist).
 */
export type Slides = number | "any" | "all" | { readonly from: number; readonly to?: number }

interface GoalBase {
  /** What the student reads in the task list; a default is made from the goal. */
  readonly text?: string
  /** Shown when the goal is not met. */
  readonly hint?: string
}

export interface StyleNeed {
  readonly bold?: boolean
  readonly italic?: boolean
  readonly underline?: boolean
  readonly color?: Color
  readonly minSize?: number
  readonly font?: Font
  readonly align?: Align
}

/** Conditions a scenario checks on the final deck. Authors pick them from this list, no programming needed. */
export type Goal = GoalBase &
  (
    | { readonly type: "slideCount"; readonly min?: number; readonly max?: number }
    /** The slides with these titles go in this order (other slides may stand between them). */
    | { readonly type: "slideOrder"; readonly titles: ReadonlyArray<string> }
    | { readonly type: "layout"; readonly slides: Slides; readonly layout: Layout }
    /** A text box of the role (any role when absent) is filled; `equals` / `contains` ignore case and extra spaces. */
    | {
        readonly type: "text"
        readonly slides?: Slides
        readonly role?: TextRole | ReadonlyArray<TextRole>
        readonly equals?: string
        readonly contains?: string
      }
    | {
        readonly type: "textStyle"
        readonly slides?: Slides
        readonly role?: TextRole | ReadonlyArray<TextRole>
        readonly contains?: string
        readonly style: StyleNeed
      }
    | {
        readonly type: "picture"
        readonly slides?: Slides
        readonly asset?: string
        readonly album?: string
        readonly minWidth?: number
        readonly maxWidth?: number
        /** The picture keeps the proportions of the drawing (it was not squashed). */
        readonly keepRatio?: boolean
      }
    | { readonly type: "shape"; readonly slides?: Slides; readonly shape?: ShapeKind }
    /** Background of the slides; any colour but white when `color` is absent. Near shades count. */
    | { readonly type: "background"; readonly slides?: Slides; readonly color?: Color }
    /** No object sticks out of the slide. */
    | { readonly type: "inside"; readonly slides?: Slides }
    | { readonly type: "transition"; readonly slides?: Slides; readonly effect?: TransitionEffect }
    | {
        readonly type: "animation"
        readonly slides?: Slides
        readonly kind?: SlideElement["kind"]
        readonly group?: EffectGroup
        readonly effect?: Effect
      }
  )

export interface GoalResult {
  readonly goal: Goal
  readonly ok: boolean
  readonly text: string
  readonly hint: string
}

const norm = (s: string): string => s.replace(/[’ʼ`]/g, "'").replace(/\s+/g, " ").trim().toLocaleLowerCase("uk")

const roles = (role: TextRole | ReadonlyArray<TextRole> | undefined): ReadonlyArray<TextRole> | null =>
  role === undefined ? null : typeof role === "string" ? [role] : role

const textsOf = (slide: Slide, role: TextRole | ReadonlyArray<TextRole> | undefined): ReadonlyArray<TextElement> => {
  const wanted = roles(role)
  return slide.elements.filter((e): e is TextElement => e.kind === "text" && (wanted === null || wanted.includes(e.role)))
}

const hex = (c: Color): [number, number, number] => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16)) as [number, number, number]

/** Colours count as the same when they are near: a student picks «блакитний» from a palette or a slightly other shade. */
export const nearColor = (a: Color, b: Color): boolean => {
  const [r1, g1, b1] = hex(a)
  const [r2, g2, b2] = hex(b)
  return Math.hypot(r1 - r2, g1 - g2, b1 - b2) <= 60
}

const colorName = (c: Color): string => PALETTE.find((p) => nearColor(p.color, c))?.name ?? c

/** Checks `test` on the slides a goal names. */
const onSlides = (deck: Deck, slides: Slides, test: (s: Slide) => boolean): boolean => {
  const list = deck.slides
  if (slides === "any") return list.some(test)
  if (slides === "all") return list.every(test)
  if (typeof slides === "number") {
    const s = list[slides - 1]
    return s !== undefined && test(s)
  }
  const to = Math.min(slides.to ?? list.length, list.length)
  if (to < slides.from) return false
  return list.slice(slides.from - 1, to).every(test)
}

const slidesLabel = (slides: Slides): string => {
  if (slides === "any") return "На слайді"
  if (slides === "all") return "На всіх слайдах"
  if (typeof slides === "number") return `На слайді ${slides}`
  return slides.to === undefined ? `На слайдах з ${slides.from}-го` : `На слайдах ${slides.from}–${slides.to}`
}

const ROLE_WORDS: Readonly<Record<TextRole, string>> = { title: "заголовок", body: "текст", caption: "напис" }

const roleWord = (role: TextRole | ReadonlyArray<TextRole> | undefined): string => {
  const list = roles(role)
  return list === null ? "напис" : list.map((r) => ROLE_WORDS[r]).join(" або ")
}

const styleWords = (s: StyleNeed): string =>
  [
    s.bold ? "жирний" : null,
    s.italic ? "курсив" : null,
    s.underline ? "підкреслений" : null,
    s.color ? colorName(s.color) : null,
    s.minSize ? `розмір не менше ${s.minSize}` : null,
    s.font ? `шрифт ${s.font}` : null,
    s.align ? { left: "ліворуч", center: "по центру", right: "праворуч" }[s.align] : null
  ]
    .filter((w) => w !== null)
    .join(", ")

export const describeGoal = (goal: Goal): string => {
  if (goal.text !== undefined) return goal.text
  switch (goal.type) {
    case "slideCount":
      if (goal.min !== undefined && goal.max !== undefined) {
        return goal.min === goal.max ? `У презентації ${goal.min} слайдів` : `У презентації від ${goal.min} до ${goal.max} слайдів`
      }
      return goal.min !== undefined ? `У презентації не менше ${goal.min} слайдів` : `У презентації не більше ${goal.max ?? 0} слайдів`
    case "slideOrder":
      return `Слайди йдуть у порядку: ${goal.titles.join(" → ")}`
    case "layout":
      return `${slidesLabel(goal.slides)} макет «${LAYOUT_NAMES[goal.layout]}»`
    case "text": {
      const where = slidesLabel(goal.slides ?? "any")
      if (goal.equals !== undefined) return `${where} ${roleWord(goal.role)} «${goal.equals}»`
      if (goal.contains !== undefined) return `${where} ${roleWord(goal.role)} зі словом «${goal.contains}»`
      return `${where} заповнено ${roleWord(goal.role)}`
    }
    case "textStyle":
      return `${slidesLabel(goal.slides ?? "any")} ${roleWord(goal.role)}${goal.contains ? ` «${goal.contains}»` : ""}: ${styleWords(goal.style)}`
    case "picture": {
      const what = goal.asset ? `малюнок «${libraryPicture(goal.asset)?.name ?? goal.asset}»` : goal.album ? `фото з альбому «${goal.album}»` : "малюнок"
      const size = goal.minWidth ? `, ширший за ${goal.minWidth}` : goal.maxWidth ? `, вужчий за ${goal.maxWidth}` : ""
      return `${slidesLabel(goal.slides ?? "any")} є ${what}${size}${goal.keepRatio ? " без спотворення" : ""}`
    }
    case "shape":
      return `${slidesLabel(goal.slides ?? "any")} є фігура${goal.shape ? ` «${SHAPE_NAMES[goal.shape]}»` : ""}`
    case "background":
      return `${slidesLabel(goal.slides ?? "all")} тло ${goal.color ? colorName(goal.color) : "кольорове"}`
    case "inside":
      return `${slidesLabel(goal.slides ?? "all")} усі об'єкти в межах слайда`
    case "transition":
      return `${slidesLabel(goal.slides ?? "all")} є перехід${goal.effect ? ` «${TRANSITION_NAMES[goal.effect]}»` : ""}`
    case "animation":
      return `${slidesLabel(goal.slides ?? "any")} ${goal.kind === "image" ? "малюнок має" : goal.kind === "text" ? "напис має" : "є об'єкт з"} анімацією${goal.group ? ` групи «${{ entrance: "Вхід", emphasis: "Виділення", exit: "Вихід" }[goal.group]}»` : ""}`
  }
}

const DEFAULT_HINTS: Readonly<Record<Goal["type"], string>> = {
  slideCount: "Новий слайд додає кнопка «Створити слайд» на вкладці «Основне».",
  slideOrder: "Перетягни ескіз слайда в лівій панелі на потрібне місце.",
  layout: "Макет слайда змінює кнопка «Макет» на вкладці «Основне».",
  text: "Клацни двічі по рамці напису і набери текст.",
  textStyle: "Виділи напис і зміни шрифт на вкладці «Основне».",
  picture: "Малюнки є на вкладці «Вставлення» › «Малюнок». Розмір змінюють кутові маркери.",
  shape: "Фігури є на вкладці «Вставлення» › «Фігури».",
  background: "Колір тла змінюють на вкладці «Конструктор».",
  inside: "Перетягни об'єкти так, щоб вони не виходили за край слайда.",
  transition: "Перехід вибирають на вкладці «Переходи».",
  animation: "Виділи об'єкт і вибери ефект на вкладці «Анімація»."
}

const near = (a: string, b: string): boolean => norm(a) === norm(b)

const meetsStyle = (t: TextElement, s: StyleNeed): boolean =>
  (s.bold === undefined || t.style.bold === s.bold) &&
  (s.italic === undefined || t.style.italic === s.italic) &&
  (s.underline === undefined || t.style.underline === s.underline) &&
  (s.color === undefined || nearColor(t.style.color, s.color)) &&
  (s.minSize === undefined || t.style.size >= s.minSize) &&
  (s.font === undefined || t.style.font === s.font) &&
  (s.align === undefined || t.style.align === s.align)

/** Corners of an element's box after rotation about its top-left corner (as Konva rotates). */
const corners = (e: SlideElement): ReadonlyArray<[number, number]> => {
  const a = (e.rotation * Math.PI) / 180
  const cos = Math.cos(a)
  const sin = Math.sin(a)
  return ([[0, 0], [e.width, 0], [0, e.height], [e.width, e.height]] as const).map(([dx, dy]) => [e.x + dx * cos - dy * sin, e.y + dx * sin + dy * cos])
}

/** A few units of slack: a student drags by hand. */
const EDGE_SLACK = 4

const isInside = (e: SlideElement): boolean =>
  corners(e).every(([x, y]) => x >= -EDGE_SLACK && y >= -EDGE_SLACK && x <= SLIDE_WIDTH + EDGE_SLACK && y <= SLIDE_HEIGHT + EDGE_SLACK)

/** An empty placeholder is not shown in the show, so it does not count as sticking out. */
const isVisible = (e: SlideElement): boolean => !(e.kind === "text" && e.text.trim() === "")

const RATIO_SLACK = 0.08

const check = (deck: Deck, goal: Goal): boolean => {
  switch (goal.type) {
    case "slideCount":
      return deck.slides.length >= (goal.min ?? 0) && deck.slides.length <= (goal.max ?? Infinity)
    case "slideOrder": {
      const titles = deck.slides.map((s) => norm(slideTitle(s)))
      const positions = goal.titles.map((t) => titles.indexOf(norm(t)))
      return positions.every((p, i) => p >= 0 && (i === 0 || p > (positions[i - 1] ?? -1)))
    }
    case "layout":
      return onSlides(deck, goal.slides, (s) => s.layout === goal.layout)
    case "text":
      return onSlides(deck, goal.slides ?? "any", (s) =>
        textsOf(s, goal.role).some((t) =>
          goal.equals !== undefined
            ? near(t.text, goal.equals)
            : goal.contains !== undefined
              ? norm(t.text).includes(norm(goal.contains))
              : t.text.trim() !== ""
        )
      )
    case "textStyle":
      return onSlides(deck, goal.slides ?? "any", (s) =>
        textsOf(s, goal.role).some(
          (t) => t.text.trim() !== "" && (goal.contains === undefined || norm(t.text).includes(norm(goal.contains))) && meetsStyle(t, goal.style)
        )
      )
    case "picture":
      return onSlides(deck, goal.slides ?? "any", (s) =>
        s.elements.some((e) => {
          if (e.kind !== "image") return false
          const pic = libraryPicture(e.asset)
          if (goal.asset !== undefined && e.asset !== goal.asset) return false
          if (goal.album !== undefined && pic?.album !== goal.album) return false
          if (goal.minWidth !== undefined && e.width < goal.minWidth) return false
          if (goal.maxWidth !== undefined && e.width > goal.maxWidth) return false
          if (goal.keepRatio && pic && Math.abs(e.width / e.height - pic.ratio) / pic.ratio > RATIO_SLACK) return false
          return true
        })
      )
    case "shape":
      return onSlides(deck, goal.slides ?? "any", (s) => s.elements.some((e) => e.kind === "shape" && (goal.shape === undefined || e.shape === goal.shape)))
    case "background":
      return onSlides(deck, goal.slides ?? "all", (s) => (goal.color === undefined ? !nearColor(s.background, "#ffffff") : nearColor(s.background, goal.color)))
    case "inside":
      return onSlides(deck, goal.slides ?? "all", (s) => s.elements.filter(isVisible).every(isInside))
    case "transition":
      return onSlides(deck, goal.slides ?? "all", (s) => (goal.effect === undefined ? s.transition.effect !== "none" : s.transition.effect === goal.effect))
    case "animation":
      return onSlides(deck, goal.slides ?? "any", (s) =>
        s.elements.some(
          (e) =>
            e.animation !== undefined &&
            (goal.kind === undefined || e.kind === goal.kind) &&
            (goal.group === undefined || e.animation.group === goal.group) &&
            (goal.effect === undefined || e.animation.effect === goal.effect)
        )
      )
  }
}

export const checkGoals = (deck: Deck, goals: ReadonlyArray<Goal>): ReadonlyArray<GoalResult> =>
  goals.map((goal) => ({ goal, ok: check(deck, goal), text: describeGoal(goal), hint: goal.hint ?? DEFAULT_HINTS[goal.type] }))

export const allMet = (results: ReadonlyArray<GoalResult>): boolean => results.length > 0 && results.every((r) => r.ok)
