import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { getCurrentUser } from '@/src/apis/auth.api';
import FullscreenLoader from '@/src/components/full-screen-loader';
import { removeTokens, setRefreshToken, setToken } from '@/src/libs/utils/get-auth-token';

const OAuthLoginSuccess = () => {
  const [searchParams] = useSearchParams();
  const accessToken = searchParams.get('access_token');
  const refreshToken = searchParams.get('refresh_token');
  const navigate = useNavigate();

  const {
    refetch: login,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ['current_user'],
    queryFn: getCurrentUser,
    enabled: false,
  });

  useEffect(() => {
    if (accessToken && refreshToken) {
      setToken(accessToken);
      setRefreshToken(refreshToken);

      login();
    }
  }, [accessToken, refreshToken]);

  useEffect(() => {
    if (!isSuccess) {
      return;
    }

    searchParams.delete('access_token');
    searchParams.delete('refresh_token');
    navigate(`/?${searchParams.toString()}`);
  }, [isSuccess]);

  useEffect(() => {
    if (!isError) {
      return;
    }
    removeTokens();
  }, [isError]);

  return <FullscreenLoader />;
};

export default OAuthLoginSuccess;
