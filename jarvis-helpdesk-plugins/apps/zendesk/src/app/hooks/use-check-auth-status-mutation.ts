import { useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { getToken } from '@/shared/lib/utils/get-auth-token';
import { ZendeskAuthApi } from '@/src/app/apis/auth';
import { ZafRequestApi } from '@/src/app/apis/zaf-request';

import { useZafClient } from '../contexts/zaf-client/context';

export enum AuthStatus {
  NOT_LOGGED_IN,
  DOMAIN_NOT_FOUND,
  READY_TO_USE,
}

const useAuthStatus = () => {
  const [status, setStatus] = useState<AuthStatus>(AuthStatus.NOT_LOGGED_IN);
  const [accessToken, setAccessToken] = useState<string | null>(getToken());
  const { client } = useZafClient();
  const intervalVerifyDomain = useRef<NodeJS.Timeout | null>(null);

  //Step 1: Check Authentication
  const checkAuthentication = () => {
    if (accessToken) {
      mutateVerifyDomain();
    } else {
      setStatus(AuthStatus.NOT_LOGGED_IN);
    }
  };

  //Step 2: Verify Domain
  const { mutate: mutateVerifyDomain } = useMutation({
    mutationFn: async () => {
      const domain = await ZafRequestApi.getDomain(client);
      try {
        return await ZendeskAuthApi.verifyDomain(domain);
      } catch (error: any) {
        throw new Error('Failed to verify domain');
      }
    },
    onSuccess: () => {
      setStatus(AuthStatus.READY_TO_USE);

      if (intervalVerifyDomain.current) {
        clearInterval(intervalVerifyDomain.current);
      }
    },
    onError: () => {
      setStatus(AuthStatus.DOMAIN_NOT_FOUND);
    },
  });

  useEffect(() => {
    checkAuthentication();
  }, [accessToken]);

  useEffect(() => {
    const intervalAccessToken = setInterval(() => {
      const token = getToken();
      if (token != undefined) {
        setAccessToken(token);
        clearInterval(intervalAccessToken);
      }
    }, 2000);

    return () => clearInterval(intervalAccessToken);
  }, [accessToken]);

  useEffect(() => {
    if (status === AuthStatus.DOMAIN_NOT_FOUND) {
      intervalVerifyDomain.current = setInterval(() => {
        mutateVerifyDomain();
      }, 5000);
    }

    return () => {
      if (intervalVerifyDomain.current) {
        clearInterval(intervalVerifyDomain.current);
      }
    };
  }, [status, mutateVerifyDomain]);

  return status;
};

export default useAuthStatus;
