import type { Deck } from "../core/model.ts";
import type { Scenario } from "../scenarios/types.ts";
import type { ResolveAsset } from "./pictures.ts";
export interface EduSlidesProps {
    readonly scenario: Scenario;
    /** A deck saved earlier: the trainer starts from it instead of the scenario start. Parse it with `parseDeck` first. */
    readonly initialDeck?: Deck;
    /** The whole deck after every change, to save the answer. */
    readonly onChange?: (deck: Deck) => void;
    readonly onCheck?: (solved: boolean) => void;
    /** `false` hides «Перевірити» when the site grades the answer. Default `true`. */
    readonly selfCheck?: boolean;
    /** Shows «Наступна вправа» after a solved check. */
    readonly onNext?: () => void;
    /** Address of a picture the student uploaded (`upload:<id>`), served by the site. */
    readonly resolveAsset?: ResolveAsset;
}
/** The presentation trainer: ribbon, slide list, the slide, the task card and the show. */
export declare const EduSlides: ({ scenario, initialDeck, onChange, onCheck, selfCheck, onNext, resolveAsset }: EduSlidesProps) => import("react").JSX.Element | null;
