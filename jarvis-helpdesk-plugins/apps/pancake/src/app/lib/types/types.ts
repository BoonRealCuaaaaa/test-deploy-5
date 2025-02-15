export type Message = {
  author: {
    role: string;
  };
  message: {
    role: string;
    content: string;
  };
  timestamp?: Date;
};

export type AIAction = {
  title: string;
  reTitle?: string;
  OnWorking: string;
  OnSuccess: string;
  OnFailed: string;
};

export type ConversationMetadata = {
  messages: Message[];
};
