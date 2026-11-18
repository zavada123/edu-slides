/**
 * Draws the objects of one slide with Konva. Text goes to canvas as plain strings, so nothing a student types can
 * become markup. Used by the editor, the thumbnails and the show.
 */
import type Konva from "konva";
import type { Slide, SlideElement } from "../core/model.ts";
import { type ResolveAsset } from "./pictures.ts";
export interface ElementHandlers {
    readonly onSelect?: (id: string) => void;
    readonly onEdit?: (id: string) => void;
    readonly onMoved?: (id: string, x: number, y: number) => void;
    readonly onLinkClick?: (el: SlideElement) => void;
}
interface Props extends ElementHandlers {
    readonly slide: Slide;
    /** Editor mode: draggable objects and dashed empty placeholders. */
    readonly editor?: boolean;
    readonly editingId?: string | null;
    readonly resolveAsset?: ResolveAsset | undefined;
    /** Konva nodes by element id, for the transformer and the show's animations. */
    readonly nodeRef?: (id: string, node: Konva.Group | null) => void;
}
export declare const SlideElements: ({ slide, editor, editingId, resolveAsset, nodeRef, onSelect, onEdit, onMoved, onLinkClick }: Props) => import("react").JSX.Element;
export {};
