export type PancakeUser = {
  id: string;
  locale: string;
  shopId: number;
  timezone: number;
  username: string;
  users: UserDetail[];
};

export type UserDetail = {
  fbId: string;
  name: string;
  pageId: string;
  status: string;
  userId: string;
};

export type PancakeResponse = {
  categorized: {
    activated: ActivatedPage[];
    activatedPageIds: string[];
  };
  success: boolean;
};

export type ActivatedPage = {
  id: string;
  insertedAt: string;
  isActivated: boolean;
  name: string;
  pageContentSyncGroupId: any;
  shopId: number;
  specialFeature: boolean;
  settings: {
    chatPlugin: {
      locale: string;
    };
  };
  timezone: number;
  username: string;
  users: UserDetail[];
};

export type GeneratePageAccessTokenResponse = {
  message: string;
  pageAccessToken: string;
  success: boolean;
};

export type ConversationResponse = {
  success: boolean;
  conversations: Conversation[];
};

export type Conversation = {
  id: string;
  type: string;
  tags: string[];
  seen: boolean;
  from: User;
  messageCount: number;
  insertedAt: string;
  updatedAt: string;
  pageId: string;
  customers: CustomerConversation[];
  lastSentBy: User;
  customerId: string;
  pageCustomer: PageCustomer;
};

export type User = {
  id: string;
  name: string;
};

export type CustomerConversation = {
  fbId: string;
  id: string;
  isContact: boolean | null;
  name: string;
};

export type PageCustomer = {
  id: string;
  name: string;
  gender: string | null;
  birthday: string | null;
  customerId: string;
};

export type Message = {
  id: string;
  message: string;
  type: string;
  seen: boolean;
  from: {
    id: string;
    name: string;
  };
  pageId: string;
  conversationId: string;
};

export type Customer = {
  customerId: string;
  fbId: string;
  id: string;
  name: string;
};

export type MessageResponse = {
  messages: Message[];
  success: boolean;
  conversationId: string;
  customers: Customer[];
  gender: any | null;
  birthday: any | null;
  lastCommentedAt: boolean;
};
