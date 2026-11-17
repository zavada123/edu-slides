import { type Align, type Color, type Deck, type Effect, type EffectGroup, type Font, type Layout, type ShapeKind, type SlideElement, type TextRole, type TransitionEffect } from "./model.ts";
/**
 * Which slides a goal looks at, numbered from 1 as the student sees them:
 * a number is that slide; `"any"` is met when some slide fits; `"all"` needs every slide;
 * `{ from, to }` needs every slide of the range (and the range must exist).
 */
export type Slides = number | "any" | "all" | {
    readonly from: number;
    readonly to?: number;
};
interface GoalBase {
    /** What the student reads in the task list; a default is made from the goal. */
    readonly text?: string;
    /** Shown when the goal is not met. */
    readonly hint?: string;
}
export interface StyleNeed {
    readonly bold?: boolean;
    readonly italic?: boolean;
    readonly underline?: boolean;
    readonly color?: Color;
    readonly minSize?: number;
    readonly font?: Font;
    readonly align?: Align;
}
/** Conditions a scenario checks on the final deck. Authors pick them from this list, no programming needed. */
export type Goal = GoalBase & ({
    readonly type: "slideCount";
    readonly min?: number;
    readonly max?: number;
}
/** The slides with these titles go in this order (other slides may stand between them). */
 | {
    readonly type: "slideOrder";
    readonly titles: ReadonlyArray<string>;
} | {
    readonly type: "layout";
    readonly slides: Slides;
    readonly layout: Layout;
}
/** A text box of the role (any role when absent) is filled; `equals` / `contains` ignore case and extra spaces. */
 | {
    readonly type: "text";
    readonly slides?: Slides;
    readonly role?: TextRole | ReadonlyArray<TextRole>;
    readonly equals?: string;
    readonly contains?: string;
} | {
    readonly type: "textStyle";
    readonly slides?: Slides;
    readonly role?: TextRole | ReadonlyArray<TextRole>;
    readonly contains?: string;
    readonly style: StyleNeed;
} | {
    readonly type: "picture";
    readonly slides?: Slides;
    readonly asset?: string;
    readonly album?: string;
    readonly minWidth?: number;
    readonly maxWidth?: number;
    /** The picture keeps the proportions of the drawing (it was not squashed). */
    readonly keepRatio?: boolean;
} | {
    readonly type: "shape";
    readonly slides?: Slides;
    readonly shape?: ShapeKind;
}
/** Background of the slides; any colour but white when `color` is absent. Near shades count. */
 | {
    readonly type: "background";
    readonly slides?: Slides;
    readonly color?: Color;
}
/** No object sticks out of the slide. */
 | {
    readonly type: "inside";
    readonly slides?: Slides;
} | {
    readonly type: "transition";
    readonly slides?: Slides;
    readonly effect?: TransitionEffect;
} | {
    readonly type: "animation";
    readonly slides?: Slides;
    readonly kind?: SlideElement["kind"];
    readonly group?: EffectGroup;
    readonly effect?: Effect;
});
export interface GoalResult {
    readonly goal: Goal;
    readonly ok: boolean;
    readonly text: string;
    readonly hint: string;
}
/** Colours count as the same when they are near: a student picks «блакитний» from a palette or a slightly other shade. */
export declare const nearColor: (a: Color, b: Color) => boolean;
export declare const describeGoal: (goal: Goal) => string;
export declare const checkGoals: (deck: Deck, goals: ReadonlyArray<Goal>) => ReadonlyArray<GoalResult>;
export declare const allMet: (results: ReadonlyArray<GoalResult>) => boolean;
export {};
