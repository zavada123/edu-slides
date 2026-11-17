import type { Goal } from "../core/goals.ts"
import type { SlideSpec } from "../core/start.ts"

/** The skill an exercise trains: the catalog groups exercises of one grade by it. */
export type ScenarioTopic = "slides" | "text" | "pictures" | "design" | "animation"

export const TOPIC_NAMES: Readonly<Record<ScenarioTopic, string>> = {
  slides: "Слайди",
  text: "Текст на слайдах",
  pictures: "Малюнки й фігури",
  design: "Оформлення",
  animation: "Анімація й показ"
}

/** One exercise: the deck at the start, what to do, and how to check it. */
export interface Scenario {
  readonly id: string
  /** School grade shown on the task card; 0 hides it. */
  readonly grade: number
  readonly title: string
  /** The task as the student reads it. Short sentences, one action each. */
  readonly task: ReadonlyArray<string>
  /** Slides at the start; an empty list gives one empty title slide. */
  readonly start: ReadonlyArray<SlideSpec>
  readonly goals: ReadonlyArray<Goal>
  readonly topic?: ScenarioTopic
  /** One line for the catalog card. */
  readonly summary?: string
  /** Paths of the topic passports in EduProstir this exercise belongs to (`inf3-21`). */
  readonly passports?: ReadonlyArray<string>
}
