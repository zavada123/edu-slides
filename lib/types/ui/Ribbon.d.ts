import { type AnimationStart, type Effect, type EffectGroup, type Layout, type ShapeKind, type Slide, type SlideElement, type TextStyle, type TransitionEffect } from "../core/model.ts";
export type Tab = "home" | "insert" | "design" | "transitions" | "animations" | "show";
export interface RibbonActions {
    readonly undo: () => void;
    readonly redo: () => void;
    readonly canUndo: boolean;
    readonly canRedo: boolean;
    readonly newSlide: (layout: Layout) => void;
    readonly duplicateSlide: () => void;
    readonly deleteSlide: () => void;
    readonly setLayout: (layout: Layout) => void;
    readonly setStyle: (patch: Partial<TextStyle>) => void;
    readonly setFill: (color: string) => void;
    readonly arrange: (where: "front" | "back") => void;
    readonly deleteElement: () => void;
    readonly insertText: () => void;
    readonly insertShape: (shape: ShapeKind) => void;
    readonly insertPicture: (asset: string) => void;
    readonly setBackground: (color: string) => void;
    readonly backgroundToAll: () => void;
    readonly setTransition: (effect: TransitionEffect) => void;
    readonly transitionToAll: () => void;
    readonly setAnimation: (group: EffectGroup, effect: Effect) => void;
    readonly setAnimationStart: (start: AnimationStart) => void;
    readonly removeAnimation: () => void;
    readonly showFromStart: () => void;
    readonly showFromCurrent: () => void;
}
interface Props {
    readonly tab: Tab;
    readonly onTab: (tab: Tab) => void;
    readonly slide: Slide;
    readonly selected: SlideElement | undefined;
    readonly actions: RibbonActions;
}
export declare const Ribbon: ({ tab, onTab, slide, selected, actions: a }: Props) => import("react").JSX.Element;
export {};
