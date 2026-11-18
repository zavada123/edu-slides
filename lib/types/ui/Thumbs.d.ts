import type { Slide } from "../core/model.ts";
import type { ResolveAsset } from "./pictures.ts";
interface Props {
    readonly slides: ReadonlyArray<Slide>;
    readonly current: string;
    readonly resolveAsset: ResolveAsset | undefined;
    readonly onPick: (id: string) => void;
    readonly onMove: (from: number, to: number) => void;
}
/** The slide list: click to open a slide, drag a thumbnail (or use the arrows) to change the order. */
export declare const Thumbs: ({ slides, current, resolveAsset, onPick, onMove }: Props) => import("react").JSX.Element;
export {};
