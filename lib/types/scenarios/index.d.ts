import type { Scenario } from "./types.ts";
export type { Scenario, ScenarioTopic } from "./types.ts";
export { TOPIC_NAMES } from "./types.ts";
/** Exercises for grades 3–4 (textbooks «Я досліджую світ 3» and «Інформатика 4», Корнієнко та ін., Ранок). */
export declare const scenarios: ReadonlyArray<Scenario>;
export declare const scenarioById: (id: string) => Scenario | undefined;
/** The exercise after `id` in the list, for «Наступна вправа». */
export declare const nextScenario: (id: string) => Scenario | undefined;
