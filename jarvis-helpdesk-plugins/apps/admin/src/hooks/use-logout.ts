import { useMutation } from '@tanstack/react-query';

import { logout as logoutFn } from '@/src/apis/auth.api';
import useAppStore from '@/src/store';

import { useEaExtension } from '../contexts/ea-extension/ea-extension-context';
import { usePancakeExtension } from '../contexts/pancake-extension/pancake-extension-context';
import queryClient from '../libs/clients/query-client';
import { removeTokens } from '../libs/utils/get-auth-token';

export const useLogout = () => {
  const { setIsAuthenticated, setUser } = useAppStore();
  const { disconnect: disconnectExtension } = useEaExtension();
  const { disconnect: disconnectPancakeExtension } = usePancakeExtension();
  const { mutate: logout, isPending: isLoading } = useMutation({
    mutationKey: ['logout'],
    mutationFn: logoutFn,
    onSuccess: async () => {
      removeTokens();
      await disconnectExtension();
      await disconnectPancakeExtension();

      queryClient.removeQueries({ queryKey: ['teams'] });
      await queryClient.cancelQueries({ queryKey: ['teams'] });

      setUser(undefined);
      setIsAuthenticated(false);
      window.location.href = '/';
    },
  });

  return {
    logout,
    isLoading,
  };
};
