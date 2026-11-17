/**
 * The picture library: ids, names and proportions. The pictures themselves live in the UI (`src/ui/pictures`), so
 * this file is safe for Node. Every picture is original work drawn for this package.
 */

export interface LibraryPicture {
  readonly id: string
  readonly name: string
  /** Album the picture belongs to, for the «Малюнок» menu and for goals like «фото з екскурсії». */
  readonly album: string
  /** Width / height of the drawing. */
  readonly ratio: number
}

export const LIBRARY: ReadonlyArray<LibraryPicture> = [
  { id: "library:cat", name: "Кіт", album: "Тварини", ratio: 1 },
  { id: "library:dog", name: "Пес Бублик", album: "Тварини", ratio: 1 },
  { id: "library:fish", name: "Риба", album: "Тварини", ratio: 1.5 },
  { id: "library:snowman", name: "Сніговик", album: "Пори року", ratio: 0.75 },
  { id: "library:flower", name: "Квітка", album: "Пори року", ratio: 0.75 },
  { id: "library:sun", name: "Сонце", album: "Пори року", ratio: 1 },
  { id: "library:leaf", name: "Осінній листок", album: "Пори року", ratio: 1 },
  { id: "library:rocket", name: "Ракета", album: "Космос", ratio: 0.6 },
  { id: "library:planet", name: "Планета", album: "Космос", ratio: 1.4 },
  { id: "library:museum", name: "Музей", album: "Екскурсія", ratio: 1.33 },
  { id: "library:castle", name: "Замок", album: "Екскурсія", ratio: 1.33 },
  { id: "library:park", name: "Парк", album: "Екскурсія", ratio: 1.33 }
]

const BY_ID = new Map(LIBRARY.map((p) => [p.id, p]))

export const libraryPicture = (id: string): LibraryPicture | undefined => BY_ID.get(id)

/** Ids the model accepts: library pictures, and files the site stored for the student (`upload:` + letters, digits, `-`). */
export const isAssetId = (id: string): boolean => BY_ID.has(id) || /^upload:[A-Za-z0-9-]{1,36}$/.test(id)
