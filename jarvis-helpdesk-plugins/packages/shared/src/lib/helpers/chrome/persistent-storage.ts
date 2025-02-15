import { StorageKey } from '../../constants/chrome';

export const getChromeStorage = () => {
  return chrome.storage.local;
};

export const getStorageData = async <T>(key: StorageKey): Promise<T | undefined> => {
  const storage = getChromeStorage();
  const result = await storage.get(key);
  return result[key] as T;
};

export const setStorageData = async <T>(key: StorageKey, value: T) => {
  const storage = getChromeStorage();
  return await storage.set({
    [key]: value,
  });
};

export const listenStorageData = <T>(key: StorageKey, callback: (value: T) => void) => {
  const storageName = 'local';

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === storageName && (changes[key] as chrome.storage.StorageChange | undefined)) {
      const newValue = changes[key]?.newValue as T;
      callback(newValue);
    }
  });
};

export const ChromePersistStorage = {
  getItem: getStorageData,
  setItem: setStorageData,
  removeItem: (key: StorageKey) => setStorageData(key, undefined),
};
