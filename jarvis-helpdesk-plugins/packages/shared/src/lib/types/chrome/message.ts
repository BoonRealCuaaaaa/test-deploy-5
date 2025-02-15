import { ChromeExternalMessageType, ChromeMessageType } from '../../constants/chrome';

export type ChromeExternalMessage = {
  type: ChromeExternalMessageType;
  payload?: any;
};

export type ChromeMessage = {
  type: ChromeMessageType;
  payload?: any;
};
