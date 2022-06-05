import { betterrolls5eSocket } from './socket';
import CONSTANTS from './constants';
import { Utils } from './utils';
import { error } from './lib/lib';
const API = {

  // validItemTypes: <string[]>[],

  async rollSoundArr(...inAttributes: any[]) {
    if (!Array.isArray(inAttributes)) {
      throw error('rollSoundArr | inAttributes must be of type array');
    }
    const [data] = inAttributes;
		this.rollSound(data);
  },

  async rollSound(data:any) {
    if (data?.action === "roll-sound") {
			Utils.playDiceSound();
		}
  },
};

export default API;
