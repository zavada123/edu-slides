import { useEffect, useState } from "react"
import castle from "./pictures/castle.svg"
import cat from "./pictures/cat.svg"
import dog from "./pictures/dog.svg"
import fish from "./pictures/fish.svg"
import flower from "./pictures/flower.svg"
import leaf from "./pictures/leaf.svg"
import museum from "./pictures/museum.svg"
import park from "./pictures/park.svg"
import planet from "./pictures/planet.svg"
import rocket from "./pictures/rocket.svg"
import snowman from "./pictures/snowman.svg"
import sun from "./pictures/sun.svg"

/** Our own drawings, bundled with the package. Pictures a student uploads come from the site through `resolveAsset`. */
const LIBRARY_URLS: Readonly<Record<string, string>> = {
  "library:cat": cat,
  "library:dog": dog,
  "library:fish": fish,
  "library:snowman": snowman,
  "library:flower": flower,
  "library:sun": sun,
  "library:leaf": leaf,
  "library:rocket": rocket,
  "library:planet": planet,
  "library:museum": museum,
  "library:castle": castle,
  "library:park": park
}

/** Maps an `upload:` id to the address where the site serves that file (same site, image content type). */
export type ResolveAsset = (id: string) => string | undefined

export const pictureUrl = (id: string, resolve?: ResolveAsset): string | undefined =>
  LIBRARY_URLS[id] ?? (id.startsWith("upload:") ? resolve?.(id) : undefined)

const cache = new Map<string, HTMLImageElement>()

/** Loads a picture once per page; `undefined` while it loads or when it cannot be loaded. */
export const usePicture = (url: string | undefined): HTMLImageElement | undefined => {
  const [image, setImage] = useState<HTMLImageElement | undefined>(() => (url ? cache.get(url) : undefined))
  useEffect(() => {
    if (!url) return undefined
    const cached = cache.get(url)
    if (cached) {
      setImage(cached)
      return undefined
    }
    let alive = true
    const img = new Image()
    img.decoding = "async"
    img.onload = () => {
      cache.set(url, img)
      if (alive) setImage(img)
    }
    img.src = url
    return () => {
      alive = false
    }
  }, [url])
  return image
}
