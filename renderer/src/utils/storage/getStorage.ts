import { Keys, keysPrefix } from './types';

export const getStorage = (key: Keys) => {
  const value = localStorage.getItem(`${keysPrefix}/${key}`);

  return value;
};
