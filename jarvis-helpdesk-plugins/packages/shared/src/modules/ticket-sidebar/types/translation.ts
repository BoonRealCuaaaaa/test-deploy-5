export type TicketSidebarTranslation = {
  autoResponse: {
    label: string;
    tooltip: string;
  };
  overview: {
    label: string;
    totalMessages: string;
    lastMessageByAgent: string;
    averageResponseTime: string;
  };
  sentiments: {
    label: string;
    customerTone: string;
    customerSatisfaction: string;
    customerUrgency: string;
    agentTone: string;
  };
  purchasingPotential: {
    label: string;
    rating: string;
    reason: string;
  };
  summary: string;
};
