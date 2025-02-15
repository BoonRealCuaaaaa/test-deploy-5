import { Overview } from '../../constants/ticket-analyze.constants';
import { ChatMessage } from '../../types/tiktokshop.type';

export const calculateAverageResponseTime = (conversation: ChatMessage[]) => {
  if (conversation.length <= 1) return Overview.DEFAULT_AVERAGE_RESPONSE_TIME;

  let sendMessage = conversation[0];
  let replyMessage = conversation[0];
  let index = 1,
    timeDifferece = 0,
    numberOfMessages = 0;
  while (index < conversation.length) {
    replyMessage = conversation[index];

    if (replyMessage.author.role !== sendMessage.author.role) {
      if (replyMessage.timestamp && sendMessage.timestamp) {
        const replyTimestamp = new Date(replyMessage.timestamp);
        const sendTimestamp = new Date(sendMessage.timestamp);

        timeDifferece += Math.abs(replyTimestamp.getTime() - sendTimestamp.getTime());
        numberOfMessages++;
      }
      sendMessage = replyMessage;
    }
    index++;
  }

  return numberOfMessages === 0 ? Overview.DEFAULT_AVERAGE_RESPONSE_TIME : timeDifferece / numberOfMessages;
};

export const calculateLastMessageTime = (conversation: ChatMessage[]) => {
  return (
    conversation
      .slice()
      .reverse()
      .find((message) => message.author.role === 'agent')?.timestamp ?? null
  );
};
