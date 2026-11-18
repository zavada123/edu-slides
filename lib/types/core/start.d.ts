import { type Color, type Deck, type Layout, type Slide } from "./model.ts";
export interface PictureSpec {
    readonly asset: string;
    readonly x: number;
    readonly y: number;
    /** Height; the width follows the drawing's proportions. Default 200. */
    readonly height?: number;
}
export interface SlideSpec {
    readonly layout: Layout;
    readonly title?: string;
    /** Text of the body (or subtitle) placeholder. */
    readonly body?: string;
    readonly background?: Color;
    readonly pictures?: ReadonlyArray<PictureSpec>;
}
export declare const buildSlide: (spec: SlideSpec, index: number) => Slide;
/** An empty list gives one title slide. */
export declare const buildDeck: (specs: ReadonlyArray<SlideSpec>) => Deck;
