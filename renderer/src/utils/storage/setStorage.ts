import { Keys, keysPrefix } from './types';

export const setStorage = (key: Keys, value: string) => {
  localStorage.setItem(`${keysPrefix}/${key}`, value);
};
