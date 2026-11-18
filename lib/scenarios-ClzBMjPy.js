// src/core/model.ts
/**
* The presentation model. It holds plain text, numbers and ids only: no HTML, no URLs of pictures, no scripts.
* Everything the student makes is shown through Konva (canvas) or React text nodes, so text can never become markup.
*/
/** Slide size in model units, 16:9. */
var SLIDE_WIDTH = 960;
var SLIDE_HEIGHT = 540;
/** Fonts with Cyrillic that every device has or that the page loads. A student cannot type another name. */
var FONTS = [
	"Arial",
	"Georgia",
	"Verdana",
	"Trebuchet MS",
	"Courier New",
	"Comic Sans MS"
];
var DEFAULT_TEXT_STYLE = {
	font: "Arial",
	size: 28,
	color: "#1f2937",
	bold: false,
	italic: false,
	underline: false,
	align: "left"
};
var SHAPES = [
	"rect",
	"roundRect",
	"ellipse",
	"triangle",
	"star",
	"arrow",
	"callout"
];
/** Animation effects, grouped as in the textbooks: entrance, emphasis and exit. */
var EFFECTS = {
	entrance: [
		"appear",
		"fade",
		"flyIn",
		"zoomIn"
	],
	emphasis: ["pulse", "spin"],
	exit: [
		"disappear",
		"fadeOut",
		"flyOut"
	]
};
var TRANSITIONS = [
	"none",
	"fade",
	"push",
	"wipe",
	"zoom"
];
var LAYOUTS = [
	"title",
	"titleContent",
	"twoContent",
	"titleOnly",
	"blank"
];
/** Limits for one deck: the page and the server refuse anything larger. */
var LIMITS = {
	slides: 40,
	elementsPerSlide: 60,
	textLength: 2e3,
	notesLength: 4e3,
	nameLength: 60,
	idLength: 40
};
var LAYOUT_NAMES = {
	title: "Титульний слайд",
	titleContent: "Заголовок і об'єкт",
	twoContent: "Два об'єкти",
	titleOnly: "Лише заголовок",
	blank: "Пустий слайд"
};
var SHAPE_NAMES = {
	rect: "Прямокутник",
	roundRect: "Заокруглений прямокутник",
	ellipse: "Овал",
	triangle: "Трикутник",
	star: "Зірка",
	arrow: "Стрілка",
	callout: "Виноска"
};
var EFFECT_NAMES = {
	appear: "Поява",
	fade: "Вицвітання",
	flyIn: "Виліт",
	zoomIn: "Масштабування",
	pulse: "Пульсація",
	spin: "Обертання",
	disappear: "Зникнення",
	fadeOut: "Вицвітання (вихід)",
	flyOut: "Виліт за край"
};
var GROUP_NAMES = {
	entrance: "Вхід",
	emphasis: "Виділення",
	exit: "Вихід"
};
var TRANSITION_NAMES = {
	none: "Немає",
	fade: "Вицвітання",
	push: "Виштовхування",
	wipe: "Витирання",
	zoom: "Масштаб"
};
/** Colours on the palette, with names a teacher can use in a task («зроби тло блакитним»). */
var PALETTE = [
	{
		color: "#ffffff",
		name: "білий"
	},
	{
		color: "#1f2937",
		name: "чорний"
	},
	{
		color: "#9ca3af",
		name: "сірий"
	},
	{
		color: "#dc2626",
		name: "червоний"
	},
	{
		color: "#f97316",
		name: "помаранчевий"
	},
	{
		color: "#facc15",
		name: "жовтий"
	},
	{
		color: "#16a34a",
		name: "зелений"
	},
	{
		color: "#9ed8f5",
		name: "блакитний"
	},
	{
		color: "#2563eb",
		name: "синій"
	},
	{
		color: "#7c3aed",
		name: "фіолетовий"
	},
	{
		color: "#ec4899",
		name: "рожевий"
	},
	{
		color: "#8b5a2b",
		name: "коричневий"
	},
	{
		color: "#fef3c7",
		name: "кремовий"
	},
	{
		color: "#dcfce7",
		name: "м'ятний"
	}
];
var isElementOf = (kind) => (element) => element.kind === kind;
// src/core/library.ts
var LIBRARY = [
	{
		id: "library:cat",
		name: "Кіт",
		album: "Тварини",
		ratio: 1
	},
	{
		id: "library:dog",
		name: "Пес Бублик",
		album: "Тварини",
		ratio: 1
	},
	{
		id: "library:fish",
		name: "Риба",
		album: "Тварини",
		ratio: 1.5
	},
	{
		id: "library:snowman",
		name: "Сніговик",
		album: "Пори року",
		ratio: .75
	},
	{
		id: "library:flower",
		name: "Квітка",
		album: "Пори року",
		ratio: .75
	},
	{
		id: "library:sun",
		name: "Сонце",
		album: "Пори року",
		ratio: 1
	},
	{
		id: "library:leaf",
		name: "Осінній листок",
		album: "Пори року",
		ratio: 1
	},
	{
		id: "library:rocket",
		name: "Ракета",
		album: "Космос",
		ratio: .6
	},
	{
		id: "library:planet",
		name: "Планета",
		album: "Космос",
		ratio: 1.4
	},
	{
		id: "library:museum",
		name: "Музей",
		album: "Екскурсія",
		ratio: 1.33
	},
	{
		id: "library:castle",
		name: "Замок",
		album: "Екскурсія",
		ratio: 1.33
	},
	{
		id: "library:park",
		name: "Парк",
		album: "Екскурсія",
		ratio: 1.33
	}
];
var BY_ID = new Map(LIBRARY.map((p) => [p.id, p]));
var libraryPicture = (id) => BY_ID.get(id);
/** Ids the model accepts: library pictures, and files the site stored for the student (`upload:` + letters, digits, `-`). */
var isAssetId = (id) => BY_ID.has(id) || /^upload:[A-Za-z0-9-]{1,36}$/.test(id);
// src/core/ops.ts
/** Editing operations. Each one returns a new deck and never changes the one it got. */
var counter = 0;
/** A short id, unique within a page. */
var newId = (prefix) => {
	counter += 1;
	return `${prefix}${Date.now().toString(36)}${counter.toString(36)}${Math.floor(Math.random() * 1296).toString(36)}`;
};
var textBox = (role, name, x, y, width, height, style) => ({
	id: newId("t"),
	name,
	kind: "text",
	role,
	text: "",
	x,
	y,
	width,
	height,
	rotation: 0,
	style: {
		...DEFAULT_TEXT_STYLE,
		...style
	}
});
/** The placeholders a layout puts on a new slide, all empty. */
var placeholders = (layout) => {
	const title = (y, h, size) => textBox("title", "Заголовок", 60, y, 840, h, {
		size,
		align: "center"
	});
	switch (layout) {
		case "title": return [title(150, 130, 48), textBox("body", "Підзаголовок", 160, 300, 640, 80, {
			size: 28,
			align: "center",
			color: "#4b5563"
		})];
		case "titleContent": return [title(30, 90, 40), textBox("body", "Текст", 60, 140, 840, 360, { size: 28 })];
		case "twoContent": return [
			title(30, 90, 40),
			textBox("body", "Текст ліворуч", 60, 140, 400, 360, { size: 24 }),
			textBox("body", "Текст праворуч", 500, 140, 400, 360, { size: 24 })
		];
		case "titleOnly": return [title(30, 90, 40)];
		case "blank": return [];
	}
};
var NO_TRANSITION = {
	effect: "none",
	duration: 1
};
var newSlide = (layout, background = "#ffffff") => ({
	id: newId("s"),
	layout,
	background,
	elements: placeholders(layout),
	hidden: false,
	transition: NO_TRANSITION,
	notes: ""
});
var newDeck = (layout = "title") => ({ slides: [newSlide(layout)] });
var replaceSlide = (deck, slideId, f) => ({ slides: deck.slides.map((s) => s.id === slideId ? f(s) : s) });
/** Inserts a slide after `index` (-1 puts it first). A new slide takes the background of the one before it. */
var addSlide = (deck, index, layout) => {
	if (deck.slides.length >= LIMITS.slides) return {
		deck,
		slideId: deck.slides[index]?.id ?? ""
	};
	const before = deck.slides[index];
	const slide = newSlide(layout, before?.background ?? "#ffffff");
	const withTransition = before ? {
		...slide,
		transition: before.transition
	} : slide;
	return {
		deck: { slides: [
			...deck.slides.slice(0, index + 1),
			withTransition,
			...deck.slides.slice(index + 1)
		] },
		slideId: slide.id
	};
};
var duplicateSlide = (deck, slideId) => {
	const index = deck.slides.findIndex((s) => s.id === slideId);
	const source = deck.slides[index];
	if (!source || deck.slides.length >= LIMITS.slides) return {
		deck,
		slideId
	};
	const copy = {
		...source,
		id: newId("s"),
		elements: source.elements.map((e) => ({
			...e,
			id: newId(e.kind[0] ?? "e")
		}))
	};
	return {
		deck: { slides: [
			...deck.slides.slice(0, index + 1),
			copy,
			...deck.slides.slice(index + 1)
		] },
		slideId: copy.id
	};
};
/** Removes a slide; the last slide stays (a deck has at least one). Links to it are dropped. */
var deleteSlide = (deck, slideId) => {
	if (deck.slides.length <= 1) return deck;
	return { slides: deck.slides.filter((s) => s.id !== slideId).map((s) => ({
		...s,
		elements: s.elements.map((e) => {
			if (e.link && "slide" in e.link && e.link.slide === slideId) {
				const { link: _dropped, ...rest } = e;
				return rest;
			}
			return e;
		})
	})) };
};
var moveSlide = (deck, from, to) => {
	const moving = deck.slides[from];
	if (!moving || to < 0 || to >= deck.slides.length || from === to) return deck;
	const rest = deck.slides.filter((_, i) => i !== from);
	return { slides: [
		...rest.slice(0, to),
		moving,
		...rest.slice(to)
	] };
};
var updateSlide = (deck, slideId, patch) => replaceSlide(deck, slideId, (s) => ({
	...s,
	...patch
}));
/** Changes the layout and adds the placeholders the slide lacks; what the student made stays. */
var changeLayout = (deck, slideId, layout) => replaceSlide(deck, slideId, (s) => {
	const hasTitle = s.elements.some((e) => e.kind === "text" && e.role === "title");
	const hasBody = s.elements.some((e) => e.kind === "text" && e.role === "body");
	const added = placeholders(layout).filter((p) => p.role === "title" ? !hasTitle : !hasBody);
	return {
		...s,
		layout,
		elements: [...s.elements, ...added].slice(0, LIMITS.elementsPerSlide)
	};
});
var setBackgroundAll = (deck, background) => ({ slides: deck.slides.map((s) => ({
	...s,
	background
})) });
var setTransitionAll = (deck, transition) => ({ slides: deck.slides.map((s) => ({
	...s,
	transition
})) });
var addElement = (deck, slideId, element) => replaceSlide(deck, slideId, (s) => s.elements.length >= LIMITS.elementsPerSlide ? s : {
	...s,
	elements: [...s.elements, element]
});
var updateElement = (deck, slideId, elementId, patch) => replaceSlide(deck, slideId, (s) => ({
	...s,
	elements: s.elements.map((e) => e.id === elementId ? {
		...e,
		...patch,
		id: e.id,
		kind: e.kind
	} : e)
}));
/** Drops a field the patch type cannot unset (animation, link, fill). */
var clearElementField = (deck, slideId, elementId, field) => replaceSlide(deck, slideId, (s) => ({
	...s,
	elements: s.elements.map((e) => {
		if (e.id !== elementId) return e;
		const copy = { ...e };
		delete copy[field];
		return copy;
	})
}));
var deleteElement = (deck, slideId, elementId) => replaceSlide(deck, slideId, (s) => ({
	...s,
	elements: s.elements.filter((e) => e.id !== elementId)
}));
/** Moves an element to the top (`front`) or the bottom of the slide. */
var reorderElement = (deck, slideId, elementId, where) => replaceSlide(deck, slideId, (s) => {
	const el = s.elements.find((e) => e.id === elementId);
	if (!el) return s;
	const rest = s.elements.filter((e) => e.id !== elementId);
	return {
		...s,
		elements: where === "front" ? [...rest, el] : [el, ...rest]
	};
});
/** A new text box in the middle of the slide. */
var newTextBox = (text = "") => ({
	...textBox("caption", "Напис", 280, 230, 400, 80, {
		size: 28,
		align: "center"
	}),
	text
});
var newShape = (shape) => {
	const width = shape === "arrow" || shape === "callout" || shape === "rect" || shape === "roundRect" ? 260 : 180;
	const height = shape === "arrow" ? 110 : 180;
	return {
		id: newId("f"),
		name: SHAPE_NAMES[shape],
		kind: "shape",
		shape,
		x: 480 - width / 2,
		y: 270 - height / 2,
		width,
		height,
		rotation: 0,
		fill: shape === "callout" ? "#ffffff" : "#9ed8f5",
		stroke: "#2563eb",
		text: "",
		style: {
			...DEFAULT_TEXT_STYLE,
			size: 24,
			align: "center"
		}
	};
};
/** A library picture, about a third of the slide high, in the middle. */
var newPicture = (asset, ratio = libraryPicture(asset)?.ratio ?? 1) => {
	const height = 200;
	const width = Math.round(height * ratio);
	return {
		id: newId("p"),
		name: libraryPicture(asset)?.name ?? "Малюнок",
		kind: "image",
		asset,
		x: 480 - width / 2,
		y: 270 - height / 2,
		width,
		height,
		rotation: 0
	};
};
var findSlide = (deck, slideId) => deck.slides.find((s) => s.id === slideId);
/** The text of a slide's title placeholder, trimmed; "" when it has none. */
var slideTitle = (slide) => (slide.elements.find((e) => e.kind === "text" && e.role === "title")?.text ?? "").trim();
// src/core/goals.ts
var norm = (s) => s.replace(/[’ʼ`]/g, "'").replace(/\s+/g, " ").trim().toLocaleLowerCase("uk");
var roles = (role) => role === void 0 ? null : typeof role === "string" ? [role] : role;
var textsOf = (slide, role) => {
	const wanted = roles(role);
	return slide.elements.filter((e) => e.kind === "text" && (wanted === null || wanted.includes(e.role)));
};
var hex = (c) => [
	1,
	3,
	5
].map((i) => parseInt(c.slice(i, i + 2), 16));
/** Colours count as the same when they are near: a student picks «блакитний» from a palette or a slightly other shade. */
var nearColor = (a, b) => {
	const [r1, g1, b1] = hex(a);
	const [r2, g2, b2] = hex(b);
	return Math.hypot(r1 - r2, g1 - g2, b1 - b2) <= 60;
};
var colorName = (c) => PALETTE.find((p) => nearColor(p.color, c))?.name ?? c;
/** Checks `test` on the slides a goal names. */
var onSlides = (deck, slides, test) => {
	const list = deck.slides;
	if (slides === "any") return list.some(test);
	if (slides === "all") return list.every(test);
	if (typeof slides === "number") {
		const s = list[slides - 1];
		return s !== void 0 && test(s);
	}
	const to = Math.min(slides.to ?? list.length, list.length);
	if (to < slides.from) return false;
	return list.slice(slides.from - 1, to).every(test);
};
var slidesLabel = (slides) => {
	if (slides === "any") return "На слайді";
	if (slides === "all") return "На всіх слайдах";
	if (typeof slides === "number") return `На слайді ${slides}`;
	return slides.to === void 0 ? `На слайдах з ${slides.from}-го` : `На слайдах ${slides.from}–${slides.to}`;
};
var ROLE_WORDS = {
	title: "заголовок",
	body: "текст",
	caption: "напис"
};
var roleWord = (role) => {
	const list = roles(role);
	return list === null ? "напис" : list.map((r) => ROLE_WORDS[r]).join(" або ");
};
var styleWords = (s) => [
	s.bold ? "жирний" : null,
	s.italic ? "курсив" : null,
	s.underline ? "підкреслений" : null,
	s.color ? colorName(s.color) : null,
	s.minSize ? `розмір не менше ${s.minSize}` : null,
	s.font ? `шрифт ${s.font}` : null,
	s.align ? {
		left: "ліворуч",
		center: "по центру",
		right: "праворуч"
	}[s.align] : null
].filter((w) => w !== null).join(", ");
var describeGoal = (goal) => {
	if (goal.text !== void 0) return goal.text;
	switch (goal.type) {
		case "slideCount":
			if (goal.min !== void 0 && goal.max !== void 0) return goal.min === goal.max ? `У презентації ${goal.min} слайдів` : `У презентації від ${goal.min} до ${goal.max} слайдів`;
			return goal.min !== void 0 ? `У презентації не менше ${goal.min} слайдів` : `У презентації не більше ${goal.max ?? 0} слайдів`;
		case "slideOrder": return `Слайди йдуть у порядку: ${goal.titles.join(" → ")}`;
		case "layout": return `${slidesLabel(goal.slides)} макет «${LAYOUT_NAMES[goal.layout]}»`;
		case "text": {
			const where = slidesLabel(goal.slides ?? "any");
			if (goal.equals !== void 0) return `${where} ${roleWord(goal.role)} «${goal.equals}»`;
			if (goal.contains !== void 0) return `${where} ${roleWord(goal.role)} зі словом «${goal.contains}»`;
			return `${where} заповнено ${roleWord(goal.role)}`;
		}
		case "textStyle": return `${slidesLabel(goal.slides ?? "any")} ${roleWord(goal.role)}${goal.contains ? ` «${goal.contains}»` : ""}: ${styleWords(goal.style)}`;
		case "picture": {
			const what = goal.asset ? `малюнок «${libraryPicture(goal.asset)?.name ?? goal.asset}»` : goal.album ? `фото з альбому «${goal.album}»` : "малюнок";
			const size = goal.minWidth ? `, ширший за ${goal.minWidth}` : goal.maxWidth ? `, вужчий за ${goal.maxWidth}` : "";
			return `${slidesLabel(goal.slides ?? "any")} є ${what}${size}${goal.keepRatio ? " без спотворення" : ""}`;
		}
		case "shape": return `${slidesLabel(goal.slides ?? "any")} є фігура${goal.shape ? ` «${SHAPE_NAMES[goal.shape]}»` : ""}`;
		case "background": return `${slidesLabel(goal.slides ?? "all")} тло ${goal.color ? colorName(goal.color) : "кольорове"}`;
		case "inside": return `${slidesLabel(goal.slides ?? "all")} усі об'єкти в межах слайда`;
		case "transition": return `${slidesLabel(goal.slides ?? "all")} є перехід${goal.effect ? ` «${TRANSITION_NAMES[goal.effect]}»` : ""}`;
		case "animation": return `${slidesLabel(goal.slides ?? "any")} ${goal.kind === "image" ? "малюнок має" : goal.kind === "text" ? "напис має" : "є об'єкт з"} анімацією${goal.group ? ` групи «${{
			entrance: "Вхід",
			emphasis: "Виділення",
			exit: "Вихід"
		}[goal.group]}»` : ""}`;
	}
};
var DEFAULT_HINTS = {
	slideCount: "Новий слайд додає кнопка «Створити слайд» на вкладці «Основне».",
	slideOrder: "Перетягни ескіз слайда в лівій панелі на потрібне місце.",
	layout: "Макет слайда змінює кнопка «Макет» на вкладці «Основне».",
	text: "Клацни двічі по рамці напису і набери текст.",
	textStyle: "Виділи напис і зміни шрифт на вкладці «Основне».",
	picture: "Малюнки є на вкладці «Вставлення» › «Малюнок». Розмір змінюють кутові маркери.",
	shape: "Фігури є на вкладці «Вставлення» › «Фігури».",
	background: "Колір тла змінюють на вкладці «Конструктор».",
	inside: "Перетягни об'єкти так, щоб вони не виходили за край слайда.",
	transition: "Перехід вибирають на вкладці «Переходи».",
	animation: "Виділи об'єкт і вибери ефект на вкладці «Анімація»."
};
var near = (a, b) => norm(a) === norm(b);
var meetsStyle = (t, s) => (s.bold === void 0 || t.style.bold === s.bold) && (s.italic === void 0 || t.style.italic === s.italic) && (s.underline === void 0 || t.style.underline === s.underline) && (s.color === void 0 || nearColor(t.style.color, s.color)) && (s.minSize === void 0 || t.style.size >= s.minSize) && (s.font === void 0 || t.style.font === s.font) && (s.align === void 0 || t.style.align === s.align);
/** Corners of an element's box after rotation about its top-left corner (as Konva rotates). */
var corners = (e) => {
	const a = e.rotation * Math.PI / 180;
	const cos = Math.cos(a);
	const sin = Math.sin(a);
	return [
		[0, 0],
		[e.width, 0],
		[0, e.height],
		[e.width, e.height]
	].map(([dx, dy]) => [e.x + dx * cos - dy * sin, e.y + dx * sin + dy * cos]);
};
/** A few units of slack: a student drags by hand. */
var EDGE_SLACK = 4;
var isInside = (e) => corners(e).every(([x, y]) => x >= -4 && y >= -4 && x <= 960 + EDGE_SLACK && y <= 540 + EDGE_SLACK);
/** An empty placeholder is not shown in the show, so it does not count as sticking out. */
var isVisible = (e) => !(e.kind === "text" && e.text.trim() === "");
var RATIO_SLACK = .08;
var check = (deck, goal) => {
	switch (goal.type) {
		case "slideCount": return deck.slides.length >= (goal.min ?? 0) && deck.slides.length <= (goal.max ?? Infinity);
		case "slideOrder": {
			const titles = deck.slides.map((s) => norm(slideTitle(s)));
			const positions = goal.titles.map((t) => titles.indexOf(norm(t)));
			return positions.every((p, i) => p >= 0 && (i === 0 || p > (positions[i - 1] ?? -1)));
		}
		case "layout": return onSlides(deck, goal.slides, (s) => s.layout === goal.layout);
		case "text": return onSlides(deck, goal.slides ?? "any", (s) => textsOf(s, goal.role).some((t) => goal.equals !== void 0 ? near(t.text, goal.equals) : goal.contains !== void 0 ? norm(t.text).includes(norm(goal.contains)) : t.text.trim() !== ""));
		case "textStyle": return onSlides(deck, goal.slides ?? "any", (s) => textsOf(s, goal.role).some((t) => t.text.trim() !== "" && (goal.contains === void 0 || norm(t.text).includes(norm(goal.contains))) && meetsStyle(t, goal.style)));
		case "picture": return onSlides(deck, goal.slides ?? "any", (s) => s.elements.some((e) => {
			if (e.kind !== "image") return false;
			const pic = libraryPicture(e.asset);
			if (goal.asset !== void 0 && e.asset !== goal.asset) return false;
			if (goal.album !== void 0 && pic?.album !== goal.album) return false;
			if (goal.minWidth !== void 0 && e.width < goal.minWidth) return false;
			if (goal.maxWidth !== void 0 && e.width > goal.maxWidth) return false;
			if (goal.keepRatio && pic && Math.abs(e.width / e.height - pic.ratio) / pic.ratio > RATIO_SLACK) return false;
			return true;
		}));
		case "shape": return onSlides(deck, goal.slides ?? "any", (s) => s.elements.some((e) => e.kind === "shape" && (goal.shape === void 0 || e.shape === goal.shape)));
		case "background": return onSlides(deck, goal.slides ?? "all", (s) => goal.color === void 0 ? !nearColor(s.background, "#ffffff") : nearColor(s.background, goal.color));
		case "inside": return onSlides(deck, goal.slides ?? "all", (s) => s.elements.filter(isVisible).every(isInside));
		case "transition": return onSlides(deck, goal.slides ?? "all", (s) => goal.effect === void 0 ? s.transition.effect !== "none" : s.transition.effect === goal.effect);
		case "animation": return onSlides(deck, goal.slides ?? "any", (s) => s.elements.some((e) => e.animation !== void 0 && (goal.kind === void 0 || e.kind === goal.kind) && (goal.group === void 0 || e.animation.group === goal.group) && (goal.effect === void 0 || e.animation.effect === goal.effect)));
	}
};
var checkGoals = (deck, goals) => goals.map((goal) => ({
	goal,
	ok: check(deck, goal),
	text: describeGoal(goal),
	hint: goal.hint ?? DEFAULT_HINTS[goal.type]
}));
var allMet = (results) => results.length > 0 && results.every((r) => r.ok);
// src/core/start.ts
/** Builds the starting deck of a scenario from a short description. Ids are fixed (`s1`, `s1-t1`…) so tests can name them. */
var fill = (box, text) => text === void 0 ? box : {
	...box,
	text
};
var buildSlide = (spec, index) => {
	const sid = `s${index + 1}`;
	const boxes = placeholders(spec.layout).map((p, i) => ({
		...fill(p, p.role === "title" ? spec.title : p.role === "body" && i === placeholders(spec.layout).findIndex((q) => q.role === "body") ? spec.body : void 0),
		id: `${sid}-t${i + 1}`
	}));
	const pictures = (spec.pictures ?? []).map((p, i) => {
		const height = p.height ?? 200;
		return {
			id: `${sid}-p${i + 1}`,
			name: libraryPicture(p.asset)?.name ?? "Малюнок",
			kind: "image",
			asset: p.asset,
			x: p.x,
			y: p.y,
			width: Math.round(height * (libraryPicture(p.asset)?.ratio ?? 1)),
			height,
			rotation: 0
		};
	});
	return {
		id: sid,
		layout: spec.layout,
		background: spec.background ?? "#ffffff",
		elements: [...boxes, ...pictures],
		hidden: false,
		transition: {
			effect: "none",
			duration: 1
		},
		notes: ""
	};
};
/** An empty list gives one title slide. */
var buildDeck = (specs) => ({ slides: (specs.length > 0 ? specs : [{ layout: "title" }]).map(buildSlide) });
// src/scenarios/index.ts
/** Exercises for grades 3–4 (textbooks «Я досліджую світ 3» and «Інформатика 4», Корнієнко та ін., Ранок). */
var scenarios = [
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
		start: [{
			layout: "title",
			title: "Пори року",
			body: "Учень 3 класу"
		}],
		goals: [
			{
				type: "slideCount",
				min: 2
			},
			{
				type: "layout",
				slides: 2,
				layout: "titleContent"
			},
			{
				type: "text",
				slides: 2,
				role: "title",
				equals: "Осінь",
				hint: "Заголовок другого слайда має бути «Осінь», без лапок."
			},
			{
				type: "text",
				slides: 2,
				role: "body"
			}
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
			{
				layout: "title",
				title: "Пори року"
			},
			{
				layout: "titleOnly",
				title: "Літо",
				background: "#fef3c7",
				pictures: [{
					asset: "library:sun",
					x: 380,
					y: 180
				}]
			},
			{
				layout: "titleOnly",
				title: "Зима",
				background: "#9ed8f5",
				pictures: [{
					asset: "library:snowman",
					x: 405,
					y: 170,
					height: 260
				}]
			},
			{
				layout: "titleOnly",
				title: "Осінь",
				background: "#fde68a",
				pictures: [{
					asset: "library:leaf",
					x: 380,
					y: 180
				}]
			},
			{
				layout: "titleOnly",
				title: "Весна",
				background: "#dcfce7",
				pictures: [{
					asset: "library:flower",
					x: 405,
					y: 170,
					height: 260
				}]
			}
		],
		goals: [{
			type: "slideCount",
			min: 5,
			max: 5,
			hint: "Не додавай і не видаляй слайди, лише переставляй."
		}, {
			type: "slideOrder",
			titles: [
				"Пори року",
				"Зима",
				"Весна",
				"Літо",
				"Осінь"
			]
		}]
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
		start: [{
			layout: "titleOnly",
			title: "Зима",
			background: "#9ed8f5",
			pictures: [{
				asset: "library:snowman",
				x: 60,
				y: 300,
				height: 120
			}]
		}],
		goals: [
			{
				type: "picture",
				slides: 1,
				asset: "library:snowman",
				minWidth: 210,
				text: "Сніговик став більшим",
				hint: "Тягни за кутовий маркер від центру назовні."
			},
			{
				type: "picture",
				slides: 1,
				asset: "library:snowman",
				keepRatio: true,
				hint: "Тягни саме за кутовий маркер, а не за бічний: так пропорції не зміняться."
			},
			{
				type: "inside",
				slides: 1
			}
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
		start: [{
			layout: "title",
			title: "Наша екскурсія",
			body: "3-А клас"
		}],
		goals: [
			{
				type: "slideCount",
				min: 4
			},
			{
				type: "picture",
				slides: { from: 2 },
				album: "Екскурсія",
				text: "На кожному новому слайді є фото з екскурсії"
			},
			{
				type: "text",
				slides: { from: 2 },
				role: [
					"caption",
					"body",
					"title"
				],
				text: "На кожному новому слайді є підпис"
			},
			{
				type: "inside",
				slides: "all"
			}
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
			{
				layout: "title",
				title: "Космос",
				body: "Розповідь про ракети"
			},
			{
				layout: "titleOnly",
				title: "Ракета",
				pictures: [{
					asset: "library:rocket",
					x: 400,
					y: 150,
					height: 300
				}]
			},
			{
				layout: "titleOnly",
				title: "Планети",
				pictures: [{
					asset: "library:planet",
					x: 340,
					y: 170
				}]
			}
		],
		goals: [{
			type: "background",
			slides: "all",
			color: "#9ed8f5",
			hint: "На вкладці «Конструктор» вибери блакитний колір і натисни «Застосувати до всіх»."
		}]
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
		start: [{
			layout: "title",
			title: "Шкільний ярмарок",
			body: "У п'ятницю о 12:00 в актовій залі"
		}],
		goals: [
			{
				type: "textStyle",
				slides: 1,
				role: "title",
				contains: "ярмарок",
				style: {
					bold: true,
					color: "#dc2626"
				}
			},
			{
				type: "textStyle",
				slides: 1,
				role: "title",
				contains: "ярмарок",
				style: { minSize: 54 }
			},
			{
				type: "text",
				slides: 1,
				role: "title",
				equals: "Шкільний ярмарок",
				hint: "Не змінюй слова заголовка, лише його вигляд."
			}
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
		start: [{
			layout: "title",
			title: "Мешканці моря",
			body: "Презентація про рибу"
		}, {
			layout: "titleOnly",
			title: "Риба",
			background: "#9ed8f5",
			pictures: [{
				asset: "library:fish",
				x: 330,
				y: 180
			}]
		}],
		goals: [{
			type: "animation",
			slides: 2,
			kind: "image",
			group: "entrance"
		}, {
			type: "transition",
			slides: "all"
		}]
	}
];
var scenarioById = (id) => scenarios.find((s) => s.id === id);
/** The exercise after `id` in the list, for «Наступна вправа». */
var nextScenario = (id) => scenarios[scenarios.findIndex((s) => s.id === id) + 1];
export { updateElement as A, LAYOUTS as B, newSlide as C, setBackgroundAll as D, reorderElement as E, DEFAULT_TEXT_STYLE as F, SHAPE_NAMES as G, LIMITS as H, EFFECTS as I, TRANSITIONS as J, SLIDE_HEIGHT as K, EFFECT_NAMES as L, LIBRARY as M, isAssetId as N, setTransitionAll as O, libraryPicture as P, FONTS as R, newShape as S, placeholders as T, PALETTE as U, LAYOUT_NAMES as V, SHAPES as W, isElementOf as X, TRANSITION_NAMES as Y, findSlide as _, buildSlide as a, newId as b, describeGoal as c, addSlide as d, changeLayout as f, duplicateSlide as g, deleteSlide as h, buildDeck as i, updateSlide as j, slideTitle as k, nearColor as l, deleteElement as m, scenarioById as n, allMet as o, clearElementField as p, SLIDE_WIDTH as q, scenarios as r, checkGoals as s, nextScenario as t, addElement as u, moveSlide as v, newTextBox as w, newPicture as x, newDeck as y, GROUP_NAMES as z };
