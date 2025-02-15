import { createContext, useContext, useEffect, useState } from 'react';

import SuccessToastDescription from '@/src/components/toaster/components/success-toast-description';
import { toast } from '@/src/components/toaster/hooks/use-toast';
import { APP_CONFIG } from '@/src/libs/app-config';
import { ChromeExternalMessageType } from '@/src/libs/constants/chrome-external-message-type';
import { IExtensionContext } from '@/src/libs/interfaces/extension';
import { getRefreshToken, getToken } from '@/src/libs/utils/get-auth-token';
import { getLastAccessedTeam } from '@/src/libs/utils/get-team';

export const EAExtensionContext = createContext<IExtensionContext | undefined>(undefined);

export const useEAExtension = (): IExtensionContext => {
  const extensionId = APP_CONFIG.EA_EXTENSION_ID;
  const [connected, setConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = async () => {
    setIsConnecting(true);
    const accessToken = getToken();
    const refreshToken = getRefreshToken();
    const selectedTeam = getLastAccessedTeam();

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
          selectedTeam,
        },
      });

      if (response.success) {
        if (!connected) {
          toast({
            description: <SuccessToastDescription content="Connected to EA Extension" />,
          });
        }
        setConnected(response.success);
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

export const useEaExtension = () => {
  const context = useContext(EAExtensionContext);
  if (context === undefined) {
    throw new Error('useExtension must be used within a provider');
  }
  return context;
};
