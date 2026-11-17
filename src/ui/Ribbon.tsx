import { type ReactNode, useEffect, useRef, useState } from "react"
import { LIBRARY } from "../core/library.ts"
import {
  type Align,
  type AnimationStart,
  EFFECT_NAMES,
  EFFECTS,
  type Effect,
  type EffectGroup,
  FONTS,
  GROUP_NAMES,
  type Layout,
  LAYOUT_NAMES,
  LAYOUTS,
  PALETTE,
  SHAPE_NAMES,
  type ShapeKind,
  SHAPES,
  type Slide,
  type SlideElement,
  type TextStyle,
  TRANSITION_NAMES,
  type TransitionEffect,
  TRANSITIONS
} from "../core/model.ts"
import { pictureUrl } from "./pictures.ts"

export type Tab = "home" | "insert" | "design" | "transitions" | "animations" | "show"

const TABS: ReadonlyArray<[Tab, string]> = [
  ["home", "Основне"],
  ["insert", "Вставлення"],
  ["design", "Конструктор"],
  ["transitions", "Переходи"],
  ["animations", "Анімація"],
  ["show", "Показ слайдів"]
]

const SIZES = [12, 14, 18, 20, 24, 28, 32, 36, 40, 44, 48, 54, 60, 66, 72, 80, 96]

export interface RibbonActions {
  readonly undo: () => void
  readonly redo: () => void
  readonly canUndo: boolean
  readonly canRedo: boolean
  readonly newSlide: (layout: Layout) => void
  readonly duplicateSlide: () => void
  readonly deleteSlide: () => void
  readonly setLayout: (layout: Layout) => void
  readonly setStyle: (patch: Partial<TextStyle>) => void
  readonly setFill: (color: string) => void
  readonly arrange: (where: "front" | "back") => void
  readonly deleteElement: () => void
  readonly insertText: () => void
  readonly insertShape: (shape: ShapeKind) => void
  readonly insertPicture: (asset: string) => void
  readonly setBackground: (color: string) => void
  readonly backgroundToAll: () => void
  readonly setTransition: (effect: TransitionEffect) => void
  readonly transitionToAll: () => void
  readonly setAnimation: (group: EffectGroup, effect: Effect) => void
  readonly setAnimationStart: (start: AnimationStart) => void
  readonly removeAnimation: () => void
  readonly showFromStart: () => void
  readonly showFromCurrent: () => void
}

interface Props {
  readonly tab: Tab
  readonly onTab: (tab: Tab) => void
  readonly slide: Slide
  readonly selected: SlideElement | undefined
  readonly actions: RibbonActions
}

/** A button of the ribbon. `command` names the action for guides and tests, as `data-u-command` does in edu-sheets. */
const Btn = ({ command, label, icon, onClick, disabled, pressed, wide }: {
  readonly command: string
  readonly label: string
  readonly icon?: ReactNode
  readonly onClick: () => void
  readonly disabled?: boolean
  readonly pressed?: boolean
  readonly wide?: boolean
}) => (
  <button
    type="button"
    className={`esl-btn ${wide ? "is-wide" : ""}`}
    data-command={command}
    title={label}
    aria-label={label}
    {...(pressed === undefined ? {} : { "aria-pressed": pressed })}
    disabled={disabled}
    onClick={onClick}
  >
    {icon !== undefined && <span className="esl-btn-icon" aria-hidden="true">{icon}</span>}
    {wide && <span className="esl-btn-label">{label}</span>}
  </button>
)

/** A button that opens a small panel under it (layouts, shapes, pictures, colours). */
const Menu = ({ command, label, icon, children, disabled }: {
  readonly command: string
  readonly label: string
  readonly icon: ReactNode
  readonly children: (close: () => void) => ReactNode
  readonly disabled?: boolean
}) => {
  const [open, setOpen] = useState(false)
  const [at, setAt] = useState({ top: 0, left: 0 })
  const box = useRef<HTMLDivElement>(null)
  // The ribbon scrolls sideways, which would cut a panel inside it: the panel is placed over the page instead.
  const toggle = () => {
    const r = box.current?.getBoundingClientRect()
    if (r) setAt({ top: r.bottom + 4, left: Math.max(8, Math.min(r.left, window.innerWidth - 280)) })
    setOpen((o) => !o)
  }
  useEffect(() => {
    if (!open) return undefined
    const away = (e: PointerEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false)
    }
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    document.addEventListener("pointerdown", away)
    document.addEventListener("keydown", esc)
    return () => {
      document.removeEventListener("pointerdown", away)
      document.removeEventListener("keydown", esc)
    }
  }, [open])
  return (
    <div className="esl-menu" ref={box}>
      <button type="button" className="esl-btn is-wide" data-command={command} title={label} aria-expanded={open} disabled={disabled} onClick={toggle}>
        <span className="esl-btn-icon" aria-hidden="true">{icon}</span>
        <span className="esl-btn-label">{label} ▾</span>
      </button>
      {open && <div className="esl-menu-panel" role="menu" style={at}>{children(() => setOpen(false))}</div>}
    </div>
  )
}

const Swatches = ({ command, current, onPick }: { readonly command: string; readonly current: string | undefined; readonly onPick: (c: string) => void }) => (
  <div className="esl-swatches">
    {PALETTE.map((p) => (
      <button
        type="button"
        key={p.color}
        className="esl-swatch"
        data-command={`${command}:${p.color}`}
        style={{ background: p.color }}
        title={p.name}
        aria-label={p.name}
        aria-pressed={current === p.color}
        onClick={() => onPick(p.color)}
      />
    ))}
  </div>
)

const Group = ({ title, children }: { readonly title: string; readonly children: ReactNode }) => (
  <div className="esl-group" role="group" aria-label={title}>
    <div className="esl-group-body">{children}</div>
    <div className="esl-group-title">{title}</div>
  </div>
)

const shapeIcon: Readonly<Record<ShapeKind, string>> = { rect: "▭", roundRect: "▢", ellipse: "◯", triangle: "△", star: "☆", arrow: "➜", callout: "💬" }

export const Ribbon = ({ tab, onTab, slide, selected, actions: a }: Props) => {
  const textual = selected && (selected.kind === "text" || selected.kind === "shape") ? selected : undefined
  const style = textual?.style
  return (
    <div className="esl-ribbon">
      <div className="esl-tabs" role="tablist">
        <div className="esl-quick">
          <Btn command="edit.undo" label="Скасувати (Ctrl+Z)" icon="↶" onClick={a.undo} disabled={!a.canUndo} />
          <Btn command="edit.redo" label="Повторити (Ctrl+Y)" icon="↷" onClick={a.redo} disabled={!a.canRedo} />
        </div>
        {TABS.map(([id, name]) => (
          <button type="button" key={id} role="tab" aria-selected={tab === id} data-tab={id} className="esl-tab" onClick={() => onTab(id)}>
            {name}
          </button>
        ))}
      </div>
      <div className="esl-panel" role="tabpanel">
        {tab === "home" && (
          <>
            <Group title="Слайди">
              <Menu command="slide.new" label="Створити слайд" icon="＋">
                {(close) =>
                  LAYOUTS.map((l) => (
                    <button type="button" key={l} role="menuitem" className="esl-menu-item" data-command={`slide.new:${l}`} onClick={() => { a.newSlide(l); close() }}>
                      <LayoutIcon layout={l} /> {LAYOUT_NAMES[l]}
                    </button>
                  ))
                }
              </Menu>
              <Menu command="slide.layout" label="Макет" icon="▤">
                {(close) =>
                  LAYOUTS.map((l) => (
                    <button type="button" key={l} role="menuitemradio" aria-checked={slide.layout === l} className="esl-menu-item" data-command={`slide.layout:${l}`} onClick={() => { a.setLayout(l); close() }}>
                      <LayoutIcon layout={l} /> {LAYOUT_NAMES[l]}
                    </button>
                  ))
                }
              </Menu>
              <Btn command="slide.duplicate" label="Дублювати слайд" icon="⧉" onClick={a.duplicateSlide} />
              <Btn command="slide.delete" label="Видалити слайд" icon="🗑" onClick={a.deleteSlide} />
            </Group>
            <Group title="Шрифт">
              <select className="esl-select" aria-label="Шрифт" data-command="format.font" disabled={!style} value={style?.font ?? "Arial"} onChange={(e) => a.setStyle({ font: e.target.value as TextStyle["font"] })}>
                {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
              <select className="esl-select is-narrow" aria-label="Розмір шрифту" data-command="format.size" disabled={!style} value={style?.size ?? 28} onChange={(e) => a.setStyle({ size: Number(e.target.value) })}>
                {[...new Set([...SIZES, style?.size ?? 28])].sort((x, y) => x - y).map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <Btn command="format.bold" label="Жирний (Ctrl+B)" icon={<b>Ж</b>} disabled={!style} pressed={style?.bold ?? false} onClick={() => a.setStyle({ bold: !style?.bold })} />
              <Btn command="format.italic" label="Курсив (Ctrl+I)" icon={<i>К</i>} disabled={!style} pressed={style?.italic ?? false} onClick={() => a.setStyle({ italic: !style?.italic })} />
              <Btn command="format.underline" label="Підкреслений (Ctrl+U)" icon={<u>П</u>} disabled={!style} pressed={style?.underline ?? false} onClick={() => a.setStyle({ underline: !style?.underline })} />
              <Menu command="format.color" label="Колір тексту" icon={<span className="esl-color-a" style={{ borderColor: style?.color ?? "#1f2937" }}>А</span>} disabled={!style}>
                {(close) => <Swatches command="format.color" current={style?.color} onPick={(c) => { a.setStyle({ color: c }); close() }} />}
              </Menu>
            </Group>
            <Group title="Абзац">
              {(["left", "center", "right"] as const satisfies ReadonlyArray<Align>).map((al) => (
                <Btn key={al} command={`format.align:${al}`} label={{ left: "Ліворуч", center: "По центру", right: "Праворуч" }[al]} icon={{ left: "⯇≡", center: "≡", right: "≡⯈" }[al]} disabled={!style} pressed={style?.align === al} onClick={() => a.setStyle({ align: al })} />
              ))}
            </Group>
            <Group title="Упорядкування">
              {selected?.kind === "shape" && (
                <Menu command="format.fill" label="Заливка" icon="🪣">
                  {(close) => <Swatches command="format.fill" current={selected.fill} onPick={(c) => { a.setFill(c); close() }} />}
                </Menu>
              )}
              <Btn command="arrange.front" label="На передній план" icon="⬒" disabled={!selected} onClick={() => a.arrange("front")} />
              <Btn command="arrange.back" label="На задній план" icon="⬓" disabled={!selected} onClick={() => a.arrange("back")} />
              <Btn command="element.delete" label="Видалити об'єкт (Delete)" icon="✕" disabled={!selected} onClick={a.deleteElement} />
            </Group>
          </>
        )}
        {tab === "insert" && (
          <>
            <Group title="Текст">
              <Btn command="insert.text" label="Напис" icon="🅰" wide onClick={a.insertText} />
            </Group>
            <Group title="Ілюстрації">
              <Menu command="insert.shape" label="Фігури" icon="△">
                {(close) => (
                  <div className="esl-grid">
                    {SHAPES.map((s) => (
                      <button type="button" key={s} className="esl-tile" data-command={`insert.shape:${s}`} title={SHAPE_NAMES[s]} aria-label={SHAPE_NAMES[s]} onClick={() => { a.insertShape(s); close() }}>
                        <span aria-hidden="true">{shapeIcon[s]}</span>
                      </button>
                    ))}
                  </div>
                )}
              </Menu>
              <Menu command="insert.picture" label="Малюнок" icon="🖼">
                {(close) => (
                  <div className="esl-pictures">
                    {[...new Set(LIBRARY.map((p) => p.album))].map((album) => (
                      <div key={album}>
                        <div className="esl-album">{album}</div>
                        <div className="esl-grid">
                          {LIBRARY.filter((p) => p.album === album).map((p) => (
                            <button type="button" key={p.id} className="esl-tile is-picture" data-command={`insert.picture:${p.id}`} title={p.name} aria-label={p.name} onClick={() => { a.insertPicture(p.id); close() }}>
                              <img src={pictureUrl(p.id)} alt="" />
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Menu>
            </Group>
          </>
        )}
        {tab === "design" && (
          <Group title="Тло слайда">
            <Swatches command="design.background" current={slide.background} onPick={a.setBackground} />
            <Btn command="design.background.all" label="Застосувати до всіх" icon="⤓" wide onClick={a.backgroundToAll} />
          </Group>
        )}
        {tab === "transitions" && (
          <Group title="Перехід до цього слайда">
            {TRANSITIONS.map((t) => (
              <Btn key={t} command={`transition:${t}`} label={TRANSITION_NAMES[t]} icon={{ none: "∅", fade: "◐", push: "⇠", wipe: "▥", zoom: "⤢" }[t]} wide pressed={slide.transition.effect === t} onClick={() => a.setTransition(t)} />
            ))}
            <Btn command="transition.all" label="Застосувати до всіх" icon="⤓" wide onClick={a.transitionToAll} />
          </Group>
        )}
        {tab === "animations" && (
          <>
            {(Object.keys(EFFECTS) as EffectGroup[]).map((g) => (
              <Group key={g} title={GROUP_NAMES[g]}>
                {EFFECTS[g].map((ef: Effect) => (
                  <Btn key={ef} command={`animation:${g}:${ef}`} label={EFFECT_NAMES[ef]} icon={{ entrance: "★", emphasis: "✶", exit: "☆" }[g]} wide disabled={!selected} pressed={selected?.animation?.effect === ef} onClick={() => a.setAnimation(g, ef)} />
                ))}
              </Group>
            ))}
            <Group title="Час">
              <select className="esl-select" aria-label="Початок анімації" data-command="animation.start" disabled={!selected?.animation} value={selected?.animation?.start ?? "click"} onChange={(e) => a.setAnimationStart(e.target.value as AnimationStart)}>
                <option value="click">За клацанням</option>
                <option value="with">Разом з попереднім</option>
                <option value="after">Після попереднього</option>
              </select>
              <Btn command="animation.remove" label="Прибрати анімацію" icon="✕" wide disabled={!selected?.animation} onClick={a.removeAnimation} />
            </Group>
            {!selected && <p className="esl-tip">Спершу клацни об'єкт на слайді.</p>}
          </>
        )}
        {tab === "show" && (
          <Group title="Почати показ">
            <Btn command="show.start" label="З початку (F5)" icon="▶" wide onClick={a.showFromStart} />
            <Btn command="show.current" label="З поточного слайда (Shift+F5)" icon="⏵" wide onClick={a.showFromCurrent} />
          </Group>
        )}
      </div>
    </div>
  )
}

/** A tiny picture of a layout for the menus. */
const LayoutIcon = ({ layout }: { readonly layout: Layout }) => (
  <svg width="40" height="24" viewBox="0 0 40 24" aria-hidden="true" className="esl-layout-icon">
    <rect x="0.5" y="0.5" width="39" height="23" fill="#fff" stroke="#9ca3af" />
    {layout === "title" && (<><rect x="6" y="7" width="28" height="5" fill="#6b7280" /><rect x="11" y="14" width="18" height="3" fill="#cbd5e1" /></>)}
    {(layout === "titleContent" || layout === "twoContent" || layout === "titleOnly") && <rect x="4" y="3" width="32" height="4" fill="#6b7280" />}
    {layout === "titleContent" && <rect x="4" y="9" width="32" height="12" fill="#cbd5e1" />}
    {layout === "twoContent" && (<><rect x="4" y="9" width="15" height="12" fill="#cbd5e1" /><rect x="21" y="9" width="15" height="12" fill="#cbd5e1" /></>)}
  </svg>
)
