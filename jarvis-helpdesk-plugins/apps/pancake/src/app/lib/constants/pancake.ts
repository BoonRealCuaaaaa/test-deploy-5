export enum PancakeConstants {
  ACCESS_TOKEN_KEY = 'jwt',
}

export enum PancakeAPIEndpoints {
  PAGE_LISTS = '/v1/pages',
  GENERATE_PAGE_ACCESS_TOKEN = '/v1/pages/:pageId/generate_page_access_token',
  GET_CONVERSATIONS = '/public_api/v2/pages/:pageId/conversations',
  GET_MESSAGES = '/public_api/v1/pages/:pageId/conversations/:conversationId/messages',
}

export enum PancakeSelectors {
  TICKET_EDITOR = ".reply-box-container > div[style*='display: flex'] > .custom-ticket-editor-wrapper",
  REPLY_BOX = '#replyBoxComposer',
}

export enum PancakeEvents {
  TICKET_CHANGED = 'TICKET_CHANGED',
}
