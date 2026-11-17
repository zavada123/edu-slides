import type { GoalResult } from "../core/goals.ts"
import type { Scenario } from "../scenarios/types.ts"

interface Props {
  readonly scenario: Scenario
  readonly results: ReadonlyArray<GoalResult> | null
  readonly open: boolean
  readonly selfCheck: boolean
  readonly full: boolean
  readonly onToggleFull: () => void
  readonly onNext: (() => void) | undefined
  readonly onToggle: () => void
  readonly onCheck: () => void
  readonly onReset: () => void
}

const ExpandIcon = ({ full }: { readonly full: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {full ? <path d="M8 3v5H3M12 3v5h5M8 17v-5H3M12 17v-5h5" /> : <path d="M3 8V3h5M17 8V3h-5M3 12v5h5M17 12v5h-5" />}
  </svg>
)

/** The task card: what to do, «Перевірити» and the result of each condition. Same layout as in edu-sheets. */
export const TaskPanel = ({ scenario, results, open, selfCheck, full, onToggleFull, onNext, onToggle, onCheck, onReset }: Props) => {
  const solved = results !== null && results.length > 0 && results.every((r) => r.ok)
  return (
    <div className={`esl-task ${open ? "is-open" : ""}`}>
      <div className="esl-task-head">
        {scenario.grade > 0 && <span className="esl-grade">{scenario.grade} клас</span>}
        <h2>{scenario.title}</h2>
        <button type="button" className="esl-icon-btn" aria-pressed={full} aria-label={full ? "Вийти з повного екрана" : "На весь екран"} title={full ? "Вийти з повного екрана (Esc)" : "На весь екран"} onClick={onToggleFull}>
          <ExpandIcon full={full} />
        </button>
        <button type="button" className="esl-icon-btn" aria-expanded={open} aria-label={open ? "Сховати завдання" : "Показати завдання"} onClick={onToggle}>
          {open ? "▴" : "▾"}
        </button>
      </div>
      {open && (
        <>
          <ol className="esl-task-steps">
            {scenario.task.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <div className="esl-task-actions">
            {selfCheck && (
              <button type="button" className="esl-check" data-command="task.check" onClick={onCheck}>
                Перевірити
              </button>
            )}
            <button type="button" className="esl-reset" onClick={onReset}>
              Почати спочатку
            </button>
          </div>
          {results !== null && (
            <div className={`esl-results ${solved ? "is-solved" : ""}`} role="status">
              <p className="esl-results-head">{solved ? "🎉 Молодець! Усе виконано." : `Виконано ${results.filter((r) => r.ok).length} з ${results.length}`}</p>
              <ul>
                {results.map((r) => (
                  <li key={r.text} className={r.ok ? "is-ok" : "is-bad"}>
                    <span aria-hidden="true">{r.ok ? "✅" : "❌"}</span> {r.text}
                    {!r.ok && r.hint !== "" && <small>{r.hint}</small>}
                  </li>
                ))}
              </ul>
              {solved && onNext !== undefined && (
                <button type="button" className="esl-next" onClick={onNext}>
                  Наступна вправа →
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
