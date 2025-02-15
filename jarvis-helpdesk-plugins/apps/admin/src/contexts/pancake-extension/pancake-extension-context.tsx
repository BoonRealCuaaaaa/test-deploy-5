import { createContext, useContext, useEffect, useState } from 'react';

import { toast } from '@/src/components/toaster/hooks/use-toast';
import { APP_CONFIG } from '@/src/libs/app-config';
import { ChromeExternalMessageType } from '@/src/libs/constants/chrome-external-message-type';
import { IExtensionContext } from '@/src/libs/interfaces/extension';
import { getRefreshToken, getToken } from '@/src/libs/utils/get-auth-token';

export const PancakeExtensionContext = createContext<IExtensionContext | undefined>(undefined);

export const usePancakeExtensionProvider = (): IExtensionContext => {
  const extensionId = APP_CONFIG.PANCAKE_EXTENSION_ID;
  const [connected, setConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = async () => {
    setIsConnecting(true);
    const accessToken = getToken();
    const refreshToken = getRefreshToken();

    if (!accessToken) {
      setConnected(false);
      setIsConnecting(false);
      return;
    }

    try {
      const response: { success: boolean } = await chrome.runtime.sendMessage(extensionId, {
        type: ChromeExternalMessageType.CONNECTION,
        payload: {
          accessToken,
          refreshToken,
        },
      });

      if (response.success) {
        setConnected(response.success);
        toast({
          description: 'Connected to EA Extension',
        });
      } else {
        setConnected(false);
      }
    } catch (e) {
      setConnected(false);
      console.error(e);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    if (!connected) {
      return;
    }
    setIsConnecting(true);
    setConnected(false);

    try {
      await chrome.runtime.sendMessage(extensionId, {
        type: ChromeExternalMessageType.DISCONNECTION,
        payload: null,
      });
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    connect();
  }, []);

  return {
    connected,
    isConnecting,
    connect,
    disconnect,
  };
};

export const usePancakeExtension = () => {
  const context = useContext(PancakeExtensionContext);
  if (context === undefined) {
    throw new Error('useExtension must be used within a provider');
  }
  return context;
};
