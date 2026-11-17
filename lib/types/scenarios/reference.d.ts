import type { Deck } from "../core/model.ts";
import type { Scenario } from "./types.ts";
/** The deck a scenario starts with. */
export declare const startDeck: (scenario: Scenario) => Deck;
/** A deck that solves the scenario: the reference answer a teacher sees. `undefined` when the scenario has no solution. */
export declare const referenceDeck: (scenario: Scenario) => Deck | undefined;
