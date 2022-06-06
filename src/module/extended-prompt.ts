import type { Options } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/client/dice/roll";

/**
 * A specialized Dialog subclass for an extended prompt for Better Rolls
 * @type {Dialog}
 */
export default class ExtendedPrompt extends Dialog {
	dialogData:Dialog.Data;
	item:Item;

	constructor(item, dialogData={}, options={}) {
		super(<any>dialogData, options);
		this.options.classes = ["dnd5e", "dialog"];

		/**
		 * Store a reference to the Item entity being used
		 * @type {Item5e}
		 */
		this.item = item;
	}
}
