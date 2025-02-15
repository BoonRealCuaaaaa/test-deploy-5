import { createRoot } from 'react-dom/client';

export function injectComponent(selectorChain: string, component: JSX.Element): void {
  const selectors = selectorChain.split('>').map((s) => s.trim());
  const containerSelector = selectors.pop()!;
  const parentSelector = selectors.join(' > ');
  const containerClass = containerSelector.startsWith('.') ? containerSelector.slice(1) : '';
  const wrapperSelector = `${parentSelector} > ${containerSelector}`;

  if (!document.querySelector(wrapperSelector)) {
    const parentContainer = document.querySelector(parentSelector);
    if (!parentContainer) {
      console.warn(`Parent container not found for selector: ${parentSelector}`);
      return;
    }
    const container = document.createElement('div');
    if (containerClass) container.className = containerClass;
    parentContainer.appendChild(container);
    createRoot(container).render(component);
  }
}
