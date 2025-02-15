import React from 'react';

import { PancakeSelectors } from '../app/lib/constants/pancake';
import { notifyTicketChange } from '../app/lib/helpers/dom-interaction';
import { injectComponent } from '../app/lib/helpers/inject';
import { fetchAndStoreAccessToken } from '../app/lib/helpers/pancake-auth';
import TicketEditor from '../app/modules/ticket-editor';

const fetchAcessToken = async () => {
  await fetchAndStoreAccessToken();
};

document.addEventListener('DOMContentLoaded', () => {
  injectComponent(PancakeSelectors.TICKET_EDITOR, React.createElement(TicketEditor));
  fetchAcessToken();
});

const observer = new MutationObserver(async () => {
  injectComponent(PancakeSelectors.TICKET_EDITOR, React.createElement(TicketEditor));
  fetchAcessToken();
  notifyTicketChange();
});

observer.observe(document.body, { childList: true, subtree: true });
