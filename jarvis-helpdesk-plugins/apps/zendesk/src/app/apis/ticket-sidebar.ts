import helpdeskPluginsApiAxios from '@/shared/lib/clients/axios/helpdesk-plugins-api';

import { TicketAnalyzeResponse } from '../lib/types/response';
import { ZendeskTicket } from '../lib/types/zendesk';

const getTicketAnalyze = async (
  ticket: ZendeskTicket | null,
  domain: string | null
): Promise<TicketAnalyzeResponse> => {
  try {
    const response = await helpdeskPluginsApiAxios.post(
      'api/v1/zendesk/ticket-analyze',
      {
        ticket,
        domain,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const result = response.data as TicketAnalyzeResponse;
    return result;
  } catch (error) {
    console.error('Error fetching ticket analyze:', error);
    throw error;
  }
};

const patchAutoResponse = async (domain: string, autoResponse: boolean) => {
  try {
    const response = await helpdeskPluginsApiAxios.patch(
      `api/v1/assistants/domain/${domain}`,
      { autoResponse },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating auto response:', error);
    throw error;
  }
};

export const TicketSidebarApi = {
  getTicketAnalyze,
  patchAutoResponse,
};
