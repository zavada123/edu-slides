import type { Scenario } from "./types.ts"

export type { Scenario, ScenarioTopic } from "./types.ts"
export { TOPIC_NAMES } from "./types.ts"

/** Exercises for grades 3–4 (textbooks «Я досліджую світ 3» and «Інформатика 4», Корнієнко та ін., Ранок). */
export const scenarios: ReadonlyArray<Scenario> = [
  {
    id: "g3-autumn-slide",
    grade: 3,
    title: "Слайд «Осінь»",
    topic: "slides",
    summary: "Додай новий слайд і підпиши його.",
    passports: ["inf3-20", "inf3-21"],
    task: [
      "Натисни «Створити слайд» і вибери макет «Заголовок і об'єкт».",
      "Клацни двічі в рамку заголовка нового слайда й надрукуй: Осінь",
      "У рамку тексту надрукуй, що буває восени."
    ],
    start: [{ layout: "title", title: "Пори року", body: "Учень 3 класу" }],
    goals: [
      { type: "slideCount", min: 2 },
      { type: "layout", slides: 2, layout: "titleContent" },
      { type: "text", slides: 2, role: "title", equals: "Осінь", hint: "Заголовок другого слайда має бути «Осінь», без лапок." },
      { type: "text", slides: 2, role: "body" }
    ]
  },
  {
    id: "g3-seasons-order",
    grade: 3,
    title: "Пори року по черзі",
    topic: "slides",
    summary: "Переставити слайди в правильному порядку.",
    passports: ["inf3-20"],
    task: ["Слайди переплуталися.", "Перетягни ескізи ліворуч так, щоб після титульного слайда йшли: Зима, Весна, Літо, Осінь."],
    start: [
      { layout: "title", title: "Пори року" },
      { layout: "titleOnly", title: "Літо", background: "#fef3c7", pictures: [{ asset: "library:sun", x: 380, y: 180 }] },
      { layout: "titleOnly", title: "Зима", background: "#9ed8f5", pictures: [{ asset: "library:snowman", x: 405, y: 170, height: 260 }] },
      { layout: "titleOnly", title: "Осінь", background: "#fde68a", pictures: [{ asset: "library:leaf", x: 380, y: 180 }] },
      { layout: "titleOnly", title: "Весна", background: "#dcfce7", pictures: [{ asset: "library:flower", x: 405, y: 170, height: 260 }] }
    ],
    goals: [
      { type: "slideCount", min: 5, max: 5, hint: "Не додавай і не видаляй слайди, лише переставляй." },
      { type: "slideOrder", titles: ["Пори року", "Зима", "Весна", "Літо", "Осінь"] }
    ]
  },
  {
    id: "g3-big-snowman",
    grade: 3,
    title: "Більший сніговик",
    topic: "pictures",
    summary: "Збільшити малюнок, не спотворивши його.",
    passports: ["inf3-22"],
    task: [
      "Клацни по сніговику: навколо з'являться маркери.",
      "Потягни за кутовий маркер, щоб сніговик став більшим (вище половини слайда).",
      "Сніговик має лишитися на слайді й не стати «товстим» чи «худим»."
    ],
    start: [{ layout: "titleOnly", title: "Зима", background: "#9ed8f5", pictures: [{ asset: "library:snowman", x: 60, y: 300, height: 120 }] }],
    goals: [
      { type: "picture", slides: 1, asset: "library:snowman", minWidth: 210, text: "Сніговик став більшим", hint: "Тягни за кутовий маркер від центру назовні." },
      { type: "picture", slides: 1, asset: "library:snowman", keepRatio: true, hint: "Тягни саме за кутовий маркер, а не за бічний: так пропорції не зміняться." },
      { type: "inside", slides: 1 }
    ]
  },
  {
    id: "g3-photo-album",
    grade: 3,
    title: "Фотоальбом «Екскурсія»",
    topic: "pictures",
    summary: "Зібрати фотоальбом з підписами.",
    passports: ["inf3-23"],
    task: [
      "Додай 3 нові слайди.",
      "На кожен встав фото з альбому «Екскурсія» (Вставлення › Малюнок).",
      "Під кожним фото додай напис (Вставлення › Напис) і підпиши, що на фото."
    ],
    start: [{ layout: "title", title: "Наша екскурсія", body: "3-А клас" }],
    goals: [
      { type: "slideCount", min: 4 },
      { type: "picture", slides: { from: 2 }, album: "Екскурсія", text: "На кожному новому слайді є фото з екскурсії" },
      { type: "text", slides: { from: 2 }, role: ["caption", "body", "title"], text: "На кожному новому слайді є підпис" },
      { type: "inside", slides: "all" }
    ]
  },
  {
    id: "g4-sky-background",
    grade: 4,
    title: "Тло як небо",
    topic: "design",
    summary: "Змінити тло всіх слайдів.",
    passports: ["inf4-23"],
    task: ["Відкрий вкладку «Конструктор».", "Вибери блакитне тло й натисни «Застосувати до всіх»."],
    start: [
      { layout: "title", title: "Космос", body: "Розповідь про ракети" },
      { layout: "titleOnly", title: "Ракета", pictures: [{ asset: "library:rocket", x: 400, y: 150, height: 300 }] },
      { layout: "titleOnly", title: "Планети", pictures: [{ asset: "library:planet", x: 340, y: 170 }] }
    ],
    goals: [{ type: "background", slides: "all", color: "#9ed8f5", hint: "На вкладці «Конструктор» вибери блакитний колір і натисни «Застосувати до всіх»." }]
  },
  {
    id: "g4-fair-title",
    grade: 4,
    title: "Запрошення на ярмарок",
    topic: "text",
    summary: "Відформатувати заголовок.",
    passports: ["inf4-24"],
    task: [
      "Виділи заголовок «Шкільний ярмарок».",
      "Зроби його жирним і червоним.",
      "Збільш розмір шрифту до 54 або більше."
    ],
    start: [{ layout: "title", title: "Шкільний ярмарок", body: "У п'ятницю о 12:00 в актовій залі" }],
    goals: [
      { type: "textStyle", slides: 1, role: "title", contains: "ярмарок", style: { bold: true, color: "#dc2626" } },
      { type: "textStyle", slides: 1, role: "title", contains: "ярмарок", style: { minSize: 54 } },
      { type: "text", slides: 1, role: "title", equals: "Шкільний ярмарок", hint: "Не змінюй слова заголовка, лише його вигляд." }
    ]
  },
  {
    id: "g4-fish-animation",
    grade: 4,
    title: "Риба з'являється",
    topic: "animation",
    summary: "Ефект появи для фото і перехід для слайдів.",
    passports: ["inf4-26"],
    task: [
      "Виділи рибу на другому слайді.",
      "На вкладці «Анімація» вибери ефект входу, наприклад «Виліт».",
      "На вкладці «Переходи» вибери перехід і натисни «Застосувати до всіх».",
      "Переглянь показ (F5)."
    ],
    start: [
      { layout: "title", title: "Мешканці моря", body: "Презентація про рибу" },
      { layout: "titleOnly", title: "Риба", background: "#9ed8f5", pictures: [{ asset: "library:fish", x: 330, y: 180 }] }
    ],
    goals: [
      { type: "animation", slides: 2, kind: "image", group: "entrance" },
      { type: "transition", slides: "all" }
    ]
  }
]

export const scenarioById = (id: string): Scenario | undefined => scenarios.find((s) => s.id === id)

/** The exercise after `id` in the list, for «Наступна вправа». */
export const nextScenario = (id: string): Scenario | undefined => scenarios[scenarios.findIndex((s) => s.id === id) + 1]
