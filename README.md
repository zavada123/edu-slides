<h1 align="center">edu-slides</h1>

<p align="center">
  <b>A presentation trainer for computer science lessons in grades 3–7, with self-checking tasks and server-side grading.</b><br>
  Slides, layouts, text, shapes, pictures, backgrounds, transitions, animations and a slide show, drawn with <a href="https://konvajs.org">Konva</a> (MIT). Made for <a href="https://eduprostir.com">EduProstir</a>.
</p>

## Status

Prototype. Seven exercises for grades 3–4 (textbooks «Я досліджую світ 3» and «Інформатика 4», Корнієнко та ін.). The plan for grades 5–7 (themes, hyperlinks, action buttons, triggers, media) is in the project notes.

## Why

Students learn presentations by adding slides, typing into placeholders, inserting pictures and running the show. A real office program is too big for a 3rd grader and cannot check the work. `edu-slides` keeps the familiar ribbon (Основне, Вставлення, Конструктор, Переходи, Анімація, Показ слайдів), describes each task declaratively and checks the result.

## Safety

The deck is plain data: text, numbers, colours and ids. There is no HTML anywhere, and text is drawn on canvas or typed in a plain `<textarea>`, so nothing a student types can become markup. `parseDeck` reads untrusted JSON field by field, drops unknown fields and refuses:

- links other than to a slide of the same deck or to an `https:` page (no `javascript:`, `data:`, user/password in the URL);
- pictures other than library ids (`library:cat`) or ids of files the site stored (`upload:<id>`): never a URL, never `data:`;
- colours that are not `#rrggbb`, fonts outside the list, decks over `LIMITS` (40 slides, 60 objects per slide, 2000 characters per text).

An external link in the show opens only after the student confirms, with `rel="noopener noreferrer"`.

## Usage

```tsx
import { EduSlides } from "edu-slides/react"
import "edu-slides/style.css"

<EduSlides
  key={scenario.id}
  scenario={scenario}
  onChange={(deck) => saveAnswer(deck)}
  onCheck={(solved) => console.log(solved)}
  selfCheck={true}
/>
```

Server grading, in Node:

```ts
import { grade, scenarioById } from "edu-slides/core"

grade(scenarioById("g3-photo-album")!, answer) // { status: "checked", solved, results } or { status: "invalid" }
```

### Goals

| `type` | Checks that |
|---|---|
| `slideCount` | the deck has `min`…`max` slides |
| `slideOrder` | slides with these titles go in this order |
| `layout` | a slide has a layout |
| `text` | a text box (of a role) is filled, `equals` or `contains` a text (case, spaces and apostrophes ignored) |
| `textStyle` | a text is bold, italic, underlined, of a colour, at least a size, a font, an alignment |
| `picture` | a library picture or album is on the slide, wider/narrower than, not squashed |
| `shape` | a shape is on the slide |
| `background` | slides have a background colour (near shades count) |
| `inside` | no object sticks out of the slide |
| `transition` | slides have a transition |
| `animation` | an object has an animation of a group or effect |

`slides` picks slides: a number (from 1), `"any"`, `"all"` or `{ from, to }`.

## Development

```bash
npm install
npm run dev        # demo with all tasks
npm test           # model, parser, goals and every task's reference solution
npm run build      # type check and build the demo into dist/
npm run build:lib  # build the package into lib/
```

## License

[MIT](LICENSE), together with the pictures in `src/ui/pictures`: original drawings made for this package. The slides are drawn with [Konva](https://konvajs.org) and [react-konva](https://github.com/konvajs/react-konva) (MIT), installed as dependencies. This project is not affiliated with Microsoft or any other maker of presentation software.
