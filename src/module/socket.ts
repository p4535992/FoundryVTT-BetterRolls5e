import CONSTANTS from './constants';
import API from './api';
import { debug } from './lib/lib';
import { setSocket } from '../main';

export const SOCKET_HANDLERS = {
  /**
   * Generic sockets
   */
  CALL_HOOK: 'callHook',
  ON_RENDER_TOKEN_CONFIG: 'onRenderTokenConfig',

  /**
   * Item pile sockets
   */

  /**
   * UI sockets
   */

  /**
   * Item & attribute sockets
   */
};

export let betterrolls5eSocket;

export function registerSocket() {
  debug('Registered betterrolls5eSocket');
  if (betterrolls5eSocket) {
    return betterrolls5eSocket;
  }
  //@ts-ignore
  betterrolls5eSocket = socketlib.registerModule(CONSTANTS.MODULE_NAME);

  /**
   * Generic socket
   */
  betterrolls5eSocket.register(SOCKET_HANDLERS.CALL_HOOK, (hook, ...args) => callHook(hook, ...args));

  betterrolls5eSocket.register('roll-sound', (...args) =>
    API.rollSoundArr(...args),
  );
  setSocket(betterrolls5eSocket);
  return betterrolls5eSocket;
}

async function callHook(inHookName, ...args) {
  const newArgs: any[] = [];
  for (let arg of args) {
    if (typeof arg === 'string') {
      const testArg = await fromUuid(arg);
      if (testArg) {
        arg = testArg;
      }
    }
    newArgs.push(arg);
  }
  return Hooks.callAll(inHookName, ...newArgs);
}
