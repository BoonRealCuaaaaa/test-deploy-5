import { getSelectedTicketId } from '@/src/app/lib/helpers/dom-interaction';

export async function getHistoryForTicket(
  ticketHistories: Record<string, { past: string[]; present: string; future: string[] }>
): Promise<{ past: string[]; present: string; future: string[] }> {
  const ticketId = (await getSelectedTicketId()) || 'default';
  return ticketHistories[ticketId] || { past: [], present: '', future: [] };
}

export async function updateHistoryForTicket(
  ticketHistories: Record<string, { past: string[]; present: string; future: string[] }>,
  setTicketHistories: React.Dispatch<
    React.SetStateAction<Record<string, { past: string[]; present: string; future: string[] }>>
  >,
  newHistory: { past: string[]; present: string; future: string[] }
) {
  const ticketId = (await getSelectedTicketId()) || 'default';
  setTicketHistories((prev) => ({ ...prev, [ticketId]: newHistory }));
}
