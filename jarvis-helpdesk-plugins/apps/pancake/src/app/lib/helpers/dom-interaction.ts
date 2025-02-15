import { useTicketStore } from '../../stores/slices/use-ticket-store';
import { PancakeEvents } from '../constants/pancake';

export async function getElementValue(selector: string): Promise<string | null> {
  const element = document.querySelector(selector);
  if (element) {
    if ('value' in element) {
      return (element as HTMLInputElement | HTMLTextAreaElement).value;
    }
    return element.textContent;
  } else {
    return new Promise((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.scripting.executeScript(
            {
              target: { tabId: tabs[0].id },
              func: (sel: string) => {
                const el = document.querySelector(sel);
                if (el) {
                  return 'value' in el ? (el as HTMLInputElement | HTMLTextAreaElement).value : el.textContent;
                }
                return null;
              },
              args: [selector],
            },
            (results) => {
              if (results[0] && results[0].result !== undefined && results[0].result !== null) {
                resolve(results[0].result);
              } else {
                resolve(null);
              }
            }
          );
        } else {
          resolve(null);
        }
      });
    });
  }
}

export async function setElementValue(selector: string, newValue: string): Promise<void> {
  const element = document.querySelector(selector);
  if (element) {
    if ('value' in element) {
      (element as HTMLInputElement | HTMLTextAreaElement).value = newValue;
    } else {
      element.textContent = newValue;
    }
  } else {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: (sel: string, val: string) => {
            const el = document.querySelector(sel);
            if (el) {
              if ('value' in el) {
                (el as HTMLInputElement | HTMLTextAreaElement).value = val;
              } else {
                el.textContent = val;
              }
            }
          },
          args: [selector, newValue],
        });
      } else {
        console.error('No active tab found');
      }
    });
  }
}

export async function getSelectedTicketId(): Promise<string | null> {
  const selectedElement =
    document.querySelector('.media.conversation-list-item.selected') ||
    document.querySelector('.popup .media.conversation-list-item.selected');

  if (selectedElement) {
    const parentElement = selectedElement.parentElement;
    if (parentElement && parentElement.id) {
      return parentElement.id;
    }
    return selectedElement.id;
  }

  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.scripting.executeScript(
          {
            target: { tabId: tabs[0].id },
            func: () => {
              const selectedEl =
                document.querySelector('.media.conversation-list-item.selected') ||
                document.querySelector('.popup .media.conversation-list-item.selected');
              if (selectedEl) {
                const parentEl = selectedEl.parentElement;
                if (parentEl && parentEl.id) {
                  return parentEl.id;
                }
                return selectedEl.id;
              }
              return null;
            },
          },
          (results) => {
            if (results[0] && results[0].result !== undefined && results[0].result !== null) {
              resolve(results[0].result);
            } else {
              resolve(null);
            }
          }
        );
      } else {
        resolve(null);
      }
    });
  });
}

export async function notifyTicketChange(): Promise<void> {
  const newTicketId = (await getSelectedTicketId()) || '';
  const { lastTicketId, setTicketId } = useTicketStore.getState();

  if (newTicketId !== lastTicketId) {
    setTicketId(newTicketId);
    chrome.runtime.sendMessage({
      type: PancakeEvents.TICKET_CHANGED,
      ticketId: newTicketId,
    });
  }
}

export async function getUrl(): Promise<string> {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      resolve(tabs[0]?.url || '');
    });
  });
}
