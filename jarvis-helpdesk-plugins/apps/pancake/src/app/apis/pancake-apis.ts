import camelcaseKeys from 'camelcase-keys';

import { pancakeApiAxios } from '../lib/clients/axios/pancake-api-axios';
import { PancakeAPIEndpoints, PancakeSelectors } from '../lib/constants/pancake';
import { getElementValue, setElementValue } from '../lib/helpers/dom-interaction';
import { getStoredAccessToken } from '../lib/helpers/pancake-auth';
import {
  ConversationResponse,
  GeneratePageAccessTokenResponse,
  MessageResponse,
  PancakeResponse,
} from '../lib/types/pancake/pancake-response';

const getListPages = async (): Promise<PancakeResponse> => {
  const accessToken = await getStoredAccessToken();
  const response = await pancakeApiAxios.get(PancakeAPIEndpoints.PAGE_LISTS, {
    params: {
      access_token: accessToken,
    },
  });
  const data = camelcaseKeys<PancakeResponse>(response.data, { deep: true });
  return data;
};

const getDomain = async (): Promise<string> => {
  const response = await getListPages();
  return response.categorized.activatedPageIds[0] || '';
};

const generatePageAccessToken = async (): Promise<GeneratePageAccessTokenResponse> => {
  const accessToken = await getStoredAccessToken();
  const pageId = await getDomain();
  const response = await pancakeApiAxios.post(
    PancakeAPIEndpoints.GENERATE_PAGE_ACCESS_TOKEN.replace(':pageId', pageId),
    null,
    {
      params: {
        access_token: accessToken,
      },
    }
  );
  const data = camelcaseKeys<GeneratePageAccessTokenResponse>(response.data, {
    deep: true,
  });
  return data;
};

const getConversations = async (): Promise<ConversationResponse> => {
  const pageAccessToken = await generatePageAccessToken();
  const pageId = await getDomain();

  const response = await pancakeApiAxios.get(PancakeAPIEndpoints.GET_CONVERSATIONS.replace(':pageId', pageId), {
    params: {
      page_access_token: pageAccessToken.pageAccessToken,
      page_id: pageId,
    },
  });
  const data = camelcaseKeys<ConversationResponse>(response.data, {
    deep: true,
  });
  return data;
};

const getMessages = async (conversationId: string): Promise<MessageResponse> => {
  const pageAccessToken = await generatePageAccessToken();
  const pageId = await getDomain();
  const conversations = await getConversations();
  const conversation = conversations.conversations.find((conv) => conv.id === conversationId);
  const customerId = conversation ? conversation.customerId : null;

  const response = await pancakeApiAxios.get(
    PancakeAPIEndpoints.GET_MESSAGES.replace(':pageId', pageId).replace(':conversationId', conversationId),
    {
      params: {
        page_access_token: pageAccessToken.pageAccessToken,
        customer_id: customerId,
      },
    }
  );
  const data = camelcaseKeys<MessageResponse>(response.data, { deep: true });
  return data;
};

const getComment = async (): Promise<string> => {
  return (await getElementValue(PancakeSelectors.REPLY_BOX)) ?? '';
};

const setComment = async (comment: string): Promise<void> => {
  await setElementValue(PancakeSelectors.REPLY_BOX, comment);
};

export const PancakeAPIs = {
  getListPages,
  getDomain,
  generatePageAccessToken,
  getConversations,
  getMessages,
  getComment,
  setComment,
};
