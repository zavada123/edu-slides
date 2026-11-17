import type Konva from "konva"
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import { Layer, Stage } from "react-konva"
import type { Deck, Slide, SlideElement } from "../core/model.ts"
import { SLIDE_HEIGHT, SLIDE_WIDTH } from "../core/model.ts"
import type { ResolveAsset } from "./pictures.ts"
import { SlideElements } from "./SlideElements.tsx"

interface StepItem {
  readonly el: SlideElement
  /** Seconds after the click. */
  readonly delay: number
}

/** Groups a slide's animations into clicks: «За клацанням» starts a new click, «Разом» and «Після» join the last one. */
export const animationSteps = (slide: Slide): ReadonlyArray<ReadonlyArray<StepItem>> => {
  const steps: StepItem[][] = []
  let lastDelay = 0
  let lastDuration = 0
  for (const el of slide.elements) {
    const a = el.animation
    if (!a) continue
    const current = steps[steps.length - 1]
    if (a.start === "click" || !current) {
      steps.push([{ el, delay: 0 }])
      lastDelay = 0
    } else {
      lastDelay = a.start === "with" ? lastDelay : lastDelay + lastDuration
      current.push({ el, delay: lastDelay })
    }
    lastDuration = a.duration
  }
  return steps
}

const useWindowFit = (): number => {
  const fit = () => Math.min(window.innerWidth, (window.innerHeight * SLIDE_WIDTH) / SLIDE_HEIGHT)
  const [width, setWidth] = useState(fit)
  useEffect(() => {
    const on = () => setWidth(fit())
    window.addEventListener("resize", on)
    return () => window.removeEventListener("resize", on)
  }, [])
  return width
}

/** Puts a node in the state before its effect: entrance objects wait unseen. */
const prepare = (node: Konva.Group, el: SlideElement) => {
  node.opacity(el.animation?.group === "entrance" ? 0 : 1)
  node.position({ x: el.x, y: el.y })
  node.scale({ x: 1, y: 1 })
  node.rotation(el.rotation)
}

/** Puts a node in the state after its effect, for a slide the show comes back to. */
const finish = (node: Konva.Group, el: SlideElement) => {
  prepare(node, el)
  node.opacity(el.animation?.group === "exit" ? 0 : 1)
}

const play = (node: Konva.Group, el: SlideElement, delay: number) => {
  const a = el.animation
  if (!a) return
  const d = a.duration
  const run = () => {
    switch (a.effect) {
      case "appear":
        node.opacity(1)
        break
      case "fade":
        node.to({ opacity: 1, duration: d })
        break
      case "flyIn":
        node.y(SLIDE_HEIGHT + 20)
        node.opacity(1)
        node.to({ y: el.y, duration: d })
        break
      case "zoomIn":
        node.scale({ x: 0.2, y: 0.2 })
        node.position({ x: el.x + el.width * 0.4, y: el.y + el.height * 0.4 })
        node.opacity(1)
        node.to({ scaleX: 1, scaleY: 1, x: el.x, y: el.y, duration: d })
        break
      case "pulse":
        node.to({ scaleX: 1.12, scaleY: 1.12, x: el.x - el.width * 0.06, y: el.y - el.height * 0.06, duration: d / 2, onFinish: () => node.to({ scaleX: 1, scaleY: 1, x: el.x, y: el.y, duration: d / 2 }) })
        break
      case "spin":
        node.to({ rotation: el.rotation + 360, duration: d, onFinish: () => node.rotation(el.rotation) })
        break
      case "disappear":
        node.opacity(0)
        break
      case "fadeOut":
        node.to({ opacity: 0, duration: d })
        break
      case "flyOut":
        node.to({ y: SLIDE_HEIGHT + 20, duration: d, onFinish: () => node.opacity(0) })
        break
    }
  }
  if (delay > 0) window.setTimeout(run, delay * 1000)
  else run()
}

interface Props {
  readonly deck: Deck
  readonly startAt: number
  readonly resolveAsset: ResolveAsset | undefined
  readonly onClose: () => void
}

/** The slide show over the whole screen: clicks, arrows, space and Enter go on, Esc ends it. */
export const SlideShow = ({ deck, startAt, resolveAsset, onClose }: Props) => {
  const shown = deck.slides.filter((s) => !s.hidden)
  const first = Math.max(0, shown.findIndex((s) => s.id === deck.slides[startAt]?.id))
  const [pos, setPos] = useState({ index: first, step: 0, built: false })
  const [leaving, setLeaving] = useState<string | null>(null)
  const width = useWindowFit()
  const scale = width / SLIDE_WIDTH
  const nodes = useRef(new Map<string, Konva.Group>())
  const box = useRef<HTMLDivElement>(null)
  const linkClicked = useRef(false)
  const slide = shown[pos.index]
  const steps = slide ? animationSteps(slide) : []

  const nodeRef = useCallback((id: string, node: Konva.Group | null) => {
    if (node) nodes.current.set(id, node)
    else nodes.current.delete(id)
  }, [])

  // A new slide: objects wait for their clicks, or show the end state when the show came back to it.
  useLayoutEffect(() => {
    if (!slide) return
    for (const el of slide.elements) {
      const node = nodes.current.get(el.id)
      if (node) (pos.built ? finish : prepare)(node, el)
    }
    nodes.current.forEach((n) => n.getLayer()?.batchDraw())
    // Only when the slide changes; steps run below.
  }, [slide?.id, pos.built])

  const next = useCallback(() => {
    if (!slide) return onClose()
    if (!pos.built && pos.step < steps.length) {
      for (const item of steps[pos.step] ?? []) {
        const node = nodes.current.get(item.el.id)
        if (node) play(node, item.el, item.delay)
      }
      setPos({ ...pos, step: pos.step + 1 })
      return
    }
    setPos({ index: pos.index + 1, step: 0, built: false })
  }, [slide, pos, steps, onClose])

  const prev = useCallback(() => {
    if (pos.index > 0) setPos({ index: Math.min(pos.index, shown.length) - 1, step: 0, built: true })
  }, [pos.index, shown.length])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (leaving !== null) return
      if (["ArrowRight", "ArrowDown", "PageDown", " ", "Enter", "n"].includes(e.key)) {
        e.preventDefault()
        next()
      } else if (["ArrowLeft", "ArrowUp", "PageUp", "Backspace", "p"].includes(e.key)) {
        e.preventDefault()
        prev()
      } else if (e.key === "Escape") {
        e.preventDefault()
        onClose()
      } else if (e.key === "Home") setPos({ index: 0, step: 0, built: false })
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [next, prev, onClose, leaving])

  useEffect(() => {
    const el = box.current
    if (el && typeof el.requestFullscreen === "function" && document.fullscreenEnabled) void el.requestFullscreen().catch(() => undefined)
    const onChange = () => {
      if (!document.fullscreenElement) onClose()
    }
    document.addEventListener("fullscreenchange", onChange)
    return () => {
      document.removeEventListener("fullscreenchange", onChange)
      if (document.fullscreenElement) void document.exitFullscreen().catch(() => undefined)
    }
  }, [onClose])

  const onLink = (el: SlideElement) => {
    if (!el.link) return
    linkClicked.current = true
    if ("slide" in el.link) {
      const target = shown.findIndex((s) => "slide" in el.link! && s.id === el.link.slide)
      if (target >= 0) setPos({ index: target, step: 0, built: false })
    } else setLeaving(el.link.url)
  }

  const transition = slide?.transition ?? { effect: "none", duration: 1 }
  return (
    <div
      className="esl-show"
      ref={box}
      role="dialog"
      aria-label="Показ слайдів"
      onClick={() => {
        if (linkClicked.current) {
          linkClicked.current = false
          return
        }
        if (leaving === null) next()
      }}
      onContextMenu={(e) => {
        e.preventDefault()
        prev()
      }}
    >
      {slide ? (
        <div key={slide.id} className={`esl-show-slide esl-tr-${transition.effect}`} style={{ width, height: width * (SLIDE_HEIGHT / SLIDE_WIDTH), animationDuration: `${transition.duration}s` }}>
          <Stage width={width} height={width * (SLIDE_HEIGHT / SLIDE_WIDTH)} scaleX={scale} scaleY={scale}>
            <Layer>
              <SlideElements slide={slide} resolveAsset={resolveAsset} nodeRef={nodeRef} onLinkClick={onLink} />
            </Layer>
          </Stage>
        </div>
      ) : (
        <p className="esl-show-end">Кінець показу слайдів. Клацніть, щоб вийти.</p>
      )}
      <button type="button" className="esl-show-close" aria-label="Завершити показ (Esc)" title="Завершити показ (Esc)" onClick={(e) => { e.stopPropagation(); onClose() }}>
        ✕
      </button>
      {leaving !== null && (
        <div className="esl-leave" role="alertdialog" aria-label="Перехід на інший сайт" onClick={(e) => e.stopPropagation()}>
          <p>Посилання веде на інший сайт:</p>
          <p className="esl-leave-url">{leaving}</p>
          <div className="esl-leave-actions">
            <a href={leaving} target="_blank" rel="noopener noreferrer nofollow" referrerPolicy="no-referrer" onClick={() => setLeaving(null)}>
              Відкрити
            </a>
            <button type="button" onClick={() => setLeaving(null)}>
              Залишитися
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
