import { ChromeExternalMessage, ChromeMessage } from '@/shared/lib/types/chrome';

export const sendMessage = (message: ChromeMessage) => {
  try {
    return chrome.runtime.sendMessage(message);
  } catch (error) {
    console.error(error);
  }
};

export const onMessageExternal = (
  callback: (
    message: ChromeExternalMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ) => void
) => {
  chrome.runtime.onMessageExternal.addListener(callback);
};

export const onMessage = (
  callback: (
    message: ChromeMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ) => void
) => {
  chrome.runtime.onMessage.addListener(callback);

  return () => {
    chrome.runtime.onMessage.removeListener(callback);
  };
};
