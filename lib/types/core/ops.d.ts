import { type Deck, type ImageElement, type Layout, type ShapeElement, type ShapeKind, type Slide, type SlideElement, type TextElement, type Transition } from "./model.ts";
/** A short id, unique within a page. */
export declare const newId: (prefix: string) => string;
/** The placeholders a layout puts on a new slide, all empty. */
export declare const placeholders: (layout: Layout) => ReadonlyArray<TextElement>;
export declare const newSlide: (layout: Layout, background?: string) => Slide;
export declare const newDeck: (layout?: Layout) => Deck;
/** Inserts a slide after `index` (-1 puts it first). A new slide takes the background of the one before it. */
export declare const addSlide: (deck: Deck, index: number, layout: Layout) => {
    readonly deck: Deck;
    readonly slideId: string;
};
export declare const duplicateSlide: (deck: Deck, slideId: string) => {
    readonly deck: Deck;
    readonly slideId: string;
};
/** Removes a slide; the last slide stays (a deck has at least one). Links to it are dropped. */
export declare const deleteSlide: (deck: Deck, slideId: string) => Deck;
export declare const moveSlide: (deck: Deck, from: number, to: number) => Deck;
export declare const updateSlide: (deck: Deck, slideId: string, patch: Partial<Omit<Slide, "id" | "elements">>) => Deck;
/** Changes the layout and adds the placeholders the slide lacks; what the student made stays. */
export declare const changeLayout: (deck: Deck, slideId: string, layout: Layout) => Deck;
export declare const setBackgroundAll: (deck: Deck, background: string) => Deck;
export declare const setTransitionAll: (deck: Deck, transition: Transition) => Deck;
export declare const addElement: (deck: Deck, slideId: string, element: SlideElement) => Deck;
export declare const updateElement: (deck: Deck, slideId: string, elementId: string, patch: Partial<SlideElement>) => Deck;
/** Drops a field the patch type cannot unset (animation, link, fill). */
export declare const clearElementField: (deck: Deck, slideId: string, elementId: string, field: "animation" | "link" | "fill") => Deck;
export declare const deleteElement: (deck: Deck, slideId: string, elementId: string) => Deck;
/** Moves an element to the top (`front`) or the bottom of the slide. */
export declare const reorderElement: (deck: Deck, slideId: string, elementId: string, where: "front" | "back") => Deck;
/** A new text box in the middle of the slide. */
export declare const newTextBox: (text?: string) => TextElement;
export declare const newShape: (shape: ShapeKind) => ShapeElement;
/** A library picture, about a third of the slide high, in the middle. */
export declare const newPicture: (asset: string, ratio?: number) => ImageElement;
export declare const findSlide: (deck: Deck, slideId: string) => Slide | undefined;
/** The text of a slide's title placeholder, trimmed; "" when it has none. */
export declare const slideTitle: (slide: Slide) => string;
