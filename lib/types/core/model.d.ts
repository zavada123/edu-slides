/**
 * The presentation model. It holds plain text, numbers and ids only: no HTML, no URLs of pictures, no scripts.
 * Everything the student makes is shown through Konva (canvas) or React text nodes, so text can never become markup.
 */
/** Slide size in model units, 16:9. */
export declare const SLIDE_WIDTH = 960;
export declare const SLIDE_HEIGHT = 540;
/** A colour as `#rrggbb`. */
export type Color = string;
/** Fonts with Cyrillic that every device has or that the page loads. A student cannot type another name. */
export declare const FONTS: readonly ["Arial", "Georgia", "Verdana", "Trebuchet MS", "Courier New", "Comic Sans MS"];
export type Font = (typeof FONTS)[number];
export type Align = "left" | "center" | "right";
export interface TextStyle {
    readonly font: Font;
    /** Points as on the ribbon: 8…96. */
    readonly size: number;
    readonly color: Color;
    readonly bold: boolean;
    readonly italic: boolean;
    readonly underline: boolean;
    readonly align: Align;
}
export declare const DEFAULT_TEXT_STYLE: TextStyle;
/** What a text box is for: a layout puts a title or body placeholder; a caption is a box the student adds. */
export type TextRole = "title" | "body" | "caption";
export declare const SHAPES: readonly ["rect", "roundRect", "ellipse", "triangle", "star", "arrow", "callout"];
export type ShapeKind = (typeof SHAPES)[number];
/** Animation effects, grouped as in the textbooks: entrance, emphasis and exit. */
export declare const EFFECTS: {
    readonly entrance: readonly ["appear", "fade", "flyIn", "zoomIn"];
    readonly emphasis: readonly ["pulse", "spin"];
    readonly exit: readonly ["disappear", "fadeOut", "flyOut"];
};
export type EffectGroup = keyof typeof EFFECTS;
export type Effect = (typeof EFFECTS)[EffectGroup][number];
export type AnimationStart = "click" | "with" | "after";
export interface Animation {
    readonly group: EffectGroup;
    readonly effect: Effect;
    readonly start: AnimationStart;
    /** Seconds, 0.25…10. */
    readonly duration: number;
}
export declare const TRANSITIONS: readonly ["none", "fade", "push", "wipe", "zoom"];
export type TransitionEffect = (typeof TRANSITIONS)[number];
export interface Transition {
    readonly effect: TransitionEffect;
    readonly duration: number;
}
/** Where a click on an element leads during the show: another slide of this deck, or a web page by `https:`. */
export type Link = {
    readonly slide: string;
} | {
    readonly url: string;
};
interface ElementBase {
    readonly id: string;
    /** The name in the selection pane; triggers in grade 7 refer to objects by it. */
    readonly name: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    /** Degrees. */
    readonly rotation: number;
    readonly animation?: Animation;
    readonly link?: Link;
}
export interface TextElement extends ElementBase {
    readonly kind: "text";
    readonly role: TextRole;
    readonly text: string;
    readonly style: TextStyle;
    /** Background of the box; none when absent. */
    readonly fill?: Color;
}
export interface ShapeElement extends ElementBase {
    readonly kind: "shape";
    readonly shape: ShapeKind;
    readonly fill: Color;
    readonly stroke: Color;
    readonly text: string;
    readonly style: TextStyle;
}
export interface ImageElement extends ElementBase {
    readonly kind: "image";
    /** An id from the picture library (`library:cat`) or of a file the site stored (`upload:<id>`). Never a URL. */
    readonly asset: string;
}
export type SlideElement = TextElement | ShapeElement | ImageElement;
export declare const LAYOUTS: readonly ["title", "titleContent", "twoContent", "titleOnly", "blank"];
export type Layout = (typeof LAYOUTS)[number];
export interface Slide {
    readonly id: string;
    readonly layout: Layout;
    readonly background: Color;
    readonly elements: ReadonlyArray<SlideElement>;
    readonly hidden: boolean;
    readonly transition: Transition;
    readonly notes: string;
}
export interface Deck {
    readonly slides: ReadonlyArray<Slide>;
}
/** Limits for one deck: the page and the server refuse anything larger. */
export declare const LIMITS: {
    readonly slides: 40;
    readonly elementsPerSlide: 60;
    readonly textLength: 2000;
    readonly notesLength: 4000;
    readonly nameLength: 60;
    readonly idLength: 40;
};
export declare const LAYOUT_NAMES: Readonly<Record<Layout, string>>;
export declare const SHAPE_NAMES: Readonly<Record<ShapeKind, string>>;
export declare const EFFECT_NAMES: Readonly<Record<Effect, string>>;
export declare const GROUP_NAMES: Readonly<Record<EffectGroup, string>>;
export declare const TRANSITION_NAMES: Readonly<Record<TransitionEffect, string>>;
/** Colours on the palette, with names a teacher can use in a task («зроби тло блакитним»). */
export declare const PALETTE: ReadonlyArray<{
    readonly color: Color;
    readonly name: string;
}>;
export declare const isElementOf: <K extends SlideElement["kind"]>(kind: K) => (element: SlideElement) => element is Extract<SlideElement, {
    kind: K;
}>;
export {};
