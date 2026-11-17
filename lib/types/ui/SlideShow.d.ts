import type { Deck, Slide, SlideElement } from "../core/model.ts";
import type { ResolveAsset } from "./pictures.ts";
interface StepItem {
    readonly el: SlideElement;
    /** Seconds after the click. */
    readonly delay: number;
}
/** Groups a slide's animations into clicks: «За клацанням» starts a new click, «Разом» and «Після» join the last one. */
export declare const animationSteps: (slide: Slide) => ReadonlyArray<ReadonlyArray<StepItem>>;
interface Props {
    readonly deck: Deck;
    readonly startAt: number;
    readonly resolveAsset: ResolveAsset | undefined;
    readonly onClose: () => void;
}
/** The slide show over the whole screen: clicks, arrows, space and Enter go on, Esc ends it. */
export declare const SlideShow: ({ deck, startAt, resolveAsset, onClose }: Props) => import("react").JSX.Element;
export {};
