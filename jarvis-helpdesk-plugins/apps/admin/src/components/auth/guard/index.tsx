import { useEffect } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';

import { useEaExtension } from '@/src/contexts/ea-extension/ea-extension-context';
import { usePancakeExtension } from '@/src/contexts/pancake-extension/pancake-extension-context';
import { useAuth } from '@/src/hooks/use-auth';
import { APP_CONFIG } from '@/src/libs/app-config';

import FullscreenLoader from '../../full-screen-loader';

const AuthGuard = () => {
  const { isAuthenticated, isLoading, isAuthenticatedBefore } = useAuth();
  const { connect: connectExtension } = useEaExtension();
  const { connect: connectPancakeExtension } = usePancakeExtension();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (!isAuthenticatedBefore) {
      window.location.href = APP_CONFIG.STACK_AUTH_URL + `?${searchParams}`;
    }
  }, [isAuthenticatedBefore]);

  if (isAuthenticated) {
    connectExtension();
    connectPancakeExtension();
  }

  return isLoading || !isAuthenticated ? <FullscreenLoader /> : <Outlet />;
};

export default AuthGuard;
