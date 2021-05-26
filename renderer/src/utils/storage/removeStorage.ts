import { Keys, keysPrefix } from './types';

export const removeStorage = (key: Keys) => {
  localStorage.removeItem(`${keysPrefix}/${key}`);
};
