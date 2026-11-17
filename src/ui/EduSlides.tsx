import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { checkGoals, type GoalResult, allMet } from "../core/goals.ts"
import type { Deck, SlideElement } from "../core/model.ts"
import { EFFECT_NAMES } from "../core/model.ts"
import * as ops from "../core/ops.ts"
import { buildDeck } from "../core/start.ts"
import type { Scenario } from "../scenarios/types.ts"
import { useFullScreen } from "./fullscreen.ts"
import type { ResolveAsset } from "./pictures.ts"
import { Ribbon, type RibbonActions, type Tab } from "./Ribbon.tsx"
import { SlideCanvas } from "./SlideCanvas.tsx"
import { SlideShow } from "./SlideShow.tsx"
import { TaskPanel } from "./TaskPanel.tsx"
import { Thumbs } from "./Thumbs.tsx"

export interface EduSlidesProps {
  readonly scenario: Scenario
  /** A deck saved earlier: the trainer starts from it instead of the scenario start. Parse it with `parseDeck` first. */
  readonly initialDeck?: Deck
  /** The whole deck after every change, to save the answer. */
  readonly onChange?: (deck: Deck) => void
  readonly onCheck?: (solved: boolean) => void
  /** `false` hides «Перевірити» when the site grades the answer. Default `true`. */
  readonly selfCheck?: boolean
  /** Shows «Наступна вправа» after a solved check. */
  readonly onNext?: () => void
  /** Address of a picture the student uploaded (`upload:<id>`), served by the site. */
  readonly resolveAsset?: ResolveAsset
}

interface History {
  readonly past: ReadonlyArray<Deck>
  readonly present: Deck
  readonly future: ReadonlyArray<Deck>
}

const HISTORY_LIMIT = 100

const isTyping = (t: EventTarget | null): boolean =>
  t instanceof HTMLElement && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable)

/** The presentation trainer: ribbon, slide list, the slide, the task card and the show. */
export const EduSlides = ({ scenario, initialDeck, onChange, onCheck, selfCheck = true, onNext, resolveAsset }: EduSlidesProps) => {
  const start = useMemo(() => initialDeck ?? buildDeck(scenario.start), [scenario, initialDeck])
  const [history, setHistory] = useState<History>({ past: [], present: start, future: [] })
  const deck = history.present
  const [currentId, setCurrentId] = useState(start.slides[0]?.id ?? "")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>("home")
  const [showAt, setShowAt] = useState<number | null>(null)
  const [results, setResults] = useState<ReadonlyArray<GoalResult> | null>(null)
  const [taskOpen, setTaskOpen] = useState(true)
  const { full, toggle: toggleFull } = useFullScreen()
  const root = useRef<HTMLDivElement>(null)

  const slide = deck.slides.find((s) => s.id === currentId) ?? deck.slides[0]
  const slideIndex = slide ? deck.slides.indexOf(slide) : 0
  const selected = slide?.elements.find((e) => e.id === selectedId)

  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const commit = useCallback((f: (d: Deck) => Deck) => {
    setHistory((h) => {
      const next = f(h.present)
      if (next === h.present) return h
      onChangeRef.current?.(next)
      return { past: [...h.past, h.present].slice(-HISTORY_LIMIT), present: next, future: [] }
    })
    setResults(null)
  }, [])

  const undo = useCallback(() => {
    setHistory((h) => {
      const prev = h.past[h.past.length - 1]
      if (!prev) return h
      onChangeRef.current?.(prev)
      return { past: h.past.slice(0, -1), present: prev, future: [h.present, ...h.future] }
    })
    setEditingId(null)
  }, [])

  const redo = useCallback(() => {
    setHistory((h) => {
      const next = h.future[0]
      if (!next) return h
      onChangeRef.current?.(next)
      return { past: [...h.past, h.present], present: next, future: h.future.slice(1) }
    })
    setEditingId(null)
  }, [])

  const sid = slide?.id ?? ""
  const patchSelected = useCallback(
    (patch: Partial<SlideElement>) => {
      if (selectedId) commit((d) => ops.updateElement(d, sid, selectedId, patch))
    },
    [commit, selectedId, sid]
  )

  const select = (id: string | null) => {
    setSelectedId(id)
    if (id === null) setEditingId(null)
  }

  const pickSlide = (id: string) => {
    setCurrentId(id)
    setSelectedId(null)
    setEditingId(null)
  }

  const insert = (el: SlideElement) => {
    commit((d) => ops.addElement(d, sid, el))
    setSelectedId(el.id)
  }

  const actions: RibbonActions = {
    undo,
    redo,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    newSlide: (layout) => {
      let created = ""
      commit((d) => {
        const r = ops.addSlide(d, slideIndex, layout)
        created = r.slideId
        return r.deck
      })
      if (created) pickSlide(created)
    },
    duplicateSlide: () => {
      let created = ""
      commit((d) => {
        const r = ops.duplicateSlide(d, sid)
        created = r.slideId
        return r.deck
      })
      if (created) pickSlide(created)
    },
    deleteSlide: () => {
      const neighbour = deck.slides[slideIndex + 1] ?? deck.slides[slideIndex - 1]
      commit((d) => ops.deleteSlide(d, sid))
      if (neighbour) pickSlide(neighbour.id)
    },
    setLayout: (layout) => commit((d) => ops.changeLayout(d, sid, layout)),
    setStyle: (patch) => {
      if (selected && (selected.kind === "text" || selected.kind === "shape")) patchSelected({ style: { ...selected.style, ...patch } })
    },
    setFill: (fill) => selected?.kind === "shape" && patchSelected({ fill }),
    arrange: (where) => selectedId && commit((d) => ops.reorderElement(d, sid, selectedId, where)),
    deleteElement: () => {
      if (!selectedId) return
      commit((d) => ops.deleteElement(d, sid, selectedId))
      select(null)
    },
    insertText: () => {
      const box = ops.newTextBox()
      insert(box)
      setEditingId(box.id)
    },
    insertShape: (shape) => insert(ops.newShape(shape)),
    insertPicture: (asset) => insert(ops.newPicture(asset)),
    setBackground: (color) => commit((d) => ops.updateSlide(d, sid, { background: color })),
    backgroundToAll: () => slide && commit((d) => ops.setBackgroundAll(d, slide.background)),
    setTransition: (effect) => commit((d) => ops.updateSlide(d, sid, { transition: { effect, duration: slide?.transition.duration ?? 1 } })),
    transitionToAll: () => slide && commit((d) => ops.setTransitionAll(d, slide.transition)),
    setAnimation: (group, effect) =>
      selected && patchSelected({ animation: { group, effect, start: selected.animation?.start ?? "click", duration: selected.animation?.duration ?? (effect === "appear" || effect === "disappear" ? 0.25 : 1) } }),
    setAnimationStart: (s) => selected?.animation && patchSelected({ animation: { ...selected.animation, start: s } }),
    removeAnimation: () => selectedId && commit((d) => ops.clearElementField(d, sid, selectedId, "animation")),
    showFromStart: () => setShowAt(0),
    showFromCurrent: () => setShowAt(slideIndex)
  }

  // Keyboard shortcuts of a presentation program, while the trainer has the focus or nothing else does.
  const actionsRef = useRef(actions)
  actionsRef.current = actions
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (showAt !== null || isTyping(e.target)) return
      const inside = root.current?.contains(document.activeElement) || document.activeElement === document.body
      if (!inside) return
      const a = actionsRef.current
      const ctrl = e.ctrlKey || e.metaKey
      const key = e.key.toLowerCase()
      const run = (f: () => void) => {
        e.preventDefault()
        f()
      }
      if (e.key === "F5") run(e.shiftKey ? a.showFromCurrent : a.showFromStart)
      else if (ctrl && (key === "z" || key === "я")) run(e.shiftKey ? a.redo : a.undo)
      else if (ctrl && (key === "y" || key === "н")) run(a.redo)
      else if (ctrl && (key === "m" || key === "ь")) run(() => a.newSlide("titleContent"))
      else if (ctrl && (key === "b" || key === "и")) run(() => {
        const el = selectedRef.current
        if (el && el.kind !== "image") a.setStyle({ bold: !el.style.bold })
      })
      else if ((e.key === "Delete" || e.key === "Backspace") && selectedRef.current) run(a.deleteElement)
      else if (e.key === "Escape" && selectedRef.current) run(() => select(null))
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [showAt])
  const selectedRef = useRef(selected)
  selectedRef.current = selected

  const check = () => {
    const r = checkGoals(deck, scenario.goals)
    setResults(r)
    onCheck?.(allMet(r))
  }

  const reset = () => {
    const fresh = buildDeck(scenario.start)
    setHistory({ past: [...history.past, deck].slice(-HISTORY_LIMIT), present: fresh, future: [] })
    onChange?.(fresh)
    pickSlide(fresh.slides[0]?.id ?? "")
    setResults(null)
  }

  if (!slide) return null
  return (
    <div className={`esl-root ${full ? "is-full" : ""}`} ref={root} lang="uk">
      <TaskPanel
        scenario={scenario}
        results={results}
        open={taskOpen}
        selfCheck={selfCheck}
        full={full}
        onToggleFull={toggleFull}
        onNext={onNext}
        onToggle={() => setTaskOpen((o) => !o)}
        onCheck={check}
        onReset={reset}
      />
      <div className="esl-app">
        <Ribbon tab={tab} onTab={setTab} slide={slide} selected={selected} actions={actions} />
        <div className="esl-main">
          <Thumbs slides={deck.slides} current={slide.id} resolveAsset={resolveAsset} onPick={pickSlide} onMove={(from, to) => commit((d) => ops.moveSlide(d, from, to))} />
          <SlideCanvas
            slide={slide}
            selectedId={selectedId}
            editingId={editingId}
            resolveAsset={resolveAsset}
            onSelect={select}
            onEdit={setEditingId}
            onChange={(id, patch) => commit((d) => ops.updateElement(d, sid, id, patch))}
          />
        </div>
        <div className="esl-status">
          Слайд {slideIndex + 1} з {deck.slides.length}
          {selected && <span> · {selected.name}{selected.animation ? ` · анімація «${EFFECT_NAMES[selected.animation.effect]}»` : ""}</span>}
        </div>
      </div>
      {showAt !== null && <SlideShow deck={deck} startAt={showAt} resolveAsset={resolveAsset} onClose={() => setShowAt(null)} />}
    </div>
  )
}
