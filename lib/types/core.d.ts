/** `edu-slides/core`: the deck model, editing operations, goals and grading. No React, no page: safe for Node. */
export * from "./core/model.ts";
export { LIBRARY, libraryPicture, isAssetId, type LibraryPicture } from "./core/library.ts";
export { parseDeck, safeUrl } from "./core/parse.ts";
export * from "./core/ops.ts";
export { checkGoals, allMet, describeGoal, nearColor, type Goal, type GoalResult, type Slides, type StyleNeed } from "./core/goals.ts";
export { grade, type Grade } from "./core/grade.ts";
export { buildDeck, buildSlide, type SlideSpec, type PictureSpec } from "./core/start.ts";
export { scenarios, scenarioById, nextScenario, TOPIC_NAMES, type Scenario, type ScenarioTopic } from "./scenarios/index.ts";
export { startDeck, referenceDeck } from "./scenarios/reference.ts";
