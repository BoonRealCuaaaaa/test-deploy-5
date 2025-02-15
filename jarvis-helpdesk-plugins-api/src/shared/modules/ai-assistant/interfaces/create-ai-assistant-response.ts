export interface CreateAiAssistantResponse {
  openAiAssistantId: string;
  userId: string;
  assistantName: string;
  openAiThreadIdPlay: string;
  openAiVectorStoreId: string;
  isDefault: boolean;
  createdBy: string;
  updatedBy: string;
  description?: string;
  instructions?: string;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAat?: Date;
  id: string;
}
