import DateTimeUtils from 'src/lib/utils/datetime.util';

import { Conversation } from '../../types/zendesk.type';

export const calculateAverageResponseTimeFromAgent = (conversation: Conversation[]): string => {
  const endUserMessages = conversation.filter((comment) => comment.author.role === 'end-user');
  const adminMessages = conversation.filter((comment) => comment.author.role === 'admin');

  if (endUserMessages.length === 0 || adminMessages.length === 0) {
    return '--';
  }

  let totalResponseTime = 0;
  let responseCount = 0;

  endUserMessages.forEach((endUserMessage, index) => {
    const endUserTimestamp = new Date(endUserMessage.timestamp).getTime();
    let adminResponse;

    if (index < endUserMessages.length - 1) {
      const nextEndUserTimestamp = new Date(endUserMessages[index + 1].timestamp).getTime();
      adminResponse = adminMessages.find(
        (adminMessage) =>
          new Date(adminMessage.timestamp).getTime() > endUserTimestamp &&
          new Date(adminMessage.timestamp).getTime() < nextEndUserTimestamp
      );
    } else {
      adminResponse = adminMessages.find(
        (adminMessage) => new Date(adminMessage.timestamp).getTime() > endUserTimestamp
      );
    }

    if (adminResponse) {
      const adminTimestamp = new Date(adminResponse.timestamp).getTime();
      totalResponseTime += adminTimestamp - endUserTimestamp;
      responseCount++;
    }
  });

  const averageResponseTimeInSeconds = responseCount > 0 ? totalResponseTime / responseCount / 1000 : 0;
  return DateTimeUtils.formatDurationToString(averageResponseTimeInSeconds);
};

export const calculateLastMessageTime = (conversation: Conversation[]): string => {
  const adminMessages = conversation.filter((comment) => comment.author.role === 'admin');
  if (adminMessages.length === 0) {
    return '--';
  }
  const lastMessage = adminMessages[adminMessages.length - 1];
  const lastMessageTime = new Date(lastMessage.timestamp);
  return DateTimeUtils.formatDateToString(lastMessageTime);
};
