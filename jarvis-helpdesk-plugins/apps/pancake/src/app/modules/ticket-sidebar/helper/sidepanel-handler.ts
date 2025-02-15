import { PancakeEvents } from "@/src/app/lib/constants/pancake";

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === PancakeEvents.TICKET_CHANGED) {
    window.location.reload();
  }
});
