/** Reference solutions: what a student does, through the same operations as the editor. Used by the tests. */
import type { Deck } from "../core/model.ts";
export declare const solutions: Readonly<Record<string, (start: Deck) => Deck>>;
