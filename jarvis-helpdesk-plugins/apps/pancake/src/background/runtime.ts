chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});

import { ChromeExternalMessageType, StorageKey } from '@/shared/lib/constants/chrome';
import { ChromePersistStorage } from '@/shared/lib/helpers/chrome/persistent-storage';
import { onMessageExternal } from '@/shared/lib/helpers/chrome/runtime';
import { startChainable } from '@/shared/lib/utils/function';

// NOTE: Use Promise along with returning true when working with asynchronous processing since the onMessage implementation of Chrome doesn't support async/await, which leads to an undefined output of sendResponse.
onMessageExternal((message, _, sendResponse) => {
  try {
    switch (message.type) {
      case ChromeExternalMessageType.CONNECTION: {
        startChainable(async () => {
          await ChromePersistStorage.setItem(StorageKey.AUTH_DATA, message.payload);
          sendResponse({ success: true });
        });

        return true;
      }
      case ChromeExternalMessageType.DISCONNECTION: {
        startChainable(async () => {
          await ChromePersistStorage.removeItem(StorageKey.AUTH_DATA);
          sendResponse({ success: true });
        });

        return true;
      }
    }
  } catch (error) {
    sendResponse({
      success: false,
      error,
    });
  }
});
