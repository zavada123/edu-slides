import { A as updateElement, B as LAYOUTS, C as newSlide, D as setBackgroundAll, E as reorderElement, F as DEFAULT_TEXT_STYLE, G as SHAPE_NAMES, H as LIMITS, I as EFFECTS, J as TRANSITIONS, K as SLIDE_HEIGHT, L as EFFECT_NAMES, M as LIBRARY, N as isAssetId, O as setTransitionAll, P as libraryPicture, R as FONTS, S as newShape, T as placeholders, U as PALETTE, V as LAYOUT_NAMES, W as SHAPES, X as isElementOf, Y as TRANSITION_NAMES, _ as findSlide, a as buildSlide, b as newId, c as describeGoal, d as addSlide, f as changeLayout, g as duplicateSlide, h as deleteSlide, i as buildDeck, j as updateSlide, k as slideTitle, l as nearColor, m as deleteElement, n as scenarioById, o as allMet, p as clearElementField, q as SLIDE_WIDTH, r as scenarios, s as checkGoals, t as nextScenario, u as addElement, v as moveSlide, w as newTextBox, x as newPicture, y as newDeck, z as GROUP_NAMES } from "./scenarios-ClzBMjPy.js";
// src/core/parse.ts
/**
* Reads a deck from untrusted JSON (a saved answer, a request body). Every field is checked and copied, unknown fields
* are dropped, strings are cut to the limits. Returns `null` for anything that is not a deck or is too large.
*/
var Invalid = class extends Error {};
var fail = () => {
	throw new Invalid();
};
var obj = (v) => typeof v === "object" && v !== null && !Array.isArray(v) ? v : fail();
var num = (v, min, max) => typeof v === "number" && Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : fail();
var bool = (v) => typeof v === "boolean" ? v : fail();
/** Text without control characters except line breaks and tabs, cut to `max`. */
var text = (v, max) => typeof v === "string" ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").slice(0, max) : fail();
var oneOf = (v, list) => list.includes(v) ? v : fail();
var id = (v) => typeof v === "string" && /^[A-Za-z0-9_-]{1,40}$/.test(v) ? v : fail();
var color = (v) => typeof v === "string" && /^#[0-9a-f]{6}$/i.test(v) ? v.toLowerCase() : fail();
var COORD = 3840;
var style = (v) => {
	const o = obj(v);
	return {
		font: oneOf(o.font ?? DEFAULT_TEXT_STYLE.font, FONTS),
		size: num(o.size ?? DEFAULT_TEXT_STYLE.size, 8, 96),
		color: color(o.color ?? DEFAULT_TEXT_STYLE.color),
		bold: bool(o.bold ?? false),
		italic: bool(o.italic ?? false),
		underline: bool(o.underline ?? false),
		align: oneOf(o.align ?? "left", [
			"left",
			"center",
			"right"
		])
	};
};
var animation = (v) => {
	const o = obj(v);
	const group = oneOf(o.group, [
		"entrance",
		"emphasis",
		"exit"
	]);
	return {
		group,
		effect: oneOf(o.effect, EFFECTS[group]),
		start: oneOf(o.start, [
			"click",
			"with",
			"after"
		]),
		duration: num(o.duration, .25, 10)
	};
};
/** Only links to a slide of this deck or to a `https:` page: `javascript:`, `data:` and the rest are refused. */
var link = (v, slideIds) => {
	const o = obj(v);
	if (o.slide !== void 0) {
		const target = id(o.slide);
		return slideIds.has(target) ? { slide: target } : void 0;
	}
	return { url: safeUrl(o.url) ?? fail() };
};
/** A web address a student may link to: `https:` only, no user name or password inside. */
var safeUrl = (v) => {
	if (typeof v !== "string" || v.length > 500) return null;
	let url;
	try {
		url = new URL(v.trim());
	} catch {
		return null;
	}
	if (url.protocol !== "https:" || url.username !== "" || url.password !== "") return null;
	return url.href;
};
var element = (v, slideIds) => {
	const o = obj(v);
	const base = {
		id: id(o.id),
		name: text(o.name ?? "", LIMITS.nameLength),
		x: num(o.x, -3840, COORD),
		y: num(o.y, -3840, COORD),
		width: num(o.width, 1, COORD),
		height: num(o.height, 1, COORD),
		rotation: num(o.rotation ?? 0, -360, 360)
	};
	const extra = {
		...o.animation === void 0 ? {} : { animation: animation(o.animation) },
		...o.link === void 0 ? {} : (() => {
			const l = link(o.link, slideIds);
			return l === void 0 ? {} : { link: l };
		})()
	};
	switch (o.kind) {
		case "text": return {
			...base,
			...extra,
			kind: "text",
			role: oneOf(o.role ?? "caption", [
				"title",
				"body",
				"caption"
			]),
			text: text(o.text, LIMITS.textLength),
			style: style(o.style ?? {}),
			...o.fill === void 0 ? {} : { fill: color(o.fill) }
		};
		case "shape": return {
			...base,
			...extra,
			kind: "shape",
			shape: oneOf(o.shape, SHAPES),
			fill: color(o.fill),
			stroke: color(o.stroke),
			text: text(o.text ?? "", LIMITS.textLength),
			style: style(o.style ?? {})
		};
		case "image": {
			const asset = typeof o.asset === "string" && isAssetId(o.asset) ? o.asset : fail();
			return {
				...base,
				...extra,
				kind: "image",
				asset
			};
		}
		default: return fail();
	}
};
var transition = (v) => {
	const o = obj(v);
	return {
		effect: oneOf(o.effect, TRANSITIONS),
		duration: num(o.duration, .25, 5)
	};
};
var slide = (v, slideIds) => {
	const o = obj(v);
	const parsed = (Array.isArray(o.elements) && o.elements.length <= LIMITS.elementsPerSlide ? o.elements : fail()).map((e) => element(e, slideIds));
	if (new Set(parsed.map((e) => e.id)).size !== parsed.length) fail();
	return {
		id: id(o.id),
		layout: oneOf(o.layout, LAYOUTS),
		background: color(o.background),
		elements: parsed,
		hidden: bool(o.hidden ?? false),
		transition: transition(o.transition ?? {
			effect: "none",
			duration: 1
		}),
		notes: text(o.notes ?? "", LIMITS.notesLength)
	};
};
var parseDeck = (input) => {
	try {
		const o = obj(input);
		const slides = Array.isArray(o.slides) && o.slides.length >= 1 && o.slides.length <= LIMITS.slides ? o.slides : fail();
		const ids = new Set(slides.map((s) => id(obj(s).id)));
		if (ids.size !== slides.length) fail();
		return { slides: slides.map((s) => slide(s, ids)) };
	} catch (e) {
		if (e instanceof Invalid) return null;
		throw e;
	}
};
// src/core/grade.ts
/**
* Grades a handed-in deck on the server. The deck is parsed again from the raw JSON and every goal is checked here,
* so nothing the page claims is trusted.
*/
var grade = (scenario, answer) => {
	const deck = parseDeck(answer);
	if (deck === null) return { status: "invalid" };
	const results = checkGoals(deck, scenario.goals);
	return {
		status: "checked",
		solved: allMet(results),
		results
	};
};
// src/scenarios/types.ts
var TOPIC_NAMES = {
	slides: "Слайди",
	text: "Текст на слайдах",
	pictures: "Малюнки й фігури",
	design: "Оформлення",
	animation: "Анімація й показ"
};
// src/scenarios/solutions.ts
var titleOf = (deck, index) => {
	const t = deck.slides[index]?.elements.find((e) => e.kind === "text" && e.role === "title");
	if (!t) throw new Error(`slide ${index + 1} has no title`);
	return t;
};
var bodyOf = (deck, index) => {
	const t = deck.slides[index]?.elements.find((e) => e.kind === "text" && e.role === "body");
	if (!t) throw new Error(`slide ${index + 1} has no body`);
	return t;
};
var slideId = (deck, index) => deck.slides[index]?.id ?? "";
var solutions = {
	"g3-autumn-slide": (start) => {
		const { deck } = addSlide(start, 0, "titleContent");
		const s = slideId(deck, 1);
		const withTitle = updateElement(deck, s, titleOf(deck, 1).id, { text: "осінь " });
		return updateElement(withTitle, s, bodyOf(withTitle, 1).id, { text: "Падає листя." });
	},
	"g3-seasons-order": (start) => {
		const a = moveSlide(start, 2, 1);
		return moveSlide(a, 4, 2);
	},
	"g3-big-snowman": (start) => {
		const s = slideId(start, 0);
		const pic = start.slides[0]?.elements.find((e) => e.kind === "image");
		if (!pic) throw new Error("no snowman");
		return updateElement(start, s, pic.id, {
			x: 300,
			y: 120,
			width: pic.width * 3,
			height: pic.height * 3
		});
	},
	"g3-photo-album": (start) => {
		let deck = start;
		for (const [i, asset] of [
			"library:museum",
			"library:castle",
			"library:park"
		].entries()) {
			deck = addSlide(deck, i, "blank").deck;
			const s = slideId(deck, i + 1);
			deck = addElement(deck, s, {
				...newPicture(asset),
				y: 60
			});
			deck = addElement(deck, s, {
				...newTextBox("Ми тут були"),
				y: 420
			});
		}
		return deck;
	},
	"g4-sky-background": (start) => setBackgroundAll(start, "#a5dcf7"),
	"g4-fair-title": (start) => {
		const t = titleOf(start, 0);
		return updateElement(start, slideId(start, 0), t.id, { style: {
			...t.style,
			bold: true,
			color: "#dc2626",
			size: 60
		} });
	},
	"g4-fish-animation": (start) => {
		const fish = start.slides[1]?.elements.find((e) => e.kind === "image");
		if (!fish) throw new Error("no fish");
		const animated = updateElement(start, slideId(start, 1), fish.id, { animation: {
			group: "entrance",
			effect: "flyIn",
			start: "click",
			duration: 1
		} });
		return setTransitionAll(animated, {
			effect: "fade",
			duration: 1
		});
	}
};
// src/scenarios/reference.ts
/** The deck a scenario starts with. */
var startDeck = (scenario) => buildDeck(scenario.start);
/** A deck that solves the scenario: the reference answer a teacher sees. `undefined` when the scenario has no solution. */
var referenceDeck = (scenario) => solutions[scenario.id]?.(startDeck(scenario));
export { DEFAULT_TEXT_STYLE, EFFECTS, EFFECT_NAMES, FONTS, GROUP_NAMES, LAYOUTS, LAYOUT_NAMES, LIBRARY, LIMITS, PALETTE, SHAPES, SHAPE_NAMES, SLIDE_HEIGHT, SLIDE_WIDTH, TOPIC_NAMES, TRANSITIONS, TRANSITION_NAMES, addElement, addSlide, allMet, buildDeck, buildSlide, changeLayout, checkGoals, clearElementField, deleteElement, deleteSlide, describeGoal, duplicateSlide, findSlide, grade, isAssetId, isElementOf, libraryPicture, moveSlide, nearColor, newDeck, newId, newPicture, newShape, newSlide, newTextBox, nextScenario, parseDeck, placeholders, referenceDeck, reorderElement, safeUrl, scenarioById, scenarios, setBackgroundAll, setTransitionAll, slideTitle, startDeck, updateElement, updateSlide };
