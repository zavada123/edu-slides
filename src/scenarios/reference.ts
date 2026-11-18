import { buildDeck } from "../core/start.ts"
import type { Deck } from "../core/model.ts"
import type { Scenario } from "./types.ts"
import { solutions } from "./solutions.ts"

/** The deck a scenario starts with. */
export const startDeck = (scenario: Scenario): Deck => buildDeck(scenario.start)

/** A deck that solves the scenario: the reference answer a teacher sees. `undefined` when the scenario has no solution. */
export const referenceDeck = (scenario: Scenario): Deck | undefined => solutions[scenario.id]?.(startDeck(scenario))
