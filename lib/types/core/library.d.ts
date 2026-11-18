/**
 * The picture library: ids, names and proportions. The pictures themselves live in the UI (`src/ui/pictures`), so
 * this file is safe for Node. Every picture is original work drawn for this package.
 */
export interface LibraryPicture {
    readonly id: string;
    readonly name: string;
    /** Album the picture belongs to, for the «Малюнок» menu and for goals like «фото з екскурсії». */
    readonly album: string;
    /** Width / height of the drawing. */
    readonly ratio: number;
}
export declare const LIBRARY: ReadonlyArray<LibraryPicture>;
export declare const libraryPicture: (id: string) => LibraryPicture | undefined;
/** Ids the model accepts: library pictures, and files the site stored for the student (`upload:` + letters, digits, `-`). */
export declare const isAssetId: (id: string) => boolean;
