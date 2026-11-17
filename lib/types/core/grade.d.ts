import { type GoalResult } from "./goals.ts";
import type { Scenario } from "../scenarios/types.ts";
export type Grade = {
    readonly status: "checked";
    readonly solved: boolean;
    readonly results: ReadonlyArray<GoalResult>;
}
/** The answer is not a deck, or is larger than `LIMITS`. */
 | {
    readonly status: "invalid";
};
/**
 * Grades a handed-in deck on the server. The deck is parsed again from the raw JSON and every goal is checked here,
 * so nothing the page claims is trusted.
 */
export declare const grade: (scenario: Scenario, answer: unknown) => Grade;
