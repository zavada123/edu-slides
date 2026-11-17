import { A as updateElement, B as LAYOUTS, D as setBackgroundAll, E as reorderElement, G as SHAPE_NAMES, I as EFFECTS, J as TRANSITIONS, L as EFFECT_NAMES, M as LIBRARY, O as setTransitionAll, R as FONTS, S as newShape, U as PALETTE, V as LAYOUT_NAMES, W as SHAPES, Y as TRANSITION_NAMES, d as addSlide, f as changeLayout, g as duplicateSlide, h as deleteSlide, i as buildDeck, j as updateSlide, m as deleteElement, n as scenarioById, o as allMet, p as clearElementField, r as scenarios, s as checkGoals, t as nextScenario, u as addElement, v as moveSlide, w as newTextBox, x as newPicture, z as GROUP_NAMES } from "./scenarios-ClzBMjPy.js";
import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Ellipse, Group, Image as Image$1, Layer, Line, Rect, Stage, Text, Transformer } from "react-konva";
// src/ui/fullscreen.ts
/** While the trainer covers the page, the page under it does not scroll and keeps no space for a scrollbar. */
var PAGE_FULL_CLASS = "esl-page-full";
var isEditing = (target) => target instanceof HTMLElement && (target.isContentEditable || target.tagName === "INPUT" || target.tagName === "TEXTAREA");
/**
* Full screen for the trainer. The trainer covers the page (a fixed layer), so it works on an iPhone too, and where
* the browser can, the whole page goes to the browser's full screen. Not the trainer alone: menus and pickers
* may open near the edges and must stay visible. Esc or the button leaves it.
*/
var useFullScreen = () => {
	const [full, setFull] = useState(false);
	const leave = useCallback(() => {
		setFull(false);
		if (document.fullscreenElement) document.exitFullscreen().catch(() => void 0);
	}, []);
	const enter = useCallback(() => {
		setFull(true);
		const page = document.documentElement;
		if (typeof page.requestFullscreen === "function" && document.fullscreenEnabled && !document.fullscreenElement) page.requestFullscreen().catch(() => void 0);
	}, []);
	useEffect(() => {
		if (!full) return void 0;
		const page = document.documentElement;
		page.classList.add(PAGE_FULL_CLASS);
		const onChange = () => {
			if (!document.fullscreenElement) setFull(false);
		};
		const onKey = (e) => {
			if (e.key === "Escape" && !isEditing(e.target)) leave();
		};
		document.addEventListener("fullscreenchange", onChange);
		document.addEventListener("keydown", onKey);
		return () => {
			page.classList.remove(PAGE_FULL_CLASS);
			document.removeEventListener("fullscreenchange", onChange);
			document.removeEventListener("keydown", onKey);
		};
	}, [full, leave]);
	const isFull = useRef(full);
	isFull.current = full;
	useEffect(() => () => {
		if (isFull.current && document.fullscreenElement) document.exitFullscreen().catch(() => void 0);
	}, []);
	return {
		full,
		toggle: full ? leave : enter
	};
};
// src/ui/pictures.ts
/** Our own drawings, bundled with the package. Pictures a student uploads come from the site through `resolveAsset`. */
var LIBRARY_URLS = {
	"library:cat": "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20200%20200'%3e%3cpath%20d='M50%20150c0-50%2020-80%2050-80s50%2030%2050%2080z'%20fill='%23f59e0b'/%3e%3cpath%20d='M150%20140c25%200%2035-20%2030-40'%20stroke='%23f59e0b'%20stroke-width='10'%20fill='none'%20stroke-linecap='round'/%3e%3ccircle%20cx='100'%20cy='70'%20r='38'%20fill='%23f59e0b'/%3e%3cpath%20d='M68%2050l-6-34%2026%2020zM132%2050l6-34-26%2020z'%20fill='%23f59e0b'/%3e%3cpath%20d='M70%2045l-3-18%2013%2011zM130%2045l3-18-13%2011z'%20fill='%23fca5a5'/%3e%3ccircle%20cx='86'%20cy='66'%20r='6'%20fill='%231f2937'/%3e%3ccircle%20cx='114'%20cy='66'%20r='6'%20fill='%231f2937'/%3e%3cpath%20d='M95%2080h10l-5%206z'%20fill='%23ec4899'/%3e%3cpath%20d='M100%2086q-6%208-14%204M100%2086q6%208%2014%204'%20stroke='%231f2937'%20stroke-width='2.5'%20fill='none'/%3e%3cpath%20d='M60%2080h22M60%2088h22M118%2080h22M118%2088h22'%20stroke='%237c2d12'%20stroke-width='2'/%3e%3cpath%20d='M70%20150v-10M90%20150v-12M110%20150v-12M130%20150v-10'%20stroke='%23b45309'%20stroke-width='3'/%3e%3c/svg%3e",
	"library:dog": "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20200%20200'%3e%3cellipse%20cx='105'%20cy='140'%20rx='55'%20ry='38'%20fill='%23d6a46b'/%3e%3crect%20x='62'%20y='150'%20width='16'%20height='36'%20rx='8'%20fill='%23d6a46b'/%3e%3crect%20x='128'%20y='150'%20width='16'%20height='36'%20rx='8'%20fill='%23d6a46b'/%3e%3cpath%20d='M158%20120q22-20%2018-42'%20stroke='%23d6a46b'%20stroke-width='10'%20fill='none'%20stroke-linecap='round'/%3e%3ccircle%20cx='80'%20cy='82'%20r='40'%20fill='%23e8c08c'/%3e%3cellipse%20cx='45'%20cy='80'%20rx='14'%20ry='30'%20fill='%238b5a2b'/%3e%3cellipse%20cx='115'%20cy='80'%20rx='14'%20ry='30'%20fill='%238b5a2b'/%3e%3ccircle%20cx='66'%20cy='76'%20r='6'%20fill='%231f2937'/%3e%3ccircle%20cx='94'%20cy='76'%20r='6'%20fill='%231f2937'/%3e%3cellipse%20cx='80'%20cy='96'%20rx='11'%20ry='8'%20fill='%231f2937'/%3e%3cpath%20d='M80%20104q0%2010-10%2010M80%20104q0%2010%2010%2010'%20stroke='%231f2937'%20stroke-width='2.5'%20fill='none'/%3e%3cpath%20d='M76%20116q4%2012%208%200'%20fill='%23ec4899'/%3e%3ccircle%20cx='114'%20cy='130'%20r='5'%20fill='%23dc2626'/%3e%3cpath%20d='M60%20118q30%2014%2060%200'%20stroke='%23dc2626'%20stroke-width='6'%20fill='none'/%3e%3c/svg%3e",
	"library:fish": "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20300%20200'%3e%3cpath%20d='M230%20100l60-50v100z'%20fill='%23f97316'/%3e%3cellipse%20cx='140'%20cy='100'%20rx='105'%20ry='65'%20fill='%23fb923c'/%3e%3cpath%20d='M110%2040q30-35%2070%200z'%20fill='%23f97316'/%3e%3cpath%20d='M110%20160q30%2030%2060%200z'%20fill='%23f97316'/%3e%3cpath%20d='M100%2050q-20%2050%200%20100M140%2040q-20%2060%200%20120'%20stroke='%23ea580c'%20stroke-width='5'%20fill='none'/%3e%3ccircle%20cx='70'%20cy='85'%20r='15'%20fill='%23fff'/%3e%3ccircle%20cx='66'%20cy='85'%20r='8'%20fill='%231f2937'/%3e%3cpath%20d='M38%20115q10%208%2022%202'%20stroke='%237c2d12'%20stroke-width='4'%20fill='none'%20stroke-linecap='round'/%3e%3ccircle%20cx='20'%20cy='50'%20r='7'%20fill='none'%20stroke='%2338bdf8'%20stroke-width='3'/%3e%3ccircle%20cx='30'%20cy='25'%20r='5'%20fill='none'%20stroke='%2338bdf8'%20stroke-width='3'/%3e%3c/svg%3e",
	"library:snowman": "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20150%20200'%3e%3ccircle%20cx='75'%20cy='150'%20r='45'%20fill='%23fff'%20stroke='%2393c5fd'%20stroke-width='3'/%3e%3ccircle%20cx='75'%20cy='88'%20r='32'%20fill='%23fff'%20stroke='%2393c5fd'%20stroke-width='3'/%3e%3ccircle%20cx='75'%20cy='40'%20r='23'%20fill='%23fff'%20stroke='%2393c5fd'%20stroke-width='3'/%3e%3crect%20x='55'%20y='4'%20width='40'%20height='18'%20fill='%231f2937'/%3e%3crect%20x='47'%20y='20'%20width='56'%20height='6'%20fill='%231f2937'/%3e%3ccircle%20cx='67'%20cy='36'%20r='3'%20fill='%231f2937'/%3e%3ccircle%20cx='83'%20cy='36'%20r='3'%20fill='%231f2937'/%3e%3cpath%20d='M75%2043l18%205-18%203z'%20fill='%23f97316'/%3e%3cpath%20d='M55%2062q20%2012%2040%200'%20stroke='%23dc2626'%20stroke-width='7'%20fill='none'/%3e%3ccircle%20cx='75'%20cy='82'%20r='4'%20fill='%231f2937'/%3e%3ccircle%20cx='75'%20cy='96'%20r='4'%20fill='%231f2937'/%3e%3cpath%20d='M45%2085l-35-25M105%2085l35-25'%20stroke='%238b5a2b'%20stroke-width='5'%20stroke-linecap='round'/%3e%3c/svg%3e",
	"library:flower": "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20150%20200'%3e%3cpath%20d='M75%2090v105'%20stroke='%2316a34a'%20stroke-width='8'/%3e%3cpath%20d='M75%20150q-40-5-45-35%2035%200%2045%2035zM75%20170q40-5%2045-35-35%200-45%2035z'%20fill='%2322c55e'/%3e%3cg%20fill='%23ec4899'%3e%3ccircle%20cx='75'%20cy='40'%20r='22'/%3e%3ccircle%20cx='105'%20cy='60'%20r='22'/%3e%3ccircle%20cx='95'%20cy='95'%20r='22'/%3e%3ccircle%20cx='55'%20cy='95'%20r='22'/%3e%3ccircle%20cx='45'%20cy='60'%20r='22'/%3e%3c/g%3e%3ccircle%20cx='75'%20cy='68'%20r='18'%20fill='%23facc15'/%3e%3c/svg%3e",
	"library:sun": "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20200%20200'%3e%3cg%20stroke='%23f59e0b'%20stroke-width='10'%20stroke-linecap='round'%3e%3cpath%20d='M100%2010v28M100%20162v28M10%20100h28M162%20100h28M36%2036l20%2020M144%20144l20%2020M36%20164l20-20M144%2056l20-20'/%3e%3c/g%3e%3ccircle%20cx='100'%20cy='100'%20r='50'%20fill='%23facc15'/%3e%3ccircle%20cx='82'%20cy='92'%20r='6'%20fill='%231f2937'/%3e%3ccircle%20cx='118'%20cy='92'%20r='6'%20fill='%231f2937'/%3e%3cpath%20d='M78%20115q22%2020%2044%200'%20stroke='%231f2937'%20stroke-width='5'%20fill='none'%20stroke-linecap='round'/%3e%3c/svg%3e",
	"library:leaf": "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20200%20200'%3e%3cpath%20d='M100%20185V120'%20stroke='%238b5a2b'%20stroke-width='8'%20stroke-linecap='round'/%3e%3cpath%20d='M100%20125L40%20140l20-30-45-20%2040-10-25-40%2045%2015%2010-45%2015%2045%2015-45%2010%2045%2045-15-25%2040%2040%2010-45%2020%2020%2030z'%20fill='%23ea580c'/%3e%3cpath%20d='M100%20125V35M100%2095L55%2070M100%2095l45-25M100%20115L60%20120M100%20115l40%205'%20stroke='%239a3412'%20stroke-width='3'%20fill='none'/%3e%3c/svg%3e",
	"library:rocket": "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20120%20200'%3e%3cpath%20d='M45%20160q15%2040%2015%2040t15-40z'%20fill='%23f97316'/%3e%3cpath%20d='M52%20160q8%2025%208%2025t8-25z'%20fill='%23facc15'/%3e%3cpath%20d='M30%20120l-25%2040h30zM90%20120l25%2040H85z'%20fill='%23dc2626'/%3e%3cpath%20d='M60%205q35%2030%2035%2090v65H25V95q0-60%2035-90z'%20fill='%23e5e7eb'%20stroke='%236b7280'%20stroke-width='3'/%3e%3cpath%20d='M60%205q20%2017%2028%2040H32q8-23%2028-40z'%20fill='%23dc2626'/%3e%3ccircle%20cx='60'%20cy='85'%20r='16'%20fill='%2338bdf8'%20stroke='%236b7280'%20stroke-width='4'/%3e%3c/svg%3e",
	"library:planet": "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20280%20200'%3e%3ccircle%20cx='140'%20cy='100'%20r='70'%20fill='%23a78bfa'/%3e%3cpath%20d='M85%2070q55-20%20110%200M78%20105q62%2018%20124%200M95%20140q45%2012%2090%200'%20stroke='%237c3aed'%20stroke-width='8'%20fill='none'%20opacity='.5'/%3e%3cellipse%20cx='140'%20cy='105'%20rx='135'%20ry='30'%20fill='none'%20stroke='%23facc15'%20stroke-width='10'%20transform='rotate(-12%20140%20105)'/%3e%3cpath%20d='M75%2080a70%2070%200%200%201%20130%200'%20fill='%23a78bfa'/%3e%3ccircle%20cx='30'%20cy='30'%20r='4'%20fill='%23facc15'/%3e%3ccircle%20cx='250'%20cy='170'%20r='5'%20fill='%23facc15'/%3e%3ccircle%20cx='240'%20cy='25'%20r='3'%20fill='%23facc15'/%3e%3c/svg%3e",
	"library:museum": "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20266%20200'%3e%3crect%20width='266'%20height='200'%20fill='%23dbeafe'/%3e%3crect%20y='170'%20width='266'%20height='30'%20fill='%2386efac'/%3e%3cpath%20d='M30%2070L133%2020l103%2050z'%20fill='%23e7e5e4'%20stroke='%2378716c'%20stroke-width='4'/%3e%3crect%20x='40'%20y='70'%20width='186'%20height='14'%20fill='%23d6d3d1'/%3e%3cg%20fill='%23f5f5f4'%20stroke='%23a8a29e'%20stroke-width='3'%3e%3crect%20x='52'%20y='84'%20width='18'%20height='76'/%3e%3crect%20x='92'%20y='84'%20width='18'%20height='76'/%3e%3crect%20x='156'%20y='84'%20width='18'%20height='76'/%3e%3crect%20x='196'%20y='84'%20width='18'%20height='76'/%3e%3c/g%3e%3crect%20x='122'%20y='110'%20width='22'%20height='50'%20fill='%238b5a2b'/%3e%3crect%20x='30'%20y='160'%20width='206'%20height='12'%20fill='%23d6d3d1'/%3e%3c/svg%3e",
	"library:castle": "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20266%20200'%3e%3crect%20width='266'%20height='200'%20fill='%23bfdbfe'/%3e%3crect%20y='165'%20width='266'%20height='35'%20fill='%234ade80'/%3e%3crect%20x='70'%20y='80'%20width='126'%20height='90'%20fill='%23a8a29e'/%3e%3crect%20x='40'%20y='50'%20width='40'%20height='120'%20fill='%2378716c'/%3e%3crect%20x='186'%20y='50'%20width='40'%20height='120'%20fill='%2378716c'/%3e%3cpath%20d='M36%2050l24-35%2024%2035zM182%2050l24-35%2024%2035z'%20fill='%23dc2626'/%3e%3cpath%20d='M70%2080h12v-10h12v10h12v-10h12v10h12v-10h12v10h12v-10h12v10h12v-10h12v10'%20fill='%23a8a29e'/%3e%3cpath%20d='M118%20170v-35q15-20%2030%200v35z'%20fill='%2357534e'/%3e%3crect%20x='54'%20y='80'%20width='12'%20height='18'%20rx='6'%20fill='%231f2937'/%3e%3crect%20x='200'%20y='80'%20width='12'%20height='18'%20rx='6'%20fill='%231f2937'/%3e%3cpath%20d='M60%2015V0l14%206-14%206'%20fill='%23facc15'/%3e%3c/svg%3e",
	"library:park": "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20266%20200'%3e%3crect%20width='266'%20height='200'%20fill='%23e0f2fe'/%3e%3ccircle%20cx='220'%20cy='40'%20r='22'%20fill='%23facc15'/%3e%3crect%20y='140'%20width='266'%20height='60'%20fill='%2386efac'/%3e%3cpath%20d='M100%20200q30-40%2060-60h20q-20%2020-40%2060z'%20fill='%23d6d3d1'/%3e%3crect%20x='55'%20y='100'%20width='12'%20height='55'%20fill='%238b5a2b'/%3e%3ccircle%20cx='61'%20cy='85'%20r='35'%20fill='%2316a34a'/%3e%3crect%20x='190'%20y='110'%20width='10'%20height='45'%20fill='%238b5a2b'/%3e%3ccircle%20cx='195'%20cy='95'%20r='28'%20fill='%2322c55e'/%3e%3crect%20x='120'%20y='128'%20width='50'%20height='6'%20fill='%2392400e'/%3e%3crect%20x='124'%20y='134'%20width='5'%20height='12'%20fill='%2392400e'/%3e%3crect%20x='161'%20y='134'%20width='5'%20height='12'%20fill='%2392400e'/%3e%3ccircle%20cx='25'%20cy='170'%20r='6'%20fill='%23f472b6'/%3e%3ccircle%20cx='240'%20cy='175'%20r='6'%20fill='%23facc15'/%3e%3c/svg%3e"
};
var pictureUrl = (id, resolve) => LIBRARY_URLS[id] ?? (id.startsWith("upload:") ? resolve?.(id) : void 0);
var cache = /* @__PURE__ */ new Map();
/** Loads a picture once per page; `undefined` while it loads or when it cannot be loaded. */
var usePicture = (url) => {
	const [image, setImage] = useState(() => url ? cache.get(url) : void 0);
	useEffect(() => {
		if (!url) return void 0;
		const cached = cache.get(url);
		if (cached) {
			setImage(cached);
			return;
		}
		let alive = true;
		const img = new Image();
		img.decoding = "async";
		img.onload = () => {
			cache.set(url, img);
			if (alive) setImage(img);
		};
		img.src = url;
		return () => {
			alive = false;
		};
	}, [url]);
	return image;
};
// src/ui/Ribbon.tsx
var TABS = [
	["home", "Основне"],
	["insert", "Вставлення"],
	["design", "Конструктор"],
	["transitions", "Переходи"],
	["animations", "Анімація"],
	["show", "Показ слайдів"]
];
var SIZES = [
	12,
	14,
	18,
	20,
	24,
	28,
	32,
	36,
	40,
	44,
	48,
	54,
	60,
	66,
	72,
	80,
	96
];
/** A button of the ribbon. `command` names the action for guides and tests, as `data-u-command` does in edu-sheets. */
var Btn = ({ command, label, icon, onClick, disabled, pressed, wide }) => /* @__PURE__ */ jsxs("button", {
	type: "button",
	className: `esl-btn ${wide ? "is-wide" : ""}`,
	"data-command": command,
	title: label,
	"aria-label": label,
	...pressed === void 0 ? {} : { "aria-pressed": pressed },
	disabled,
	onClick,
	children: [icon !== void 0 && /* @__PURE__ */ jsx("span", {
		className: "esl-btn-icon",
		"aria-hidden": "true",
		children: icon
	}), wide && /* @__PURE__ */ jsx("span", {
		className: "esl-btn-label",
		children: label
	})]
});
/** A button that opens a small panel under it (layouts, shapes, pictures, colours). */
var Menu = ({ command, label, icon, children, disabled }) => {
	const [open, setOpen] = useState(false);
	const [at, setAt] = useState({
		top: 0,
		left: 0
	});
	const box = useRef(null);
	const toggle = () => {
		const r = box.current?.getBoundingClientRect();
		if (r) setAt({
			top: r.bottom + 4,
			left: Math.max(8, Math.min(r.left, window.innerWidth - 280))
		});
		setOpen((o) => !o);
	};
	useEffect(() => {
		if (!open) return void 0;
		const away = (e) => {
			if (box.current && !box.current.contains(e.target)) setOpen(false);
		};
		const esc = (e) => e.key === "Escape" && setOpen(false);
		document.addEventListener("pointerdown", away);
		document.addEventListener("keydown", esc);
		return () => {
			document.removeEventListener("pointerdown", away);
			document.removeEventListener("keydown", esc);
		};
	}, [open]);
	return /* @__PURE__ */ jsxs("div", {
		className: "esl-menu",
		ref: box,
		children: [/* @__PURE__ */ jsxs("button", {
			type: "button",
			className: "esl-btn is-wide",
			"data-command": command,
			title: label,
			"aria-expanded": open,
			disabled,
			onClick: toggle,
			children: [/* @__PURE__ */ jsx("span", {
				className: "esl-btn-icon",
				"aria-hidden": "true",
				children: icon
			}), /* @__PURE__ */ jsxs("span", {
				className: "esl-btn-label",
				children: [label, " ▾"]
			})]
		}), open && /* @__PURE__ */ jsx("div", {
			className: "esl-menu-panel",
			role: "menu",
			style: at,
			children: children(() => setOpen(false))
		})]
	});
};
var Swatches = ({ command, current, onPick }) => /* @__PURE__ */ jsx("div", {
	className: "esl-swatches",
	children: PALETTE.map((p) => /* @__PURE__ */ jsx("button", {
		type: "button",
		className: "esl-swatch",
		"data-command": `${command}:${p.color}`,
		style: { background: p.color },
		title: p.name,
		"aria-label": p.name,
		"aria-pressed": current === p.color,
		onClick: () => onPick(p.color)
	}, p.color))
});
var Group$1 = ({ title, children }) => /* @__PURE__ */ jsxs("div", {
	className: "esl-group",
	role: "group",
	"aria-label": title,
	children: [/* @__PURE__ */ jsx("div", {
		className: "esl-group-body",
		children
	}), /* @__PURE__ */ jsx("div", {
		className: "esl-group-title",
		children: title
	})]
});
var shapeIcon = {
	rect: "▭",
	roundRect: "▢",
	ellipse: "◯",
	triangle: "△",
	star: "☆",
	arrow: "➜",
	callout: "💬"
};
var Ribbon = ({ tab, onTab, slide, selected, actions: a }) => {
	const style = (selected && (selected.kind === "text" || selected.kind === "shape") ? selected : void 0)?.style;
	return /* @__PURE__ */ jsxs("div", {
		className: "esl-ribbon",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "esl-tabs",
			role: "tablist",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "esl-quick",
				children: [/* @__PURE__ */ jsx(Btn, {
					command: "edit.undo",
					label: "Скасувати (Ctrl+Z)",
					icon: "↶",
					onClick: a.undo,
					disabled: !a.canUndo
				}), /* @__PURE__ */ jsx(Btn, {
					command: "edit.redo",
					label: "Повторити (Ctrl+Y)",
					icon: "↷",
					onClick: a.redo,
					disabled: !a.canRedo
				})]
			}), TABS.map(([id, name]) => /* @__PURE__ */ jsx("button", {
				type: "button",
				role: "tab",
				"aria-selected": tab === id,
				"data-tab": id,
				className: "esl-tab",
				onClick: () => onTab(id),
				children: name
			}, id))]
		}), /* @__PURE__ */ jsxs("div", {
			className: "esl-panel",
			role: "tabpanel",
			children: [
				tab === "home" && /* @__PURE__ */ jsxs(Fragment, { children: [
					/* @__PURE__ */ jsxs(Group$1, {
						title: "Слайди",
						children: [
							/* @__PURE__ */ jsx(Menu, {
								command: "slide.new",
								label: "Створити слайд",
								icon: "＋",
								children: (close) => LAYOUTS.map((l) => /* @__PURE__ */ jsxs("button", {
									type: "button",
									role: "menuitem",
									className: "esl-menu-item",
									"data-command": `slide.new:${l}`,
									onClick: () => {
										a.newSlide(l);
										close();
									},
									children: [
										/* @__PURE__ */ jsx(LayoutIcon, { layout: l }),
										" ",
										LAYOUT_NAMES[l]
									]
								}, l))
							}),
							/* @__PURE__ */ jsx(Menu, {
								command: "slide.layout",
								label: "Макет",
								icon: "▤",
								children: (close) => LAYOUTS.map((l) => /* @__PURE__ */ jsxs("button", {
									type: "button",
									role: "menuitemradio",
									"aria-checked": slide.layout === l,
									className: "esl-menu-item",
									"data-command": `slide.layout:${l}`,
									onClick: () => {
										a.setLayout(l);
										close();
									},
									children: [
										/* @__PURE__ */ jsx(LayoutIcon, { layout: l }),
										" ",
										LAYOUT_NAMES[l]
									]
								}, l))
							}),
							/* @__PURE__ */ jsx(Btn, {
								command: "slide.duplicate",
								label: "Дублювати слайд",
								icon: "⧉",
								onClick: a.duplicateSlide
							}),
							/* @__PURE__ */ jsx(Btn, {
								command: "slide.delete",
								label: "Видалити слайд",
								icon: "🗑",
								onClick: a.deleteSlide
							})
						]
					}),
					/* @__PURE__ */ jsxs(Group$1, {
						title: "Шрифт",
						children: [
							/* @__PURE__ */ jsx("select", {
								className: "esl-select",
								"aria-label": "Шрифт",
								"data-command": "format.font",
								disabled: !style,
								value: style?.font ?? "Arial",
								onChange: (e) => a.setStyle({ font: e.target.value }),
								children: FONTS.map((f) => /* @__PURE__ */ jsx("option", {
									value: f,
									children: f
								}, f))
							}),
							/* @__PURE__ */ jsx("select", {
								className: "esl-select is-narrow",
								"aria-label": "Розмір шрифту",
								"data-command": "format.size",
								disabled: !style,
								value: style?.size ?? 28,
								onChange: (e) => a.setStyle({ size: Number(e.target.value) }),
								children: [.../* @__PURE__ */ new Set([...SIZES, style?.size ?? 28])].sort((x, y) => x - y).map((s) => /* @__PURE__ */ jsx("option", {
									value: s,
									children: s
								}, s))
							}),
							/* @__PURE__ */ jsx(Btn, {
								command: "format.bold",
								label: "Жирний (Ctrl+B)",
								icon: /* @__PURE__ */ jsx("b", { children: "Ж" }),
								disabled: !style,
								pressed: style?.bold ?? false,
								onClick: () => a.setStyle({ bold: !style?.bold })
							}),
							/* @__PURE__ */ jsx(Btn, {
								command: "format.italic",
								label: "Курсив (Ctrl+I)",
								icon: /* @__PURE__ */ jsx("i", { children: "К" }),
								disabled: !style,
								pressed: style?.italic ?? false,
								onClick: () => a.setStyle({ italic: !style?.italic })
							}),
							/* @__PURE__ */ jsx(Btn, {
								command: "format.underline",
								label: "Підкреслений (Ctrl+U)",
								icon: /* @__PURE__ */ jsx("u", { children: "П" }),
								disabled: !style,
								pressed: style?.underline ?? false,
								onClick: () => a.setStyle({ underline: !style?.underline })
							}),
							/* @__PURE__ */ jsx(Menu, {
								command: "format.color",
								label: "Колір тексту",
								icon: /* @__PURE__ */ jsx("span", {
									className: "esl-color-a",
									style: { borderColor: style?.color ?? "#1f2937" },
									children: "А"
								}),
								disabled: !style,
								children: (close) => /* @__PURE__ */ jsx(Swatches, {
									command: "format.color",
									current: style?.color,
									onPick: (c) => {
										a.setStyle({ color: c });
										close();
									}
								})
							})
						]
					}),
					/* @__PURE__ */ jsx(Group$1, {
						title: "Абзац",
						children: [
							"left",
							"center",
							"right"
						].map((al) => /* @__PURE__ */ jsx(Btn, {
							command: `format.align:${al}`,
							label: {
								left: "Ліворуч",
								center: "По центру",
								right: "Праворуч"
							}[al],
							icon: {
								left: "⯇≡",
								center: "≡",
								right: "≡⯈"
							}[al],
							disabled: !style,
							pressed: style?.align === al,
							onClick: () => a.setStyle({ align: al })
						}, al))
					}),
					/* @__PURE__ */ jsxs(Group$1, {
						title: "Упорядкування",
						children: [
							selected?.kind === "shape" && /* @__PURE__ */ jsx(Menu, {
								command: "format.fill",
								label: "Заливка",
								icon: "🪣",
								children: (close) => /* @__PURE__ */ jsx(Swatches, {
									command: "format.fill",
									current: selected.fill,
									onPick: (c) => {
										a.setFill(c);
										close();
									}
								})
							}),
							/* @__PURE__ */ jsx(Btn, {
								command: "arrange.front",
								label: "На передній план",
								icon: "⬒",
								disabled: !selected,
								onClick: () => a.arrange("front")
							}),
							/* @__PURE__ */ jsx(Btn, {
								command: "arrange.back",
								label: "На задній план",
								icon: "⬓",
								disabled: !selected,
								onClick: () => a.arrange("back")
							}),
							/* @__PURE__ */ jsx(Btn, {
								command: "element.delete",
								label: "Видалити об'єкт (Delete)",
								icon: "✕",
								disabled: !selected,
								onClick: a.deleteElement
							})
						]
					})
				] }),
				tab === "insert" && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Group$1, {
					title: "Текст",
					children: /* @__PURE__ */ jsx(Btn, {
						command: "insert.text",
						label: "Напис",
						icon: "🅰",
						wide: true,
						onClick: a.insertText
					})
				}), /* @__PURE__ */ jsxs(Group$1, {
					title: "Ілюстрації",
					children: [/* @__PURE__ */ jsx(Menu, {
						command: "insert.shape",
						label: "Фігури",
						icon: "△",
						children: (close) => /* @__PURE__ */ jsx("div", {
							className: "esl-grid",
							children: SHAPES.map((s) => /* @__PURE__ */ jsx("button", {
								type: "button",
								className: "esl-tile",
								"data-command": `insert.shape:${s}`,
								title: SHAPE_NAMES[s],
								"aria-label": SHAPE_NAMES[s],
								onClick: () => {
									a.insertShape(s);
									close();
								},
								children: /* @__PURE__ */ jsx("span", {
									"aria-hidden": "true",
									children: shapeIcon[s]
								})
							}, s))
						})
					}), /* @__PURE__ */ jsx(Menu, {
						command: "insert.picture",
						label: "Малюнок",
						icon: "🖼",
						children: (close) => /* @__PURE__ */ jsx("div", {
							className: "esl-pictures",
							children: [...new Set(LIBRARY.map((p) => p.album))].map((album) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
								className: "esl-album",
								children: album
							}), /* @__PURE__ */ jsx("div", {
								className: "esl-grid",
								children: LIBRARY.filter((p) => p.album === album).map((p) => /* @__PURE__ */ jsx("button", {
									type: "button",
									className: "esl-tile is-picture",
									"data-command": `insert.picture:${p.id}`,
									title: p.name,
									"aria-label": p.name,
									onClick: () => {
										a.insertPicture(p.id);
										close();
									},
									children: /* @__PURE__ */ jsx("img", {
										src: pictureUrl(p.id),
										alt: ""
									})
								}, p.id))
							})] }, album))
						})
					})]
				})] }),
				tab === "design" && /* @__PURE__ */ jsxs(Group$1, {
					title: "Тло слайда",
					children: [/* @__PURE__ */ jsx(Swatches, {
						command: "design.background",
						current: slide.background,
						onPick: a.setBackground
					}), /* @__PURE__ */ jsx(Btn, {
						command: "design.background.all",
						label: "Застосувати до всіх",
						icon: "⤓",
						wide: true,
						onClick: a.backgroundToAll
					})]
				}),
				tab === "transitions" && /* @__PURE__ */ jsxs(Group$1, {
					title: "Перехід до цього слайда",
					children: [TRANSITIONS.map((t) => /* @__PURE__ */ jsx(Btn, {
						command: `transition:${t}`,
						label: TRANSITION_NAMES[t],
						icon: {
							none: "∅",
							fade: "◐",
							push: "⇠",
							wipe: "▥",
							zoom: "⤢"
						}[t],
						wide: true,
						pressed: slide.transition.effect === t,
						onClick: () => a.setTransition(t)
					}, t)), /* @__PURE__ */ jsx(Btn, {
						command: "transition.all",
						label: "Застосувати до всіх",
						icon: "⤓",
						wide: true,
						onClick: a.transitionToAll
					})]
				}),
				tab === "animations" && /* @__PURE__ */ jsxs(Fragment, { children: [
					Object.keys(EFFECTS).map((g) => /* @__PURE__ */ jsx(Group$1, {
						title: GROUP_NAMES[g],
						children: EFFECTS[g].map((ef) => /* @__PURE__ */ jsx(Btn, {
							command: `animation:${g}:${ef}`,
							label: EFFECT_NAMES[ef],
							icon: {
								entrance: "★",
								emphasis: "✶",
								exit: "☆"
							}[g],
							wide: true,
							disabled: !selected,
							pressed: selected?.animation?.effect === ef,
							onClick: () => a.setAnimation(g, ef)
						}, ef))
					}, g)),
					/* @__PURE__ */ jsxs(Group$1, {
						title: "Час",
						children: [/* @__PURE__ */ jsxs("select", {
							className: "esl-select",
							"aria-label": "Початок анімації",
							"data-command": "animation.start",
							disabled: !selected?.animation,
							value: selected?.animation?.start ?? "click",
							onChange: (e) => a.setAnimationStart(e.target.value),
							children: [
								/* @__PURE__ */ jsx("option", {
									value: "click",
									children: "За клацанням"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "with",
									children: "Разом з попереднім"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "after",
									children: "Після попереднього"
								})
							]
						}), /* @__PURE__ */ jsx(Btn, {
							command: "animation.remove",
							label: "Прибрати анімацію",
							icon: "✕",
							wide: true,
							disabled: !selected?.animation,
							onClick: a.removeAnimation
						})]
					}),
					!selected && /* @__PURE__ */ jsx("p", {
						className: "esl-tip",
						children: "Спершу клацни об'єкт на слайді."
					})
				] }),
				tab === "show" && /* @__PURE__ */ jsxs(Group$1, {
					title: "Почати показ",
					children: [/* @__PURE__ */ jsx(Btn, {
						command: "show.start",
						label: "З початку (F5)",
						icon: "▶",
						wide: true,
						onClick: a.showFromStart
					}), /* @__PURE__ */ jsx(Btn, {
						command: "show.current",
						label: "З поточного слайда (Shift+F5)",
						icon: "⏵",
						wide: true,
						onClick: a.showFromCurrent
					})]
				})
			]
		})]
	});
};
/** A tiny picture of a layout for the menus. */
var LayoutIcon = ({ layout }) => /* @__PURE__ */ jsxs("svg", {
	width: "40",
	height: "24",
	viewBox: "0 0 40 24",
	"aria-hidden": "true",
	className: "esl-layout-icon",
	children: [
		/* @__PURE__ */ jsx("rect", {
			x: "0.5",
			y: "0.5",
			width: "39",
			height: "23",
			fill: "#fff",
			stroke: "#9ca3af"
		}),
		layout === "title" && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("rect", {
			x: "6",
			y: "7",
			width: "28",
			height: "5",
			fill: "#6b7280"
		}), /* @__PURE__ */ jsx("rect", {
			x: "11",
			y: "14",
			width: "18",
			height: "3",
			fill: "#cbd5e1"
		})] }),
		(layout === "titleContent" || layout === "twoContent" || layout === "titleOnly") && /* @__PURE__ */ jsx("rect", {
			x: "4",
			y: "3",
			width: "32",
			height: "4",
			fill: "#6b7280"
		}),
		layout === "titleContent" && /* @__PURE__ */ jsx("rect", {
			x: "4",
			y: "9",
			width: "32",
			height: "12",
			fill: "#cbd5e1"
		}),
		layout === "twoContent" && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("rect", {
			x: "4",
			y: "9",
			width: "15",
			height: "12",
			fill: "#cbd5e1"
		}), /* @__PURE__ */ jsx("rect", {
			x: "21",
			y: "9",
			width: "15",
			height: "12",
			fill: "#cbd5e1"
		})] })
	]
});
// src/ui/SlideElements.tsx
var fontStyle = (s) => [s.italic ? "italic" : "", s.bold ? "bold" : ""].join(" ").trim() || "normal";
var PLACEHOLDER = {
	title: "Клацніть двічі, щоб додати заголовок",
	body: "Клацніть двічі, щоб додати текст",
	caption: "Клацніть двічі, щоб додати напис"
};
/** Points of a polygon that fills a w×h box. */
var polygon = (shape, w, h) => {
	switch (shape) {
		case "triangle": return [
			w / 2,
			0,
			w,
			h,
			0,
			h
		];
		case "arrow": return [
			0,
			h * .3,
			w * .62,
			h * .3,
			w * .62,
			0,
			w,
			h / 2,
			w * .62,
			h,
			w * .62,
			h * .7,
			0,
			h * .7
		];
		case "callout": return [
			0,
			0,
			w,
			0,
			w,
			h * .72,
			w * .45,
			h * .72,
			w * .2,
			h,
			w * .25,
			h * .72,
			0,
			h * .72
		];
		case "star": {
			const pts = [];
			for (let i = 0; i < 10; i++) {
				const r = i % 2 === 0 ? .5 : .2;
				const a = -Math.PI / 2 + i * Math.PI / 5;
				pts.push(w / 2 + Math.cos(a) * r * w, h * .53 + Math.sin(a) * r * h * 1.05);
			}
			return pts;
		}
		default: return [];
	}
};
var TextBody = ({ el, text, editing, empty }) => /* @__PURE__ */ jsx(Text, {
	width: el.width,
	height: el.height,
	padding: 8,
	text: editing ? "" : text,
	fontFamily: el.style.font,
	fontSize: el.style.size,
	fontStyle: fontStyle(el.style),
	textDecoration: el.style.underline ? "underline" : "",
	align: el.style.align,
	verticalAlign: el.kind === "shape" || el.kind === "text" && el.role === "title" ? "middle" : "top",
	fill: empty ? "#9ca3af" : el.style.color,
	wrap: "word",
	ellipsis: false,
	listening: false
});
var TextNode = ({ el, editor, editing }) => {
	const empty = el.text.trim() === "";
	if (empty && !editor) return null;
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Rect, {
		width: el.width,
		height: el.height,
		...el.fill ? { fill: el.fill } : { fill: "rgba(0,0,0,0.001)" },
		...empty && editor ? {
			stroke: "#9ca3af",
			dash: [6, 4],
			strokeWidth: 1.5,
			strokeScaleEnabled: false
		} : {}
	}), /* @__PURE__ */ jsx(TextBody, {
		el: empty && editor ? {
			...el,
			style: {
				...el.style,
				size: Math.min(el.style.size, 28),
				bold: false
			}
		} : el,
		text: empty ? PLACEHOLDER[el.role] : el.text,
		editing,
		empty
	})] });
};
var ShapeNode = ({ el, editing }) => {
	const common = {
		fill: el.fill,
		stroke: el.stroke,
		strokeWidth: 3
	};
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		el.shape === "rect" && /* @__PURE__ */ jsx(Rect, {
			width: el.width,
			height: el.height,
			...common
		}),
		el.shape === "roundRect" && /* @__PURE__ */ jsx(Rect, {
			width: el.width,
			height: el.height,
			cornerRadius: Math.min(el.width, el.height) * .18,
			...common
		}),
		el.shape === "ellipse" && /* @__PURE__ */ jsx(Ellipse, {
			x: el.width / 2,
			y: el.height / 2,
			radiusX: el.width / 2,
			radiusY: el.height / 2,
			...common
		}),
		(el.shape === "triangle" || el.shape === "arrow" || el.shape === "callout" || el.shape === "star") && /* @__PURE__ */ jsx(Line, {
			points: [...polygon(el.shape, el.width, el.height)],
			closed: true,
			...common,
			lineJoin: "round"
		}),
		el.text !== "" && /* @__PURE__ */ jsx(TextBody, {
			el: el.shape === "callout" ? {
				...el,
				height: el.height * .72
			} : el,
			text: el.text,
			editing
		})
	] });
};
var ImageNode = ({ el, resolve }) => {
	const image = usePicture(pictureUrl(el.asset, resolve));
	return image ? /* @__PURE__ */ jsx(Image$1, {
		image,
		width: el.width,
		height: el.height
	}) : /* @__PURE__ */ jsx(Rect, {
		width: el.width,
		height: el.height,
		fill: "#e5e7eb"
	});
};
var SlideElements = ({ slide, editor = false, editingId = null, resolveAsset, nodeRef, onSelect, onEdit, onMoved, onLinkClick }) => /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Rect, {
	width: 960,
	height: 540,
	fill: slide.background,
	listening: editor,
	onMouseDown: () => onSelect?.(""),
	onTap: () => onSelect?.("")
}), slide.elements.map((el) => /* @__PURE__ */ jsxs(Group, {
	id: el.id,
	ref: (node) => nodeRef?.(el.id, node),
	x: el.x,
	y: el.y,
	rotation: el.rotation,
	draggable: editor && editingId !== el.id,
	listening: editor || el.link !== void 0,
	onMouseDown: () => onSelect?.(el.id),
	onTap: () => onSelect?.(el.id),
	onDblClick: () => (el.kind === "text" || el.kind === "shape") && onEdit?.(el.id),
	onDblTap: () => (el.kind === "text" || el.kind === "shape") && onEdit?.(el.id),
	onDragEnd: (e) => onMoved?.(el.id, Math.round(e.target.x()), Math.round(e.target.y())),
	onClick: () => onLinkClick?.(el),
	...!editor && el.link ? {
		onMouseEnter: (e) => setCursor(e, "pointer"),
		onMouseLeave: (e) => setCursor(e, "")
	} : {},
	children: [
		el.kind === "text" && /* @__PURE__ */ jsx(TextNode, {
			el,
			editor,
			editing: editingId === el.id
		}),
		el.kind === "shape" && /* @__PURE__ */ jsx(ShapeNode, {
			el,
			editing: editingId === el.id
		}),
		el.kind === "image" && /* @__PURE__ */ jsx(ImageNode, {
			el,
			resolve: resolveAsset
		})
	]
}, el.id))] });
var setCursor = (e, cursor) => {
	const stage = e.target.getStage();
	if (stage) stage.container().style.cursor = cursor;
};
// src/ui/SlideCanvas.tsx
/** Size of the slide on screen: as large as the workspace allows, 16:9. */
var useFit = (box) => {
	const [width, setWidth] = useState(640);
	useLayoutEffect(() => {
		const el = box.current;
		if (!el) return void 0;
		const measure = () => {
			const w = el.clientWidth - 24;
			const h = el.clientHeight - 24;
			setWidth(Math.max(240, Math.floor(Math.min(w, h > 120 ? h * 960 / 540 : w))));
		};
		measure();
		const ro = new ResizeObserver(measure);
		ro.observe(el);
		return () => ro.disconnect();
	}, [box]);
	return width;
};
/** The slide being edited: drag, resize and rotate objects, double-click to type. */
var SlideCanvas = ({ slide, selectedId, editingId, resolveAsset, onSelect, onEdit, onChange }) => {
	const box = useRef(null);
	const width = useFit(box);
	const scale = width / 960;
	const nodes = useRef(/* @__PURE__ */ new Map());
	const transformer = useRef(null);
	const selected = slide.elements.find((e) => e.id === selectedId);
	const editing = slide.elements.find((e) => e.id === editingId);
	const nodeRef = useCallback((id, node) => {
		if (node) nodes.current.set(id, node);
		else nodes.current.delete(id);
	}, []);
	useEffect(() => {
		const tr = transformer.current;
		if (!tr) return;
		const node = selectedId && !editingId ? nodes.current.get(selectedId) : void 0;
		tr.nodes(node ? [node] : []);
		tr.getLayer()?.batchDraw();
	}, [
		selectedId,
		editingId,
		slide
	]);
	const onTransformEnd = () => {
		const node = selectedId ? nodes.current.get(selectedId) : void 0;
		if (!node || !selected) return;
		const sx = node.scaleX();
		const sy = node.scaleY();
		node.scale({
			x: 1,
			y: 1
		});
		onChange(selected.id, {
			x: Math.round(node.x()),
			y: Math.round(node.y()),
			rotation: Math.round(node.rotation()),
			width: Math.max(10, Math.round(selected.width * sx)),
			height: Math.max(10, Math.round(selected.height * sy))
		});
	};
	return /* @__PURE__ */ jsx("div", {
		className: "esl-workspace",
		ref: box,
		children: /* @__PURE__ */ jsxs("div", {
			className: "esl-stage",
			style: {
				width,
				height: width * (540 / 960)
			},
			"data-target": "slide",
			children: [/* @__PURE__ */ jsx(Stage, {
				width,
				height: width * (540 / 960),
				scaleX: scale,
				scaleY: scale,
				children: /* @__PURE__ */ jsxs(Layer, { children: [/* @__PURE__ */ jsx(SlideElements, {
					slide,
					editor: true,
					editingId,
					resolveAsset,
					nodeRef,
					onSelect: (id) => {
						if (editingId && id !== editingId) onEdit(null);
						onSelect(id === "" ? null : id);
					},
					onEdit: (id) => {
						onSelect(id);
						onEdit(id);
					},
					onMoved: (id, x, y) => onChange(id, {
						x,
						y
					})
				}), /* @__PURE__ */ jsx(Transformer, {
					ref: transformer,
					rotateEnabled: true,
					keepRatio: selected?.kind === "image",
					rotationSnaps: [
						0,
						90,
						180,
						270
					],
					anchorSize: 12,
					anchorCornerRadius: 6,
					borderStroke: "#2563eb",
					anchorStroke: "#2563eb",
					boundBoxFunc: (oldBox, newBox) => newBox.width < 10 || newBox.height < 10 ? oldBox : newBox,
					onTransformEnd
				})] })
			}), editing && (editing.kind === "text" || editing.kind === "shape") && /* @__PURE__ */ jsx(TextEditor, {
				el: editing,
				scale,
				onCommit: (text) => text !== editing.text && onChange(editing.id, { text }),
				onClose: () => onEdit(null)
			}, editing.id)]
		})
	});
};
/**
* Typing happens in a plain `<textarea>` over the slide: real browser text input (Cyrillic, IME, the phone keyboard),
* and its value is only ever plain text.
*/
var TextEditor = ({ el, scale, onCommit, onClose }) => {
	const [value, setValue] = useState(el.text);
	const ref = useRef(null);
	const latest = useRef({
		value,
		onCommit
	});
	latest.current = {
		value,
		onCommit
	};
	useEffect(() => {
		const t = ref.current;
		if (t) {
			t.focus();
			t.setSelectionRange(t.value.length, t.value.length);
		}
		return () => latest.current.onCommit(latest.current.value);
	}, []);
	const onDone = () => onClose();
	return /* @__PURE__ */ jsx("textarea", {
		ref,
		className: "esl-text-editor",
		"aria-label": "Текст напису",
		value,
		maxLength: 2e3,
		onChange: (e) => setValue(e.target.value),
		onBlur: onDone,
		onKeyDown: (e) => {
			if (e.key === "Escape") {
				e.preventDefault();
				e.stopPropagation();
				onDone();
			}
		},
		style: {
			left: el.x * scale,
			top: el.y * scale,
			width: el.width * scale,
			height: el.height * scale,
			transform: `rotate(${el.rotation}deg)`,
			fontFamily: el.style.font,
			fontSize: el.style.size * scale,
			fontWeight: el.style.bold ? 700 : 400,
			fontStyle: el.style.italic ? "italic" : "normal",
			textDecoration: el.style.underline ? "underline" : "none",
			textAlign: el.style.align,
			color: el.style.color,
			padding: 8 * scale
		}
	});
};
// src/ui/SlideShow.tsx
/** Groups a slide's animations into clicks: «За клацанням» starts a new click, «Разом» and «Після» join the last one. */
var animationSteps = (slide) => {
	const steps = [];
	let lastDelay = 0;
	let lastDuration = 0;
	for (const el of slide.elements) {
		const a = el.animation;
		if (!a) continue;
		const current = steps[steps.length - 1];
		if (a.start === "click" || !current) {
			steps.push([{
				el,
				delay: 0
			}]);
			lastDelay = 0;
		} else {
			lastDelay = a.start === "with" ? lastDelay : lastDelay + lastDuration;
			current.push({
				el,
				delay: lastDelay
			});
		}
		lastDuration = a.duration;
	}
	return steps;
};
var useWindowFit = () => {
	const fit = () => Math.min(window.innerWidth, window.innerHeight * 960 / 540);
	const [width, setWidth] = useState(fit);
	useEffect(() => {
		const on = () => setWidth(fit());
		window.addEventListener("resize", on);
		return () => window.removeEventListener("resize", on);
	}, []);
	return width;
};
/** Puts a node in the state before its effect: entrance objects wait unseen. */
var prepare = (node, el) => {
	node.opacity(el.animation?.group === "entrance" ? 0 : 1);
	node.position({
		x: el.x,
		y: el.y
	});
	node.scale({
		x: 1,
		y: 1
	});
	node.rotation(el.rotation);
};
/** Puts a node in the state after its effect, for a slide the show comes back to. */
var finish = (node, el) => {
	prepare(node, el);
	node.opacity(el.animation?.group === "exit" ? 0 : 1);
};
var play = (node, el, delay) => {
	const a = el.animation;
	if (!a) return;
	const d = a.duration;
	const run = () => {
		switch (a.effect) {
			case "appear":
				node.opacity(1);
				break;
			case "fade":
				node.to({
					opacity: 1,
					duration: d
				});
				break;
			case "flyIn":
				node.y(560);
				node.opacity(1);
				node.to({
					y: el.y,
					duration: d
				});
				break;
			case "zoomIn":
				node.scale({
					x: .2,
					y: .2
				});
				node.position({
					x: el.x + el.width * .4,
					y: el.y + el.height * .4
				});
				node.opacity(1);
				node.to({
					scaleX: 1,
					scaleY: 1,
					x: el.x,
					y: el.y,
					duration: d
				});
				break;
			case "pulse":
				node.to({
					scaleX: 1.12,
					scaleY: 1.12,
					x: el.x - el.width * .06,
					y: el.y - el.height * .06,
					duration: d / 2,
					onFinish: () => node.to({
						scaleX: 1,
						scaleY: 1,
						x: el.x,
						y: el.y,
						duration: d / 2
					})
				});
				break;
			case "spin":
				node.to({
					rotation: el.rotation + 360,
					duration: d,
					onFinish: () => node.rotation(el.rotation)
				});
				break;
			case "disappear":
				node.opacity(0);
				break;
			case "fadeOut":
				node.to({
					opacity: 0,
					duration: d
				});
				break;
			case "flyOut": node.to({
				y: 560,
				duration: d,
				onFinish: () => node.opacity(0)
			});
		}
	};
	if (delay > 0) window.setTimeout(run, delay * 1e3);
	else run();
};
/** The slide show over the whole screen: clicks, arrows, space and Enter go on, Esc ends it. */
var SlideShow = ({ deck, startAt, resolveAsset, onClose }) => {
	const shown = deck.slides.filter((s) => !s.hidden);
	const first = Math.max(0, shown.findIndex((s) => s.id === deck.slides[startAt]?.id));
	const [pos, setPos] = useState({
		index: first,
		step: 0,
		built: false
	});
	const [leaving, setLeaving] = useState(null);
	const width = useWindowFit();
	const scale = width / 960;
	const nodes = useRef(/* @__PURE__ */ new Map());
	const box = useRef(null);
	const linkClicked = useRef(false);
	const slide = shown[pos.index];
	const steps = slide ? animationSteps(slide) : [];
	const nodeRef = useCallback((id, node) => {
		if (node) nodes.current.set(id, node);
		else nodes.current.delete(id);
	}, []);
	useLayoutEffect(() => {
		if (!slide) return;
		for (const el of slide.elements) {
			const node = nodes.current.get(el.id);
			if (node) (pos.built ? finish : prepare)(node, el);
		}
		nodes.current.forEach((n) => n.getLayer()?.batchDraw());
	}, [slide?.id, pos.built]);
	const next = useCallback(() => {
		if (!slide) return onClose();
		if (!pos.built && pos.step < steps.length) {
			for (const item of steps[pos.step] ?? []) {
				const node = nodes.current.get(item.el.id);
				if (node) play(node, item.el, item.delay);
			}
			setPos({
				...pos,
				step: pos.step + 1
			});
			return;
		}
		setPos({
			index: pos.index + 1,
			step: 0,
			built: false
		});
	}, [
		slide,
		pos,
		steps,
		onClose
	]);
	const prev = useCallback(() => {
		if (pos.index > 0) setPos({
			index: Math.min(pos.index, shown.length) - 1,
			step: 0,
			built: true
		});
	}, [pos.index, shown.length]);
	useEffect(() => {
		const onKey = (e) => {
			if (leaving !== null) return;
			if ([
				"ArrowRight",
				"ArrowDown",
				"PageDown",
				" ",
				"Enter",
				"n"
			].includes(e.key)) {
				e.preventDefault();
				next();
			} else if ([
				"ArrowLeft",
				"ArrowUp",
				"PageUp",
				"Backspace",
				"p"
			].includes(e.key)) {
				e.preventDefault();
				prev();
			} else if (e.key === "Escape") {
				e.preventDefault();
				onClose();
			} else if (e.key === "Home") setPos({
				index: 0,
				step: 0,
				built: false
			});
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [
		next,
		prev,
		onClose,
		leaving
	]);
	useEffect(() => {
		const el = box.current;
		if (el && typeof el.requestFullscreen === "function" && document.fullscreenEnabled) el.requestFullscreen().catch(() => void 0);
		const onChange = () => {
			if (!document.fullscreenElement) onClose();
		};
		document.addEventListener("fullscreenchange", onChange);
		return () => {
			document.removeEventListener("fullscreenchange", onChange);
			if (document.fullscreenElement) document.exitFullscreen().catch(() => void 0);
		};
	}, [onClose]);
	const onLink = (el) => {
		if (!el.link) return;
		linkClicked.current = true;
		if ("slide" in el.link) {
			const target = shown.findIndex((s) => "slide" in el.link && s.id === el.link.slide);
			if (target >= 0) setPos({
				index: target,
				step: 0,
				built: false
			});
		} else setLeaving(el.link.url);
	};
	const transition = slide?.transition ?? {
		effect: "none",
		duration: 1
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "esl-show",
		ref: box,
		role: "dialog",
		"aria-label": "Показ слайдів",
		onClick: () => {
			if (linkClicked.current) {
				linkClicked.current = false;
				return;
			}
			if (leaving === null) next();
		},
		onContextMenu: (e) => {
			e.preventDefault();
			prev();
		},
		children: [
			slide ? /* @__PURE__ */ jsx("div", {
				className: `esl-show-slide esl-tr-${transition.effect}`,
				style: {
					width,
					height: width * (540 / 960),
					animationDuration: `${transition.duration}s`
				},
				children: /* @__PURE__ */ jsx(Stage, {
					width,
					height: width * (540 / 960),
					scaleX: scale,
					scaleY: scale,
					children: /* @__PURE__ */ jsx(Layer, { children: /* @__PURE__ */ jsx(SlideElements, {
						slide,
						resolveAsset,
						nodeRef,
						onLinkClick: onLink
					}) })
				})
			}, slide.id) : /* @__PURE__ */ jsx("p", {
				className: "esl-show-end",
				children: "Кінець показу слайдів. Клацніть, щоб вийти."
			}),
			/* @__PURE__ */ jsx("button", {
				type: "button",
				className: "esl-show-close",
				"aria-label": "Завершити показ (Esc)",
				title: "Завершити показ (Esc)",
				onClick: (e) => {
					e.stopPropagation();
					onClose();
				},
				children: "✕"
			}),
			leaving !== null && /* @__PURE__ */ jsxs("div", {
				className: "esl-leave",
				role: "alertdialog",
				"aria-label": "Перехід на інший сайт",
				onClick: (e) => e.stopPropagation(),
				children: [
					/* @__PURE__ */ jsx("p", { children: "Посилання веде на інший сайт:" }),
					/* @__PURE__ */ jsx("p", {
						className: "esl-leave-url",
						children: leaving
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "esl-leave-actions",
						children: [/* @__PURE__ */ jsx("a", {
							href: leaving,
							target: "_blank",
							rel: "noopener noreferrer nofollow",
							referrerPolicy: "no-referrer",
							onClick: () => setLeaving(null),
							children: "Відкрити"
						}), /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => setLeaving(null),
							children: "Залишитися"
						})]
					})
				]
			})
		]
	});
};
// src/ui/TaskPanel.tsx
var ExpandIcon = ({ full }) => /* @__PURE__ */ jsx("svg", {
	width: "18",
	height: "18",
	viewBox: "0 0 20 20",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: "2",
	strokeLinecap: "round",
	strokeLinejoin: "round",
	"aria-hidden": "true",
	children: full ? /* @__PURE__ */ jsx("path", { d: "M8 3v5H3M12 3v5h5M8 17v-5H3M12 17v-5h5" }) : /* @__PURE__ */ jsx("path", { d: "M3 8V3h5M17 8V3h-5M3 12v5h5M17 12v5h-5" })
});
/** The task card: what to do, «Перевірити» and the result of each condition. Same layout as in edu-sheets. */
var TaskPanel = ({ scenario, results, open, selfCheck, full, onToggleFull, onNext, onToggle, onCheck, onReset }) => {
	const solved = results !== null && results.length > 0 && results.every((r) => r.ok);
	return /* @__PURE__ */ jsxs("div", {
		className: `esl-task ${open ? "is-open" : ""}`,
		children: [/* @__PURE__ */ jsxs("div", {
			className: "esl-task-head",
			children: [
				scenario.grade > 0 && /* @__PURE__ */ jsxs("span", {
					className: "esl-grade",
					children: [scenario.grade, " клас"]
				}),
				/* @__PURE__ */ jsx("h2", { children: scenario.title }),
				/* @__PURE__ */ jsx("button", {
					type: "button",
					className: "esl-icon-btn",
					"aria-pressed": full,
					"aria-label": full ? "Вийти з повного екрана" : "На весь екран",
					title: full ? "Вийти з повного екрана (Esc)" : "На весь екран",
					onClick: onToggleFull,
					children: /* @__PURE__ */ jsx(ExpandIcon, { full })
				}),
				/* @__PURE__ */ jsx("button", {
					type: "button",
					className: "esl-icon-btn",
					"aria-expanded": open,
					"aria-label": open ? "Сховати завдання" : "Показати завдання",
					onClick: onToggle,
					children: open ? "▴" : "▾"
				})
			]
		}), open && /* @__PURE__ */ jsxs(Fragment, { children: [
			/* @__PURE__ */ jsx("ol", {
				className: "esl-task-steps",
				children: scenario.task.map((step) => /* @__PURE__ */ jsx("li", { children: step }, step))
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "esl-task-actions",
				children: [selfCheck && /* @__PURE__ */ jsx("button", {
					type: "button",
					className: "esl-check",
					"data-command": "task.check",
					onClick: onCheck,
					children: "Перевірити"
				}), /* @__PURE__ */ jsx("button", {
					type: "button",
					className: "esl-reset",
					onClick: onReset,
					children: "Почати спочатку"
				})]
			}),
			results !== null && /* @__PURE__ */ jsxs("div", {
				className: `esl-results ${solved ? "is-solved" : ""}`,
				role: "status",
				children: [
					/* @__PURE__ */ jsx("p", {
						className: "esl-results-head",
						children: solved ? "🎉 Молодець! Усе виконано." : `Виконано ${results.filter((r) => r.ok).length} з ${results.length}`
					}),
					/* @__PURE__ */ jsx("ul", { children: results.map((r) => /* @__PURE__ */ jsxs("li", {
						className: r.ok ? "is-ok" : "is-bad",
						children: [
							/* @__PURE__ */ jsx("span", {
								"aria-hidden": "true",
								children: r.ok ? "✅" : "❌"
							}),
							" ",
							r.text,
							!r.ok && r.hint !== "" && /* @__PURE__ */ jsx("small", { children: r.hint })
						]
					}, r.text)) }),
					solved && onNext !== void 0 && /* @__PURE__ */ jsx("button", {
						type: "button",
						className: "esl-next",
						onClick: onNext,
						children: "Наступна вправа →"
					})
				]
			})
		] })]
	});
};
// src/ui/Thumbs.tsx
var THUMB_WIDTH = 150;
var Thumb = memo(({ slide, resolveAsset }) => /* @__PURE__ */ jsx(Stage, {
	width: THUMB_WIDTH,
	height: 1350 / 16,
	scaleX: THUMB_WIDTH / 960,
	scaleY: THUMB_WIDTH / 960,
	listening: false,
	children: /* @__PURE__ */ jsx(Layer, {
		listening: false,
		children: /* @__PURE__ */ jsx(SlideElements, {
			slide,
			resolveAsset
		})
	})
}));
/** The slide list: click to open a slide, drag a thumbnail (or use the arrows) to change the order. */
var Thumbs = ({ slides, current, resolveAsset, onPick, onMove }) => {
	const [dragging, setDragging] = useState(null);
	const [over, setOver] = useState(null);
	const currentIndex = slides.findIndex((s) => s.id === current);
	return /* @__PURE__ */ jsxs("div", {
		className: "esl-thumbs",
		role: "listbox",
		"aria-label": "Слайди",
		"data-target": "thumbs",
		children: [slides.map((slide, i) => /* @__PURE__ */ jsxs("div", {
			role: "option",
			"aria-selected": slide.id === current,
			tabIndex: slide.id === current ? 0 : -1,
			className: `esl-thumb ${slide.id === current ? "is-current" : ""} ${over === i && dragging !== null && dragging !== i ? "is-over" : ""}`,
			draggable: true,
			onDragStart: (e) => {
				setDragging(i);
				e.dataTransfer.effectAllowed = "move";
				e.dataTransfer.setData("text/plain", String(i));
			},
			onDragOver: (e) => {
				e.preventDefault();
				setOver(i);
			},
			onDragLeave: () => setOver((o) => o === i ? null : o),
			onDrop: (e) => {
				e.preventDefault();
				if (dragging !== null && dragging !== i) onMove(dragging, i);
				setDragging(null);
				setOver(null);
			},
			onDragEnd: () => {
				setDragging(null);
				setOver(null);
			},
			onClick: () => onPick(slide.id),
			onKeyDown: (e) => {
				if (e.key === "ArrowDown" || e.key === "ArrowRight") {
					e.preventDefault();
					const next = slides[i + 1];
					if (e.ctrlKey && next) onMove(i, i + 1);
					else if (next) onPick(next.id);
				}
				if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
					e.preventDefault();
					const prev = slides[i - 1];
					if (e.ctrlKey && prev) onMove(i, i - 1);
					else if (prev) onPick(prev.id);
				}
			},
			children: [/* @__PURE__ */ jsx("span", {
				className: "esl-thumb-no",
				children: i + 1
			}), /* @__PURE__ */ jsx("div", {
				className: `esl-thumb-img ${slide.hidden ? "is-hidden" : ""}`,
				children: /* @__PURE__ */ jsx(Thumb, {
					slide,
					resolveAsset
				})
			})]
		}, slide.id)), currentIndex >= 0 && slides.length > 1 && /* @__PURE__ */ jsxs("div", {
			className: "esl-thumb-move",
			"aria-label": "Перемістити поточний слайд",
			children: [/* @__PURE__ */ jsx("button", {
				type: "button",
				"data-command": "slide.moveUp",
				disabled: currentIndex === 0,
				onClick: () => onMove(currentIndex, currentIndex - 1),
				title: "Перемістити слайд вище",
				children: "▲"
			}), /* @__PURE__ */ jsx("button", {
				type: "button",
				"data-command": "slide.moveDown",
				disabled: currentIndex === slides.length - 1,
				onClick: () => onMove(currentIndex, currentIndex + 1),
				title: "Перемістити слайд нижче",
				children: "▼"
			})]
		})]
	});
};
// src/ui/EduSlides.tsx
var isTyping = (t) => t instanceof HTMLElement && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable);
/** The presentation trainer: ribbon, slide list, the slide, the task card and the show. */
var EduSlides = ({ scenario, initialDeck, onChange, onCheck, selfCheck = true, onNext, resolveAsset }) => {
	const start = useMemo(() => initialDeck ?? buildDeck(scenario.start), [scenario, initialDeck]);
	const [history, setHistory] = useState({
		past: [],
		present: start,
		future: []
	});
	const deck = history.present;
	const [currentId, setCurrentId] = useState(start.slides[0]?.id ?? "");
	const [selectedId, setSelectedId] = useState(null);
	const [editingId, setEditingId] = useState(null);
	const [tab, setTab] = useState("home");
	const [showAt, setShowAt] = useState(null);
	const [results, setResults] = useState(null);
	const [taskOpen, setTaskOpen] = useState(true);
	const { full, toggle: toggleFull } = useFullScreen();
	const root = useRef(null);
	const slide = deck.slides.find((s) => s.id === currentId) ?? deck.slides[0];
	const slideIndex = slide ? deck.slides.indexOf(slide) : 0;
	const selected = slide?.elements.find((e) => e.id === selectedId);
	const onChangeRef = useRef(onChange);
	onChangeRef.current = onChange;
	const commit = useCallback((f) => {
		setHistory((h) => {
			const next = f(h.present);
			if (next === h.present) return h;
			onChangeRef.current?.(next);
			return {
				past: [...h.past, h.present].slice(-100),
				present: next,
				future: []
			};
		});
		setResults(null);
	}, []);
	const undo = useCallback(() => {
		setHistory((h) => {
			const prev = h.past[h.past.length - 1];
			if (!prev) return h;
			onChangeRef.current?.(prev);
			return {
				past: h.past.slice(0, -1),
				present: prev,
				future: [h.present, ...h.future]
			};
		});
		setEditingId(null);
	}, []);
	const redo = useCallback(() => {
		setHistory((h) => {
			const next = h.future[0];
			if (!next) return h;
			onChangeRef.current?.(next);
			return {
				past: [...h.past, h.present],
				present: next,
				future: h.future.slice(1)
			};
		});
		setEditingId(null);
	}, []);
	const sid = slide?.id ?? "";
	const patchSelected = useCallback((patch) => {
		if (selectedId) commit((d) => updateElement(d, sid, selectedId, patch));
	}, [
		commit,
		selectedId,
		sid
	]);
	const select = (id) => {
		setSelectedId(id);
		if (id === null) setEditingId(null);
	};
	const pickSlide = (id) => {
		setCurrentId(id);
		setSelectedId(null);
		setEditingId(null);
	};
	const insert = (el) => {
		commit((d) => addElement(d, sid, el));
		setSelectedId(el.id);
	};
	const actions = {
		undo,
		redo,
		canUndo: history.past.length > 0,
		canRedo: history.future.length > 0,
		newSlide: (layout) => {
			let created = "";
			commit((d) => {
				const r = addSlide(d, slideIndex, layout);
				created = r.slideId;
				return r.deck;
			});
			if (created) pickSlide(created);
		},
		duplicateSlide: () => {
			let created = "";
			commit((d) => {
				const r = duplicateSlide(d, sid);
				created = r.slideId;
				return r.deck;
			});
			if (created) pickSlide(created);
		},
		deleteSlide: () => {
			const neighbour = deck.slides[slideIndex + 1] ?? deck.slides[slideIndex - 1];
			commit((d) => deleteSlide(d, sid));
			if (neighbour) pickSlide(neighbour.id);
		},
		setLayout: (layout) => commit((d) => changeLayout(d, sid, layout)),
		setStyle: (patch) => {
			if (selected && (selected.kind === "text" || selected.kind === "shape")) patchSelected({ style: {
				...selected.style,
				...patch
			} });
		},
		setFill: (fill) => selected?.kind === "shape" && patchSelected({ fill }),
		arrange: (where) => selectedId && commit((d) => reorderElement(d, sid, selectedId, where)),
		deleteElement: () => {
			if (!selectedId) return;
			commit((d) => deleteElement(d, sid, selectedId));
			select(null);
		},
		insertText: () => {
			const box = newTextBox();
			insert(box);
			setEditingId(box.id);
		},
		insertShape: (shape) => insert(newShape(shape)),
		insertPicture: (asset) => insert(newPicture(asset)),
		setBackground: (color) => commit((d) => updateSlide(d, sid, { background: color })),
		backgroundToAll: () => slide && commit((d) => setBackgroundAll(d, slide.background)),
		setTransition: (effect) => commit((d) => updateSlide(d, sid, { transition: {
			effect,
			duration: slide?.transition.duration ?? 1
		} })),
		transitionToAll: () => slide && commit((d) => setTransitionAll(d, slide.transition)),
		setAnimation: (group, effect) => selected && patchSelected({ animation: {
			group,
			effect,
			start: selected.animation?.start ?? "click",
			duration: selected.animation?.duration ?? (effect === "appear" || effect === "disappear" ? .25 : 1)
		} }),
		setAnimationStart: (s) => selected?.animation && patchSelected({ animation: {
			...selected.animation,
			start: s
		} }),
		removeAnimation: () => selectedId && commit((d) => clearElementField(d, sid, selectedId, "animation")),
		showFromStart: () => setShowAt(0),
		showFromCurrent: () => setShowAt(slideIndex)
	};
	const actionsRef = useRef(actions);
	actionsRef.current = actions;
	useEffect(() => {
		const onKey = (e) => {
			if (showAt !== null || isTyping(e.target)) return;
			if (!(root.current?.contains(document.activeElement) || document.activeElement === document.body)) return;
			const a = actionsRef.current;
			const ctrl = e.ctrlKey || e.metaKey;
			const key = e.key.toLowerCase();
			const run = (f) => {
				e.preventDefault();
				f();
			};
			if (e.key === "F5") run(e.shiftKey ? a.showFromCurrent : a.showFromStart);
			else if (ctrl && (key === "z" || key === "я")) run(e.shiftKey ? a.redo : a.undo);
			else if (ctrl && (key === "y" || key === "н")) run(a.redo);
			else if (ctrl && (key === "m" || key === "ь")) run(() => a.newSlide("titleContent"));
			else if (ctrl && (key === "b" || key === "и")) run(() => {
				const el = selectedRef.current;
				if (el && el.kind !== "image") a.setStyle({ bold: !el.style.bold });
			});
			else if ((e.key === "Delete" || e.key === "Backspace") && selectedRef.current) run(a.deleteElement);
			else if (e.key === "Escape" && selectedRef.current) run(() => select(null));
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [showAt]);
	const selectedRef = useRef(selected);
	selectedRef.current = selected;
	const check = () => {
		const r = checkGoals(deck, scenario.goals);
		setResults(r);
		onCheck?.(allMet(r));
	};
	const reset = () => {
		const fresh = buildDeck(scenario.start);
		setHistory({
			past: [...history.past, deck].slice(-100),
			present: fresh,
			future: []
		});
		onChange?.(fresh);
		pickSlide(fresh.slides[0]?.id ?? "");
		setResults(null);
	};
	if (!slide) return null;
	return /* @__PURE__ */ jsxs("div", {
		className: `esl-root ${full ? "is-full" : ""}`,
		ref: root,
		lang: "uk",
		children: [
			/* @__PURE__ */ jsx(TaskPanel, {
				scenario,
				results,
				open: taskOpen,
				selfCheck,
				full,
				onToggleFull: toggleFull,
				onNext,
				onToggle: () => setTaskOpen((o) => !o),
				onCheck: check,
				onReset: reset
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "esl-app",
				children: [
					/* @__PURE__ */ jsx(Ribbon, {
						tab,
						onTab: setTab,
						slide,
						selected,
						actions
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "esl-main",
						children: [/* @__PURE__ */ jsx(Thumbs, {
							slides: deck.slides,
							current: slide.id,
							resolveAsset,
							onPick: pickSlide,
							onMove: (from, to) => commit((d) => moveSlide(d, from, to))
						}), /* @__PURE__ */ jsx(SlideCanvas, {
							slide,
							selectedId,
							editingId,
							resolveAsset,
							onSelect: select,
							onEdit: setEditingId,
							onChange: (id, patch) => commit((d) => updateElement(d, sid, id, patch))
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "esl-status",
						children: [
							"Слайд ",
							slideIndex + 1,
							" з ",
							deck.slides.length,
							selected && /* @__PURE__ */ jsxs("span", { children: [
								" · ",
								selected.name,
								selected.animation ? ` · анімація «${EFFECT_NAMES[selected.animation.effect]}»` : ""
							] })
						]
					})
				]
			}),
			showAt !== null && /* @__PURE__ */ jsx(SlideShow, {
				deck,
				startAt: showAt,
				resolveAsset,
				onClose: () => setShowAt(null)
			})
		]
	});
};
export { EduSlides, SlideShow, animationSteps, nextScenario, pictureUrl, scenarioById, scenarios };
