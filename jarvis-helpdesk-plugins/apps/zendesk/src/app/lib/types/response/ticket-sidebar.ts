export type TicketAnalyzeResponse = {
  isAutoResponse: boolean;
  sentiment: Record<string, unknown>;
  summary: string;
  commentsCount: number;
  averageResponseTime: string;
  lastMessageTime: string;
  [key: string]: unknown;
};
