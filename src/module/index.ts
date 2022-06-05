import { BRSettings } from "./settings.js";
import { BetterRollsChatCard } from "./chat-message.js";
import { addItemSheetButtons, BetterRolls } from "./betterrolls5e.js";
import { ItemUtils, Utils } from "./utils/index.js";
import { addBetterRollsContent } from "./item-tab.js";
import { patchCoreFunctions } from "./patching/index.js"
import { migrate } from "./migration.js";
import { registerSocket } from "./socket.js";
import API from "./api.js";
import { setApi } from "../main.js";
import { i18n } from "./lib/lib.js";
import type { ItemData } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs.js";
import CONSTANTS from "./constants.js";

// Attaches BetterRolls to actor sheet
Hooks.on("renderActorSheet5e", (app, html, data) => {
	const triggeringElement = ".item .item-name h4";
	const buttonContainer = ".item-properties";

	// this timeout allows other modules to modify the sheet before we do
	setTimeout(() => {
		if (game.settings.get("betterrolls5e", "rollButtonsEnabled")) {
			addItemSheetButtons(app.object, html, data, triggeringElement, buttonContainer)
		}
	}, 0);
});
// Attaches BetterRolls to item sheet
Hooks.on("renderItemSheet5e", (app:any, html:JQuery<HTMLElement>, data:ItemData) => {
	addBetterRollsContent(app, html, data);
});

export const initHooks = async () => {
	BRSettings.init();
	patchCoreFunctions();

	// Setup template partials
	loadTemplates([
		`${CONSTANTS.PATH}/red-damage-crit.html`
	]);

	Hooks.once('socketlib.ready', registerSocket);

	//@ts-ignore
	window.BetterRolls = BetterRolls();
	//@ts-ignore
	window.BetterRolls.API = API;
};

export const setupHooks = async () => {
	//@ts-ignore
	setApi(window.BetterRolls.API);
};

export const readyHooks = async () => {
	await migrate();

	// Make a combined damage type array that includes healing
	//@ts-ignore
	const dnd5e = CONFIG.DND5E;
	//@ts-ignore
	CONFIG.betterRolls5e.combinedDamageTypes = mergeObject(duplicate(dnd5e.damageTypes), dnd5e.healingTypes);

	// Updates crit text from the dropdown.
	let critText = <string>BRSettings.critString;
	if (critText.includes("br5e.critString")) {
		critText = i18n(critText);
		game.settings.set("betterrolls5e", "critString", critText);
	}

	// Set up socket
	// game.socket.on("module.betterrolls5e", (data) => {
	// 	if (data?.action === "roll-sound") {
	// 		Utils.playDiceSound();
	// 	}
	// });

	// Initialize Better Rolls
	// window.BetterRolls = BetterRolls();
	Hooks.call("readyBetterRolls");
};

// Create flags for item when it's first created
Hooks.on("preCreateItem", (item) => ItemUtils.ensureFlags(item));

// Modify context menu for damage rolls (they break)
Hooks.on("getChatLogEntryContext", (html, options) => {
	const contextDamageLabels = [
		game.i18n.localize("DND5E.ChatContextDamage"),
		game.i18n.localize("DND5E.ChatContextHealing"),
		game.i18n.localize("DND5E.ChatContextDoubleDamage"),
		game.i18n.localize("DND5E.ChatContextHalfDamage")
	];

	for (let i=options.length-1; i>=0; i--) {
		const option = options[i];
		if (contextDamageLabels.includes(option.name)) {
			option.condition = li => canvas.tokens?.controlled.length && li.find(".dice-roll").length && !li.find(".red-full").length;
		}
	}
});

// Bind to any newly rendered chat cards at runtime
// For whatever reason, this callback is sometimes called with unattached html elements
Hooks.on("renderChatMessage", BetterRollsChatCard.bind);
Hooks.on("getChatLogEntryContext", BetterRollsChatCard.addOptions);
