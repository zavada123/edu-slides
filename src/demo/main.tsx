import { StrictMode, useState } from "react"
import { createRoot } from "react-dom/client"
import { nextScenario, scenarioById, scenarios } from "../scenarios/index.ts"
import { EduSlides } from "../react.ts"
import "../ui/slides.css"
import "./demo.css"

const Demo = () => {
  const initial = new URLSearchParams(location.search).get("task") ?? scenarios[0]?.id ?? ""
  const [id, setId] = useState(scenarioById(initial)?.id ?? scenarios[0]?.id ?? "")
  const [solved, setSolved] = useState<ReadonlyArray<string>>([])
  const scenario = scenarioById(id)
  if (!scenario) return null
  const next = nextScenario(id)
  return (
    <main className="demo">
      <header className="demo-head">
        <h1>Тренажер «Презентації»</h1>
        <label>
          Вправа:{" "}
          <select value={id} onChange={(e) => setId(e.target.value)}>
            {scenarios.map((s) => (
              <option key={s.id} value={s.id}>
                {s.grade} кл. · {s.title} {solved.includes(s.id) ? "✓" : ""}
              </option>
            ))}
          </select>
        </label>
      </header>
      <EduSlides
        key={scenario.id}
        scenario={scenario}
        onCheck={(ok) => ok && setSolved((list) => (list.includes(id) ? list : [...list, id]))}
        {...(next ? { onNext: () => setId(next.id) } : {})}
      />
    </main>
  )
}

const root = document.getElementById("root")
if (root) createRoot(root).render(<StrictMode><Demo /></StrictMode>)
