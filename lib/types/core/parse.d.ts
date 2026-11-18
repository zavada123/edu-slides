import { type Deck } from "./model.ts";
/** A web address a student may link to: `https:` only, no user name or password inside. */
export declare const safeUrl: (v: unknown) => string | null;
export declare const parseDeck: (input: unknown) => Deck | null;
