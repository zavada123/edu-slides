import type { GoalResult } from "../core/goals.ts";
import type { Scenario } from "../scenarios/types.ts";
interface Props {
    readonly scenario: Scenario;
    readonly results: ReadonlyArray<GoalResult> | null;
    readonly open: boolean;
    readonly selfCheck: boolean;
    readonly full: boolean;
    readonly onToggleFull: () => void;
    readonly onNext: (() => void) | undefined;
    readonly onToggle: () => void;
    readonly onCheck: () => void;
    readonly onReset: () => void;
}
/** The task card: what to do, «Перевірити» and the result of each condition. Same layout as in edu-sheets. */
export declare const TaskPanel: ({ scenario, results, open, selfCheck, full, onToggleFull, onNext, onToggle, onCheck, onReset }: Props) => import("react").JSX.Element;
export {};
