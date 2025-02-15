import Popup from './modules/popup';
import TicketSidebar from './modules/ticket-sidebar';
import { renderApp } from './bootstrap';

renderApp(Popup, 'root');
renderApp(TicketSidebar, 'sidepanel-root');
