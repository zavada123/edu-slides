/** Maps an `upload:` id to the address where the site serves that file (same site, image content type). */
export type ResolveAsset = (id: string) => string | undefined;
export declare const pictureUrl: (id: string, resolve?: ResolveAsset) => string | undefined;
/** Loads a picture once per page; `undefined` while it loads or when it cannot be loaded. */
export declare const usePicture: (url: string | undefined) => HTMLImageElement | undefined;
