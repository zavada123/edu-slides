import { type Slide, type SlideElement } from "../core/model.ts";
import type { ResolveAsset } from "./pictures.ts";
interface Props {
    readonly slide: Slide;
    readonly selectedId: string | null;
    readonly editingId: string | null;
    readonly resolveAsset: ResolveAsset | undefined;
    readonly onSelect: (id: string | null) => void;
    readonly onEdit: (id: string | null) => void;
    readonly onChange: (id: string, patch: Partial<SlideElement>) => void;
}
/** The slide being edited: drag, resize and rotate objects, double-click to type. */
export declare const SlideCanvas: ({ slide, selectedId, editingId, resolveAsset, onSelect, onEdit, onChange }: Props) => import("react").JSX.Element;
export {};
