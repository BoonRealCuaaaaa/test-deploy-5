import { create } from 'zustand';

interface TicketState {
  lastTicketId: string;
  setTicketId: (ticketId: string) => void;
}

export const useTicketStore = create<TicketState>((set) => ({
  lastTicketId: '',
  setTicketId: (ticketId: string) => set({ lastTicketId: ticketId }),
}));
